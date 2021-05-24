import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { ChatRoom } from './chat/chatroom.entity';
import { ChatService } from './chat/chat.service';

type CreateRoomReq = {
  postID: number;
  postUserID: string;
  userID: string;
};
type MsgReq = {
  text: string;
  senderID: string;
  chatID: number;
  postID: number;
  receiverID: string;
};
type MsgRes = {
  id: number;
  createdAt: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
};

// Gives us access to the socket.io functionally
@WebSocketGateway(81, {
  transports: ['websocket'],
  namespace: 's-marcet',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private postService: PostService,
    private chatService: ChatService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('requestNewRoom')
  async createRoom(
    @MessageBody() req: CreateRoomReq,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log(client.rooms);
      const chatroom = await this.chatService.getChatRoom(
        req.postID,
        req.postUserID,
        req.userID,
      );
      if (chatroom) {
        console.log('해당 데이터를 가진 채팅방이 존재합니다.');
        return chatroom.id;
      } else {
        console.log('채팅방이 없습니다. 새로 생성해야합니다.');
        return -1;
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @SubscribeMessage('login')
  async handleUserLogin(
    @MessageBody() userID: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`유저가 로그인했습니다. => Req : ${userID}, ${socket.id}`);
    try {
      const client = await this.chatService.findClientByID(userID);
      if (client) {
        //console.log('기존 유저 정보를 업데이트합니다.');
        await this.chatService.updateClient(userID, socket.id);
        // 클라이언트가 속한 채팅방 구하기
        const chatroom = await this.chatService.getChatRoomIDsByUser(userID);
        // 클라이언트를 현재 속해 있는 채팅방으로 join
        const rooms = chatroom.map((room) => room.id.toString());
        if (rooms.length > 0) socket.join(rooms);
      } else {
        console.log('신규 정보를 입력합니다');
        await this.chatService.addClient(userID, socket.id);
      }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(
    @MessageBody() data: MsgReq,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatID, postID, text, senderID, receiverID } = data;
    try {
      let chatroom: ChatRoom = new ChatRoom();
      const post = await this.postService.getPost(postID);
      const sender = await this.userService.getUserByID(senderID);
      const receiver = await this.userService.getUserByID(receiverID);

      // 존재하는 채팅 정보 확인
      if (chatID == -1) {
        // 신규 채팅을 이용한다는 것. 새로운 채팅방을 만들어줘야함
        // sender:구매자 / receiver:판매자
        chatroom = await this.chatService.addChatRoom(post, sender, receiver);

        // sender의 입장에서 현재 chatID는 -1이므로 새로 만들어진 chat의 id를 전달
        client.emit('room created', chatroom.id);

        // 신규 이용이므로 sender와 receiver가 아직 chatroom에 들어간 상태가 아니다
        // 새로 만든 chatroom 으로 들여보내줘야 한다.

        // 1. sender를 room에 join
        client.join(chatroom.id.toString());
        // 2. receiver가 접속중이라면 join
        const rclient = await this.chatService.findClientByID(receiver.id);
        // receiver id로 조회된 클라이언트는 무조건 있음
        if (rclient && rclient.clientID !== '') {
          this.server.of(rclient.clientID).socketsJoin(chatroom.id.toString());
        }
      } else {
        // 기존 채팅을 이용한다는 것
        chatroom = await this.chatService.getChatRoomByID(chatID);
      }

      // 받은 메세지를 서버에 저장
      const newMsg = await this.chatService.addMsg(chatroom, sender, text);

      // 상대방에게 새로운 메세지가 왔음을 알림 (sender 제외)
      client.broadcast.to(chatroom.id.toString()).emit('msgFromClient');

      // sender의 state변경을 위해 추가하는 이벤트 발생 (만약 상대방이 그 페이지에 머물고 있을 수 있으므로 동시에 발생)
      const res: MsgRes = {
        ...newMsg,
        createdAt: newMsg.createdAt.toLocaleString(),
      };
      this.server.of(chatroom.id.toString()).emit('newMsgRes', res);
    } catch (e) {
      Logger.log(e);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
    this.chatService.disconnectClient(client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
    //console.log(client.handshake);
    client.emit('connectionSuccess', `${client.id} 연결`);
  }
}

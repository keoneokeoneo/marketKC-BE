import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { SocketService } from './socket/socket.service';
import { ChatRoom } from './socket/chatroom.entity';
import { User } from './user/user.entity';

type CreateRoomReq = {
  postID: number;
  postUserID: string;
  userID: string;
};
type MsgReq = {
  msg: string;
  senderID: string;
  chatID: number;
  postID: number;
  receiverID: string;
};
type MsgRes = {
  sender: string;
  msg: string;
  chatroomID: number;
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
    private socketService: SocketService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('requestNewRoom')
  async createRoom(
    @MessageBody() req: CreateRoomReq,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('룸 생성 요청 ', req);
    try {
      const chatroom = await this.socketService.getChatRoom(
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
    @ConnectedSocket() client: Socket,
  ) {
    //console.log(`유저가 로그인했습니다. => Req : ${userID}, ${client.id}`);
    try {
      const user = await this.socketService.findChatUser(userID);
      if (user) {
        //console.log('기존 유저 정보를 업데이트합니다.');
        await this.socketService.updateChatUser(userID, client.id);
        // 클라이언트가 속한 채팅방 구하기
        const chatroom = await this.socketService.getChatRoomIDsByUser(userID);
        // 클라이언트를 현재 속해 있는 채팅방으로 join
        const rooms = chatroom.map((room) => room.id.toString());
        client.join(rooms);
      } else {
        console.log('신규 정보를 입력합니다');
        await this.socketService.addChatUser(userID, client.id);
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
    const { chatID, postID, msg, senderID, receiverID } = data;
    try {
      let chatroom: ChatRoom = new ChatRoom();
      let text = '';
      const post = await this.postService.getPost(postID);
      const buyer = await this.userService.getUserByID(senderID);
      const seller = await this.userService.getUserByID(receiverID);
      if (chatID == -1) {
        // 신규 채팅을 이용한다는 것. 새로운 채팅방을 만들어줘야함
        // sender:구매자 / receiver:판매자
        text = '신규채팅이용';
        chatroom = await this.socketService.addChatRoom(post, seller, buyer);
      } else {
        // 기존 채팅을 이용한다는 것
        text = '기존채팅이용';
        chatroom = await this.socketService.getChatRoomByID(chatID);
      }
      let sender: User;
      if (chatroom.buyer.id == data.senderID) sender = chatroom.buyer;
      else if (chatroom.seller.id == data.senderID) sender = chatroom.seller;
      const response = {
        id: chatroom.id,
        createdAt: new Date(Date.now()).toLocaleString(),
        sender: {
          id: sender.id,
          name: sender.name,
        },
        msg: msg,
      };
      await this.socketService.addMsg(chatroom, buyer, msg);
      client.broadcast
        .to(chatroom.id.toString())
        .emit('msgToClientNoti', response);
      client.broadcast
        .to(chatroom.id.toString())
        .emit('msgToClientMerge', chatroom.id);
      return response;
      // const newMsg = await this.socketService.addMsg(chatroom, buyer, msg);
      // const res: MsgRes = {
      //   msg: newMsg.msg,
      //   sender: newMsg.sender.name,
      //   chatroomID: chatroom.id,
      // };
    } catch (e) {
      Logger.log(e);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
    //console.log(client.handshake);
    client.emit('connectionSuccess', `${client.id} 연결`);
  }
}

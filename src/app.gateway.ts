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
import { TradeService } from './trade/trade.service';
import { CreateTradeReq } from './trade/trade.type';

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
type TradeRequest = {
  postID: number;
  chatID: number;
  senderID: string;
  receiverID: string;
};
type HandleRequest = {
  id: number;
  answer: boolean;
};

// Gives us access to the socket.io functionally
@WebSocketGateway(8080, {
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
    private tradeService: TradeService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('requestNewRoom')
  async createRoom(
    @MessageBody() req: CreateRoomReq,
    @ConnectedSocket() client: Socket,
  ) {
    // 채팅으로 거래 시 기존 채팅방의 유무 검사 후 id값 반환
    try {
      const chatroom = await this.chatService.getChatRoom(
        req.postID,
        req.postUserID,
        req.userID,
      );
      console.log(chatroom);
      if (chatroom) return chatroom.id;
      else return -1;
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
    // 앱 실행시 소켓 서버에 연결되므로 로그인 한 시점에 업데이트 필요
    try {
      const client = await this.chatService.findClientByID(userID);
      if (client) {
        // 기존 클라이언트 정보 업데이트
        await this.chatService.updateClient(userID, socket.id);
        // 클라이언트가 속한 채팅방 구하기
        const chatroom = await this.chatService.getChatRoomIDsByUser(userID);

        // 클라이언트를 현재 속해 있는 채팅방으로 join
        const rooms = chatroom.map((room) => room.id.toString());

        if (rooms.length > 0) socket.join(rooms);
      } else {
        // 클라이언트 정보 신규 생성
        await this.chatService.addClient(userID, socket.id);
      }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  @SubscribeMessage('joinToRoom')
  async handleJoinRoom(
    @MessageBody() roomID: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(roomID);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(
    @MessageBody() data: MsgReq,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatID, postID, text, senderID, receiverID } = data;
    try {
      let chatroom: ChatRoom;
      let id: string;
      const post = await this.postService.getPost(postID);
      const sender = await this.userService.getUserByID(senderID);
      const receiver = await this.userService.getUserByID(receiverID);
      const rclient = await this.chatService.findClientByID(receiver.id);

      // 존재하는 채팅 정보 확인
      if (chatID === -1) {
        // 신규 채팅을 이용한다는 것. 새로운 채팅방을 만들어줘야함
        // sender:구매자 / receiver:판매자
        chatroom = await this.chatService.addChatRoom(post, sender, receiver);
        id = chatroom.id.toString();

        // sender의 입장에서 현재 chatID는 -1이므로 새로 만들어진 chat의 id를 전달
        client.emit('room created', chatroom.id);

        // sender를 새 채팅방에 입장 시킨다
        await client.join([id]);

        // receiver를 새 채팅방에 입장시킨다
        if (rclient && rclient.clientID !== '')
          this.server.to(rclient.clientID).emit('roomInvitation', id);
      } else {
        // 기존 채팅을 이용한다는 것
        chatroom = await this.chatService.getChatRoomByID(chatID);
        id = chatroom.id.toString();
      }
      console.log(chatroom);

      // 받은 메세지를 서버에 저장
      const newMsg = await this.chatService.addMsg(chatroom, sender, text);

      // 받을 사용자에게 메세지 도착을 알림
      this.server
        .to(rclient.clientID)
        .emit('notiFromServer', `${newMsg.sender.name}님 : ${newMsg.text}`);

      // sender의 state변경을 위해 추가하는 이벤트 발생 (만약 상대방이 그 페이지에 머물고 있을 수 있으므로 동시에 발생)
      const res: MsgRes = {
        createdAt: newMsg.createdAt.toLocaleString(),
        id: newMsg.id,
        text: newMsg.text,
        sender: {
          id: newMsg.sender.id,
          name: newMsg.sender.name,
        },
      };

      // 해당 채팅 페이지에 머물러있는 경우 state 변경을 같이 해줘야함
      this.server.to(id).emit('newMsgRes', res);
    } catch (e) {
      Logger.log(e);
    }
  }

  @SubscribeMessage('sendTradeRequest')
  async handleTradeRequest(
    @MessageBody() req: TradeRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const { postID, receiverID, senderID, chatID } = req;
    try {
      const post = await this.postService.getPost(postID);
      const sender = await this.userService.getUserByID(senderID);
      //const receiver = await this.userService.getUserByID(receiverID);

      // 판매글의 상태를 먼저 확인
      if (post.status !== '판매중') {
        // 판매중이 아니면 신청 불가
        client.emit(
          'tradeReqeustFail',
          '해당 게시글은 거래 가능한 상태가 아닙니다.',
        );
        return;
      }

      // 채팅방과 거래요청은 1:1 관계
      const check = await this.tradeService.getRequestByChatID(chatID);

      if (check) {
        client.emit('tradeRequestFail', '이미 요청했습니다.');
        return;
      }

      // 요청 생성 및 성공 메세지 전송
      await this.tradeService.createRequest(
        postID,
        chatID,
        senderID,
        receiverID,
      );
      client.emit('tradeRequestSuccess', '거래 요청에 성공했습니다.');

      // 받을 유저에게 알림 푸쉬
      const rclient = await this.chatService.findClientByID(receiverID);
      if (rclient && rclient.clientID !== '')
        this.server
          .to(rclient.clientID)
          .emit('notiFromServer', `${sender.name}님이 거래를 요청했습니다.`);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('answerTradeRequest')
  async handleAcceptTradeRequest(
    @MessageBody() req: HandleRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const { answer, id } = req;
    try {
      // 1. 요청 응답
      const request = await this.tradeService.answerRequest(id, answer);
      const rclient = await this.chatService.findClientByID(request.senderID);

      if (!answer) {
        if (rclient && rclient.clientID !== '')
          this.server
            .to(rclient.clientID)
            .emit('notiFromServer', '판매자가 거래를 거절했습니다.');
        client.emit('tradeRequestRejected');
        return;
      }

      if (rclient && rclient.clientID !== '')
        this.server
          .to(rclient.clientID)
          .emit('notiFromServer', '판매자가 거래를 수락했습니다.');

      //2. post, seller, buyer 정보 확인
      const post = await this.postService.getPost(request.postID);
      const seller = await this.userService.getUserByID(request.receiverID);
      const buyer = await this.userService.getUserByID(request.senderID);

      // 3. trade 생성
      const param: CreateTradeReq = {
        price: post.price,
        buyerID: buyer.id,
        buyerName: buyer.name,
        sellerID: seller.id,
        sellerName: seller.name,
        from: buyer.walletAddr,
        to: seller.walletAddr,
        postID: post.id,
      };
      const trade = await this.tradeService.createTrade(param);

      client.emit('tradeRequestAccepted', trade);
    } catch (e) {
      console.error(e);
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

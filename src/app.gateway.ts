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

type CreateRoomReq = {
  postID: number;
  postUserID: string;
  userID: string;
};
type MsgReq = {
  msg: string;
  userID: string;
};
type MsgRes = {
  msg: string;
  senderID: string;
  time: string;
};

// Gives us access to the socket.io functionally
@WebSocketGateway(81, {
  transports: ['websocket'],
  namespace: 'market-kc-chat',
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

  @SubscribeMessage('roomCreationRequest')
  async createRoom(
    @MessageBody() req: CreateRoomReq,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<unknown>> {
    console.log('룸 생성 요청 ', req);
    try {
      const chatroom = await this.socketService.getChatRoom(
        req.postID,
        req.postUserID,
        req.userID,
      );
      if (chatroom) {
        console.log('해당 데이터를 가진 채팅방이 존재합니다.');
        this.server.emit('test1', '기존 채팅방으로 안내할게요');
        return {
          event: 'roomCreationError',
          data: chatroom.id,
        };
      } else {
        console.log('채팅방이 없습니다. 새로 생성해야합니다.');
        this.server.emit('test 2', '채팅방 생성할게요');
        return {
          event: 'roomCreationSuccess',
          data: '채팅방 생성해야됩니다.',
        };
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`In Test => Req : ${data}, ${client.id}`);
    return data;
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() data: MsgReq,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    const res: MsgRes = {
      msg: data.msg,
      senderID: data.userID,
      time: client.handshake.time,
    };
    this.server.emit('msgToClient', res);
    return {
      time: client.handshake.time,
      msg: data.msg,
      senderID: data.userID,
    };
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
    console.log(client.handshake);
    client.emit('connectionSuccess', `${client.id} 연결`);
  }
}

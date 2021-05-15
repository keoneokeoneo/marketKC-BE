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
import { v4 } from 'uuid';
type RoomReq = {
  postID: string;
  userID: string;
};
// Gives us access to the socket.io functionally
@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'market-kc-chat',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('createRoom')
  createRoom(
    @MessageBody() req: RoomReq,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const roomName = `chatRoom#${v4()}`;
    console.log('룸 생성 요청 ', req, roomName);
    client.join(roomName);
    client.to(roomName).emit('roomCreated', { room: roomName });
    return { event: 'roomCreated', data: roomName };
  }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`In Test => Req : ${data}, ${client.id}`);
    return data;
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data);
    this.server.emit('msgToClient', data);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }
}

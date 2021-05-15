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

  createRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.join(data);
    client.to(data).emit('roomCreated', { room: data });
    return { event: 'roomCreated', room: data };
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

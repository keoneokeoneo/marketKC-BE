import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chatroom.repository';
import { ChatUserRepository } from './client.repository';
import { MessageRepository } from './message.repository';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ChatRoomRepository,
      ChatUserRepository,
    ]),
  ],
  providers: [SocketService],
  controllers: [SocketController],
  exports: [SocketService],
})
export class SocketModule {}

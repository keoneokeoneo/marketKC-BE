import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chatroom.repository';
import { MessageRepository } from './message.repository';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository, ChatRoomRepository])],
  providers: [SocketService],
  controllers: [SocketController],
  exports: [SocketService],
})
export class SocketModule {}

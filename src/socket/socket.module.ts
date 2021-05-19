import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
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
    UserModule,
    PostModule,
  ],
  providers: [SocketService],
  controllers: [SocketController],
  exports: [SocketService],
})
export class SocketModule {}

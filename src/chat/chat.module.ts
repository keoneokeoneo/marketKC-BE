import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatMsgRepository } from './chatmsg.repository';
import { ChatRoomRepository } from './chatroom.repository';
import { ClientRepository } from './client.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMsgRepository,
      ChatRoomRepository,
      ClientRepository,
    ]),
    UserModule,
    PostModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}

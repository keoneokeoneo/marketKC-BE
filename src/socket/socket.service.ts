import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './chatroom.entity';
import { ChatRoomRepository } from './chatroom.repository';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: MessageRepository,
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: ChatRoomRepository,
  ) {}
  /**
   * 구/판매자 아이디와 게시글 아이디로 채팅방 조회
   *
   * @param postID post id
   * @param postUserID seller user id
   * @param userID buyer user id
   */
  async getChatRoom(postID: number, postUserID: string, userID: string) {
    return await this.chatroomRepository.findOne({
      where: {
        buyer: {
          id: userID,
        },
        seller: {
          id: postUserID,
        },
        post: {
          id: postID,
        },
      },
    });
  }

  async addNewChatRoom(postID: number, postUserID: string, userID: string) {}
}

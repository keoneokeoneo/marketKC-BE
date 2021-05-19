import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { ChatRoom } from './chatroom.entity';
import { ChatRoomRepository } from './chatroom.repository';
import { ChatUser } from './chatuser.entity';
import { ChatUserRepository } from './client.repository';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: MessageRepository,
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: ChatRoomRepository,
    @InjectRepository(ChatUser)
    private readonly chatuserRepository: ChatUserRepository,
  ) {}

  async findChatUser(userID: string) {
    return await this.chatuserRepository.findOne({ where: { userID: userID } });
  }

  async addChatUser(userID: string, clientID: string) {
    const newClient = await this.chatuserRepository.create();
    newClient.clientID = clientID;
    newClient.userID = userID;
    newClient.lastActivity = new Date(Date.now());
    return await this.chatuserRepository.save(newClient);
  }

  async updateChatUser(userID: string, clientID: string) {
    return await this.chatuserRepository.update(
      { userID: userID },
      { clientID: clientID, lastActivity: new Date(Date.now()) },
    );
  }

  async getChatRooms(userID: string) {
    return await this.chatroomRepository.findAndCount({
      where: [{ buyer: { id: userID } }, { seller: { id: userID } }],
    });
  }

  /**
   * 채팅방 생성
   *
   * @param post 게시글 아이디
   * @param seller 판매자 아이디
   * @param buyer 구매자 아이디
   */
  async addChatRoom(post: Post, seller: User, buyer: User) {
    const res = await this.chatroomRepository.create();
    const time = new Date(Date.now());
    res.buyer = buyer;
    res.seller = seller;
    res.post = post;
    res.createdAt = time;
    res.updatedAt = time;
    return await this.chatroomRepository.save(res);
  }

  /**
   * 채팅방 조회
   *
   * @param postID 게시글 아이디
   * @param postUserID 판매자 아이디
   * @param userID 구매자 아이디
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
  async getChatRoomByID(id: number) {
    return await this.chatroomRepository.findOne(id, {
      relations: ['messages', 'post', 'buyer', 'seller'],
    });
  }

  async getChatRoomIDsByUser(userID: string) {
    return await this.chatroomRepository.find({
      where: [{ buyer: { id: userID } }, { seller: { id: userID } }],
    });
  }

  async getChatRoomsByUser(user: User) {
    const res = await this.chatroomRepository.find({
      where: [{ buyer: user }, { seller: user }],
      relations: ['messages', 'buyer', 'seller', 'post'],
    });
    if (res.length < 1) return res;

    console.log(res);
    const data = res.map((data) => ({
      id: data.id,
      user:
        user.id !== data.buyer.id
          ? {
              id: data.buyer.id,
              name: data.buyer.name,
              profileImgUrl: data.buyer.profileImgUrl,
            }
          : {
              id: data.seller.id,
              name: data.seller.name,
              profileImgUrl: data.seller.profileImgUrl,
            },
      post: {
        id: data.post.id,
        location: data.post.location,
        imgUrl: data.post.postImgs[0].url,
      },
      message:
        data.messages.length > 1
          ? data.messages.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            )[0]
          : data.messages[0],
    }));
    return data;
  }

  async addMsg(chatroom: ChatRoom, sender: User, msg: string) {
    const newMsg = await this.messageRepository.create();
    newMsg.sender = sender;
    newMsg.chatroom = chatroom;
    newMsg.createdAt = new Date(Date.now());
    newMsg.msg = msg;
    return await this.messageRepository.save(newMsg);
  }
}

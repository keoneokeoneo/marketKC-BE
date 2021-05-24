import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { ChatMsg } from './chatmsg.entity';
import { ChatMsgRepository } from './chatmsg.repository';
import { ChatRoom } from './chatroom.entity';
import { ChatRoomRepository } from './chatroom.repository';
import { Client } from './client.entity';
import { ClientRepository } from './client.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMsg)
    private readonly chatmsgRepository: ChatMsgRepository,
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: ChatRoomRepository,
    @InjectRepository(Client)
    private readonly clientRepository: ClientRepository,
  ) {}

  async findClientByID(id: string) {
    return await this.clientRepository.findOne({ where: { userID: id } });
  }

  async disconnectClient(id: string) {
    return await this.clientRepository.update(
      { clientID: id },
      {
        clientID: '',
        lastActivity: new Date(Date.now()),
      },
    );
  }

  async addClient(userID: string, clientID: string) {
    const newClient = await this.clientRepository.create();
    newClient.clientID = clientID;
    newClient.userID = userID;
    newClient.lastActivity = new Date(Date.now());
    return await this.clientRepository.save(newClient);
  }

  async updateClient(userID: string, clientID: string) {
    return await this.clientRepository.update(
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
   * @param sender 구매자 아이디
   * @param receiver 판매자 아이디
   */
  async addChatRoom(post: Post, sender: User, receiver: User) {
    const res = await this.chatroomRepository.create();
    res.buyer = sender;
    res.seller = receiver;
    res.post = post;
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
      relations: ['chatMsgs', 'post', 'buyer', 'seller'],
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
      relations: ['chatMsgs', 'buyer', 'seller', 'post'],
    });
    if (res.length < 1) return res;

    const data = res.map((data) => {
      const msg =
        data.chatMsgs.length > 1
          ? data.chatMsgs.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            )[0]
          : data.chatMsgs[0];
      return {
        id: data.id,
        target:
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
        lastMsg: {
          id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.createdAt).toLocaleString(),
        },
      };
    });
    return data;
  }

  async addMsg(chatroom: ChatRoom, sender: User, msg: string) {
    const newMsg = await this.chatmsgRepository.create();
    newMsg.sender = sender;
    newMsg.chatroom = chatroom;
    newMsg.createdAt = new Date(Date.now());
    newMsg.text = msg;
    return await this.chatmsgRepository.save(newMsg);
  }
}

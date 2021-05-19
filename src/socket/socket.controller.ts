import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { SocketService } from './socket.service';
import { Response } from 'express';
@Controller('/api/chats')
export class SocketController {
  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private postService: PostService,
  ) {}

  @Get('/users/:id')
  async getChatRoomsByUserID(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUserByID(id);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저가 존재하지 않습니다.');
      const rooms = await this.socketService.getChatRoomsByUser(user);
      if (rooms.length < 1)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저가 속한 채팅방이 없습니다.');
      return res.status(HttpStatus.OK).send(rooms);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Get('/:chatID/:postID')
  async getChatByID(
    @Param('chatID') chatID: number,
    @Param('postID') postID: number,
    @Res() res: Response,
  ) {
    try {
      if (Number(chatID) === -1) {
        const post = await this.postService.getPost(Number(postID));
        if (!post)
          return res
            .status(HttpStatus.NOT_FOUND)
            .send('게시글 정보가 없습니다.');

        const data = {
          id: post.id,
          messages: [],
          post: {
            id: post.id,
            title: post.title,
            price: post.price,
            postImg: post.postImgs[0].url,
            postUser: {
              id: post.user.id,
              name: post.user.name,
            },
            status: post.status,
          },
          buyer: null,
          seller: null,
        };
        return res.status(HttpStatus.OK).send(data);
      } else {
        const chat = await this.socketService.getChatRoomByID(Number(chatID));
        if (!chat)
          return res
            .status(HttpStatus.NOT_FOUND)
            .send('채팅방 정보가 없습니다');
        const { buyer, seller, post, id, messages } = chat;
        const data = {
          id: id,
          messages: messages.map((msg) => ({
            id: msg.id,
            createdAt: new Date(msg.createdAt),
            msg: msg.msg,
            sender: {
              id: msg.sender.id,
              name: msg.sender.name,
            },
          })),
          post: {
            id: post.id,
            title: post.title,
            price: post.price,
            postImg: post.postImgs[0].url,
            postUser: {
              id: post.user.id,
              name: post.user.name,
            },
            status: post.status,
          },
          buyer: {
            id: buyer.id,
            name: buyer.name,
          },
          seller: {
            id: seller.id,
            name: seller.name,
          },
        };
        return res.status(HttpStatus.OK).send(data);
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { SocketService } from './socket.service';

@Controller('/api/chats')
export class SocketController {
  constructor(private socketService: SocketService) {}

  // @Get('/posts/:id')
  // async getChatPosts(@Param('id') id:number, @Res() res:Response){
  //   try{
  //     const
  //   } catch(e){
  //     Logger.error(e);
  //     throw e
  //   }
  // }
}

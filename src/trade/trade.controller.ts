import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { CreateTX, TradeService } from './trade.service';

@Controller('/api/trades')
export class TradeController {
  constructor(
    private tradeService: TradeService,
    private postService: PostService,
    private userService: UserService,
  ) {}

  @Get('/users/:userID')
  async getTradesByUserID(
    @Param('userID') userID: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserByID(userID);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저 정보가 존재하지 않습니다.');
      const result = await this.tradeService.getTradesByUser(userID);
      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/requests/users/:userID')
  async getRequestsByUserID(
    @Param('userID') userID: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserByID(userID);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저 정보가 존재하지 않습니다.');

      const requests = await this.tradeService.getRequestsByUser(userID);

      return res.status(HttpStatus.OK).send(requests);
    } catch (e) {
      console.log(e);
    }
  }

  @Post('/tx')
  async createTX(@Body() req: CreateTX, @Res() res: Response) {
    console.log(req);
    try {
      const tx = await this.tradeService.saveTX(req);
      // 생성에 오류가 생긴경우 코드?
      if (!tx)
        return res.status(HttpStatus.CONFLICT).send('알 수 없는 에러 발생');

      // 거래 상태 변경
      await this.tradeService.updateTrade(req.tradeID, req.stage);

      if (req.stage === 'Done')
        await this.postService.updateStatus(req.postID, '거래완료');

      return res.status(HttpStatus.CREATED).send('트랜잭션 저장에 성공!');
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/tx/users/:userID')
  async getUserTX(@Param('userID') userID: string, @Res() res: Response) {
    try {
      const result = await this.tradeService.getUserTX(userID);
      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      console.log(e);
    }
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('/updateLastActivity/:id')
  async updateLastActivity(@Param('id') id: string) {
    try {
      return await this.userService.updateLastActivity(id);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Get('/:id')
  async getUserData(@Param('id') id: string, @Res() res: Response) {
    try {
      const searchedUser = await this.userService.getUserByID(id);

      if (searchedUser) {
        // 검색된 유저가 있음 -> 검색된 유저 정보 전달 (200, ok)
        const result = {
          id: searchedUser.id,
          email: searchedUser.email,
          name: searchedUser.name,
          walletAddr: searchedUser.walletAddr,
          profileImgUrl: searchedUser.profileImgUrl,
          createdAt: searchedUser.createdAt,
          updatedAt: searchedUser.updatedAt,
          subscribedCategories: searchedUser.subscribedCategories.toString(),
        };
        return res.status(HttpStatus.OK).send(result);
      } else {
        // 검색된 유저가 없음 -> 에러 메세지 전달 (404, not found)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저 정보가 존재하지 않습니다.');
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  @Patch('/:id/categories')
  async updateUserCategories(
    @Param('id') id: string,
    @Body() ids: number[],
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserByID(id);

      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저 정보가 존재하지 않습니다.');

      const result = await this.userService.updateUserCategories(id, ids);

      return res.status(HttpStatus.OK).send('수정 성공');
    } catch (e) {
      Logger.error(e);
    }
  }
}

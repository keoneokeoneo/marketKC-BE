import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
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
  async getUserData(@Param('id') id: string) {
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
        return result;
      } else {
        // 검색된 유저가 없음 -> 에러 메세지 전달 (404, not found)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: '검색된 유저 정보가 없습니다.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

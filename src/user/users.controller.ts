import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseMessage } from 'src/response.util';
import { UsersService } from './users.service';

@Controller('/api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/setCategories')
  async updateSubscribedCategories() {}

  @Put('/updateLastActivity/:userID')
  async updateLastActivity(@Param('userID') userID: string) {
    try {
      await this.usersService.updateLastActivity(userID);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Get('/:userID')
  async getUserData(@Param('userID') userID: string) {
    console.log('Requested userID : ', userID);
    try {
      const searchedUser = await this.usersService.getUserByID(userID);

      console.log('Searched User : ', searchedUser);

      if (searchedUser) {
        const res = {
          userID: searchedUser.userID,
          userEmail: searchedUser.userEmail,
          userName: searchedUser.userName,
          userWalletAddr: searchedUser.userWalletAddr,
          userProfileImgUrl: searchedUser.userProfileImgUrl,
          createdAt: searchedUser.createdAt,
          updatedAt: searchedUser.updatedAt,
          subscribedCategories: searchedUser.subscribedCategories.toString(),
        };
        return new ResponseMessage().success(200).body(res).build();
      } else {
        return new ResponseMessage()
          .error(999)
          .body('유저 정보가 없습니다.')
          .build();
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

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
    try {
      const searchedUser = await this.usersService.getUserByID(userID);
      //console.log(searchedUser);

      const a = {
        userID: searchedUser.userID,
        userEmail: searchedUser.userEmail,
        userName: searchedUser.userName,
        userWalletAddr: searchedUser.userWalletAddr,
        userProfileImgUrl: searchedUser.userProfileImgUrl,
        createdAt: searchedUser.createdAt,
        updatedAt: searchedUser.updatedAt,
        subscribedCategories: searchedUser.subscribedCategories.toString(),
      };

      if (searchedUser) {
        return new ResponseMessage().success(200).body(a).build();
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

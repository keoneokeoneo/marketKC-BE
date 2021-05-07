import { Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { ResponseMessage } from 'src/response.util';
import { UsersService } from './users.service';

@Controller('/api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/setCategories')
  async updateSubscribedCategories() {}

  @Get('/:userID')
  async getUserData(@Param('userID') userID: string) {
    try {
      const searchedUser = await this.usersService.getUserByID(userID);
      console.log(searchedUser);

      if (searchedUser) {
        return new ResponseMessage().success(200).body(searchedUser).build();
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

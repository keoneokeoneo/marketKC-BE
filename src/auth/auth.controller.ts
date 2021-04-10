import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { Register } from 'src/user/users.type';
import * as Joi from 'joi';
import { ResponseMessage, Response } from 'src/response.util';

export const regSchema = Joi.object({
  userEmail: Joi.string().required(),
  userName: Joi.string().required(),
  userPW: Joi.string().required(),
});

export const loginSchema = Joi.object({
  userEmail: Joi.string().required(),
  userPW: Joi.string().required(),
});

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async addUser(@Body() register: Register): Promise<Response> {
    try {
      console.log(register);
      const {
        value,
        error,
      }: { value: Register; error?: Joi.ValidationError } = regSchema.validate(
        register,
      );

      if (error) {
        Logger.error(error);
        return new ResponseMessage()
          .error(999)
          .body('Parameter Error : Wrong Params')
          .build();
      }

      const searchedRes = await this.usersService.getUserByEmail(
        value.userEmail,
      );

      if (searchedRes !== undefined) {
        return new ResponseMessage()
          .error(100)
          .body('이미 사용중인 이메일 주소입니다.')
          .build();
      } else {
        const newUserInfo = await this.usersService.addUser(value);
        return new ResponseMessage().success().body(newUserInfo).build();
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

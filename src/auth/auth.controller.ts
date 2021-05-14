import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Register } from 'src/user/user.type';
import * as Joi from 'joi';
import { Response } from 'express';

export const regSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

@Controller('/api/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async addUser(@Body() register: Register, @Res() res: Response) {
    try {
      const {
        value,
        error,
      }: { value: Register; error?: Joi.ValidationError } = regSchema.validate(
        register,
      );

      if (error) {
        Logger.error(error);
        return res.status(HttpStatus.BAD_REQUEST).send(error);
      }

      const searchedUser = await this.userService.getUserByEmail(value.email);

      if (searchedUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('이미 사용중인 이메일입니다.');
      } else {
        await this.userService.addUser(register);
        return res.status(HttpStatus.CREATED).send('로그인 성공');
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

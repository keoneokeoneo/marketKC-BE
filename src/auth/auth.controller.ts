import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Register } from 'src/user/user.type';
import * as Joi from 'joi';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async addUser(@Body() register: Register, @Res() res: Response) {
    try {
      const { value, error }: { value: Register; error?: Joi.ValidationError } =
        regSchema.validate(register);

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
        return res.status(HttpStatus.CREATED).send('회원가입에 성공했습니다');
      }
    } catch (e) {
      Logger.error(e);
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    try {
      if (!(req.user instanceof User)) {
        // validate user에서 에러가 발생
        return res.status(req.user.code).send(req.user.message);
      } else {
        const result = await this.authService.login(req.user);
        return res.status(HttpStatus.OK).send(result);
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/validation')
  getProfile(@Request() req) {
    return req.user;
  }
}

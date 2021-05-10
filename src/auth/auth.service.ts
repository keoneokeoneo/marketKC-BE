import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as Bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const searchedUser = await this.userService.getUserByEmail(email);

      if (!searchedUser) {
        // 해당 유저 정보가 존재하지 않음
        return {
          code: HttpStatus.NOT_FOUND,
          message: '가입된 계정이 아닙니다.',
        };
      }

      const pwCheck = await Bcrypt.compare(password, searchedUser.password);

      if (!pwCheck) {
        // db에 있는 password와 입력한 password가 다름
        return {
          code: HttpStatus.BAD_REQUEST,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }

      return searchedUser;
    } catch (e) {
      Logger.error(e);
    }
  }

  async login(data: User) {
    try {
      const payload = {
        email: data.email,
        name: data.name,
        id: data.id,
      };

      await this.userService.updateLastActivity(data.id);

      const newUser = await this.userService.getUserByID(data.id);

      return {
        access_token: this.jwtService.sign(payload),
        id: newUser.id,
      };
    } catch (e) {
      Logger.error(e);
    }
  }
}

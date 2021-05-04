import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import * as Bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage, Response } from 'src/response.util';
import { Users } from 'src/user/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userEmail: string,
    userPW: string,
  ): Promise<Response | Users> {
    const user = await this.usersService.getUserByEmail(userEmail);
    if (user === undefined) {
      // 데이터에 맞는 유저가 db에 없음
      return new ResponseMessage()
        .error(999)
        .body('가입된 계정이 없습니다')
        .build();
    }
    const pwCheck = await Bcrypt.compare(userPW, user.userPW);

    if (!pwCheck) {
      // db에 있는 password와 입력한 password가 다름
      return new ResponseMessage()
        .error(888)
        .body('이메일/비밀번호를 확인해주세요')
        .build();
    }

    return user;
  }

  async login(data: any) {
    console.log(data);
    if (!(data instanceof Users)) return data;
    const payload = {
      userEmail: data.userEmail,
      userName: data.userName,
      userID: data.userID,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userName: data.userName,
      userEmail: data.userEmail,
      userID: data.userID,
      userWalletAddr: data.userWalletAddr,
      userProfileImgUrl: data.userProfileImgUrl,
      userCreatedAt: data.createdAt,
      userUpdatedAt: data.updatedAt,
      code: 200,
    };
  }
}

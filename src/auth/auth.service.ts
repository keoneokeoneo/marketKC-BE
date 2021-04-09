import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import * as Bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userEmail: string, userPW: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(userEmail);
    const pwCheck = await Bcrypt.compare(userPW, user.userPW);

    if (!pwCheck) return null;

    return user;
  }

  async login(user: any) {
    const payload = {
      userEmail: user.userEmail,
      userName: user.userName,
      userID: user.userID,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

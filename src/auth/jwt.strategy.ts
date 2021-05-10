import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET_KEY } from 'src/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    try {
      await this.userService.updateLastActivity(payload.id);
    } catch (e) {
      Logger.error(e);
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  }
}

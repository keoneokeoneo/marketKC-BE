import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ValidationError } from 'joi';
import { Response, ResponseMessage } from 'src/response.util';
import { loginSchema, regSchema } from './users.schema';
import { UsersService } from './users.service';
import { Login, Register, UserInfo } from './users.type';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async addUser(@Body() register: Register): Promise<Response> {
    try {
      console.log(register);
      const {
        value,
        error,
      }: { value: Register; error?: ValidationError } = regSchema.validate(
        register,
      );

      if (error) {
        Logger.error(error);
        return new ResponseMessage()
          .error(999)
          .body('Parameter Error : Wrong Params')
          .build();
      }

      const user: UserInfo = await this.usersService.addUser(value);
      return new ResponseMessage().success().body(user).build();
    } catch (e) {
      Logger.error(e);
    }
  }

  // @Post('login')
  // public async login(@Body() login:Login):Promise<Response>{
  //   const {value, error}:{value:Login, error?: ValidationError} = loginSchema.validate(login)

  //   if(error){
  //     Logger.error(error)
  //     return new ResponseMessage().error(999).body('Parameter Error : Wrong Params').build();
  //   }

  //   const user = await this
  // }
}

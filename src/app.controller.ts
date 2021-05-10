import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Logger,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CategoryService } from './category/category.service';
import { User } from './user/user.entity';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
  ) {}

  @Get('/api/categories')
  async getCategories(@Res() res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();

      if (categories.length > 0) {
        return res.status(HttpStatus.OK).send(categories);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('서버에 저장된 카테고리가 없습니다.');
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
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
  @Get('/api/auth/validateUser')
  getProfile(@Request() req) {
    return req.user;
  }
}

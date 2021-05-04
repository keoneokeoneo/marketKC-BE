import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CategoriesService } from './categories/categories.service';
import { ResponseMessage } from './response.util';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private categoriesService: CategoriesService,
  ) {}

  @Get('/api/categories')
  async getCategories() {
    try {
      const categories = await this.categoriesService.getAllCategories();

      if (categories.length > 0) {
        return new ResponseMessage().success(200).body(categories).build();
      } else {
        return new ResponseMessage()
          .error(999)
          .body('서버에 저장된 카테고리가 없습니다.')
          .build();
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

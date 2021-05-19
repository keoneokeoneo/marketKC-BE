import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Res,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Controller('/api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
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

  @Post()
  async addCategories(@Body() data: Category[], @Res() res: Response) {
    try {
      const result = await this.categoryService.addCategories(data);

      if (result) res.status(201).send('카테고리 추가 성공');
    } catch (e) {
      Logger.error(e);
    }
  }
}

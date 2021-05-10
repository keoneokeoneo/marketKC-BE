import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,
  ) {}

  async getAllCategories() {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      Logger.error(e);
    }
  }
}

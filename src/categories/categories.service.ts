import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './categories.entity';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async getAllCategories() {
    return await this.categoriesRepository.find();
  }
}

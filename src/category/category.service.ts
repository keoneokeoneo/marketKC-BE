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

  async getCategoryByID(id: number) {
    try {
      return await this.categoryRepository.findOne(id);
    } catch (e) {
      Logger.error(e);
    }
  }

  async addCategories(categories: Category[]) {
    try {
      const inputData: Category[] = [];
      categories.forEach((category) => {
        const newCategory = new Category();
        newCategory.id = category.id;
        newCategory.name = category.name;
        inputData.push(newCategory);
      });

      return await this.categoryRepository.save(inputData);
    } catch (e) {
      Logger.error(e);
    }
  }
}

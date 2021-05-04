import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesRepository])],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

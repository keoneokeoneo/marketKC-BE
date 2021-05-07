import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), CategoriesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

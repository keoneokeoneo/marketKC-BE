import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CategoryModule } from 'src/category/category.module';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CategoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

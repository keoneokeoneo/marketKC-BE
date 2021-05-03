import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository])],
  providers: [],
  exports: [],
})
export class PostsModule {}

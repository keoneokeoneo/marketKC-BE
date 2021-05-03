import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { PostsRepository } from './posts.repository';
import { PostData } from './posts.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: PostsRepository,
  ) {}

  async addPost(data: PostData) {
    const upload = await this.postsRepository.create();

    upload.postTitle = data.postTitle;
    upload.postContent = data.postContent;
    upload.postPrice = data.postPrice;
    upload.userID = data.userID;
    upload.postCategoryID = data.postCategoryID;

    const post = await this.postsRepository.save(upload);

    return post;
  }
}

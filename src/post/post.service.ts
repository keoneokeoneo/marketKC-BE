import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { PostData } from './post.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
  ) {}

  async addPost(data: PostData) {
    const upload = await this.postRepository.create();

    upload.title = data.title;
    upload.content = data.content;
    upload.price = data.price;
    upload.writer = data.writer;
    upload.category = data.category;

    const post = await this.postRepository.save(upload);

    return post;
  }
}

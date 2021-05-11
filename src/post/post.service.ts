import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { UploadPost } from './post.type';
import { PostImg } from './postImg.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: PostRepository,
  ) {}

  async getPost(id: number) {
    try {
      const res = await this.postRepository.findOne(id, {
        relations: ['category', 'user', 'postImgs'],
      });

      return res;
    } catch (e) {
      Logger.error(e);
    }
  }

  async getFeedPosts() {
    try {
      const [result, total] = await this.postRepository.findAndCount({
        order: { updatedAt: 'DESC' },
        select: [
          'id',
          'title',
          'location',
          'updatedAt',
          'price',
          'chats',
          'likes',
        ],
        relations: ['postImgs'],
        // where: [
        //   {
        //     category: {
        //       id: 5,
        //     },
        //   },
        // ],
      });

      return {
        result,
        total,
      };
    } catch (e) {
      Logger.error(e);
    }
  }

  async addPost(data: UploadPost, user: User, category: Category) {
    try {
      const newPost = new Post();

      newPost.title = data.title;
      newPost.content = data.content;
      newPost.price = data.price;
      newPost.location = data.location;

      const date = new Date(Date.now());
      newPost.createdAt = date;
      newPost.updatedAt = date;

      const urls: PostImg[] = [];

      data.imgUrls.forEach((url) => {
        const newPostImg = new PostImg();
        newPostImg.url = url;

        urls.push(newPostImg);
      });

      newPost.postImgs = urls;
      newPost.user = user;
      newPost.category = category;

      return await this.postRepository.save(newPost);
    } catch (e) {
      Logger.error(e);
    }
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { string } from 'joi';
import { userInfo } from 'node:os';
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
    const res = await this.postRepository.findOne(id, {
      relations: ['category', 'user', 'postImgs'],
    });

    const tmp = res.location.split(' ');

    await this.postRepository.update({ id: id }, { views: res.views + 1 });

    return {
      id: res.id,
      title: res.title,
      content: res.content,
      price: res.price,
      likes: res.likes,
      chats: res.chats,
      views: res.views + 1,
      location: `${tmp[1]} ${tmp[2]}`,
      updatedAt: res.updatedAt,
      categoryName: res.category.name,
      user: {
        id: res.user.id,
        name: res.user.name,
        profileImgUrl: res.user.profileImgUrl,
      },
      postImgs: res.postImgs,
    };
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

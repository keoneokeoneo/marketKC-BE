import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { getDiff } from 'src/dateFormat';
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

  async updateView(id: number, prev: number) {
    return await this.postRepository.update({ id: id }, { views: prev + 1 });
  }

  async getPost(id: number) {
    return await this.postRepository.findOne(id, {
      relations: ['category', 'seller', 'postImgs', 'chatrooms'],
    });
  }

  async getFeedPosts() {
    try {
      const [result, total] = await this.postRepository.findAndCount({
        relations: ['postImgs'],
        select: ['title', 'location', 'updatedAt', 'price', 'id'],
        where: [{ status: '판매중' }],
        order: { updatedAt: 'DESC' },
      });

      return {
        result,
        total,
      };
    } catch (e) {
      Logger.error(e);
    }
  }

  async getChatPost(postID: number) {
    const res = await this.postRepository.findOne({ where: { id: postID } });
    if (!res) return null;
    return {
      title: res.title,
      price: res.price,
      image: res.postImgs[0].url,
      user: {
        name: res.seller.name,
      },
    };
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
      newPost.seller = user;
      newPost.category = category;

      return await this.postRepository.save(newPost);
    } catch (e) {
      Logger.error(e);
    }
  }

  async updateStatus(postID: number, status: '판매중' | '거래중' | '거래완료') {
    return await this.postRepository.update(
      { id: postID },
      { status: status, updatedAt: new Date(Date.now()) },
    );
  }

  async getUserPost(userID: string) {
    const posts = await this.postRepository.find({
      relations: ['chatrooms'],
      where: { seller: { id: userID } },
    });

    if (posts.length < 1) return [];

    return posts.map((post) => {
      const {
        id,
        title,
        status,
        updatedAt,
        chatrooms,
        location,
        postImgs,
        price,
        seller,
      } = post;

      return {
        id: id,
        title: title,
        location: location.split(' ')[2],
        updatedAt: getDiff(updatedAt),
        status: status,
        price: price,
        chats: chatrooms.length,
        postImg: postImgs[0].url,
        seller: {
          id: seller.id,
          name: seller.name,
        },
      };
    });
  }
}

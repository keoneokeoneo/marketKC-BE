import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UploadPost } from './post.type';
import * as Joi from 'joi';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { getDiff } from 'src/dateFormat';

export const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryID: Joi.number().required(),
  location: Joi.string().required(),
  price: Joi.number().required(),
  userID: Joi.string().required(),
  imgUrls: Joi.array().items(Joi.string()).required(),
});

@Controller('/api/posts')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  @Get()
  async getFeedPosts(@Res() res: Response) {
    try {
      const result = await this.postService.getFeedPosts();

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Get('/:id')
  async getPost(@Param('id') id: number, @Res() res: Response) {
    try {
      const post = await this.postService.getPost(id);

      if (!post)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 게시글이 존재하지 않습니다.');

      await this.postService.updateView(id, post.views); // 조회했으므로 뷰 증가

      const tmp = post.location.split(' ');

      const result = {
        id: post.id,
        title: post.title,
        content: post.content,
        price: post.price,
        likes: post.likes,
        chats: post.chats,
        views: post.views + 1,
        location: `${tmp[1]} ${tmp[2]}`,
        updatedAt: getDiff(post.updatedAt),
        categoryName: post.category.name,
        user: {
          id: post.user.id,
          name: post.user.name,
          profileImgUrl: post.user.profileImgUrl,
        },
        postImgs: post.postImgs,
      };

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Post()
  async addPost(@Body() post: UploadPost, @Res() res: Response) {
    try {
      const {
        value,
        error,
      }: {
        value: UploadPost;
        error?: Joi.ValidationError;
      } = postSchema.validate(post);

      if (error) {
        // Joi Validation ㅣ실패
        Logger.error(error);
        return res.status(HttpStatus.BAD_REQUEST).send(error);
      }

      const user = await this.userService.getUserByID(post.userID);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 유저 정보가 없습니다.');

      const category = await this.categoryService.getCategoryByID(
        post.categoryID,
      );
      if (!category)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 카테고리 정보가 없습니다.');
      // 포스트 먼저 생성 - id값 참조를 해야 함
      const newPost = await this.postService.addPost(value, user, category);

      return res.status(HttpStatus.CREATED).send(newPost);
    } catch (e) {
      Logger.error(e);
    }
  }
}

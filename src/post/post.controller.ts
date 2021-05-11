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

  @Get('/feed')
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
      const result = await this.postService.getPost(id);

      if (!result)
        res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 게시글이 존재하지 않습니다.');

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

      console.log('작성자 정보 : ', user);

      const category = await this.categoryService.getCategoryByID(
        post.categoryID,
      );
      if (!category)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('해당 카테고리 정보가 없습니다.');
      console.log('게시글 카테고리 정보 : ', category);

      // 포스트 먼저 생성 - id값 참조를 해야 함
      const newPost = await this.postService.addPost(value, user, category);
      console.log('생성된 post : ', newPost);

      return res.status(HttpStatus.CREATED).send(newPost);

      // 성공
    } catch (e) {
      Logger.error(e);
    }
  }
}

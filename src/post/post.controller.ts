import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostData } from './post.type';
import * as Joi from 'joi';

export const postSchema = Joi.object({
  postTitle: Joi.string().required(),
  postContent: Joi.string().required(),
  postCategoryID: Joi.number().required(),
  //postLocation:Joi.number().required(),
  postPrice: Joi.number().required(),
  userID: Joi.string().required(),
});

@Controller('/api/post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/add')
  async addPost(@Body() post: PostData) {
    try {
      console.log(post);
      const {
        value,
        error,
      }: { value: PostData; error?: Joi.ValidationError } = postSchema.validate(
        post,
      );

      if (error) {
        Logger.error(error);
      }

      const newPost = await this.postService.addPost(value);

      // 성공
    } catch (e) {
      Logger.error(e);
    }
  }
}

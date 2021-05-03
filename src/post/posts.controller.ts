import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostData } from './posts.type';
import * as Joi from 'joi';
import { ResponseMessage } from 'src/response.util';

export const postSchema = Joi.object({
  postTitle: Joi.string().required(),
  postContent: Joi.string().required(),
  postCategoryID: Joi.number().required(),
  //postLocation:Joi.number().required(),
  postPrice: Joi.number().required(),
  userID: Joi.string().required(),
});

@Controller('/api/post')
export class PostsController {
  constructor(private postsService: PostsService) {}

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
        return new ResponseMessage()
          .error()
          .body('Parameter Error : Wrong Params')
          .build();
      }

      const newPost = await this.postsService.addPost(value);

      return new ResponseMessage().success().body(newPost).build();
    } catch (e) {
      Logger.error(e);
    }
  }
}

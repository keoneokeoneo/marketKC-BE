import * as Joi from 'joi';

export const regSchema = Joi.object({
  userEmail: Joi.string().required(),
  userName: Joi.string().required(),
  userPW: Joi.string().required(),
});

export const loginSchema = Joi.object({
  userEmail: Joi.string().required(),
  userPW: Joi.string().required(),
});

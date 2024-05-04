import { Joi } from 'celebrate';
import { regrex } from '../utils/data';

export const schemaCreateCard = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().uri(),
});

export const schemaId = Joi.object().keys({
  cardId: Joi.string().required().alphanum().length(24),
});

export const schemaUpdateUser = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(200),
});

export const schemaUpdateAvatar = Joi.object().keys({
  avatar: Joi.string().required().pattern(regrex)
    .message('Url не валидный'),
});

export const schemaLoginUser = Joi.object().keys({
  email: Joi.string().required().min(2).max(30)
    .email(),
  password: Joi.string().required().min(4),
});

export const schemaUserId = Joi.object().keys({
  userId: Joi.string().required().alphanum().length(24),
});

export const schemaCreateUser = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  email: Joi.string().required(),
  password: Joi.string().required(),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string().required().pattern(regrex)
    .message('Url не валидный'),
});

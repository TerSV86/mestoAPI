import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getUsers, getUserById, updateUser, updateAvatar,
  getInfoCurrentUser,
} from '../controllers/users';
import { regrex } from '../utils/data';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getInfoCurrentUser);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regrex)
      .message('Url не валидный'),
  }),
}), updateAvatar);

export default userRouter;

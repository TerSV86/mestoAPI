import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUsers, /* getUserById, */ updateUser, updateAvatar,
  /* getInfoCurrentUser, */
  searchUser,
} from '../controllers/users';
import {
  schemaUpdateAvatar, schemaUpdateUser, schemaUserId,
} from '../validation/card';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', searchUser/* getInfoCurrentUser */);
userRouter.get('/:userId', celebrate({ params: schemaUserId }), searchUser/* getUserById */);

userRouter.patch('/me', celebrate({ body: schemaUpdateUser }), updateUser);
userRouter.patch('/me/avatar', celebrate({ body: schemaUpdateAvatar }), updateAvatar);

export default userRouter;

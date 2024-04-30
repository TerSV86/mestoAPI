import { Router } from 'express';
import {
  /* createUser, */ getUsers, getUserById, updateUser, updateAvatar,
  getInfoCurrentUser,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getInfoCurrentUser);
userRouter.get('/:userId', getUserById);
// eslint-disable-next-line max-len
// userRouter.post('/', createUser); - удалить обработчик создания user, его заменил обработчик в app;
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);


export default userRouter;

import express from 'express';
import router from './routes/index';

const app = express();

app.use(router);

const connect = async () => {
  try {
    await app.listen(3000);
    console.log('Сервер запущен на порту:', 3000);
  } catch (err) {
    console.log(err);
  }
};

connect();


import { Router } from 'express';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);

export default router;

import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);

export default userRouter;



import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  await res.send({ message: 'User' });
};

export const getUserById = async (req: Request, res: Response) => {
  res.send({ message: 'id' });
};

export const createUser = async (req: Request, res: Response) => { res.send({ message: 'create' }); };
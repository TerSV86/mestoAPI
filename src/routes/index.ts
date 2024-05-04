import { Router } from 'express';
import { celebrate } from 'celebrate';
import userRouter from './users';
import cardRouter from './cards';
import { login, createUser } from '../controllers/users';
import auth from '../middleware/auth';
import { schemaCreateUser, schemaLoginUser } from '../validation/card';

const NotFoundError = require('../errors/notFoundError');

const router = Router();

router.post('/signin', celebrate({ body: schemaLoginUser }), login);
router.post('/signup', celebrate({ body: schemaCreateUser }), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

export default router;

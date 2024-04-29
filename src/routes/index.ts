import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const NotFoundError = require('../errors/notFoundError');

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

export default router;

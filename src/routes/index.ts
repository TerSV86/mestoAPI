import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import userRouter from './users';
import cardRouter from './cards';
import { login, createUser } from '../controllers/users';
import auth from '../middleware/auth';

const NotFoundError = require('../errors/notFoundError');

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(4),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required(),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

export default router;

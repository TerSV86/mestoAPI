import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const NotFoundError = require('../errors/notFoundError');
const BadRequest = require('../errors/BadRequest');

export const getUsers = async (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: '1' }));

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      if (typeof user.name !== 'string'
        || user.name === ''
        || user.about.length < 2
        || typeof user.about !== 'string'
      ) {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      if (typeof user.avatar !== 'string'
        || user.avatar === ''
      ) {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: user });
    })
    .catch(next);
};

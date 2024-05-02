import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const { NODE_ENV, JWT_SECRET } = process.env;

export const getUsers = async (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: '1' }));

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    email,
    password,
    about,
    avatar,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, about, avatar,
    }))
    .then((user) => {
      res.status(constants.HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch(next);
};

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

// eslint-disable-next-line max-len
export const getInfoCurrentUser = async (req: any, res: Response, next: NextFunction) => User.findById(req.user._id)
  .then((user) => {
    res.send({ data: user });
  })
  .catch(next);

export const login: any = async (req: any, res: Response, next: NextFunction) => {
  console.log(req.body);

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Неправильная почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new Error('Неправильная почта или пароль');
    }
    if (!JWT_SECRET) {
      throw new Error('Секретный ключ JWT не установлен');
    }

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }); /* .end() - защита если тело пустое */

    res.send({ token, message: 'Все верно!' });
  } catch (err) {
    next(err);
  }
};

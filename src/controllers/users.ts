import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CustomRequest } from '../types/customTypes';

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequest = require('../errors/BadRequest');

export const getUsers = async (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

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

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

export const getInfoCurrentUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .then((user) => {
    res.send({ data: user });
  })
  .catch(next);

export const login: any = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new BadRequest('Неправильная почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new BadRequest('Неправильная почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      (NODE_ENV === 'production' && JWT_SECRET)
        ? JWT_SECRET
        : 'some-secret-key',
    );
    res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }); /* .end() - защита если тело пустое */

    res.send({ token, message: 'Все верно!' });
  } catch (err) {
    next(err);
  }
};

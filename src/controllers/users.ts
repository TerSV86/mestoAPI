import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { CustomRequest } from '../types/customTypes';
import cachingDecoration from '../wrapperDecoration/wrapperCachUserId';

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequest = require('../errors/BadRequest');

export const getUsers = async (req: Request, res: Response, next: NextFunction) => user.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

/* export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user.findById(userId)
    .then((userInfo) => {
      res.send({ data: userInfo });
    })
    .catch(next);
}; */

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    email,
    password,
    about,
    avatar,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, email, password: hash, about, avatar,
    }))
    .then((newUser) => {
      res.status(constants.HTTP_STATUS_CREATED).send({ data: newUser });
    })
    .catch(next);
};

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  return user.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((userUpdate) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: userUpdate });
    })
    .catch(next);
};

export const updateAvatar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((userUpdate) => {
      res.status(constants.HTTP_STATUS_OK).send({ data: userUpdate });
    })
    .catch(next);
};

/* export const getInfoCurrentUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => user.findById(req.user?._id)
  .then((info) => {
    res.send({ data: info });
  })
  .catch(next); */

// eslint-disable-next-line import/no-mutable-exports
export let searchUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = (req.params.userId) ? req.params.userId : req.user?._id;
  console.log(id, req.params, req.user);

  return user.findById(id)
    .then((info) => {
      res.send({ data: info });
      return info;
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

searchUser = cachingDecoration(searchUser);

export const login: any = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const userLog = await user.findOne({ email }).select('+password');
    if (!userLog) {
      throw new BadRequest('Неправильная почта или пароль');
    }
    const matched = await bcrypt.compare(password, userLog.password);
    if (!matched) {
      throw new BadRequest('Неправильная почта или пароль');
    }

    const token = jwt.sign(
      { _id: userLog._id },
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

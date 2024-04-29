import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import User from '../models/user';

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
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
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
      res.status(constants.HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(constants.HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch(next);
};

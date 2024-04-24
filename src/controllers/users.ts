import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  await res.send({ message: 'User' });
};

export const getUserById = async (req: Request, res: Response) => {
  res.send({ message: 'id' });
};

export const createUser = async (req: Request, res: Response) => { res.send({ message: 'create' }); };

/* export const getUsers = async (req: Request, res: Response) => { res.send({ message: 'User' }); }User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getUserById = async (req: Request, res: Response) => {
  console.log('id');

  res.send({ message: 'id' });
  const { id } = req.params;
  return User.find({ _id: id })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = async (req: Request, res: Response) => {
  res.send({ message: 'createUser' });
};
console.log(req.body);

const { name, about, avatar } = req.body;
try {
  const user = await User.create({ name, about, avatar });
  return res.send({ data: user });
} catch {
  return res.status(500).send({ message: 'Произошла ошибка' });
} */
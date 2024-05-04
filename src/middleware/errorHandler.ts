import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import mongoose, { Error as MongooseError } from 'mongoose';
import { CustomRequest } from '../types/customTypes';

const errorHandler = (err: any, req: CustomRequest, res: Response, next: NextFunction) => {
  console.log(err);

  if (err.name === 'JsonWebTokenError') {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Токен не действителен' });
  }

  if (err instanceof Error && err.message.startsWith('E11000')) {
    return res.status(constants.HTTP_STATUS_CONFLICT)
      .send({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'ValidationError') {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: `Переданы некорректные данные ${err.message}` });
  }
  if (err instanceof MongooseError.CastError) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Передан некорректный id' });
  }
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере ошибка'
        : message,
    });
};

export default errorHandler;

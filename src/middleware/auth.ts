import { NextFunction } from 'express';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';

const Unauthorized = require('../errors/Unauthorized');

export default (req: any, res: any, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;

  next();
};

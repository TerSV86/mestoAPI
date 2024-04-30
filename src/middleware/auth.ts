import { NextFunction } from 'express';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';

export default (req: any, res: any, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log('authori', authorization);

  if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log('payload', payload);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  console.log('reqUser', req.user);

  next();
};

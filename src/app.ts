import express, {
  json, Response, NextFunction,
} from 'express';
import mongoose, { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middleware/logger';
import router from './routes/index';
import { CustomRequest } from './types/customTypes';

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(json());
app.use(requestLogger);
app.use(router);
app.use('/', router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.connection.on('connected', () => {
  console.log('Подключение к базе данных успешно');
});
mongoose.connection.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});

app.use(errorLogger);
app.use(errors());
app.use((err: any, req: CustomRequest, res: Response, next: NextFunction) => {
  console.log(err.name);
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
});

app.listen(PORT, () => {
  console.log(`Приложение работает на порту ${PORT}`);
});

import express, {
  json, Response, NextFunction,
} from 'express';
import mongoose, { Error as MongooseError } from 'mongoose';
/* import ValidatorError from 'validator'; */
import { constants } from 'http2';
/* import user from './models/user'; */
import helmet from 'helmet';
import router from './routes/index';

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66293d230dd37bf14aed15e5',
  };
  next();
});

app.use(json());
app.use(router);
app.use('/', router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

mongoose.connection.on('connected', () => {
  console.log('Подключение к базе данных успешно');
});
mongoose.connection.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});

// eslint-disable-next-line no-unused-vars, consistent-return
app.use((err: any, req: any, res: Response, next: NextFunction) => {
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
  /* next(); */
});

app.listen(PORT, () => {
  console.log(`Приложение работает на порту ${PORT}`);
});

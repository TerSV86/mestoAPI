import express, {
  json, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';

const { PORT = 3000 } = process.env;

const app = express();

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

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: any, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  console.log('middl', message);

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

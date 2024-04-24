import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';

const app = express();
app.get('/', (req: Request, res: Response) => {
  console.log('test');

  res.send({ message: 'test' });
});
app.use(router);

const connect = async () => {
  try {
    await app.listen(3000);
    console.log('Сервер запущен на порту:', 3000);
  } catch (err) {
    console.log(err);
  }
};

connect();

/* const { PORT = 3000 } = process.env;

const app = express();
app.use(json());
app.use(router);
app.use('/users', router);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// Проверка подключения к БД (удалить)
mongoose.connection.on('connected', () => {
  console.log('Подключение к базе данных успешно');
});
mongoose.connection.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});


app.listen(PORT, () => {
  console.log(`Приложение работает на порту ${PORT}`);
}); */

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
import errorHandler from './middleware/errorHandler';

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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение работает на порту ${PORT}`);
});

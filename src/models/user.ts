import { model, Schema } from 'mongoose';
import validator from 'validator';
import { regrex } from '../utils/data';

export interface IUser {
  name: string;
  email: string;
  password: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      required: false,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name"-30'],
    },
    email: {
      type: String,
      validate: {
        validator: (v: string) => validator.isEmail(v),
      },
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    about: {
      type: String,
      default: 'Исследователь',
      required: false,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [200, 'Максимальная длина поля "about"-200'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url: string) => {
          const isMatch = regrex.test(url);
          return isMatch;
        },
        message: 'Введен некорректный URL адрес',
      },
      required: false,
    },
  },
  { versionKey: false },
);

export default model<IUser>('User', userSchema);

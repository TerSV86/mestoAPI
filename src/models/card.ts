import { model, Schema } from 'mongoose';
import validator from 'validator';

interface ICard {
  name?: string;
  link: string;
  owener: Schema.Types.ObjectId;
  likes: [Schema.Types.ObjectId];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name"-30'],
    },
    link: {
      type: String,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: true,
    },
    owener: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<ICard>('card', cardSchema);

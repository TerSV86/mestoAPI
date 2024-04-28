import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';

const NotFoundError = require('../errors/notFoundError');
const BadRequest = require('../errors/BadRequest');

export const getCards = async (req: Request, res: Response) => Card.find({})
  .select('-__v')
  .populate('owener')
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createCard = async (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owener = req.user._id;
  return (await Card.create({ name, link, owener })).populate('owener')
    .then((card) => {
      if (!card) {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch(next);
};

export const likeCard = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: card.likes });
    })
    .catch(next);
};

export const dislikeCard = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      res.send({ data: card });
    })
    .catch(next);
};

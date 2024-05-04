import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import card from '../models/card';

const NotFoundError = require('../errors/notFoundError');

export const getCards = async (req: Request, res: Response, next: NextFunction) => card.find({})
  .select('-__v')
  .populate('owener')
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = async (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owener = req.user._id;
  return card.create({ name, link, owener })
    .then((newCard) => newCard.populate('owener'))
    .then((newCard) => {
      res.status(constants.HTTP_STATUS_CREATED).send({ data: newCard });
    })
    .catch((err: any) => {
      next(err);
    });
};

export const deleteCard = async (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return card.findById(cardId)
    .then((cardDel) => {
      if (!cardDel) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (cardDel.owener.toString() !== req.user._id) {
        return res.send({ message: 'Вы не можете удалить эту карточку' });
      }
      return card.deleteOne({ _id: cardDel._id.toString() })
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

export const likeCard = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((cardLike) => {
      if (!cardLike) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send({ data: cardLike.likes });
    })
    .catch(next);
};

export const dislikeCard = async (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .then((cardDis) => {
      if (!cardDis) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send({ data: cardDis });
    })
    .catch(next);
};

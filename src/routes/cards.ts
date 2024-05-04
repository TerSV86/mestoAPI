import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { schemaCreateCard, schemaId } from '../validation/card';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({ body: schemaCreateCard }), createCard);
cardRouter.delete('/:cardId', celebrate({ params: schemaId }), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({ params: schemaId }), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({ params: schemaId }), dislikeCard);

export default cardRouter;

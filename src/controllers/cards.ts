/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

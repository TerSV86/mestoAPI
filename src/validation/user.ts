import { Joi } from 'celebrate';

export const schemaCreateCard = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().uri(),
});

export const schemaCardId = Joi.object().keys({
  cardId: Joi.string().required().hex().length(24),
});

import Joi from "joi";

const requiredPositiveInt = Joi.number().integer().positive().required();

const bodySchema = Joi.object({
  customerId: requiredPositiveInt,
  gameId: requiredPositiveInt,
  daysRented: requiredPositiveInt,
});

const querySchema = Joi.object({
  customerId: Joi.number().integer().positive(),
  gameId: Joi.number().integer().positive(),
  status: Joi.string().valid("open", "closed"),
  startDate: Joi.date(),
  offset: Joi.number().integer().positive().default(0),
  limit: Joi.number().integer().positive(),
  order: Joi.string().valid(
    "id",
    "customerId",
    "gameId",
    "rentDate",
    "daysRented",
    "returnDate",
    "originalPrice",
    "delayFee"
  ),
  desc: Joi.boolean().default(false),
});

export { bodySchema, querySchema };

import Joi from "joi";

const bodySchema = Joi.object({
  name: Joi.string().trim().required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().integer().positive().required(),
  pricePerDay: Joi.number().integer().positive().required(),
});

const querySchema = Joi.object({
  name: Joi.string(),
  offset: Joi.number().integer().positive().default(0),
  limit: Joi.number().integer().positive(),
  order: Joi.string().valid("id", "name", "image", "stockTotal", "pricePerDay"),
  desc: Joi.boolean().default(false),
});

export { bodySchema, querySchema };

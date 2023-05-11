import Joi from "joi";

const bodySchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .required(),
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .required(),
  birthday: Joi.date().required(),
});

const querySchema = Joi.object({
  cpf: Joi.string().pattern(/\d+/),
  offset: Joi.number().integer().positive().default(0),
  limit: Joi.number().integer().positive(),
  order: Joi.string().valid("name", "phone", "cpf", "birthday"),
  desc: Joi.boolean().default(false),
});

export { bodySchema, querySchema };

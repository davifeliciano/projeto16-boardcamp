import Joi from "joi";

export default function validateId(req, res, next) {
  const { id } = req.params;
  const { error, value } = Joi.number().integer().validate(id);

  if (error) {
    return res.sendStatus(404);
  }

  res.locals.id = value;
  next();
}

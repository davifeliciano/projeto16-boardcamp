export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const bodyErrors = error.details.map((detail) => detail.message);
      return res.status(400).send({ bodyErrors });
    }

    res.locals.body = value;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const queryErrors = error.details.map((detail) => detail.message);
      return res.status(400).send({ queryErrors });
    }

    res.locals.query = value;
    next();
  };
}

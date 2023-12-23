import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export default function validateRequest(req: Request, res: Response, next: NextFunction, schema: Joi.Schema) {
  const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });

  if (error) {
    console.log(error.details);
    const errors = error.details.map((errorItem: Joi.ValidationErrorItem) => ({
      key: errorItem.context?.key,
      message: errorItem.message,
    }));
    return res.status(400).json({ errors, message: 'Request has validation errors' });
  } else {
    req.body = value;
    next();
  }
}

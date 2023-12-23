import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import validateRequest from './index.js';

export const registerRequest = (req: Request, _res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string().required().max(25),
    lastName: Joi.string().required().max(25),
    email: Joi.string().email().required().max(25),
    password: Joi.string().min(6).required().max(25),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
  });
  validateRequest(req, _res, next, schema);
};

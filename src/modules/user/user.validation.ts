import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().required().max(25),
  lastName: Joi.string().required().max(25),
  email: Joi.string().email().required().max(25),
  password: Joi.string().min(6).required().max(25),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateTokenSchema = Joi.object({
  token: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
});

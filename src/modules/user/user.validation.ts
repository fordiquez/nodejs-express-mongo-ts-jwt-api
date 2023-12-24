import Joi from 'joi';

const register = Joi.object({
  firstName: Joi.string().required().max(25),
  lastName: Joi.string().required().max(25),
  email: Joi.string().email().required().max(25),
  password: Joi.string().min(6).required().max(25),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
});

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default { register, login };

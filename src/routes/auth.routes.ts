import passport from 'passport';
import { registerRequest } from '../requests/auth.requests.js';
import { registerMiddleware, rememberMe } from '../middlewares/auth.middleware.js';
import { register } from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post(
  '/login',
  rememberMe,
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/error',
    failureFlash: true,
  }),
);

router.post('/register', registerRequest, registerMiddleware, register);

export default router;

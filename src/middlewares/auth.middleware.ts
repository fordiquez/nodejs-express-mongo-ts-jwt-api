import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { User } from '../models/User.js';

export async function registerMiddleware(req: Request, res: Response, next: NextFunction) {
  const potentialUser = await User.findOne({ email: req.body.email });

  if (potentialUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  next();
}

export async function rememberMe(req: Request, _res: Response, next: NextFunction) {
  if (req.body.remember) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    req.session.cookie.expires = new Date(Date.now() + oneWeek);
    req.session.cookie.maxAge = oneWeek;
  }

  next();
}

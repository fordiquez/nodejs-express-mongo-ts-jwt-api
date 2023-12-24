import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import token from '../utils/token.js';
import UserModel from '../modules/user/user.model.js';
import Token from '../utils/interfaces/token.interface.js';
import HttpException from '../utils/http.exception.js';

export default async function authenticatedMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new HttpException(401, 'Unauthorised'));
  }

  const accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    const user = await UserModel.findById(payload.id).select('-password').exec();

    if (!user) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised'));
  }
}

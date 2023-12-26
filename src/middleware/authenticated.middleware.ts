import { Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import UserModel from '../modules/user/user.model.js';
import jwt from '../utils/jwt.js';
import HttpException from '../utils/http.exception.js';
import AuthenticatedRequest from '../utils/interfaces/authenticated.request.interface.js';
import Token from '../utils/interfaces/token.interface.js';

export default async function authenticatedMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const accessToken = jwt.getToken(req);

  if (!accessToken) {
    return next(new HttpException(401, 'Unauthorized'));
  }

  try {
    const payload: Token | jsonwebtoken.JsonWebTokenError = await jwt.verifyToken(accessToken);

    if (!(payload instanceof jsonwebtoken.JsonWebTokenError)) {
      const user = await UserModel.findById(payload.id).exec();

      if (!user) {
        return next(new HttpException(401, 'Unauthorized'));
      }

      req.user = user;
    }

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorized'));
  }
}

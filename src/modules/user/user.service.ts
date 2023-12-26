import jsonwebtoken from 'jsonwebtoken';
import UserModel from './user.model.js';
import User, { UserRole } from './user.interface.js';
import jwt from '../../utils/jwt.js';
import Nodemailer from '../../utils/nodemailer.js';
import Token from '../../utils/interfaces/token.interface.js';
import { Request } from 'express';

export default class UserService {
  private user = UserModel;
  private nodemailer = new Nodemailer();

  public async register({ firstName, lastName, email, password }: User): Promise<string | Error> {
    if (await this.user.findOne({ email })) throw new Error('A user with the same email address already exists!');

    try {
      const role = (await this.user.countDocuments({})) === 0 ? UserRole.ADMIN : UserRole.USER;

      const user = await this.user.create({ firstName, lastName, email, password, role });

      return jwt.createToken(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.user.findOne({ email });

    if (!user) {
      throw new Error('Unable to find user with that email address');
    }

    if (await user.isValidPassword(password)) {
      const token = jwt.createToken(user);
      return { user, token };
    } else {
      throw new Error('Wrong credentials given');
    }
  }

  public async validateToken(token: string): Promise<Token> {
    const payload: Token | jsonwebtoken.JsonWebTokenError = await jwt.verifyToken(token);

    if (!(payload instanceof jsonwebtoken.JsonWebTokenError)) {
      const user = await this.user.findById(payload.id);

      if (!user) {
        throw new Error('Unauthorized');
      }

      return payload;
    }

    throw new Error('Unauthorized');
  }

  public async refreshToken(req: Request): Promise<string> {
    const token = jwt.getToken(req);

    if (token) {
      const payload: Token | jsonwebtoken.JsonWebTokenError = await jwt.verifyToken(token);

      if (!(payload instanceof jsonwebtoken.JsonWebTokenError)) {
        const user = await this.user.findById(payload.id);

        if (!user) {
          throw new Error('Unauthorized');
        }

        return jwt.createToken(user);
      }
    }

    throw new Error('Unauthorized');
  }

  public async forgotPassword(email: string, origin: string | undefined): Promise<string> {
    const user = await this.user.findOne({ email });

    if (!user) {
      throw new Error('Unable to find user with that email address');
    }

    const resetToken = jwt.createToken(user);

    await this.nodemailer.sendResetPasswordMail(email, resetToken, origin);

    return resetToken;
  }

  public async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const payload: Token | jsonwebtoken.JsonWebTokenError = await jwt.verifyToken(token);

    if (!(payload instanceof jsonwebtoken.JsonWebTokenError)) {
      const user = await this.user.findById(payload.id);

      if (!user) {
        throw new Error('Unauthorized');
      }

      user.password = password;
      user.save();

      return { user, token };
    }

    throw new Error('Unauthorized');
  }
}

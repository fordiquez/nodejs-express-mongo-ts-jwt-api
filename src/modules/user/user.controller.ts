import { Router, Request, Response, NextFunction } from 'express';
import authenticated from '../../middleware/authenticated.middleware.js';
import validationMiddleware from '../../middleware/validation.middleware.js';
import HttpException from '../../utils/http.exception.js';
import AuthenticatedRequest from '../../utils/interfaces/authenticated.request.interface.js';
import Controller from '../../utils/interfaces/controller.interface.js';
import UserService from './user.service.js';
import { loginSchema, registerSchema, resetPasswordSchema, validateTokenSchema } from './user.validation.js';

export default class UserController implements Controller {
  public router = Router();
  private userService = new UserService();
  private readonly authFlow: 'bearer' | 'cookie';

  constructor(authFlow: 'bearer' | 'cookie') {
    this.authFlow = authFlow;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', validationMiddleware(registerSchema), this.register);
    this.router.post('/login', validationMiddleware(loginSchema), this.login);
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.post('/reset-password', validationMiddleware(resetPasswordSchema), this.resetPassword);
    this.router.post('/validate-token', validationMiddleware(validateTokenSchema), this.validateToken);
    this.router.post('/refresh-token', this.refreshToken);
    this.router.delete('/logout', authenticated, this.logout);
    this.router.get('/users', authenticated, this.getUser);
  }

  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const token = await this.userService.register(req.body);

      res.status(201).json({ token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.userService.login(email, password);

      this.setOrClearCookieToken(res, token);

      res.status(200).json({ user, token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private getUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      next(new HttpException(404, 'No logged in user'));
    }

    res.status(200).send({ data: req.user });
  };

  private validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = await this.userService.validateToken(req.body.token);

      res.status(200).send({ payload });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = await this.userService.refreshToken(req);
      res.status(200).send({ token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private logout = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (this.authFlow === 'cookie') {
      res.clearCookie('token');
    }

    res.status(200).send({ success: true });
  };

  private forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const token = await this.userService.forgotPassword(req.body.email, req.get('origin'));

      res.status(200).send({ token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.userService.resetPassword(req.body);

      res.status(200).send({ user, token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private setOrClearCookieToken = (res: Response, token: string): void => {
    this.authFlow === 'cookie'
      ? res.cookie('token', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
      : res.clearCookie('token');
  };
}

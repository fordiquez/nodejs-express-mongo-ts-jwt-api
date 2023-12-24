import { Router, Request, Response, NextFunction } from 'express';
import authenticated from '../../middleware/authenticated.middleware.js';
import validationMiddleware from '../../middleware/validation.middleware.js';
import HttpException from '../../utils/http.exception.js';
import Controller from '../../utils/interfaces/controller.interface.js';
import UserService from './user.service.js';
import validate from './user.validation.js';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
    this.router.get(`${this.path}`, authenticated, this.getUser);
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

      const token = await this.userService.login(email, password);

      res.status(200).json({ token });
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  };

  private getUser = (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return next(new HttpException(404, 'No logged in user'));
    }

    res.status(200).send({ data: req.user });
  };
}

export default UserController;

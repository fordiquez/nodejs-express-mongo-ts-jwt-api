import User from '../../modules/user/user.interface.js';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

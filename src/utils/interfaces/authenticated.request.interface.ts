import { Request } from 'express';
import User from '../../modules/user/user.interface.js';

// Define a custom interface extending the Express Request type to include a 'user' property
export default interface AuthenticatedRequest extends Request {
  user?: User;
}

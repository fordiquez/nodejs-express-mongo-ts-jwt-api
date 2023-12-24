import UserModel from './user.model.js';
import token from '../../utils/token.js';
import User, { UserRole } from './user.interface.js';

class UserService {
  private user = UserModel;

  public async register({ firstName, lastName, email, password }: User): Promise<string | Error> {
    try {
      const role = (await this.user.countDocuments({})) === 0 ? UserRole.ADMIN : UserRole.USER;

      const user = await this.user.create({ firstName, lastName, email, password, role });

      return token.createToken(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async login(email: string, password: string): Promise<string | Error> {
    const user = await this.user.findOne({ email });

    if (!user) {
      throw new Error('Unable to find user with that email address');
    }

    if (await user.isValidPassword(password)) {
      return token.createToken(user);
    } else {
      throw new Error('Wrong credentials given');
    }
  }
}

export default UserService;

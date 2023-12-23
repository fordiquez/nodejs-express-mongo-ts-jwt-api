import { IUser, User, UserRole } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async ({
  email,
  firstName,
  lastName,
  password,
}: IUser): Promise<{
  message: string;
  error: boolean;
  user: IUser | null;
}> => {
  if (await User.findOne({ email: email })) throw 'User with such email already exists';

  const isFirstUser = (await User.countDocuments({})) === 0;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role: isFirstUser ? UserRole.ADMIN : UserRole.USER,
  });

  const registeredUser = await User.register(user, password);

  if (registeredUser) {
    return { message: 'User registered', error: false, user: registeredUser };
  }

  return { message: 'error registering user', error: true, user: null };
};

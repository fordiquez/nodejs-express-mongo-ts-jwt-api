import { model, Schema, PassportLocalDocument } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser extends PassportLocalDocument {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  role: UserRole;
}

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: String,
  verificationToken: String,
  resetToken: { token: String, expires: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  passwordResetAt: Date,
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const User = model<IUser>('User', UserSchema);

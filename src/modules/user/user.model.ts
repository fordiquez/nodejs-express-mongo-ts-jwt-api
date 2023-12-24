import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import User from './user.interface.js';

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    role: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.password;
  },
});

export default model<User>('User', userSchema);

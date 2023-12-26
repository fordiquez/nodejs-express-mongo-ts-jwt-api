import { Schema } from 'mongoose';

export default interface Token {
  id: Schema.Types.ObjectId;
  iat: number;
  exp: number;
}

import mongoose from 'mongoose';

export default function isValidId(
  id: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array,
) {
  return mongoose.Types.ObjectId.isValid(id);
}

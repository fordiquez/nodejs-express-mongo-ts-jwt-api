import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (): Promise<void> => {
  const MONGO_URL: string | undefined = process.env.MONGO_URL;
  if (MONGO_URL) {
    await mongoose
      .connect(MONGO_URL)
      .then(async () => logger.info('Connected to MongoDB successfully'))
      .catch((error) => {
        logger.error(error);
        process.exit(1);
      });
  }
};

export const isValidId = (
  id: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array,
) => mongoose.Types.ObjectId.isValid(id);

export default connectDB;

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

/**
 * Connects to MongoDB using mongoose and caches the connection across module reloads.
 * This prevents creating multiple connections in development (e.g. Next.js hot reload).
 *
 * Returns the active `mongoose` instance (typed as `mongoose.Mongoose`).
 */
export default async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { mongoose };

import mongoose from 'mongoose';

export default async () => {
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => console.log('There is an error while connecting to MongoDB : ', err.message));
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

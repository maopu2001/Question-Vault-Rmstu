import mongoose from 'mongoose';
import User from './schema/userSchema';
import Auth from './schema/authSchema';
import File from './schema/fileSchema';

export default async () => {
  const connection = await mongoose
    .connect(process.env.NEXT_MONGODB_URI)
    .catch((err) => console.log('There is an error while connecting to MongoDB : ', err.message));
  
  if (!connection.models.User) {
    connection.model('User', User.schema);
  }
  if (!connection.models.Auth) {
    connection.model('Auth', Auth.schema);
  }
  if (!connection.models.File) {
    connection.model('File', File.schema);
  }
  return connection;
};

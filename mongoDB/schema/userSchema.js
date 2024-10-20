import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  degree: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  session: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

import mongoose from 'mongoose';

const tempAuthSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  randomNumber: { type: String },
  email: { type: String, unique: true },
  degree: { type: String },
  faculty: { type: String },
  department: { type: String },
  session: { type: String },

  role: { type: String, enum: ['admin', 'user', 'superadmin'], default: 'user' },
  accessrequest: { type: Boolean, default: false },
  passwordChangeRequest: { type: Boolean, default: false },
  createdAt: { type: Date, expires: '1d', default: Date.now },
});

const TempAuth = mongoose.models.TempAuth || mongoose.model('TempAuth', tempAuthSchema);
export default TempAuth;

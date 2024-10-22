import mongoose from 'mongoose';

const tempAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  randomNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  degree: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  session: { type: String, required: true },

  role: { type: String, enum: ['admin', 'user', 'superadmin'], default: 'user', required: true },
  accessrequest: { type: Boolean, default: false },
  createdAt: { type: Date, expires: '1d', default: Date.now },
});

const TempAuth = mongoose.models.TempAuth || mongoose.model('TempAuth', tempAuthSchema);
export default TempAuth;

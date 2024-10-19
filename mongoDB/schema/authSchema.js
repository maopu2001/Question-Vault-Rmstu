import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'superadmin'], default: 'user', required: true },
});

export default mongoose.models.Auth || mongoose.model('Auth', authSchema);

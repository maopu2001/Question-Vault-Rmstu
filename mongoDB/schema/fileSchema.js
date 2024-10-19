import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  content: String, // For smaller files
  gridFSId: mongoose.Schema.Types.ObjectId, // For larger files
});

// Create a model from the schema
export default mongoose.models.File || mongoose.model('File', fileSchema);

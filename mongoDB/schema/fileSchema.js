import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  deleteUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
});

// Create a model from the schema
const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;

import mongoose from 'mongoose';

const deletedFileSchema = new mongoose.Schema({
  deleteDate: { type: Date, default: Date.now },
  deleteUrl: { type: String, required: true },
});

const DeletedFile = mongoose.models.DeletedFile || mongoose.model('DeletedFile', deletedFileSchema);
export default DeletedFile;

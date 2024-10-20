import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
  degree: { type: String, required: true },
  session: { type: String, required: true },
  semester: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
});

const departmentSchema = new mongoose.Schema({
  departmentCode: { type: String, required: true },
  departmentName: { type: String, required: true },
  faculty: { type: String, required: true },
});

const degreeSchema = new mongoose.Schema({
  degreeCode: { type: String, required: true },
  degreeTitle: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
});

const facultySchema = new mongoose.Schema({
  facultyName: { type: String, required: true, unique: true },
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

const Degree = mongoose.models.Degree || mongoose.model('Degree', degreeSchema);

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export { Course, Department, Degree, Faculty };

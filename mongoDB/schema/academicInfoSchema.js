import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseTitle: { type: String, required: true },
  courseType: { type: String, required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Semester' },
  department: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
});

const departmentSchema = new mongoose.Schema({
  departmentCode: { type: String, required: true, unique: true },
  departmentTitle: { type: String, required: true, unique: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
});

const degreeSchema = new mongoose.Schema({
  degreeCode: { type: String, required: true },
  degreeTitle: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
});

const semesterSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  degree: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Degree' },
});

const facultySchema = new mongoose.Schema({
  facultyName: { type: String, required: true, unique: true },
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

const Degree = mongoose.models.Degree || mongoose.model('Degree', degreeSchema);

const Semester = mongoose.models.Semester || mongoose.model('Semester', semesterSchema);

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export { Course, Department, Degree, Semester, Faculty };

import connectMongo from '@/mongoDB/connectMongo';
import { Course, Degree, Department, Faculty, QuesInfo, Semester } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      const degrees = await Degree.find({}).populate('faculty');
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'department') {
    try {
      await connectMongo();
      const departments = await Department.find({}).populate('faculty');
      if (!departments || departments.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: departments }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'semester') {
    try {
      await connectMongo();
      const semesters = await Semester.find({}).populate('degree');
      if (!semesters || semesters.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: semesters }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'course') {
    try {
      await connectMongo();
      const courses = await Course.find({})
        .populate({
          path: 'semester',
          populate: 'degree',
        })
        .populate('department');
      if (!courses || courses.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: courses }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'session') {
    try {
      await connectMongo();
      const quesInfoList = await QuesInfo.find();
      const sessionsArray = quesInfoList.map((quesInfo) => quesInfo.session);
      const sessions = [...new Set(sessionsArray)].sort();

      if (!sessions || sessions.length < 1) return NextResponse.json({ data: sessions }, { status: 200 });

      return NextResponse.json({ data: sessions }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid request' }, { status: 404 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      const faculty = await Faculty.findOne({ facultyName: body.formdata.faculty });

      const data = {
        ...body.formdata,
        faculty: faculty._id,
      };
      await Degree.create(data);
      const degrees = await Degree.find({}).populate('faculty');
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'department') {
    try {
      await connectMongo();
      const faculty = await Faculty.findOne({ facultyName: body.formdata.faculty });

      const data = {
        ...body.formdata,
        faculty: faculty._id,
      };
      await Department.create(data);
      const departments = await Department.find({}).populate('faculty');
      if (!departments || departments.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: departments }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'semester') {
    try {
      await connectMongo();
      const degree = await Degree.findOne({ degreeCode: body.formdata.degree });

      const data = {
        ...body.formdata,
        degree: degree._id,
      };
      await Semester.create(data);
      const semesters = await Semester.find({}).populate('degree');
      if (!semesters || semesters.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: semesters }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      await Faculty.create(body);
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'course') {
    try {
      await connectMongo();
      const department = await Department.findOne({ departmentTitle: body.formdata.department });
      const semester = await Semester.findOne({ semester: body.formdata.semester });

      const data = {
        courseCode: body.formdata.courseCode,
        courseTitle: body.formdata.courseTitle,
        courseType: body.formdata.courseType,
        department: department._id,
        semester: semester._id,
      };

      await Course.create(data);
      const courses = await Course.find({})
        .populate({
          path: 'semester',
          populate: 'degree',
        })
        .populate('department');

      if (!courses || courses.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: courses }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      await Degree.deleteOne({ degreeCode: body.degreeCode });
      const degrees = await Degree.find({}).populate('faculty');
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'department') {
    try {
      await connectMongo();
      await Department.deleteOne({ departmentCode: body.departmentCode });
      const departments = await Department.find({}).populate('faculty');
      if (!departments || departments.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: departments }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'semester') {
    try {
      await connectMongo();
      await Semester.deleteOne({ semester: body.semester });
      const semesters = await Semester.find({}).populate('degree');
      if (!semesters || semesters.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: semesters }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      await Faculty.deleteOne({ facultyName: body.facultyName });
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'course') {
    try {
      await connectMongo();
      await Course.deleteOne({ courseCode: body.courseCode });
      const courses = await Course.find({})
        .populate({
          path: 'semester',
          populate: 'degree',
        })
        .populate('department');
      if (!courses || courses.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: courses }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  }
}

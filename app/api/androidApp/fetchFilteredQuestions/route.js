import connectMongo from '@/mongoDB/connectMongo';
import { QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = new URL(req.url)?.searchParams;
  try {
    await connectMongo();

    const faculty = searchParams.get('faculty') || '';
    const department = searchParams.get('department') || '';
    const degree = searchParams.get('degree') || '';
    const semester = searchParams.get('semester') || '';

    if (faculty === '' || department === '' || degree === '' || semester === '') {
      return NextResponse.json({ data: [] }, { status: 400 });
    }

    const filteredQuesInfoList = await QuesInfo.find({ faculty, department, degree, semester })
      .sort({
        semester: 1,
        session: 1,
        exam: 1,
      })
      .populate('createdBy', '-profileImg');

    if (filteredQuesInfoList.length < 1) {
      return NextResponse.json({ data: [] }, { status: 404 });
    }

    const courses = await QuesInfo.find({ faculty, department, degree, semester }).select('course');
    const uniqueCourses = [...new Set(courses.map((course) => course.course))].sort(
      (a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0]
    );

    const sessions = await QuesInfo.find({ faculty, department, degree, semester }).select('session');
    const uniqueSessions = [...new Set(sessions.map((session) => session.session))].sort(
      (a, b) => a.match(/\d{4}/)[0] - b.match(/\d{4}/)[0]
    );

    const exams = await QuesInfo.find({ faculty, department, degree, semester }).select('exam');
    const uniqueExams = [...new Set(exams.map((exam) => exam.exam))].sort();

    return NextResponse.json(
      { data: filteredQuesInfoList, courses: uniqueCourses, sessions: uniqueSessions, exams: uniqueExams },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

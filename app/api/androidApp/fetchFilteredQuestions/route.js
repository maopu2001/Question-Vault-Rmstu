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
      .populate('createdBy');

    if (filteredQuesInfoList.length < 1) {
      return NextResponse.json({ data: [] }, { status: 404 });
    }

    const courses = await QuesInfo.find({ faculty, department, degree, semester }).select('course');
    const sortedCourses = courses.sort((a, b) => {
      const numA = parseInt(a.course.match(/\d+/)[0], 10);
      const numB = parseInt(b.course.match(/\d+/)[0], 10);
      return numA - numB;
    });
    const uniqueCourses = [...new Set(sortedCourses.map((course) => course.course))];

    const sessions = await QuesInfo.find({ faculty, department, degree, semester }).select('session');
    const sortedSessions = sessions.sort((a, b) => a.session - b.session);
    const uniqueSessions = [...new Set(sortedSessions.map((session) => session.session))];

    const exams = await QuesInfo.find({ faculty, department, degree, semester }).select('exam');
    const sortedExams = exams.sort((a, b) => a.exam - b.exam);
    const uniqueExams = [...new Set(sortedExams.map((exam) => exam.exam))];

    return NextResponse.json(
      { data: filteredQuesInfoList, courses: uniqueCourses, sessions: uniqueSessions, exams: uniqueExams },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

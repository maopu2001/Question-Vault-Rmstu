const { default: connectMongo } = require('@/mongoDB/connectMongo');
const { QuesInfo } = require('@/mongoDB/indexSchema');
const { NextResponse } = require('next/server');

export async function POST(req) {
  const { faculty, department, degree, semester, courses, sessions, exams } = await req.json();
  
  if (!faculty || !department || !degree || !semester)
    return NextResponse.json({ message: 'All required field is not filled up' }, { status: 400 });

  try {
    await connectMongo();
    const unFilteredQuesInfoList = await QuesInfo.find({ faculty, department, degree, semester })
      .sort({
        semester: 1,
        session: 1,
        exam: 1,
      })
      .populate('createdBy');
    if (courses.length < 1 && sessions.length < 1 && exams.length < 1) {
      return NextResponse.json({ data: unFilteredQuesInfoList }, { status: 200 });
    }

    const filteredQuesInfoList = unFilteredQuesInfoList.filter((quesInfo) => {
      const sessionMatch = sessions.length > 0 ? sessions.includes(quesInfo.session) : true;
      const examMatch = exams.length > 0 ? exams.includes(quesInfo.exam) : true;
      const courseMatch = courses.length > 0 ? courses.includes(quesInfo.course) : true;
      return sessionMatch && examMatch && courseMatch;
    });
    return NextResponse.json({ data: filteredQuesInfoList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

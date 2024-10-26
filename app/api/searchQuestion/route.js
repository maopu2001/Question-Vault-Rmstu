const { default: connectMongo } = require('@/mongoDB/connectMongo');
const { QuesInfo } = require('@/mongoDB/indexSchema');
const { NextResponse } = require('next/server');

export async function POST(req) {
  const { faculty, department, degree, semester, course, sessions, exams } = await req.json();
  if (!faculty || !department || !degree || !semester || !course)
    return NextResponse.json({ message: 'All required field is not filled up' }, { status: 400 });

  try {
    await connectMongo();
    const unFilteredQuesInfoList = await QuesInfo.find({ faculty, department, degree, semester, course }).sort({
      session: 1,
      exam: 1,
    });
    if (sessions.length < 1 && exams.length < 1) {
      return NextResponse.json({ data: unFilteredQuesInfoList }, { status: 200 });
    }

    const filteredQuesInfoList = unFilteredQuesInfoList.filter((quesInfo) => {
      const sessionMatch = sessions.length > 0 ? sessions.includes(quesInfo.session) : true;
      const examMatch = exams.length > 0 ? exams.includes(quesInfo.exam) : true;
      return sessionMatch && examMatch;
    });
    return NextResponse.json({ data: filteredQuesInfoList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

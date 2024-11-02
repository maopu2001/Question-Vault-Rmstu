const { default: connectMongo } = require('@/mongoDB/connectMongo');
const { QuesInfo } = require('@/mongoDB/indexSchema');
const { NextResponse } = require('next/server');

export async function POST(req) {
  const { faculty, department, degree, semester } = await req.json();

  if (!faculty || !department || !degree || !semester)
    return NextResponse.json({ message: 'All required field is not filled up' }, { status: 400 });

  try {
    await connectMongo();
    const filteredQuesInfoList = await QuesInfo.find({ faculty, department, degree, semester })
      .sort({
        semester: 1,
        session: 1,
        exam: 1,
      })
      .populate('createdBy');

    return NextResponse.json({ data: filteredQuesInfoList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

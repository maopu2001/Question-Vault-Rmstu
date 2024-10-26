import connectMongo from '@/mongoDB/connectMongo';
import { File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectMongo();
    const quesInfoList = await QuesInfo.find({}).sort({ semester: 1, session: 1, exam: 1 }).populate('createdBy');

    if (!quesInfoList || quesInfoList.length < 1)
      return NextResponse.json({ message: 'No question is found' }, { status: 400 });

    return NextResponse.json({ data: quesInfoList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

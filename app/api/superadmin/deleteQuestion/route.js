import { QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get('id');
  try {
    await QuesInfo.deleteOne({ _id: id });
    const quesInfoList = await QuesInfo.find({}).sort({ semester: 1, session: 1, exam: 1 }).populate('createdBy');

    if (!quesInfoList || quesInfoList.length < 1)
      return NextResponse.json({ data: [], message: 'Question Deleted successfully' }, { status: 200 });

    return NextResponse.json({ data: quesInfoList, message: 'Question Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

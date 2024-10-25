import connectMongo from '@/mongoDB/connectMongo';
import { File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { role, quesId } = await req.json();

  if (role !== 'editor' && role !== 'superadmin') {
    return NextResponse.json({ message: 'You are not authorized to perform this action.' }, { status: 400 });
  }

  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findByIdAndDelete(quesId);

    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 404 });

    quesInfo.fileList.map(async (item) => {
      await File.findByIdAndDelete(item.id);
    });
    return NextResponse.json({ message: `Question deleted successfully.` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

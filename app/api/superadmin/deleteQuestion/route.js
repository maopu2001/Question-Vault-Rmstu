import connectMongo from '@/mongoDB/connectMongo';
import { DeletedFile, File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get('id');
  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findByIdAndDelete(id);
    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 404 });

    for (let file of quesInfo.fileList) {
      const fileInfo = await File.findByIdAndDelete(file.id);
      await DeletedFile.create({ deleteUrl: fileInfo.deleteUrl });
    }

    const quesInfoList = await QuesInfo.find({}).sort({ semester: 1, session: 1, exam: 1 }).populate('createdBy');

    if (!quesInfoList || quesInfoList.length < 1)
      return NextResponse.json({ data: [], message: 'Question Deleted successfully' }, { status: 200 });

    return NextResponse.json({ data: quesInfoList, message: 'Question Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

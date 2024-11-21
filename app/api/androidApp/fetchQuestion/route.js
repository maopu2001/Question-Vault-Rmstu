import connectMongo from '@/mongoDB/connectMongo';
import { File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = new URL(req.url)?.searchParams;
  try {
    await connectMongo();
    const quesId = searchParams.get('quesId') || '';
    const quesInfo = await QuesInfo.findById(quesId);
    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 400 });
    const fileList = quesInfo.fileList.sort((x, y) => x.pageNo - y.pageNo);

    if (fileList.length === 0) return NextResponse.json({ data: [] }, { status: 200 });

    const files = [];
    for (let file of fileList) {
      const fileInfo = await File.findById(file.id);
      files.push(fileInfo);
    }

    return NextResponse.json({ data: files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

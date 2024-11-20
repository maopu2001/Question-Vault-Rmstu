import connectMongo from '@/mongoDB/connectMongo';
import { File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req, props) {
  const params = await props.params;
  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findById(params.quesId);
    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 400 });
    const fileList = quesInfo.fileList.sort((x, y) => x.pageNo - y.pageNo);

    if (fileList.length === 0) return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });

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

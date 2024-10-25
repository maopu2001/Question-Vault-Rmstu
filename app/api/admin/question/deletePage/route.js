import connectMongo from '@/mongoDB/connectMongo';
import { File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { role, quesId, pageNo } = await req.json();

  if (role !== 'editor' && role !== 'superadmin') {
    return NextResponse.json({ message: 'You are not authorized to perform this action.' }, { status: 400 });
  }

  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findById(quesId);
    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    const getFileId = () => {
      for (let item of quesInfo.fileList) if (item.pageNo === pageNo) return item.id;
    };
    await File.findByIdAndDelete(getFileId());
    quesInfo.fileList = quesInfo.fileList.filter((item) => item.pageNo !== pageNo);
    
    await quesInfo.save();
    return NextResponse.json({ message: `Page no ${pageNo} deleted successfully.` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

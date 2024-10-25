import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  const { quesId, pageNo } = await req.json();

  if (!token) return NextResponse.json({ message: 'Token not found.' }, { status: 400 });
  if (!quesId || !pageNo) return NextResponse.json({ message: 'Question ID or Page No not found.' }, { status: 400 });

  try {
    await connectMongo();
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const auth = await Auth.findById(payload.id).populate('user');
    if (!auth) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const userId = auth.user._id;

    const quesInfo = await QuesInfo.findById(quesId);

    if (!quesInfo) return NextResponse.json({ message: 'Question not found.' }, { status: 404 });

    const getFileId = () => {
      for (let item of quesInfo.fileList) if (item.pageNo === pageNo) return item.id;
    };

    const file = await File.findById(getFileId());
    if (!file) return NextResponse.json({ message: 'File not found.' }, { status: 404 });

    if (String(userId) === String(quesInfo.createdBy))
      return NextResponse.json({ data: file, role: 'editor' }, { status: 200 });
    else return NextResponse.json({ data: file, role: auth.role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
  }
}

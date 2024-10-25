import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

const FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16MB threshold

export async function POST(req) {
  const token = req.cookies.get('token')?.value;

  const formData = await req.formData();
  const file = formData.get('image');
  const pageNo = formData.get('pageNo');
  const id = formData.get('id');

  try {
    await connectMongo();
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const auth = await Auth.findById(payload.id).populate('user');
    if (!auth) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const userId = auth.user._id;

    const quesInfo = await QuesInfo.findById(id).populate('createdBy');
    if (!quesInfo) return NextResponse.json({ message: 'No question found.' }, { status: 404 });

    if (String(userId) !== String(quesInfo.createdBy._id)) {
      return NextResponse.json({ message: 'You are not authorized to edit this question info.' }, { status: 400 });
    }

    const fileList = quesInfo.fileList;
    const pageNoArr = fileList.map((item) => {
      return item.pageNo;
    });
    if (pageNoArr.includes(pageNo)) {
      return NextResponse.json({ message: 'This page number already exists.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length >= FILE_SIZE_LIMIT)
      return NextResponse.json({ message: 'The file exceeds the size limit of 16 MB' }, { status: 400 });

    const newFileId = await saveNormalFile(file.name, file.type, file.size, buffer);

    quesInfo.fileList.push({ pageNo, id: newFileId });
    await quesInfo.save();
    return NextResponse.json({ message: 'File Upload Successful', quesInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

async function saveNormalFile(filename, contentType, size, buffer) {
  // For smaller files, store as base64 string
  const base64String = buffer.toString('base64');
  const newFile = new File({
    filename,
    contentType,
    size,
    content: base64String,
  });
  await newFile.save();
  return newFile._id;
}

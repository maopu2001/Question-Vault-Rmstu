import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, DeletedFile, File, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

const FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16MB threshold

export async function POST(req) {
  const token = req.cookies.get('token')?.value;

  const formData = await req.formData();
  const image = formData.get('image');
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

    if (!image) {
      return NextResponse.json({ message: 'No file received.' }, { status: 400 });
    }

    const newFormdata = new FormData();
    newFormdata.append('image', image);

    const newFileId = await saveImage(image.name, image.type, image.size, newFormdata);

    quesInfo.fileList.push({ pageNo, id: newFileId });
    await quesInfo.save();
    return NextResponse.json({ message: 'File Upload Successful', quesInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

async function saveImage(filename, contentType, size, formData) {
  try {
    const res = await fetch(process.env.IMGBB_URL, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('Image Upload Failed');
    }
    const resData = await res.json();

    const deletedFiles = await DeletedFile.find({ deleteUrl: resData.data.delete_url });

    if (deletedFiles && deletedFiles.length > 0) {
      for (let deletedFile of deletedFiles) {
        await DeletedFile.deleteOne({ deleteUrl: deletedFile.deleteUrl });
      }
    }

    const newFile = new File({
      filename,
      contentType,
      size,
      imageUrl: resData.data.image.url,
      deleteUrl: resData.data.delete_url,
      thumbUrl: resData.data.medium.url,
    });

    await newFile.save();
    return newFile._id;
  } catch (error) {
    throw new Error('Image Upload Failed');
  }
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { File } from '@/mongoDB/indexSchema';
import connectMongo from '@/mongoDB/connectMongo';

const FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16MB threshold

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectMongo();

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let newFileId;
    if (buffer.length < FILE_SIZE_LIMIT) {
      newFileId = await saveNormalFile(file.name, file.type, file.size, buffer);
    } else {
      newFileId = await saveLargeFile(file.name, file.type, file.size, buffer);
    }

    return NextResponse.json({ message: 'File uploaded and saved successfully', id: newFileId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading file.' }, { status: 500 });
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

async function saveLargeFile(filename, contentType, size, buffer) {
  // For larger files, use GridFS
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

  const uploadStream = bucket.openUploadStream(filename, { contentType });

  await new Promise((resolve, reject) => {
    uploadStream.end(buffer, (error) => {
      error ? reject(error) : resolve();
    });
  });

  const newFile = new File({
    filename,
    contentType,
    size,
    gridFSId: uploadStream.id,
  });
  await newFile.save();
  return newFile._id;
}

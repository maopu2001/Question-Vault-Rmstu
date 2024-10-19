import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import File from '@/mongoDB/schema/fileSchema';
import connectMongo from '@/mongoDB/connectMongo';

const SIZE_LIMIT = 16 * 1024 * 1024; // 16MB threshold

export async function GET(req, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'No file ID provided.' }, { status: 400 });
  }

  try {
    await connectMongo();
    const file = await File.findById(id);
    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    if (file.size > SIZE_LIMIT) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
      const downloadStream = bucket.openDownloadStreamById(file.gridFSId);

      // For large files, we need to handle the stream differently
      return new NextResponse(
        { dataStream: downloadStream, contentType: file.contentType },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
          },
        }
      );
    } else {
      return NextResponse.json({ dataStream: file.content, contentType: file.contentType }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}

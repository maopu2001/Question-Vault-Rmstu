import { NextResponse } from 'next/server';
import { User } from '@/mongoDB/indexSchema';
import connectMongo from '@/mongoDB/connectMongo';

const FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16MB threshold

export async function POST(req) {
  try {
    const username = req.nextUrl.searchParams.get('username');
    await connectMongo();

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ message: 'No Profile Image received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length >= FILE_SIZE_LIMIT) {
      return NextResponse.json({ message: 'Image size exceeds limit. The limit is 16MB' }, { status: 400 });
    }
    const base64String = buffer.toString('base64');
    await User.updateOne({ username }, { profileImg: base64String });
    return NextResponse.json({ message: 'Profile Image updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading Profile Image.' }, { status: 500 });
  }
}

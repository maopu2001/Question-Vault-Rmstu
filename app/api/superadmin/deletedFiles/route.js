import connectMongo from '@/mongoDB/connectMongo';
import { DeletedFile } from '@/mongoDB/indexSchema';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get('SuperAdmin-Token');
    if (!token || token !== process.env.SUPER_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid superadmin token' }, { status: 400 });
    }

    await connectMongo();
    const deletedFiles = await DeletedFile.find();
    const data = deletedFiles.map((file) => file.deleteUrl);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const headersList = headers();
    const token = headersList.get('SuperAdmin-Token');
    if (!token || token !== process.env.SUPER_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid superadmin token' }, { status: 400 });
    }
    await connectMongo();
    const deletedFiles = await DeletedFile.find();
    for (let deletedFile of deletedFiles) {
      await DeletedFile.findByIdAndDelete(deletedFile._id);
    }
    return NextResponse.json({ message: 'DeletedFile collection has been deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

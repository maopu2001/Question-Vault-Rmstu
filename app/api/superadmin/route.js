import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const headersList = headers();
    // const token = headersList.get('SuperAdmin-Token');

    // if (!token || token !== process.env.SUPER_ADMIN_TOKEN) {
    //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    // }

    await connectMongo();
    const allUsers = await Auth.find({}).populate('user');

    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    console.error('Error in superadmin GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

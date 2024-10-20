import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import { NextResponse } from 'next/server';
import User from '@/mongoDB/schema/userSchema';

export async function GET(req) {
  try {
    const reqToken = req.headers.get('SuperAdmin-Token');
    const SuperAdminToken = new TextEncoder().encode(process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN).toString();

    if (!reqToken || reqToken !== SuperAdminToken) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    const filteredAuth = await Auth.find({ role }).populate('user');
    const filteredUsers = filteredAuth.map((auth) => auth.user);

    return NextResponse.json({ filteredUsers }, { status: 200 });
  } catch (error) {
    console.error('Error in superadmin GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

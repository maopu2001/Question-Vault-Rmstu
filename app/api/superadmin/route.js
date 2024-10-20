import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const reqToken = req.headers.get('SuperAdmin-Token');
    const SuperAdminToken = new TextEncoder().encode(process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN).toString();

    if (!reqToken || reqToken !== SuperAdminToken) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();

    const params = new URL(req.url).searchParams;
    const role = params.get('role');

    let filteredUsers;
    if (role !== 'request') {
      const filteredAuth = await Auth.find({ role }).populate('user');
      filteredUsers = filteredAuth.map((auth) => auth.user);
    } else {
      const filteredAuth = await Auth.find({ accessrequest: true }).populate('user');
      filteredUsers = filteredAuth.map((auth) => auth.user);
    }

    return NextResponse.json({ filteredUsers }, { status: 200 });
  } catch (error) {
    console.error('Error in superadmin GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

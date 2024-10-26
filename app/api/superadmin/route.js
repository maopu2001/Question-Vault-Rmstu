export const dynamic = 'force-dynamic';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
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

    if (filteredUsers.length < 1) return NextResponse.json({ message: `No ${role} is found` }, { status: 400 });
    return NextResponse.json({ filteredUsers }, { status: 200 });
  } catch (error) {
    console.error('Error in superadmin GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

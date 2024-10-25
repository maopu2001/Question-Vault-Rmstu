import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Token not found' }, { status: 404 });
  }
  const payload = await jwtVerify(token, process.env.JWT_SECRET);

  if (!payload) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  try {
    await connectMongo();
    const auth = await Auth.findById(payload.id).populate('user');
    const data = { ...auth.user.toObject(), role: payload.role };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || error || 'Something went wrong.' }, { status: 500 });
  }
}

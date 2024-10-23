import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, User } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Token not found' }, { status: 404 });
  try {
    const payload = await jwtVerify(token);
    await connectMongo();
    const auth = await Auth.findById(payload.id);
    if (!auth) return NextResponse.json({ message: 'Id not found' }, { status: 404 });
    await Auth.deleteOne({ _id: payload.id });
    await User.deleteOne({ _id: auth.user });

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Invalid Token' }, { status: 400 });
  }
}

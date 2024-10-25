import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Token not found' }, { status: 404 });
  try {
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    await connectMongo();
    const auth = await Auth.findById(payload.id);
    if (!auth) return NextResponse.json({ message: 'Id not found' }, { status: 404 });
    if (auth.accessrequest)
      return NextResponse.json({ message: 'Request to access Admin is sent already' }, { status: 400 });
    if (payload.role !== 'user') return NextResponse.json({ message: 'Already authorized' }, { status: 400 });
    await Auth.updateOne({ _id: payload.id }, { accessrequest: true });
    return NextResponse.json({ message: 'Request to access Admin sent successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Invalid Token' }, { status: 400 });
  }
}

import jwtSign from '@/lib/jwtSign';
import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth } from '@/mongoDB/indexSchema';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Token not found' }, { status: 404 });
  try {
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    await connectMongo();
    let auth = await Auth.findById(payload.id);
    if (!auth) return NextResponse.json({ message: 'Id not found' }, { status: 404 });
    if (payload.role === 'user') return NextResponse.json({ message: 'Already a User' }, { status: 400 });
    await Auth.updateOne({ _id: payload.id }, { role: 'user' });
    auth = await Auth.findById(payload.id);

    const newPayload = {
      id: auth._id,
      username: auth.username,
      role: auth.role,
    };

    const newToken = await jwtSign(newPayload, process.env.JWT_SECRET);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: '/',
    };

    (await cookies()).set('token', newToken, cookieOptions);

    await jwtSign({ role: auth.role }, process.env.NEXT_PUBLIC_JWT_SECRET);

    return NextResponse.json({ message: 'Admin access has been revoked' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Invalid Token' }, { status: 400 });
  }
}

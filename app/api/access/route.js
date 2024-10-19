import jwtVerify from '@/lib/jwtVerify';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) return NextResponse.json({ message: 'Token not found' }, { status: 404 });

  try {
    const payload = await jwtVerify(token);
    return NextResponse.json({ role: payload.role }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }
}

import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Token not found' }, { status: 404 });
  try {
    const payload = await jwtVerify(token);
    await connectMongo();
    const auth = await Auth.findById(payload.id);
    if (!auth) return NextResponse.json({ message: 'Id not found' }, { status: 404 });
    if (auth.accessrequest) return NextResponse.json({ message: 'Already requested' }, { status: 400 });
    if (payload.role !== 'user') return NextResponse.json({ message: 'Already authorized' }, { status: 400 });
    await Auth.updateOne({ _id: payload.id }, { accessrequest: true });
    return NextResponse.json({ message: 'Access request sent' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Invalid Token' }, { status: 400 });
  }
}

export async function POST(req) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: 'Id not found.' }, { status: 404 });
  }
  try {
    await connectMongo();
    const auth = await Auth.findOne({ user: id });
    if (!auth) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    await Auth.updateOne({ user: id }, { role: 'admin', accessrequest: false });
    return NextResponse.json({ message: 'This User is now an Admin' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: 'Id not found.' }, { status: 404 });
  }
  try {
    await connectMongo();
    const auth = await Auth.findOne({ user: id });
    if (!auth) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    await Auth.updateOne({ user: id }, { role: 'user' });
    return NextResponse.json({ message: 'This Admin is now a User' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

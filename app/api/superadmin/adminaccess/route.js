import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

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

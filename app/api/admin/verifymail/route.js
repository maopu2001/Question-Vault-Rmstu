import sendMail from '@/lib/sendMail';
import { Auth, TempAuth, User } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { id, randomNumber } = body;
  if (!id || !randomNumber) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
  try {
    const tempAuth = await TempAuth.findById(id);
    if (randomNumber === tempAuth.randomNumber) {
      const { name, username, email, degree, faculty, department, session, password } = tempAuth;
      const newUser = new User({ name, username, email, degree, faculty, department, session });
      await newUser.save();
      const newAuth = new Auth({ user: newUser._id, password });
      await newAuth.save();
      await TempAuth.deleteOne({ _id: id });
      return NextResponse.json({ message: 'Verification successful' }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ message: err.message || err || 'Verification failed' }, { status: 500 });
  }
}

export async function GET(req) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Id not found' }, { status: 404 });
  }
  const tempAuth = await TempAuth.findById(id);
  if (!tempAuth) {
    return NextResponse.json({ message: 'Wrong Id' }, { status: 404 });
  }

  try {
    sendMail(
      tempAuth.email,
      'Verify - Exam Question Dump Rmstu',
      `{req.nextUrl.origin}/emailverification/${tempAuth._id}`,
      tempAuth.randomNumber
    );
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Failed to send Verification Mail' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Verification Mail sent successfully' }, { status: 200 });
}

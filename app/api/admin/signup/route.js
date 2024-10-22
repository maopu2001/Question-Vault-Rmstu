import { NextResponse } from 'next/server';
import connectMongo from '@/mongoDB/connectMongo';
import bcrypt from 'bcrypt';
import { TempAuth, User } from '@/mongoDB/indexSchema';
import sendMail from '@/lib/sendMail';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, username, email, degree, faculty, department, session, password } = body;
    await connectMongo();

    let user = await User.findOne({ username });
    if (user) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }
    user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: 'This email is already registered to an account' }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newTempAuth = new TempAuth({
      name,
      username,
      password: hashedPassword,
      randomNumber,
      email,
      degree,
      faculty,
      department,
      session,
    });

    try {
      sendMail(
        email,
        'Verify - Exam Question Dump Rmstu',
        `{req.nextUrl.origin}/emailverification/${newTempAuth._id}`,
        randomNumber
      );
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Failed to send Verification Mail' }, { status: 500 });
    }
    await newTempAuth.save();
    return NextResponse.json({ redirect: `/emailverification/${newTempAuth._id}` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

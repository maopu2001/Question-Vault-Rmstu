import { NextResponse } from 'next/server';
import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import User from '@/mongoDB/schema/userSchema';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const connection = await connectMongo();
  try {
    const body = await req.json();
    const { name, username, email, degree, faculty, department, session, password } = body;

    const user = await User.findOne({ username });
    if (user) {
      await connection.disconnect();
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, username, email, degree, faculty, department, session });
    await newUser.save();
    const newAuth = new Auth({ user: newUser._id, password: hashedPassword });
    await newAuth.save();
    await connection.disconnect();
    return NextResponse.json({ message: 'Signup successful' }, { status: 200 });
  } catch (err) {
    await connection.disconnect();
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

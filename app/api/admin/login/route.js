import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import User from '@/mongoDB/schema/userSchema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwtSign from '@/lib/jwtSign';

export async function POST(req) {
  const connection = await connectMongo();
  try {
    const body = await req.json();
    const { usernameEmail, password } = body;
    const user = (await User.findOne({ username: usernameEmail })) || (await User.findOne({ email: usernameEmail }));
    if (!user) {
      await connection.disconnect();
      return NextResponse.json({ message: 'Incorrect username, email or password' }, { status: 400 });
    }
    const auth = await Auth.findOne({ user: user._id });
    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      await connection.disconnect();
      return NextResponse.json({ message: 'Incorrect username, email or password' }, { status: 400 });
    }
    await connection.disconnect();

    const payload = {
      id: auth._id,
      username: auth.username,
      role: auth.role,
    };

    const token = await jwtSign(payload, { expirationTime: '24h' });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
      path: '/',
    };

    cookies().set('token', token, cookieOptions);
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (err) {
    await connection.disconnect();
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

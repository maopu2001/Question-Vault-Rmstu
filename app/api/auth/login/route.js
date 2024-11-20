import connectMongo from '@/mongoDB/connectMongo';
import { Auth, User } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwtSign from '@/lib/jwtSign';

export async function POST(req) {
  try {
    const body = await req.json();
    const { usernameEmail, password } = body;
    await connectMongo();
    const user = (await User.findOne({ username: usernameEmail })) || (await User.findOne({ email: usernameEmail }));
    if (!user) {
      return NextResponse.json({ message: 'Incorrect username, email or password' }, { status: 400 });
    }
    const auth = await Auth.findOne({ user: user._id });
    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect username, email or password' }, { status: 400 });
    }

    const payload = {
      id: auth._id,
      username: auth.username,
      role: auth.role,
    };

    const token = await jwtSign(payload, process.env.JWT_SECRET);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: '/',
    };

    (await cookies()).set('token', token, cookieOptions);

    const role = await jwtSign({ role: auth.role }, process.env.NEXT_PUBLIC_JWT_SECRET);

    const nonHttpCookieOptions = {
      maxAge: 60 * 60 * 24,
      path: '/',
    };

    (await cookies()).set('role', role, nonHttpCookieOptions);
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

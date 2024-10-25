import jwtSign from '@/lib/jwtSign';
import sendMail from '@/lib/sendMail';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, TempAuth, User } from '@/mongoDB/indexSchema';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { id, randomNumber } = body;
  if (!id || !randomNumber) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
  try {
    await connectMongo();
    const tempAuth = await TempAuth.findById(id);

    if (randomNumber !== tempAuth.randomNumber) {
      return NextResponse.json({ message: 'Wrong OTP' }, { status: 400 });
    }

    const {
      name,
      username,
      email,
      degree,
      faculty,
      department,
      session,
      password,
      passwordChangeRequest,
      accessrequest,
    } = tempAuth;

    if (passwordChangeRequest) {
      const user = await User.findOne({ email: tempAuth.email });
      const auth = await Auth.findOne({ user: user._id });
      const payload = {
        id: auth._id,
      };

      const passChangeToken = await jwtSign(payload, process.env.JWT_SECRET, { expirationTime: '15min' });

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 15, //15 minutes
        path: '/',
      };
      await TempAuth.deleteOne({ email: tempAuth.email });
      cookies().set('passChangeToken', passChangeToken, cookieOptions);
      return NextResponse.json({ message: 'Verification successful', type: 'passwordChangeRequest' }, { status: 200 });
    } else {
      const newUser = new User({ name, username, email, degree, faculty, department, session });
      await newUser.save();
      const newAuth = new Auth({ user: newUser._id, password, accessrequest });
      await newAuth.save();
      await TempAuth.deleteOne({ _id: id });
      return NextResponse.json({ message: 'Verification successful', type: 'none' }, { status: 200 });
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
  await connectMongo();
  const tempAuth = await TempAuth.findById(id);
  if (!tempAuth) {
    return NextResponse.json({ message: 'Wrong Id' }, { status: 404 });
  }

  try {
    sendMail(
      tempAuth.email,
      'Verify - Exam Question Dump Rmstu',
      `${req.nextUrl.origin}/emailverification/${tempAuth._id}`,
      tempAuth.randomNumber
    );
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Failed to send Verification Mail' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Verification Mail sent successfully' }, { status: 200 });
}

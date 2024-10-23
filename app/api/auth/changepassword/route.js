import bcrypt from 'bcrypt';
import { Auth, TempAuth, User } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';
import connectMongo from '@/mongoDB/connectMongo';
import sendMail from '@/lib/sendMail';
import jwtVerify from '@/lib/jwtVerify';

export async function POST(req) {
  try {
    const body = await req.json();
    const { password } = body;
    const passChangeToken = req.cookies.get('passChangeToken')?.value;
    if (!passChangeToken) return NextResponse.json({ message: 'Password Changing Token not found' }, { status: 400 });
    const { id } = await jwtVerify(passChangeToken);
    if (!id || !password) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await connectMongo();
    const auth = await Auth.findById(id);
    auth.password = hashedPassword;
    await auth.save();
    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    let email, auth;
    await connectMongo();
    if (token) {
      const payload = await jwtVerify(token);
      auth = await Auth.findById(payload.id).populate('user');
    } else {
      email = req.nextUrl.searchParams.get('email');
      if (!email) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
      const user = await User.findOne({ email: email });
      auth = await Auth.findOne({ user: user._id }).populate('user');
    }

    if (!auth) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
    auth.randomNumber = randomNumber;
    const tempAuth = await TempAuth.findOne({ email: auth.user.email });
    if (tempAuth) {
      return NextResponse.json({ message: 'Already sent Verification mail', id: tempAuth._id }, { status: 200 });
    }
    const newTempAuth = new TempAuth({
      email: auth.user.email,
      randomNumber: randomNumber,
      passwordChangeRequest: true,
      accessrequest: auth.accessrequest,
    });
    await newTempAuth.save();

    sendMail(
      newTempAuth.email,
      'Verify - Exam Question Dump Rmstu',
      `${req.nextUrl.origin}/emailverification/${newTempAuth._id}`,
      newTempAuth.randomNumber
    );

    return NextResponse.json({ message: 'Verification mail sent successfully', id: newTempAuth._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

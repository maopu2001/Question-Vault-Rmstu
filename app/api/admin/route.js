import jwtVerify from '@/lib/jwtVerify';
import { Auth, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  try {
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    const auth = await Auth.findById(payload.id).populate('user');
    if (!auth) return NextResponse.json({ message: 'User not found.' }, { status: 404 });

    const questionList = await QuesInfo.find({ createdBy: auth.user._id });
    if (questionList.length === 0)
      return NextResponse.json({ message: "You didn't upload any question." }, { status: 404 });
    return NextResponse.json({ data: questionList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

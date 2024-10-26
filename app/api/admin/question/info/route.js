import jwtVerify from '@/lib/jwtVerify';
import connectMongo from '@/mongoDB/connectMongo';
import { Auth, QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const token = req.cookies.get('token')?.value;
  try {
    await connectMongo();
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    console.log(payload.id);
    const auth = await Auth.findById(payload.id).populate('user');
    if (!auth) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const userId = auth.user._id;

    const quesInfo = await QuesInfo.findOne(body);

    if (quesInfo && String(userId) === String(quesInfo.createdBy)) {
      return NextResponse.json(
        { message: 'Question Info already exist. Editing...', id: quesInfo._id },
        { status: 200 }
      );
    }

    if (quesInfo) {
      return NextResponse.json(
        { message: 'Question Info already exist. But you are not authorized to edit this question info.' },
        { status: 400 }
      );
    }

    const newQuesInfo = new QuesInfo({ ...body, createdBy: userId });
    await newQuesInfo.save();
    return NextResponse.json(
      { message: 'Question Info submitted successfully. Creating...', id: newQuesInfo._id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(req) {
  const id = req.nextUrl.searchParams.get('id');
  const token = req.cookies.get('token')?.value;
  try {
    await connectMongo();
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    if (!payload) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const auth = await Auth.findById(payload.id).populate('user');
    if (!auth) return NextResponse.json({ message: `No creator's Id found` }, { status: 404 });
    const userId = auth.user._id;

    const quesInfo = await QuesInfo.findById(id).populate('createdBy');
    if (!quesInfo) return NextResponse.json({ message: 'Question Info not found' }, { status: 400 });

    if (String(userId) !== String(quesInfo.createdBy._id)) {
      return NextResponse.json(
        { message: 'Question Info already exist. But you are not authorized to edit this question info.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ quesInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

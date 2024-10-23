import connectMongo from '@/mongoDB/connectMongo';
import { QuesInfo } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findOne(body);
    if (quesInfo) {
      return NextResponse.json(
        { message: 'Question Info already exist. Editing...', id: quesInfo._id },
        { status: 200 }
      );
    }
    const newQuesInfo = new QuesInfo(body);
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
  try {
    await connectMongo();
    const quesInfo = await QuesInfo.findById(id);
    if (!quesInfo) {
      return NextResponse.json({ message: 'Question Info not found' }, { status: 400 });
    }
    return NextResponse.json({ quesInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

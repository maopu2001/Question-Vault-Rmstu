import connectMongo from '@/mongoDB/connectMongo';
import { File } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { mid1, mid2, final } = await req.json();

  if (!mid1 || !mid2 || !final) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    await connectMongo();
    let mid1Questions = [];
    for (let id of mid1) {
      const file = await File.findById(id);
      mid1Questions.push(file);
    }
    let mid2Questions = [];
    for (let id of mid2) {
      const file = await File.findById(id);
      mid2Questions.push(file);
    }
    let finalQuestions = [];
    for (let id of final) {
      const file = await File.findById(id);
      finalQuestions.push(file);
    }

    return NextResponse.json({ data: { mid1Questions, mid2Questions, finalQuestions } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

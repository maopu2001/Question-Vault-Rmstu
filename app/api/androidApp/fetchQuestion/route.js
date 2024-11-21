import connectMongo from '@/mongoDB/connectMongo';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = new URL(req.url)?.searchParams;
  try {
    await connectMongo();
    return NextResponse.json({ data: filteredQuesInfoList }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ faculty: [], department: [], degree: [], semester: [] }, { status: 500 });
  }
}

import connectMongo from '@/mongoDB/connectMongo';
import { TempAuth } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Id not found' }, { status: 400 });
  try {
    await connectMongo();
    const tempAuth = await TempAuth.findById(id);
    if (!tempAuth) return NextResponse.json({ message: 'TempAuth not found' }, { status: 400 });
    return NextResponse.json({ message: 'TempAuth found' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

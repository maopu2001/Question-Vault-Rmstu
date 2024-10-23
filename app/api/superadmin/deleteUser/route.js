import { Auth, User } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get('id');
  try {
    await Auth.deleteOne({ user: id });
    await User.deleteOne({ _id: id });
    return NextResponse.json({ message: 'User Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}

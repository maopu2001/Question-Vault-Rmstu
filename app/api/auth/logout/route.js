import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    cookies().delete('token');
    cookies().delete('passChangeToken');
    cookies().delete('role');
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
  }
}

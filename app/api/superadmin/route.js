import connectMongo from '@/mongoDB/connectMongo';
import Auth from '@/mongoDB/schema/authSchema';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  let connection;
  try {
    // const headersList = headers();
    // const token = headersList.get('SuperAdmin-Token');
    
    // if (!token || token !== process.env.SUPER_ADMIN_TOKEN) {
    //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    // }

    connection = await connectMongo();
    const allUsers = await Auth.find({}).populate('user');
    await connection.disconnect();
    
    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    console.error('Error in superadmin GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.disconnect();
    }
  }
}

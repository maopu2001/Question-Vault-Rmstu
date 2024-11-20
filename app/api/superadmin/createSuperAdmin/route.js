import connectMongo from '@/mongoDB/connectMongo';
import { Auth, User } from '@/mongoDB/indexSchema';
import bcrypt from 'bcrypt';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('SuperAdmin-Token');
    if (!token || token !== process.env.SUPER_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid superadmin token' }, { status: 400 });
    }

    const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME;
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

    try {
      await connectMongo();
      const oldSuperAdminAuth = await Auth.findOne({ role: 'superadmin' });
      if (oldSuperAdminAuth) {
        const oldSuperAdminUser = await User.findOne({ _id: oldSuperAdminAuth.user });
        await Auth.deleteOne({ _id: oldSuperAdminAuth._id });
        await User.deleteOne({ _id: oldSuperAdminUser._id });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);

      const superAdminUser = new User({
        name: 'Super Administrator',
        username: SUPER_ADMIN_USERNAME,
        email: `${SUPER_ADMIN_USERNAME}@example.com`,
        degree: 'B.Sc. (Engg.)',
        faculty: 'Faculty of Engineering',
        department: 'Computer Science and Engineering',
        session: '2020-2021',
      });
      await superAdminUser.save();

      const superAdminAuth = new Auth({
        user: superAdminUser._id,
        password: hashedPassword,
        role: 'superadmin',
      });
      await superAdminAuth.save();
    } catch (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Superadmin created/updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

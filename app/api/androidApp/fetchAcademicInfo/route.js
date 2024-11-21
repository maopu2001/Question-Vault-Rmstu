import connectMongo from '@/mongoDB/connectMongo';
import { Degree, Department, Faculty, Semester } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectMongo();
    const faculty = (await Faculty.find()) || [];
    const department = (await Department.find().populate('faculty')) || [];
    const degree = (await Degree.find().populate('faculty')) || [];
    const semester = (await Semester.find().populate('degree')) || [];
    return NextResponse.json({ faculty, department, degree, semester }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ faculty: [], department: [], degree: [], semester: [] }, { status: 500 });
  }
}

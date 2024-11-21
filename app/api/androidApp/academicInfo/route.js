import connectMongo from '@/mongoDB/connectMongo';
import { Degree, Department, Faculty, QuesInfo, Semester } from '@/mongoDB/indexSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams || '';
  console.log(searchParams);
  try {
    await connectMongo();
    if (searchParams === '') {
      const faculty = (await Faculty.find()) || [];
      const department = (await Department.find().populate('faculty')) || [];
      const degree = (await Degree.find().populate('faculty')) || [];
      const semester = (await Semester.find().populate('degree')) || [];
      return NextResponse.json({ faculty, department, degree, semester }, { status: 200 });
    } else {
      const faculty = searchParams.get('faculty') || '';
      const department = searchParams.get('department') || '';
      const degree = searchParams.get('degree') || '';
      const semester = searchParams.get('semester') || '';

      if (faculty === '' || department === '' || degree === '' || semester === '') {
        return NextResponse.json({ message: 'All search parameters must be provided' }, { status: 400 });
      }

      const filteredQuesInfoList = await QuesInfo.find({ faculty, department, degree, semester })
        .sort({
          semester: 1,
          session: 1,
          exam: 1,
        })
        .populate('createdBy');
      
      

      return NextResponse.json({ data: filteredQuesInfoList }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ faculty: [], department: [], degree: [], semester: [] }, { status: 500 });
  }
}

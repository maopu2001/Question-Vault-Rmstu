import connectMongo from '@/mongoDB/connectMongo';
import { Degree, Faculty } from '@/mongoDB/schema/academicInfoSchema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      const degrees = await Degree.find({}).populate('faculty');
      console.log(degrees);
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid request' }, { status: 404 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      const faculty = await Faculty.findOne({ facultyName: body.formdata.faculty });

      const data = {
        ...body.formdata,
        faculty: faculty._id,
      };
      await Degree.create(data);
      const degrees = await Degree.find({}).populate('faculty');
      console.log(degrees);
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 200 });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      await Faculty.create(body);
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const params = new URL(req.url).searchParams;

  if (params.get('id') === 'degree') {
    try {
      await connectMongo();
      await Degree.deleteOne({ degreeCode: body.degreeCode });
      const degrees = await Degree.find({}).populate('faculty');
      if (!degrees || degrees.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: degrees }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  } else if (params.get('id') === 'faculty') {
    try {
      await connectMongo();
      await Faculty.deleteOne({ facultyName: body.facultyName });
      const faculties = await Faculty.find({});
      if (!faculties || faculties.length < 1) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ data: faculties }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message || 'Something went wrong' }, { status: 500 });
    }
  }
}

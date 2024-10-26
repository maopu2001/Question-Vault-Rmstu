'use client';

import FormSelectField from '@/components/form/FormSelectField';
import FormTextField from '@/components/form/FormTextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Loading from '@/components/ui/Loading';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  degree: z.string().min(1, { message: 'Please select a degree type.' }),
  semester: z.string().min(1, { message: 'Please select a semester.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
  course: z.string().min(1, { message: 'Please enter a course code.' }),
  session: z
    .string()
    .min(1, { message: 'Please enter a session.' })
    .regex(/^\d{4}-\d{4}$/, { message: 'Session must be in the format YYYY-YYYY (e.g., 2020-2021).' })
    .refine(
      (val) => {
        const [year1, year2] = val.split('-').map(Number);
        return year2 === year1 + 1;
      },
      { message: 'The second year must be exactly one year after the first year.' }
    )
    .refine(
      (val) => {
        const [year1] = val.split('-').map(Number);
        return year1 >= 2015;
      },
      { message: 'Session cannot be before 2015-2016.' }
    )
    .refine(
      (val) => {
        const [year1] = val.split('-').map(Number);
        return year1 <= new Date().getFullYear();
      },
      { message: 'Session cannot be after the curernt year.' }
    ),
  exam: z.string().min(1, { message: 'Please select an exam.' }),
});

const exams = ['Midterm - 1', 'Midterm - 2', 'Semester Final'];

export default function InfoForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      faculty: '',
      department: '',
      degree: '',
      semester: '',
      course: '',
      session: '',
      exam: '',
    },
  });

  const watchFaculty = form.watch('faculty');
  const watchDegree = form.watch('degree');
  const watchDepartment = form.watch('department');
  const watchSemester = form.watch('semester');

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //setting faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=faculty');
        const resData = await res.json();
        const data = resData.data.map((item) => {
          return item.facultyName;
        });
        setFaculties(data);
      } catch (error) {
        setFaculties([]);
      }
    };
    fetchFaculties();
  }, []);

  //setting departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=department');
        const resData = await res.json();
        const data = resData.data.reduce((acc, item) => {
          if (item.faculty.facultyName === watchFaculty) acc.push(item.departmentTitle);
          return acc;
        }, []);
        setDepartments(data);
      } catch (error) {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [watchFaculty]);

  // setting degree types
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=degree');
        const resData = await res.json();
        const data = resData.data.reduce((acc, item) => {
          if (item.faculty.facultyName === watchFaculty) acc.push(item.degreeCode);
          return acc;
        }, []);
        setDegrees(data);
      } catch (error) {
        setDegrees([]);
      }
    };
    fetchDegrees();
  }, [watchFaculty]);

  //setting semesters
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=semester');
        const resData = await res.json();
        const data = resData.data.reduce((acc, item) => {
          if (item.degree.degreeCode === watchDegree) acc.push(item.semester);
          return acc;
        }, []);
        setSemesters(data);
      } catch (error) {
        setSemesters([]);
      }
    };
    fetchSemesters();
  }, [watchDegree]);

  //setting courses
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=course');
        const resData = await res.json();
        const data = resData.data.reduce((acc, item) => {
          if (
            item.semester.semester === watchSemester &&
            item.semester.degree.degreeCode === watchDegree &&
            item.department.departmentTitle === watchDepartment
          )
            acc.push(`${item.courseTitle} (${item.courseCode})`);
          return acc;
        }, []);
        setCourses(data);
      } catch (error) {
        setCourses([]);
      }
    };
    fetchSemesters();
  }, [watchDegree, watchDepartment, watchSemester]);

  const degreeData = {
    label: 'Degree Type',
    name: 'degree',
    placeholder: 'Select a degree type',
    arr: degrees,
  };

  const semesterData = {
    label: 'Semester',
    name: 'semester',
    placeholder: 'Select a semester',
    arr: semesters,
  };

  const facultyData = {
    label: 'Faculty',
    name: 'faculty',
    placeholder: 'Select a faculty',
    arr: faculties,
  };

  const departmentData = {
    label: 'Department',
    name: 'department',
    placeholder: 'Select a department',
    arr: departments,
  };

  const courseData = {
    label: 'Course',
    name: 'course',
    placeholder: 'Select a Course',
    arr: courses,
  };

  const sessionData = {
    label: 'Session',
    name: 'session',
    placeholder: 'Enter session (e.g., 2020-2021)',
    type: 'text',
  };

  const examData = {
    label: 'Exam',
    name: 'exam',
    placeholder: 'Select an exam',
    arr: exams,
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/question/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw Error(resData.message);
      }
      const resData = await res.json();
      toast({
        title: resData.message,
        className: 'bg-green-500 text-white',
      });
      form.reset();
      router.push(`/admin/question/upload/${resData.id}`);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold py-3">Question Information</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2">
        <FormSelectField formControl={form.control} data={facultyData} />
        <FormSelectField formControl={form.control} data={departmentData} />
        <FormSelectField formControl={form.control} data={degreeData} />
        <FormSelectField formControl={form.control} data={semesterData} />
        <FormSelectField formControl={form.control} data={courseData} />
        <FormTextField formControl={form.control} data={sessionData} />
        <FormSelectField formControl={form.control} data={examData} />
        <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

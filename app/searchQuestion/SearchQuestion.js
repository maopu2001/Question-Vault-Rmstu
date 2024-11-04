'use client';
import FormSelectField from '@/components/form/FormSelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
});

export default function SearchQuestion() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      faculty: '',
      department: '',
      degree: '',
      semester: '',
    },
  });

  const watchFaculty = form.watch('faculty');
  const watchDegree = form.watch('degree');

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [semesters, setSemesters] = useState([]);

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

  //data for input field
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

  const onSubmit = async (data) => {
    
    router.push(
      `/question?faculty=${data.faculty}&department=${data.department}&degree=${data.degree}&semester=${data.semester}`
    );
  };

  return (
    <div className="mx-auto sm:w-5/6 w-[95%]">
      <Form {...form}>
        <h1 className="text-2xl font-bold py-3 text-center">Search Question</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="sm:w-1/2 w-full space-y-2 mx-auto">
          <FormSelectField formControl={form.control} data={facultyData} />
          <FormSelectField formControl={form.control} data={departmentData} />
          <FormSelectField formControl={form.control} data={degreeData} />
          <FormSelectField formControl={form.control} data={semesterData} />
          <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
}

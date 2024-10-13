'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import FormSelectField from './form/FormSelectField';
import FormTextField from './form/FormTextField';

const FormSchema = z.object({
  degree: z.string().min(1, { message: 'Please select a degree type.' }),
  semester: z.string().min(1, { message: 'Please select a semester.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
  courseCode: z.string().min(1, { message: 'Please enter a course code.' }),
  session: z
    .string()
    .min(1, { message: 'Please enter a session.' })
    .regex(/^\d{4}-\d{4}$/, { message: 'Session must be in the format YYYY-YYYY (e.g., 2020-2021).' })
    .refine(
      (val) => {
        const [year1, year2] = val.split('-').map(Number);
        year2 === year1 + 1;
      },
      { message: 'The second year must be exactly one year after the first year.' }
    ),
  exam: z.string().min(1, { message: 'Please select an exam.' }),
});

const degrees = ['Bachelors', 'Masters', 'Ph.D'];

const semesters = {
  Bachelors: [
    '1st Year 1st Semester',
    '1st Year 2nd Semester',
    '2nd Year 1st Semester',
    '2nd Year 2nd Semester',
    '3rd Year 1st Semester',
    '3rd Year 2nd Semester',
    '4th Year 1st Semester',
    '4th Year 2nd Semester',
  ],
  Masters: ['1st Year 1st Semester', '1st Year 2nd Semester', '2nd Year 1st Semester', '2nd Year 2nd Semester'],
  'Ph.D': [],
};

const courses = {
  Bachelors: {
    'Computer Science and Engineering': {
      '1st Year 1st Semester': ['CSE 101', 'CSE 102'],
      '1st Year 2nd Semester': ['CSE 103', 'CSE 104'],
      '2nd Year 1st Semester': ['CSE 201', 'CSE 202'],
      '2nd Year 2nd Semester': ['CSE 203', 'CSE 204'],
      '3rd Year 1st Semester': ['CSE 301', 'CSE 302'],
      '3rd Year 2nd Semester': ['CSE 303', 'CSE 304'],
      '4th Year 1st Semester': ['CSE 401', 'CSE 402'],
      '4th Year 2nd Semester': ['CSE 403', 'CSE 404'],
    },
    Management: {
      '1st Year 1st Semester': ['MGT 101', 'MGT 102'],
      '1st Year 2nd Semester': ['MGT 103', 'MGT 104'],
      '2nd Year 1st Semester': ['MGT 201', 'MGT 202'],
      '2nd Year 2nd Semester': ['MGT 203', 'MGT 204'],
      '3rd Year 1st Semester': ['MGT 301', 'MGT 302'],
      '3rd Year 2nd Semester': ['MGT 303', 'MGT 304'],
      '4th Year 1st Semester': ['MGT 401', 'MGT 402'],
      '4th Year 2nd Semester': ['MGT 403', 'MGT 404'],
    },
    'Tourism and Hospitality Management': {
      '1st Year 1st Semester': ['THM 101', 'THM 102'],
      '1st Year 2nd Semester': ['THM 103', 'THM 104'],
      '2nd Year 1st Semester': ['THM 201', 'THM 202'],
      '2nd Year 2nd Semester': ['THM 203', 'THM 204'],
      '3rd Year 1st Semester': ['THM 301', 'THM 302'],
      '3rd Year 2nd Semester': ['THM 303', 'THM 304'],
      '4th Year 1st Semester': ['THM 401', 'THM 402'],
      '4th Year 2nd Semester': ['THM 403', 'THM 404'],
    },
    'Forestry and Environmental Science': {
      '1st Year 1st Semester': ['FES 101', 'FES 102'],
      '1st Year 2nd Semester': ['FES 103', 'FES 104'],
      '2nd Year 1st Semester': ['FES 201', 'FES 202'],
      '2nd Year 2nd Semester': ['FES 203', 'FES 204'],
      '3rd Year 1st Semester': ['FES 301', 'FES 302'],
      '3rd Year 2nd Semester': ['FES 303', 'FES 304'],
      '4th Year 1st Semester': ['FES 401', 'FES 402'],
      '4th Year 2nd Semester': ['FES 403', 'FES 404'],
    },
    'Fisharies and Marine Resources Technology': {
      '1st Year 1st Semester': ['FMRT 101', 'FMRT 102'],
      '1st Year 2nd Semester': ['FMRT 103', 'FMRT 104'],
      '2nd Year 1st Semester': ['FMRT 201', 'FMRT 202'],
      '2nd Year 2nd Semester': ['FMRT 203', 'FMRT 204'],
      '3rd Year 1st Semester': ['FMRT 301', 'FMRT 302'],
      '3rd Year 2nd Semester': ['FMRT 303', 'FMRT 304'],
      '4th Year 1st Semester': ['FMRT 401', 'FMRT 402'],
      '4th Year 2nd Semester': ['FMRT 403', 'FMRT 404'],
    },
  },
  Masters: {},
  'Ph.D': {},
};

const faculties = ['Faculty of Engineering', 'Faculty of Biological Science', 'Faculty of Business Administration'];

const departments = {
  'Faculty of Engineering': ['Computer Science and Engineering'],
  'Faculty of Biological Science': ['Forestry and Environmental Science', 'Fisharies and Marine Resources Technology'],
  'Faculty of Business Administration': ['Management', 'Tourism and Hospitality Management'],
};

const exams = ['Midterm - 1', 'Midterm - 2', 'Semester Final'];

export default function InfoForm() {
  const { toast } = useToast();
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      degree: '',
      semester: '',
      faculty: '',
      department: '',
      batch: '',
      courseCode: '',
    },
  });

  const watchFaculty = form.watch('faculty');
  const watchDegree = form.watch('degree');
  const watchDepartment = form.watch('department');
  const watchSemester = form.watch('semester');

  useEffect(() => {
    try {
      if (watchFaculty && departments[watchFaculty]) setAvailableDepartments(departments[watchFaculty]);
      else setAvailableDepartments([]);
    } catch (err) {
      setAvailableDepartments([]);
    }

    try {
      if (watchDegree && semesters[watchDegree]) setAvailableSemesters(semesters[watchDegree]);
      else setAvailableSemesters([]);
    } catch (error) {
      setAvailableSemesters([]);
    }

    try {
      if (watchDegree && watchDepartment && watchSemester && courses[watchDegree][watchDepartment][watchSemester])
        setAvailableCourses(courses[watchDegree][watchDepartment][watchSemester]);
      else setAvailableCourses([]);
    } catch (error) {
      setAvailableCourses([]);
    }
  }, [watchFaculty, watchDegree, watchDepartment, watchSemester]);

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
    arr: availableSemesters,
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
    arr: availableDepartments,
  };

  const courseCodeData = {
    label: 'Course Code',
    name: 'courseCode',
    placeholder: 'Enter a Course Code',
    arr: availableCourses,
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

  function onSubmit(data) {
    console.log(data);
    toast({
      title: 'Form Submitted Successfully',
      description: <code>{JSON.stringify(data)}</code>,
      className: 'bg-green-500 text-white',
    });
  }

  return (
    <Form {...form}>
      <h1 className="text-2xl font-bold py-3">Question Information</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2">
        <FormSelectField formControl={form.control} data={degreeData} />
        <FormSelectField formControl={form.control} data={semesterData} />
        <FormSelectField formControl={form.control} data={facultyData} />
        <FormSelectField formControl={form.control} data={departmentData} />
        <FormSelectField formControl={form.control} data={courseCodeData} />
        <FormTextField formControl={form.control} data={sessionData} />
        <FormSelectField formControl={form.control} data={examData} />
        <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

'use client';
import FormCheckboxField from '@/components/form/FormCheckboxField';
import FormSelectField from '@/components/form/FormSelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Loading from '@/components/ui/Loading';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import QuestionListTable from './QuestionListTable';

const FormSchema = z.object({
  degree: z.string().min(1, { message: 'Please select a degree type.' }),
  semester: z.string().min(1, { message: 'Please select a semester.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
  course: z.string().min(1, { message: 'Please enter a course code.' }),
});

export default function SearchQuestion() {
  const [questionList, setQuestionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      faculty: '',
      department: '',
      degree: '',
      semester: '',
      course: '',
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

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);

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

  //setting sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=session');
        const resData = await res.json();
        setSessions(resData.data);
      } catch (error) {
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

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

  const courseData = {
    label: 'Course',
    name: 'course',
    placeholder: 'Select a Course',
    arr: courses,
  };

  // data for checkboxes
  const sessionData = {
    label: 'Session',
    arr: sessions,
    setFilteredArr: setFilteredSessions,
  };

  const examData = {
    label: 'Exam',
    arr: ['Midterm - 1', 'Midterm - 2', 'Semester Final'],
    setFilteredArr: setFilteredExams,
  };

  const onSubmit = async (data) => {
    const body = { ...data, exams: filteredExams, sessions: filteredSessions };
    setIsLoading(true);
    try {
      const res = await fetch('/api/searchQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw Error(resData.message);
      }
      const resData = await res.json();
      setQuestionList([...resData.data]);
      form.reset();
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        className: 'bg-red-500 text-white',
      });
      setQuestionList([]);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-5/6">
      {isLoading && <Loading />}
      {(questionList.length < 1 && (
        <Form {...form}>
          <h1 className="text-2xl font-bold py-3 text-center">Search Question</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2 mx-auto">
            <FormSelectField formControl={form.control} data={facultyData} />
            <FormSelectField formControl={form.control} data={departmentData} />
            <FormSelectField formControl={form.control} data={degreeData} />
            <FormSelectField formControl={form.control} data={semesterData} />
            <FormSelectField formControl={form.control} data={courseData} />

            <FormCheckboxField data={sessionData} />
            <FormCheckboxField data={examData} />
            <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
              Search
            </Button>
          </form>
        </Form>
      )) || <QuestionListTable questionList={questionList} />}
    </div>
  );
}

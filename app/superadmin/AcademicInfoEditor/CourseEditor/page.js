'use client';
import FormSelectField from '@/components/form/FormSelectField';
import FormTextField from '@/components/form/FormTextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Loading from '@/components/ui/Loading';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  courseCode: z.string().min(1, { message: 'Please enter a course code.' }),
  courseTitle: z.string().min(1, { message: 'Please enter a course title.' }),
  courseType: z.string().min(1, { message: 'Please select a course type.' }),
  degree: z.string().min(1, { message: 'Please select a degree type.' }),
  semester: z.string().min(1, { message: 'Please select a semester.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
});

export default function CourseEditor() {
  const id = 'course';
  const dataHeader = ['Course Code', 'Course Title', 'Course Type', 'Degree Type', 'Semester', 'Department', 'Remove'];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [degrees, setDegrees] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);

  const form = useForm(
    { resolver: zodResolver(FormSchema) },
    {
      defaultValues: {
        courseCode: '',
        courseTitle: '',
        courseType: '',
        degree: '',
        semester: '',
        department: '',
      },
    }
  );

  const courseCodeData = {
    name: 'courseCode',
    placeholder: 'Enter a Course Code',
    type: 'text',
  };

  const courseTitleData = {
    name: 'courseTitle',
    placeholder: 'Enter a Course Title',
    type: 'text',
  };

  const courseTypeData = {
    name: 'courseType',
    placeholder: 'Select a Course Type',
    arr: ['Theory', 'Lab', 'Thesis'],
  };

  const degreeData = {
    name: 'degree',
    placeholder: 'Select a Degree Type',
    arr: degrees,
  };

  const semesterData = {
    name: 'semester',
    placeholder: 'Select a Semester',
    arr: semesters,
  };

  const departmentData = {
    name: 'department',
    placeholder: 'Select a  Department',
    arr: departments,
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        setData(resData.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCourse();

    const fetchDegreeSemester = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=semester`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        const degreeArr = resData.data.map((item) => {
          return item.degree.degreeCode;
        });
        const uniquedegreeArr = [...new Set(degreeArr)];
        setDegrees(uniquedegreeArr);
        const semesterArr = resData.data.map((item) => {
          return item.semester;
        });
        const uniquesemesterArr = [...new Set(semesterArr)];
        setSemesters(uniquesemesterArr);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchDegreeSemester();

    const fetchDepartment = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=department`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        const departmentArr = resData.data.map((item) => {
          return item.departmentTitle;
        });
        setDepartments(departmentArr);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchDepartment();

    setIsLoading(false);
  }, []);

  const onSubmit = async (formdata) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formdata }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${formdata.courseCode} Added Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to Add ${formdata.courseCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (e, courseCode) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCode }),
      });
      if (!res.ok || res.status >= 400) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${courseCode} Removed Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to delete ${courseCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-center font-semibold text-xl">Course Editor</h1>
      <div className="min-w-[400px] w-5/6 overflow-x-auto mx-auto no-scroll p-3 border-primary-200 border-4 rounded-xl">
        <Form {...form} on>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <table className="min-w-[1200px] w-5/6 border-collapse text-center mx-auto" border={2}>
              <tbody>
                <tr className="*:border *:border-primary-500 *:px-1">
                  {dataHeader.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
                {data.map((item, i) => (
                  <tr className="*:border *:border-primary-500 *:px-1" key={i}>
                    <td>{item.courseCode}</td>
                    <td>{item.courseTitle}</td>
                    <td>{item.courseType}</td>
                    <td>{item.semester?.degree?.degreeCode}</td>
                    <td>{item.semester?.semester}</td>
                    <td>{item.department?.departmentTitle}</td>
                    <td>
                      <Button className="rounded-full w-10 p-1 m-1" onClick={(e) => onDelete(e, item.courseCode)}>
                        <Image src="/delete.svg" alt="Delete" width={36} height={36} />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr className="*:border *:border-primary-500 *:px-2 *:pb-2">
                  <td>
                    <FormTextField formControl={form.control} data={courseCodeData} />
                  </td>
                  <td>
                    <FormTextField formControl={form.control} data={courseTitleData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={courseTypeData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={degreeData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={semesterData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={departmentData} />
                  </td>
                  <td></td>
                </tr>
                <tr className="*:pt-2">
                  <td colSpan={6}>
                    <Button className="w-full bg-primary-600" type="submit">
                      Submit
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Form>
      </div>
    </div>
  );
}

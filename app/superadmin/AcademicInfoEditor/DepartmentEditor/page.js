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
  departmentCode: z.string().min(1, { message: 'Please enter a department Code.' }),
  departmentTitle: z.string().min(1, { message: 'Please enter a department Code.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
});

export default function DegreeEditor() {
  const id = 'department';
  const dataHeader = ['Department Code', 'Department Title', 'Faculty', 'Remove'];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);

  const form = useForm(
    { resolver: zodResolver(FormSchema) },
    { defaultValues: { departmentCode: '', departmentTitle: '', faculty: '' } }
  );

  const facultyData = {
    // label: 'Faculty',
    name: 'faculty',
    placeholder: 'Select a Faculty',
    arr: faculties,
  };

  const departmentCodeData = {
    // label: 'Department Code',
    name: 'departmentCode',
    placeholder: 'Enter Department Code',
    type: 'text',
  };

  const departmentTitleData = {
    // label: 'Department Title',
    name: 'departmentTitle',
    placeholder: 'Enter Department Title',
    type: 'text',
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchDegree = async () => {
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
    fetchDegree();

    const fetchFaculties = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=faculty`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        const facultyArr = resData.data.map((item) => {
          return item.facultyName;
        });
        setFaculties(facultyArr);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFaculties();
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
        title: `${formdata.departmentCode} Added Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to Add ${formdata.departmentCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (e, departmentCode) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ departmentCode }),
      });
      if (!res.ok || res.status >= 400) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${departmentCode} Removed Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to delete ${departmentCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-center font-semibold text-xl">Department Editor</h1>
      <div className="min-w-[400px] w-5/6 overflow-x-auto mx-auto no-scroll p-3 border-primary-200 border-4 rounded-xl">
        <Form {...form} on>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <table className="min-w-[600px] w-5/6 border-collapse text-center mx-auto" border={2}>
              <tbody>
                <tr className="*:border *:border-primary-500 *:px-1">
                  {dataHeader.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
                {data.map((item, i) => (
                  <tr className="*:border *:border-primary-500 *:px-1" key={i}>
                    <td>{item.departmentCode}</td>
                    <td>{item.departmentTitle}</td>
                    <td>{item.faculty.facultyName}</td>
                    <td>
                      <Button className="rounded-full w-10 p-1 m-1" onClick={(e) => onDelete(e, item.departmentCode)}>
                        <Image src="/delete.svg" alt="Delete" width={36} height={36} />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr className="*:border *:border-primary-500 *:px-2 *:pb-2">
                  <td>
                    <FormTextField formControl={form.control} data={departmentCodeData} />
                  </td>
                  <td>
                    <FormTextField formControl={form.control} data={departmentTitleData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={facultyData} />
                  </td>
                  <td></td>
                </tr>
                <tr className="*:pt-2">
                  <td colSpan={4}>
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

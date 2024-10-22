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
  degreeCode: z.string().min(1, { message: 'Please enter a degree Code.' }),
  degreeTitle: z.string().min(1, { message: 'Please enter a degree Code.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
});

export default function DegreeEditor() {
  const id = 'degree';
  const dataHeader = ['Degree Code', 'Degree Title', 'Faculty', 'Remove'];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);

  const form = useForm(
    { resolver: zodResolver(FormSchema) },
    { defaultValues: { degreeCode: '', degreeTitle: '', faculty: '' } }
  );

  const facultyData = {
    // label: 'Faculty',
    name: 'faculty',
    placeholder: 'Select a Faculty',
    arr: faculties,
  };

  const degreeCodeData = {
    // label: 'Degree Code',
    name: 'degreeCode',
    placeholder: 'Enter Degree Code',
    type: 'text',
  };

  const degreeTitleData = {
    // label: 'Degree Title',
    name: 'degreeTitle',
    placeholder: 'Enter Degree Title',
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
        title: `${formdata.degreeCode} Added Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to Add ${formdata.degreeCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (e, degreeCode) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ degreeCode }),
      });
      if (!res.ok || res.status >= 400) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${degreeCode} Removed Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to delete ${degreeCode}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-center font-semibold text-xl">Degree Editor</h1>
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
                    <td>{item.degreeCode}</td>
                    <td>{item.degreeTitle}</td>
                    <td>{item.faculty?.facultyName}</td>
                    <td>
                      <Button className="rounded-full w-10 p-1 m-1" onClick={(e) => onDelete(e, item.degreeCode)}>
                        <Image src="/delete.svg" alt="Delete" width={36} height={36} />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr className="*:border *:border-primary-500 *:px-2 *:pb-2">
                  <td>
                    <FormTextField formControl={form.control} data={degreeCodeData} />
                  </td>
                  <td>
                    <FormTextField formControl={form.control} data={degreeTitleData} />
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

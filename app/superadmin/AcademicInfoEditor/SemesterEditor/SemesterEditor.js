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
  semester: z.string().min(1, { message: 'Please enter a Semester.' }),
  degree: z.string().min(1, { message: 'Please select a Degree Type.' }),
});

export default function SemesterEditor() {
  const id = 'semester';
  const dataHeader = ['Semester', 'Degree Type', 'Remove'];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [degrees, setDegrees] = useState([]);

  const form = useForm({ resolver: zodResolver(FormSchema) }, { defaultValues: { semester: '', degree: '' } });

  const degreeData = {
    // label: 'Faculty',
    name: 'degree',
    placeholder: 'Select a Degree Type',
    arr: degrees,
  };

  const semesterData = {
    // label: 'Department Code',
    name: 'semester',
    placeholder: 'Enter a Semester',
    type: 'text',
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchSemester = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        console.log(resData.data);
        setData(resData.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchSemester();

    const fetchDegrees = async () => {
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=degree`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        const degreeArr = resData.data.map((item) => {
          return item.degreeCode;
        });
        setDegrees(degreeArr);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchDegrees();
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
        title: `${formdata.semester} Added Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to Add ${formdata.semester}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (e, semester) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester }),
      });
      if (!res.ok || res.status >= 400) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${semester} Removed Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to delete ${semester}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-center font-semibold text-xl">Semester Editor</h1>
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
                    <td>{item.semester}</td>
                    <td>{item.degree?.degreeCode}</td>
                    <td>
                      <Button className="rounded-full w-10 p-1 m-1" onClick={(e) => onDelete(e, item.semester)}>
                        <Image src="/delete.svg" alt="Delete" width={36} height={36} />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr className="*:border *:border-primary-500 *:px-2 *:pb-2">
                  <td>
                    <FormTextField formControl={form.control} data={semesterData} />
                  </td>
                  <td>
                    <FormSelectField formControl={form.control} data={degreeData} />
                  </td>
                  <td></td>
                </tr>
                <tr className="*:pt-2">
                  <td colSpan={3}>
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

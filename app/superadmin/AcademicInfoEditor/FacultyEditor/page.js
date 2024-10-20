'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/Loading';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FacultyEditor(props) {
  const id = 'faculty';
  const dataHeader = ['Faculty Name', 'Remove'];
  const [data, setData] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDegree = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        setData(resData.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    };
    fetchDegree();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyName: faculty }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${faculty} Added Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to Add ${faculty}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  const onDelete = async (facultyName) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/AcademicInfoEditor?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyName }),
      });
      if (!res.ok || res.status >= 400) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setData(resData.data);
      toast({
        title: `${faculty} Removed Successfully`,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (err) {
      toast({
        title: `Failed to delete ${facultyName}`,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div {...props}>
      {isLoading && <Loading />}
      <h1 className="text-center font-semibold text-xl">Faculty Editor</h1>

      <div className="min-w-[400px] w-5/6 overflow-x-auto mx-auto no-scroll p-3 border-primary-200 border-4 rounded-xl">
        <table className="min-w-[600px] w-5/6 border-collapse text-center mx-auto" border={2}>
          <tbody>
            <tr className="*:border *:border-primary-500 *:px-1">
              {dataHeader.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
            {data.map((item, i) => (
              <tr className="*:border *:border-primary-500 *:px-1" key={i}>
                <td>{item.facultyName}</td>
                <td>
                  <Button className="rounded-full w-10 p-1 m-1" onClick={() => onDelete(item.facultyName)}>
                    <Image src="/delete.svg" alt="Delete" width={36} height={36} />
                  </Button>
                </td>
              </tr>
            ))}

            <tr className="*:border *:border-primary-500 *:p-2">
              <td colSpan={2}>
                <Input placeholder="Enter Faculty Name" onChange={(e) => setFaculty(e.target.value)} />
              </td>
            </tr>
            <tr className="*:pt-2">
              <td colSpan={2}>
                <Button className="w-full bg-primary-600" onClick={onSubmit}>
                  Submit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

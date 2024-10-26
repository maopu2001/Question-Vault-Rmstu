'use client';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import UpdateProfileImage from './UpdateProfileImage';
import DeleteAccount from './DeleteAccount';
import ChangePassword from './ChangePassword';
import RemoveAdmin from './RemoveAdmin';
import RequestAdmin from './RequestAdmin';

const bgProfileImg =
  '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';

export default function Profile() {
  const [data, setData] = useState([]);
  const [roleColor, setRoleColor] = useState('text-primary-500');
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const resData = await res.json();
        if (resData.data.role === 'admin') setRoleColor('text-blue-500');
        if (resData.data.role === 'superadmin') setRoleColor('text-red-500');
        setData(resData.data);
        setRole(resData.data.role);
        setIsLoading(false);
      } catch (error) {
        setData([]);
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [role]);

  return (
    <div className="flex flex-col">
      {isLoading && <Loading />}
      <div>
        <h1 className="text-center text-2xl font-bold py-2">Profile</h1>
        <div className="relative mx-auto w-48 h-48 border rounded-full">
          <Image
            className="rounded-full"
            src={`data:image/jpeg;base64,${data.profileImg || bgProfileImg}`}
            alt=""
            fill={true}
          />
        </div>
        <h2 className="text-center text-xl font-bold">{data.name}</h2>
        <h2 className={`text-center text-lg font-semibold ${roleColor}`}>Username: {data.username}</h2>
        <h2 className={`text-center text-lg font-semibold ${roleColor}`}>Email: {data.email}</h2>
        <h2 className={`text-center text-lg font-semibold capitalize ${roleColor}`}>
          Role: {data.role}
          {data.role !== 'superadmin' && ' |'}
          {data.role === 'admin' && <RemoveAdmin roleColor={roleColor} />}
          {data.role === 'user' && <RequestAdmin roleColor={roleColor} />}
        </h2>
      </div>
      <div className="border-2 my-3 rounded-lg w-fit mx-auto p-2">
        <table className="w-2/3 min-w-[400px] mx-auto text-lg">
          <tbody>
            <tr>
              <td>Faculty</td>
              <td className="w-3">:</td>
              <td> {data.faculty}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>:</td>
              <td>{data.department}</td>
            </tr>
            <tr>
              <td>Degree Type</td>
              <td>:</td>
              <td>{data.degree}</td>
            </tr>
            <tr>
              <td>Session</td>
              <td>:</td>
              <td>{data.session}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <UpdateProfileImage username={data.username} />
      {role !== 'superadmin' && <ChangePassword />}
      {role !== 'superadmin' && <DeleteAccount />}
    </div>
  );
}

'use client';

import Loading from '@/components/Loading';
import { useEffect, useState } from 'react';

export default function SuperAdminDashboard() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = ['Role', 'Name', 'Username', 'Email', 'Degree', 'Faculty', 'Department', 'Session'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/superadmin');
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error);
        }
        const data = await res.json();
        console.log(data.allUsers);
        setUserList([...columns, ...data.allUsers]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold text-center w-full">Super Admin Dashboard</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {userList.map(({ role, user }) => (
          <li key={role}>
            {role}
            {JSON.stringify(user)}
          </li>
        ))}
      </ul>
    </div>
  );
}

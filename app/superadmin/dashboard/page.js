'use client';
import Loading from '@/components/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import InfoTable from './InfoTable';

export default function SuperAdminDashboard() {
  const [role, setRole] = useState('user');
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const encodedToken = new TextEncoder().encode(process.env.NEXT_PUBLIC_SUPER_ADMIN_TOKEN);
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/superadmin?role=${role}`, {
          headers: {
            'Content-Type': 'application/json',
            'SuperAdmin-Token': encodedToken,
          },
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error);
        }
        const data = await res.json();
        setUserList(data.filteredUsers);
        if (data.filteredUsers.length < 1) {
          setError('Empty List');
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold py-3 text-center w-full">Super Admin Dashboard</h1>
      <Tabs defaultValue="user" className="flex bg-primary-100 flex-col w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="adminaccess" onClick={() => setRole('request')}>
            Permission Requests
          </TabsTrigger>
          <TabsTrigger value="user" onClick={() => setRole('user')}>
            Users
          </TabsTrigger>
          <TabsTrigger value="admin" onClick={() => setRole('admin')}>
            Administrators
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col place-items-center" value="adminaccess">
          <h1 className="text-xl font-semibold mb-2">Requested Permission for Administrator Access</h1>
          <InfoTable userList={userList} error={error} />
        </TabsContent>
        <TabsContent className="flex flex-col place-items-center" value="user">
          <h1 className="text-xl font-semibold mb-2">Users</h1>
          <InfoTable userList={userList} error={error} />
        </TabsContent>
        <TabsContent className="flex flex-col place-items-center" value="admin">
          <h1 className="text-xl font-semibold mb-2">Administrators</h1>
          <InfoTable userList={userList} error={error} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

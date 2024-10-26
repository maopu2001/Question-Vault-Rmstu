import Loading from '@/components/ui/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import UserInfoTable from './UserInfoTable';

export default function () {
  const [role, setRole] = useState('user');
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/superadmin?role=${role}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const data = await res.json();
        setUserList(data.filteredUsers);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [role, reload]);

  return (
    <Tabs defaultValue="user" className="flex flex-col w-full">
      {isLoading && <Loading />}
      <TabsList className="w-fit mx-auto bg-primary-200 rounded-xl border-1 shadow-lg *:rounded-xl">
        <TabsTrigger
          className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
          value="adminaccess"
          onClick={() => setRole('request')}
        >
          Permission Requests
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
          value="user"
          onClick={() => setRole('user')}
        >
          Users
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
          value="admin"
          onClick={() => setRole('admin')}
        >
          Administrators
        </TabsTrigger>
      </TabsList>
      <TabsContent value="adminaccess">
        <h1 className="text-xl text-center font-semibold mb-2">Requested Permission for Administrator Access</h1>
        <UserInfoTable setReload={setReload} role="adminaccess" userList={userList} error={error} />
      </TabsContent>
      <TabsContent value="user">
        <h1 className="text-xl text-center font-semibold mb-2">Users</h1>
        <UserInfoTable setReload={setReload} role="user" userList={userList} error={error} />
      </TabsContent>
      <TabsContent value="admin">
        <h1 className="text-xl text-center font-semibold mb-2">Administrators</h1>
        <UserInfoTable setReload={setReload} role="admin" userList={userList} error={error} />
      </TabsContent>
    </Tabs>
  );
}

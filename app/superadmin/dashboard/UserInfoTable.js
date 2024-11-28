import Loading from '@/components/ui/Loading';
import UserListTable from '@/components/UserListTable';
import { useState } from 'react';

export default function UserInfoTable({ setReload, role, userList, error }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading && <Loading />}
      {(error && (
        <p className="border-2 border-primary-300 rounded-md shadow-lg p-4 px-16 text-center font-semibold w-fit mx-auto">
          {error}
        </p>
      )) || (
        <div className="w-[90%] grid md:grid-cols-2 grid-cols-1 gap-4 my-4 mx-auto">
          {userList.map((user, i) => {
            return <UserListTable key={i} user={user} setReload={setReload} role={role} setIsLoading={setIsLoading} />;
          })}
        </div>
      )}
    </div>
  );
}

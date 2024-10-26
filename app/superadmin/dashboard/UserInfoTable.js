import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import DeleteUser from '@/components/DeleteUser';

export default function UserInfoTable({ setReload, role, userList, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const makeAdmin = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/superadmin/adminaccess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: 'Failed to made Administrator',
          description: error.message,
          className: 'bg-red-500 text-white',
        });
        setIsLoading(false);
      }
      toast({
        title: 'Successfully made Administrator',
        className: 'bg-green-500 text-white',
      });
      setReload((p) => !p);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: 'Failed to make Administrator',
        description: error.message || error,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/superadmin/adminaccess', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: 'Failed to remove Administrator',
          description: error.message,
          className: 'bg-red-500 text-white',
        });
        setIsLoading(false);
      }
      toast({
        title: 'Successfully removed Administrator',
        className: 'bg-green-500 text-white',
      });
      setReload((p) => !p);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: 'Failed to remove Administrator',
        description: error.message || error,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      {(error && (
        <p className=" border-2 border-primary-300 rounded-md shadow-lg p-4 px-16 text-center font-semibold w-fit mx-auto">
          {error}
        </p>
      )) || (
        <div className="w-[90%] grid md:grid-cols-2 grid-cols-1 gap-4 my-4 mx-auto">
          {userList.map((user, i) => {
            return (
              <div className="border-2 border-primary-300 rounded-md shadow-lg p-4 relative flex gap-5" key={i}>
                <table className="p-4" key={i}>
                  <tbody>
                    <tr>
                      <th className="text-right pr-3">Name:</th>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <th className="text-right pr-3">Username:</th>
                      <td>{user.username}</td>
                    </tr>
                    <tr>
                      <th className="text-right pr-3">Email:</th>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <th className="text-right pr-3">Degree:</th>
                      <td>{user.degree}</td>
                    </tr>
                    <tr>
                      <th className="text-right pr-3">Department:</th>
                      <td>{user.department}</td>
                    </tr>
                    <tr>
                      <th className="text-right pr-3">Session:</th>
                      <td>{user.session}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex flex-col gap-2 absolute right-5 top-5 w-fit">
                  {role === 'admin' && (
                    <Button
                      onClick={() => removeAdmin(user._id)}
                      className="bg-red-400 hover:bg-red-500 text-black rounded-md px-2 w-full"
                    >
                      Remove Admin
                    </Button>
                  )}
                  {role !== 'admin' && (
                    <Button
                      onClick={() => makeAdmin(user._id)}
                      className="bg-blue-700 hover:bg-blue-500 rounded-md px-2 w-full"
                    >
                      Make Admin
                    </Button>
                  )}
                  {role === 'user' && <DeleteUser id={user._id} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

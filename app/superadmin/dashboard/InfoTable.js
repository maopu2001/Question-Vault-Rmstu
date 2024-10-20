import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function InfoTable({ setReload, role, userList, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const makeAdmin = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/adminaccess', {
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
      const res = await fetch('/api/admin/adminaccess', {
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
    <div className="min-w-[400px] w-5/6 overflow-x-auto mx-auto no-scroll p-3 border-primary-200 border-4 rounded-xl">
      {isLoading && <Loading />}
      {error && <p className="text-center font-semibold mb-2">{error}</p>}
      {!error && (
        <table className="min-w-[900px] w-5/6 border-collapse text-center mx-auto" border={2}>
          <tbody>
            <tr className="*:border *:border-primary-500 *:px-1">
              <th>Name</th>
              <th>Username / Email</th>
              <th>Degree</th>
              <th>Faculty / Department</th>
              <th>Session</th>
              {role !== 'admin' && <th>Make Admin</th>}
              {role === 'admin' && <th>Remove Admin</th>}
            </tr>
            {userList.map((user, i) => (
              <React.Fragment key={i}>
                <tr className="*:border *:border-primary-500 *:px-1">
                  <td rowSpan={2}>{user?.name}</td>
                  <td>{user?.username}</td>
                  <td rowSpan={2}>{user?.degree}</td>
                  <td>{user?.faculty}</td>
                  <td rowSpan={2}>{user?.session}</td>
                  {role !== 'admin' && (
                    <td rowSpan={2}>
                      <Button onClick={() => makeAdmin(user._id)} className="bg-primary-500 rounded-2xl text-xs">
                        Make Admin
                      </Button>
                    </td>
                  )}
                  {role === 'admin' && (
                    <td rowSpan={2}>
                      <Button onClick={() => removeAdmin(user._id)} className="bg-primary-500 rounded-2xl text-xs">
                        Remove Admin
                      </Button>
                    </td>
                  )}
                </tr>
                <tr className="*:border *:border-primary-500 *:px-1">
                  <td>{user?.email}</td>
                  <td>{user?.department}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

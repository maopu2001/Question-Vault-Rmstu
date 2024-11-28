import DeleteUser from '@/components/DeleteUser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function UserListTable({ user, setIsLoading, setReload, role }) {
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
    <div className="border-2 border-primary-300 rounded-md shadow-lg md:p-4 relative p-2 pb-16 w-full">
      <table className="p-4 w-full">
        <tbody>
          <tr>
            <th className="pr-3 flex justify-end">Name:</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th className="pr-3 flex justify-end">Username:</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th className="pr-3 flex justify-end">Email:</th>
            <td className="break-all">{user.email}</td>
          </tr>
          <tr>
            <th className="pr-3 flex justify-end">Degree:</th>
            <td>{user.degree}</td>
          </tr>
          <tr>
            <th className="pr-3 flex justify-end">Department:</th>
            <td>{user.department}</td>
          </tr>
          <tr>
            <th className="pr-3 flex justify-end">Session:</th>
            <td>{user.session}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex md:flex-col gap-2 absolute md:right-5 md:top-5 bottom-2 md:w-fit md:h-fit w-full justify-center">
        {role === 'admin' && (
          <Button
            onClick={() => removeAdmin(user._id)}
            className="bg-red-400 hover:bg-red-500 text-black rounded-md px-2 w-fit"
          >
            Remove Admin
          </Button>
        )}
        {role !== 'admin' && (
          <Button onClick={() => makeAdmin(user._id)} className="bg-blue-700 hover:bg-blue-500 rounded-md px-2 w-fit">
            Make Admin
          </Button>
        )}
        {role === 'user' && <DeleteUser id={user._id} />}
      </div>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useState } from 'react';

export default function DeleteUser({ id }) {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/deleteUser?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const resData = await res.json();
        throw Error(resData.message);
      }
      const resData = await res.json();
      toast({
        title: resData.message,
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog>
      {isLoading && <Loading />}
      <AlertDialogTrigger>
        <div className="bg-red-400 hover:bg-red-500 text-black rounded-md p-2 flex justify-center items-center">Delete User</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:w-full w-[95%] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this account and remove this users data from the
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
import { useState } from 'react';

const DeleteIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  </svg>
);

export default function DeleteQuestion({ id, setQuestionList }) {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/superadmin/deleteQuestion?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const resData = await res.json();
        throw Error(resData.message);
      }
      const resData = await res.json();
      setQuestionList(resData.data);
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
        <Button className="bg-red-400 hover:bg-red-500 rounded-full w-12 h-12 p-0">{DeleteIcon}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this question and remove it's data from the
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

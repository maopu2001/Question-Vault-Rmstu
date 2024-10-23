import Loading from '@/components/ui/Loading';
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
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function RemoveAdmin(props) {
  const roleColor = props.roleColor;
  const [isLoading, setIsLoading] = useState(false);

  const removeAdmin = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/removeaccess');
      if (!res.ok) throw new Error('Failed to remove Admin access.');
      toast({
        title: 'Admin access removed successfully',
        className: 'bg-green-500 text-white',
      });
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Failed to remove Admin access',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      {isLoading && <Loading />}
      <AlertDialogTrigger className={`${roleColor} text-lg bg-transparent px-2 hover:bg-transparent hover:underline`}>
        Remove Admin Access
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove your administration access permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeAdmin} className="bg-red-600">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

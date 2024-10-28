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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ChangePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/changepassword');
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message);
      }
      const resData = await res.json();
      setIsLoading(false);
      router.push(`/emailverification/${resData.id}`);
    } catch (error) {
      toast({
        title: error.message || 'Failed to get password changing token.',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      {isLoading && <Loading />}
      <AlertDialogTrigger className="bg-primary-500 hover:bg-primary-700 w-fit mx-auto py-2 px-3 rounded-lg my-3 text-white">
        Change Account Password
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:w-full w-[95%] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will sent a verification email to your registered email with an OTP. You can change your
            password after verifying your email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} className="bg-primary-600">
            Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

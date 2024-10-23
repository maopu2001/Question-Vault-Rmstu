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
      console.log(resData);
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
    // <Dialog>
    //   <DialogTrigger className="bg-primary-500 hover:bg-primary-700 w-fit mx-auto py-2 px-3 rounded-lg my-3 text-white">
    //     Change Account Password
    //   </DialogTrigger>
    //   <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
    //     <DialogHeader>
    //       <DialogTitle>Change Account's Password</DialogTitle>
    //     </DialogHeader>
    //     <div className="mx-auto">
    //       {isLoading && <Loading />}

    //       <p className="font-thin text-center mb-2">
    //         <Checkbox className="mr-2" onCheckedChange={() => setIsDisabled((p) => !p)} />I accept any issues during
    //         this process.{' '}
    //       </p>
    //       <Button onClick={onSubmit} className="bg-primary-600 hover:bg-primary-700 w-full" disabled={isDisabled}>
    //         Change Password
    //       </Button>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <AlertDialog>
      {isLoading && <Loading />}
      <AlertDialogTrigger className="bg-primary-500 hover:bg-primary-700 w-fit mx-auto py-2 px-3 rounded-lg my-3 text-white">
        Change Account Password
      </AlertDialogTrigger>
      <AlertDialogContent>
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

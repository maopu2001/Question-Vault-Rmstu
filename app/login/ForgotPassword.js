import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/ui/Loading';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/auth/changepassword?email=${email}`);
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

  useEffect(() => {
    if (email.length < 1) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email]);

  return (
    <Dialog>
      <DialogTrigger className="hover:underline underline-offset-4 mx-auto text-sm font-semibold">
        Forgot Password
      </DialogTrigger>
      <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>
        {isLoading && <Loading />}
        <Input
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          placeholder="Type your account email here"
          type="email"
        />
        <Button onClick={onSubmit} className="bg-primary-600 hover:bg-primary-700 w-full" disabled={isDisabled}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

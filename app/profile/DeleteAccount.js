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

export default function DeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfim] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/deleteaccount');
      if (!res.ok) throw new Error('Failed to delete account.');
      await fetch('/api/auth/logout');
      setIsLoading(false);
      toast({
        title: 'Account deleted successfully',
        className: 'bg-green-500 text-white',
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Failed to delete account',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (confirm === 'Delete My Account') setIsDisabled(false);
    else setIsDisabled(true);
  }, [confirm]);

  return (
    <Dialog>
      {isLoading && <Loading />}
      <DialogTrigger className="bg-red-600/80 hover:bg-red-600 w-fit mx-auto py-2 px-3 rounded-lg mb-5 ">
        Delete your Account
      </DialogTrigger>
      <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Delete your Account</DialogTitle>
          <DialogDescription>
            This action can not be undone. Please proceed with caution. To confirm deleting your account, type "Delete
            My Account" in the textbox.
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto w-full">
          <Input
            onChange={(e) => setConfim(e.target.value)}
            className="mb-2"
            placeholder={`Type "Delete My Account" here`}
          ></Input>
          <Button onClick={onDelete} className="bg-red-700 hover:bg-red-800 w-full" disabled={isDisabled}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

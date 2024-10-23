import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/ui/Loading';
import { Checkbox } from '@/components/ui/checkbox';

export default function RequestAdmin(props) {
  const roleColor = props.roleColor;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const requestAdmin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/requestaccess');
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message);
      }
      toast({
        title: 'Request to access Admin sent successfully',
        className: 'bg-green-500 text-white',
      });
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message || 'Failed to send request',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className={`${roleColor} text-lg bg-transparent px-2 hover:bg-transparent hover:underline`}>
        Request Admin Access
      </DialogTrigger>
      <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Request for Administrator Access</DialogTitle>
        </DialogHeader>
        <div className="mx-auto">
          {isLoading && <Loading />}

          <p className="font-thin text-center mb-2">
            <Checkbox className="mr-2" onCheckedChange={() => setIsDisabled((p) => !p)} />I want to be an administrator
            to make this site better.
          </p>
          <Button onClick={requestAdmin} className="bg-primary-600 hover:bg-primary-700 w-full" disabled={isDisabled}>
            Request Admin Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

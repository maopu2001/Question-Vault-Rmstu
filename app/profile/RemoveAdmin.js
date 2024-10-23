import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/ui/Loading';
import { Checkbox } from '@/components/ui/checkbox';

export default function RemoveAdmin(props) {
  const roleColor = props.roleColor;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

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
    <Dialog>
      <DialogTrigger className={`${roleColor} text-lg bg-transparent px-2 hover:bg-transparent hover:underline`}>
        Remove Admin Access
      </DialogTrigger>
      <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Remove Administrator Access</DialogTitle>
        </DialogHeader>
        <div className="mx-auto">
          {isLoading && <Loading />}

          <p className="font-thin text-center mb-2">
            <Checkbox className="mr-2" onCheckedChange={() => setIsDisabled((p) => !p)} />I accept that, I will be a
            normal user after this.
          </p>
          <Button onClick={removeAdmin} className="bg-primary-600 hover:bg-primary-700 w-full" disabled={isDisabled}>
            Remove Admin Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

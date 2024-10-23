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

export default function UpdateProfileImage(props) {
  const { username } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (!profileImg) setIsDisabled(true);
    else setIsDisabled(false);
  }, [profileImg]);

  const handleFileChange = async (e) => {
    setProfileImg(e.target.files[0]);
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('image', profileImg);
    try {
      setIsLoading(true);
      const res = await fetch(`/api/profile/uploadProfileImg?username=${username}`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Failed to update Profile Image`);
      }
      toast({
        title: 'Profile Image updated successfully',
        className: 'bg-green-500 text-white',
      });
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message || 'Failed to update Profile Image',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-primary-500 hover:bg-primary-700 w-fit mx-auto py-2 px-3 rounded-lg text-white ">
        Update Profile Image
      </DialogTrigger>
      <DialogContent className="w-1/2 min-w-[350px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
          <DialogDescription>Upload your profile image. Image file size can not be over 16MB</DialogDescription>
        </DialogHeader>
        <div className="mx-auto ">
          {isLoading && <Loading />}
          <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
          <Button onClick={onSubmit} className="bg-primary-800 hover:bg-primary-600 w-full" disabled={isDisabled}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

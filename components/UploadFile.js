'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CloseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function UploadFile({ className, id }) {
  const removeFile = (e) => {
    e.preventDefault();
    document.getElementById('file-upload').remove();
  };

  return (
    <div id="file-upload" className="relative">
      <Button
        onClick={removeFile}
        className="absolute right-1 top-1 bg-transparent hover:bg-primary-300 w-4 h-4 p-[2px] rounded-full"
      >
        {CloseIcon}
      </Button>
      <Label
        className={`${className} p-3 border rounded-md flex justify-center items-center text-sm text-center`}
        htmlFor="file"
      >
        Upload Image or PDF
      </Label>
      <Input type="file" accept=".pdf,.png,.jpg,.jpeg" id="file" className="hidden opacity-0 -mt-12" />
    </div>
  );
}

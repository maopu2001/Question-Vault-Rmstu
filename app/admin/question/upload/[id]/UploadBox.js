'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CloseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="black">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function UploadBox({ pageNo, upload, setUpload, id, setUploadFinished }) {
  const [file, setFile] = useState(null);
  const [newPageNo, setNewPageNo] = useState(pageNo);
  const [image, setImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const handleUpload = async () => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('pageNo', newPageNo);
      formData.append('id', id);

      try {
        const res = await fetch('/api/admin/question/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        setFile(null);
        setIsUploaded(true);
        setUploadFinished((p) => p + 1);
      } catch (error) {
        setUploadFinished((p) => p + 1);
        console.error(error.message);
      }
    };

    if (upload > 0 && !isUploaded) {
      handleUpload();
      setUpload((p) => p - 1);
    }
  }, [upload]);

  const handleChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    if (newFile) {
      const imageUrl = URL.createObjectURL(newFile);
      setImage(imageUrl);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-w-[330px] w-full min-h-[330px] h-full flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md m-auto">
      <div className="relative w-full">
        <h1 className="font-bold text-2xl flex w-fit mx-auto">
          Page no -{' '}
          <Input
            className="w-6 mx-2 p-1 text-center"
            defaultValue={pageNo}
            onChange={(e) => setNewPageNo(e.target.value)}
          ></Input>
          {file && (
            <Button
              onClick={removeFile}
              className="absolute right-0 bg-transparent hover:bg-primary-700/40 rounded-full p-2"
            >
              {CloseIcon}
            </Button>
          )}
        </h1>
      </div>
      <div className="w-5/6 h-3/4 border-2 rounded-xl">
        {(!file && (
          <div className="w-full h-full relative rounded-xl">
            <h1 className="flex justify-center items-center absolute w-full h-full pointer-events-none">
              <p className="font-semibold text-sm text-center">'Drag and Drop' or 'Click' to upload</p>
            </h1>
            <Input
              className="opacity-0 bg-black rounded-xl w-full h-full"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )) || (
          <div>
            <Link href={image} target="_blank">
              <img src={image} alt="Uploaded Image" className="w-full h-full object-cover " />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

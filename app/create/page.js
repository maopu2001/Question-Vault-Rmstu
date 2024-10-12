'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadFile from '@/components/UploadFile';
import { useState } from 'react';

const CreateIcon = (
  <svg width="36px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="fill-black">
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
);

export default function New() {
  const [fileComponents, setFileComponents] = useState([<UploadFile key={1} />]);

  const addNewFile = (e) => {
    e.preventDefault();
    setFileComponents((prevFiles) => [...prevFiles, <UploadFile key={prevFiles.length + 1} />]);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className=" py-4 text-xl font-bold text-center">Add NewQuestion</h1>
      <form className="w-1/3 min-w-96 flex flex-col gap-2">
        <Input type="text" placeholder="Batch" />
        <Input type="text" placeholder="Course Code" />
        <Input type="text" placeholder="Course Title" />
        <Input type="text" placeholder="Year" />
        <Input type="text" placeholder="Semester" />
        <div className="grid grid-cols-3 gap-2" id="fileUploadContainer">
          {fileComponents}
          <Button
            onClick={addNewFile}
            className="border p-3 rounded-md flex justify-center items-center bg-transparent h-full hover:bg-primary-300"
          >
            {CreateIcon}
          </Button>
        </div>
        <Button className="bg-primary-800 hover:bg-primary-600" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

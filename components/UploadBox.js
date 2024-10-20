'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Loading from './ui/Loading';

export default function UploadBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);

    try {
      setStatus('Uploading...');
      setIsLoading(true);
      const res = await fetch('/api/uploadImg', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setStatus(`Upload successful. Id: ${resData.id}`);
      setIsLoading(false);
      setFile(null); // Reset file input after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Error uploading file. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-4/5 flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md">
      {isLoading && <Loading />}
      <Label htmlFor="upload">Upload File</Label>
      <Input className="w-64" id="upload" type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {status && <p className="text-center">{status}</p>}
    </div>
  );
}

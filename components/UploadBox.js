'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function UploadBox() {
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
      const res = await fetch('/api/uploadImg', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resData = await res.json();
      setStatus(`Upload successful. Id: ${resData.id}`);
      setFile(null); // Reset file input after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="w-4/5 flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md">
      <Label htmlFor="upload">Upload File</Label>
      <Input className="w-64" id="upload" type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {status && <p className="text-center">{status}</p>}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Image from 'next/image';
import Loading from './Loading';

export default function DownloadBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileId, setFileId] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);

  const handleDownload = async () => {
    try {
      setStatus('Downloading...');
      setIsLoading(true);
      const res = await fetch(`/api/getImg/${fileId}`);

      console.log(`Response status: ${res.status}`);
      console.log(`Response headers:`, res.headers);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error data:', errorData);
        setStatus(errorData.error || 'An error occurred');
        setIsLoading(false);
      } else {
        const contentType = res.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);
        if (contentType && contentType.includes('application/json')) {
          const resData = await res.json();
          // let image = new Image();
          const imageSrc = `data:image/png;base64,${resData.dataStream}`;
          setData(imageSrc);
          console.log(imageSrc);
          setStatus('Download Success!');
          setIsLoading(false);
        } else {
          // Handle large file download
        }
      }
    } catch (err) {
      console.error('Download error:', err);
      setStatus('Error downloading file. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-4/5 flex flex-col items-center gap-4 py-6 shadow-md border rounded-lg">
      {isLoading && <Loading />}
      <Input className="w-64" type="text" placeholder="Enter file ID" onChange={(e) => setFileId(e.target.value)} />
      <Button className="" onClick={handleDownload} disabled={!fileId}>
        Download
      </Button>
      {status && <p>{status}</p>}
      {data && <Image src={data} alt="img" width="400" height="400" />}
    </div>
  );
}

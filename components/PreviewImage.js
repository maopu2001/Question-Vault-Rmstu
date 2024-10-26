import { toast } from '@/hooks/use-toast';
import makeImageFromBase64 from '@/lib/makeImageFromBase64';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Loading from './ui/Loading';

const CloseIcon = (
  <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

const DeleteIcon = (
  <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  </svg>
);

export default function PreviewImage({ data, setPreview }) {
  const { quesId, pageNo } = data;
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quesId, pageNo }),
        });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const resData = await res.json();
        const data = makeImageFromBase64(resData.data, 'fileInfo');
        setImage(data);
        setRole(resData.role);
        setIsLoading(false);
      } catch (error) {
        setRole('');
        setImage(null);
        setIsLoading(false);
        console.error(error.message);
      }
    };
    fetchImage();
  }, []);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/question/deletePage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, quesId, pageNo }),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message);
      }
      window.location.reload();
    } catch (error) {
      toast({
        title: error.message,
        className: 'bg-red-500 text-white',
      });
      setPreview(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-auto fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-primary-500/70 flex">
      {isLoading && <Loading />}
      {image && (
        <div className="m-auto z-20 relative md:w-fit md:h-[95%] w-[95%] h-fit rounded-xl p-2 bg-primary-50">
          <div className="absolute right-1 top-1 flex gap-2">
            {(role === 'editor' || role === 'superadmin') && (
              <Button onClick={onDelete} className="bg-primary-300/50 hover:bg-red-500 rounded-full px-3">
                {DeleteIcon}
              </Button>
            )}
            <Button
              onClick={() => setPreview(null)}
              className="bg-primary-300/50 hover:bg-primary-500/50 rounded-full px-3 py-0"
            >
              {CloseIcon}
            </Button>
          </div>
          <div className="h-full">
            <h2 className="text-center font-bold my-2">Page No - {pageNo}</h2>
            <Link href={image} target="_blank">
              <img className="h-[94%] object-cover border-2 rounded-md" src={image} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

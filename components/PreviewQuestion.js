import Link from 'next/link';
import { Button } from './ui/button';
import React, { useEffect } from 'react';

const CloseIcon = (
  <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function PreviewQuestion({ pages, setPreview }) {
  return (
    <div className="bg-opacity-20 backdrop-blur-lg overflow-auto fixed z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-white flex">
      <div className="m-auto z-20 relative w-[95%] h-[95%] rounded-xl p-2">
        <div className="absolute right-1 top-1 flex gap-2">
          <Button
            onClick={() => setPreview(null)}
            className="bg-primary-700 hover:bg-primary-600 rounded-full px-3 py-0"
          >
            {CloseIcon}
          </Button>
        </div>
        <div className="h-full">
          <h1 className="text-center text-2xl font-bold">Question Preview</h1>
          <div className="flex flex-col gap-4 mt-4">
            {pages.length > 0 &&
              pages.map((page, i) => {
                return (
                  <div key={i}>
                    <h1 className="text-center font-bold mb-2">Page No - {i + 1}</h1>
                    <div className="w-full bg-slate-300 rounded-md">
                      <Link href={page.imageUrl} target="_blank">
                        <img className="object-contain w-full h-full border-2 rounded-md" src={page.thumbUrl} />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

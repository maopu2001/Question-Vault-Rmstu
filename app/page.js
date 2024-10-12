import DownloadBox from '@/components/DownloadBox';
import UploadBox from '@/components/UploadBox';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center my-10 gap-4">
      <UploadBox />
      <DownloadBox />
    </div>
  );
}

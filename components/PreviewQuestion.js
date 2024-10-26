import makeImageFromBase64 from '@/lib/makeImageFromBase64';
import Link from 'next/link';
import { Button } from './ui/button';

const CloseIcon = (
  <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function PreviewQuestion({ quesInfo, pages, setPreview }) {
  return (
    <div className="overflow-auto fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-primary-500/70 flex">
      <div className="m-auto z-20 relative w-[95%] h-[95%] rounded-xl p-2 bg-primary-50">
        <div className="absolute right-1 top-1 flex gap-2">
          <Button
            onClick={() => setPreview(null)}
            className="bg-primary-300/50 hover:bg-primary-500/50 rounded-full px-3 py-0"
          >
            {CloseIcon}
          </Button>
        </div>
        <div className="h-full">
          <h1 className="text-center text-2xl font-bold">Question's Information</h1>
          <div className="rounded-xl shadow-lg pb-2 w-full">
            <table className="my-2 mx-auto">
              <tbody>
                <tr>
                  <th className="text-right pr-3">Department:</th>
                  <td>{quesInfo.department}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Degree:</th>
                  <td>{quesInfo.degree}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Semester:</th>
                  <td>{quesInfo.semester}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Course:</th>
                  <td>{quesInfo.course}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Exam:</th>
                  <td>{quesInfo.exam}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Session:</th>
                  <td>{quesInfo.session}</td>
                </tr>
                <tr>
                  <th className="text-right pr-3">Total Page:</th>
                  <td>{pages.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            {pages.length > 0 &&
              pages.map((page, i) => {
                console.log(page);
                const image = makeImageFromBase64(page, 'base64');
                return (
                  <div className="w-full bg-slate-300 rounded-md">
                    <Link href={image} target="_blank">
                      <img className="object-contain w-full h-full border-2 rounded-md" src={image} />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

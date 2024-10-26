import PreviewQuestion from '@/components/PreviewQuestion';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import base64ToPdf from '@/lib/base64ToPdf';
import convertUSTtoBST from '@/lib/convertUSTtoBST';
import getNonHttpCookies from '@/lib/getNonHttpCookies';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DeleteQuestion from './DeleteQuestion';

const PreviewIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z" />
  </svg>
);

const DownloadIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
  </svg>
);

const EditorIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
  </svg>
);

export default function QuestionListTable({ questionList, setQuestionList, editor }) {
  const [preview, setPreview] = useState(false);
  const [pages, setPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const setRoleFromToken = async () => {
      try {
        const payload = await getNonHttpCookies(document.cookie, 'role');
        setRole(payload.role);
      } catch (error) {
        setRole(null);
      }
    };
    if (editor) setRole('editor');
    else setRoleFromToken();
  }, []);

  const handlePreview = async (ques) => {
    const quesId = ques._id;
    setIsLoading(true);
    const res = await fetch(`/api/getQuestion/${quesId}`);
    const resData = await res.json();
    setPages([...resData.data]);
    setPreview(true);
    setIsLoading(false);
  };

  const handleDownload = async (ques) => {
    setIsLoading(true);
    const quesId = ques._id;
    const res = await fetch(`/api/getQuestion/${quesId}`);
    const resData = await res.json();
    const pages = [...resData.data];
    setIsLoading(false);
    const courseCode = ques.course.match(/\(([^)]+)\)/)[1];
    const name = `${ques.semester} ${ques.exam} - ${courseCode} - (${ques.session})`;
    base64ToPdf(pages, name);
  };

  const handleEdit = (quesId) => {
    router.push(`/admin/question/upload/${quesId}`);
  };

  return (
    <div className="w-[90%] grid md:grid-cols-2 grid-cols-1 gap-4 my-4 mx-auto">
      {isLoading && <Loading />}
      {questionList.map((ques, i) => {
        return (
          <div className="relative border-2 border-primary-300 rounded-md shadow-lg p-4" key={i}>
            <h1 className="font-bold w-fit mx-auto mb-3 shadow-lg px-12 py-2 rounded-xl">Question Information</h1>
            <div className="flex gap-5">
              <table className="p-4 w-full" key={i}>
                <tbody>
                  <tr>
                    <th className="text-right pr-3">Department:</th>
                    <td>{ques.department}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Degree:</th>
                    <td>{ques.degree}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Semester:</th>
                    <td>{ques.semester}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Course:</th>
                    <td>{ques.course}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Exam:</th>
                    <td>{ques.exam}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Session:</th>
                    <td>{ques.session}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Total Page:</th>
                    <td>{ques.fileList.length}</td>
                  </tr>

                  <tr>
                    <th colSpan={2}>
                      <h1 className="font-bold w-fit mx-auto mb-3 shadow-lg px-12 py-2 rounded-xl">
                        Create Information
                      </h1>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Name:</th>
                    <td>{ques.createdBy.name}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Department:</th>
                    <td>{ques.createdBy.department}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Session:</th>
                    <td>{ques.createdBy.session}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Degree Type:</th>
                    <td>{ques.createdBy.degree}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Created At:</th>
                    <td>{convertUSTtoBST(ques.createdAt)}</td>
                  </tr>
                  <tr>
                    <th className="text-right pr-3">Updated At:</th>
                    <td>{convertUSTtoBST(ques.updatedAt)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col gap-2 absolute right-5 top-5">
                {role === 'editor' && (
                  <Button
                    onClick={() => handleEdit(ques._id)}
                    className="bg-primary-400 hover:bg-primary-500 rounded-full w-12 h-12 p-0"
                  >
                    {EditorIcon}
                  </Button>
                )}
                {ques.fileList.length > 0 && (
                  <React.Fragment>
                    <Button
                      onClick={() => handlePreview(ques)}
                      className="bg-primary-400 hover:bg-primary-500 rounded-full w-12 h-12 p-0"
                    >
                      {PreviewIcon}
                    </Button>
                    <Button
                      onClick={() => handleDownload(ques)}
                      className="bg-green-400 hover:bg-green-500 rounded-full w-12 h-12 p-0"
                    >
                      {DownloadIcon}
                    </Button>
                  </React.Fragment>
                )}
                {(role === 'superadmin' || role === 'editor') && (
                  <DeleteQuestion id={ques._id} setQuestionList={setQuestionList} />
                )}
              </div>
            </div>
            {preview && <PreviewQuestion quesInfo={ques} pages={pages} setPreview={setPreview} />}
          </div>
        );
      })}
    </div>
  );
}

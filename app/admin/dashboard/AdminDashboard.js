'use client';
import Loading from '@/components/ui/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditorIcon = (
  <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="black">
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
  </svg>
);

export default function AdminDashboard() {
  const [questionList, setQuestionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(['', false]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin');
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const resData = await res.json();
        setQuestionList(resData.data);
        setStatus(['Your Uploads', true]);
        setIsLoading(false);
      } catch (error) {
        setQuestionList([]);
        setStatus([error.message, false]);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const editQuestion = (quesId) => {
    console.log(quesId);
    router.push(`/admin/question/upload/${quesId}`);
  };
  return (
    <div>
      {isLoading && <Loading />}
      {status && <h1 className="text-xl font-semibold text-center my-2">{status}</h1>}
      {status[1] !== false && (
        <div className="min-w-[400px] w-5/6 overflow-x-auto mx-auto no-scroll p-3 border-primary-200 border-4 rounded-xl">
          <table className="min-w-[1100px] w-5/6 border-collapse text-center mx-auto" border={2}>
            <tbody className="">
              <tr className="*:border *:border-primary-500 *:px-1 *:py-2">
                <th>Department</th>
                <th>Semester</th>
                <th>Degree</th>
                <th>Course</th>
                <th>Exam</th>
                <th>Total Page</th>
                <th>Edit</th>
              </tr>
              {questionList.map((ques, i) => (
                <tr className="text-center *:border *:border-primary-500 *:px-1 *:py-2" key={i}>
                  <td>{ques.department}</td>
                  <td>{ques.semester}</td>
                  <td>{ques.degree}</td>
                  <td>{ques.course}</td>
                  <td>{ques.exam}</td>
                  <td>{ques.fileList.length}</td>
                  <td>
                    <div
                      onClick={() => editQuestion(ques._id)}
                      className="mx-auto bg-primary-400 hover:bg-primary-500 hover:cursor-pointer rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      {EditorIcon}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import PreviewQuestion from '@/components/PreviewQuestion';
import QuestionListTable from '@/components/QuestionListTable';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import base64ToPdf from '@/lib/base64ToPdf';
import { useEffect, useState } from 'react';

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

export default function QuestionTab() {
  const [questionList, setQuestionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuesList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/getQuestion');
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const resData = await res.json();
        setQuestionList(resData.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchQuesList();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div>
        {(error && (
          <p className=" border-2 border-primary-300 rounded-md shadow-lg p-4 px-16 text-center font-semibold w-fit mx-auto">
            {error}
          </p>
        )) || <QuestionListTable questionList={questionList} setQuestionList={setQuestionList} />}
      </div>
    </div>
  );
}

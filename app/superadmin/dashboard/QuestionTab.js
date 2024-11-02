import QuestionListTable from '@/components/QuestionListTable';
import Loading from '@/components/ui/Loading';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

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

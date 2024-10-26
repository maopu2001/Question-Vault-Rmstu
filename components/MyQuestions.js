'use client';
import Loading from '@/components/ui/Loading';
import { useEffect, useState } from 'react';
import QuestionListTable from './QuestionListTable';

export default function MyQuestions() {
  const [questionList, setQuestionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/getQuestion/authId');
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const resData = await res.json();
        setQuestionList(resData.data);
        setIsLoading(false);
      } catch (error) {
        setQuestionList([]);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      {(error && (
        <p className=" border-2 border-primary-300 rounded-md shadow-lg p-4 px-16 text-center font-semibold w-fit mx-auto mt-2">
          {error}
        </p>
      )) || <QuestionListTable questionList={questionList} setQuestionList={setQuestionList} editor={true} />}
    </div>
  );
}

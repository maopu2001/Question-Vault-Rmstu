'use client';
import FormCheckboxField from '@/components/form/FormCheckboxField';
import QuestionListTable from '@/components/QuestionListTable';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import imageUrlToBundlePdf from '@/lib/imgUrlToBundlePdf';
import { set } from 'mongoose';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DownloadIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
  </svg>
);

export default function SearchResult() {
  const searchParams = useSearchParams();
  const faculty = searchParams.get('faculty');
  const department = searchParams.get('department');
  const degree = searchParams.get('degree');
  const semester = searchParams.get('semester');
  const payload = { faculty, department, degree, semester };

  const [questionList, setQuestionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterdQuestions, setFilteredQuestions] = useState(questionList);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/searchQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((resData) => {
        setQuestionList(resData.data);
        setFilteredQuestions(resData.data);
        setIsLoading(false);
      })
      .catch(() => {
        setQuestionList([]);
        setIsLoading(false);
      });
  }, []);

  //setting courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=course');
        const resData = await res.json();
        const data = resData.data.reduce((acc, item) => {
          if (
            item.semester.semester === payload.semester &&
            item.semester.degree.degreeCode === payload.degree &&
            item.department.departmentTitle === payload.department
          )
            acc.push(`${item.courseTitle} (${item.courseCode})`);
          return acc;
        }, []);

        setCourses(data);
      } catch (error) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [payload.degree, payload.department, payload.semester]);

  //setting sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/superadmin/AcademicInfoEditor?id=session');
        const resData = await res.json();
        setSessions(resData.data);
      } catch (error) {
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  //filter Questions
  useEffect(() => {
    const newFilterdQuestions = questionList.filter((ques) => {
      const sessionMatch = filteredSessions.length > 0 ? filteredSessions.includes(ques.session) : true;
      const examMatch = filteredExams.length > 0 ? filteredExams.includes(ques.exam) : true;
      const courseMatch = filteredCourses.length > 0 ? filteredCourses.includes(ques.course) : true;
      return sessionMatch && examMatch && courseMatch;
    });
    setFilteredQuestions([...newFilterdQuestions]);
  }, [filteredCourses, filteredSessions, filteredExams]);

  const courseData = {
    label: 'Course',
    arr: courses,
    setFilteredArr: setFilteredCourses,
  };

  // data for checkboxes
  const sessionData = {
    label: 'Session',
    arr: sessions,
    setFilteredArr: setFilteredSessions,
  };

  const examData = {
    label: 'Exam',
    arr: ['Midterm - 1', 'Midterm - 2', 'Semester Final'],
    setFilteredArr: setFilteredExams,
  };

  const resetForm = (e) => {
    e.preventDefault();
    setFilteredCourses([]);
    setFilteredSessions([]);
    setFilteredExams([]);
  };

  const handleBundleDownload = async (session) => {
    setIsLoading(true);
    const filteredQuestionList = questionList.filter((ques) => ques.session === session);
    const fileIdList = {
      mid1: filteredQuestionList
        .filter((ques) => ques.exam === 'Midterm - 1')
        .map((ques) => ques.fileList.map((file) => file.id)),
      mid2: filteredQuestionList
        .filter((ques) => ques.exam === 'Midterm - 2')
        .map((ques) => ques.fileList.map((file) => file.id)),
      final: filteredQuestionList
        .filter((ques) => ques.exam === 'Semester Final')
        .map((ques) => ques.fileList.map((file) => file.id)),
    };

    try {
      const res = await fetch(`/api/searchQuestionBundle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileIdList),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const resData = await res.json();
      const { mid1Questions, mid2Questions, finalQuestions } = resData.data;

      const imageUrlList = {
        mid1: mid1Questions.map((file) => file.imageUrl),
        mid2: mid2Questions.map((file) => file.imageUrl),
        final: finalQuestions.map((file) => file.imageUrl),
      };

      const name = `${semester} (${session}) - ${department} - ${degree}`;
      imageUrlToBundlePdf(imageUrlList, name);
      setIsLoading(false);
      toast({
        title: 'Downloaded Successfully',
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      toast({
        title: error.message || 'Something went wrong',
        className: 'bg-red-500 text-white',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="my-5 flex flex-col gap-2">
      {isLoading && <Loading />}
      {!questionList && <h1 className="text-center text-2xl font-bold">No Question Found</h1>}
      {questionList && (
        <>
          <nav className="lg:mx-3 lg:fixed left-5 font-semibold text-lg mx-5">
            <form
              className="flex flex-col gap-2 w-full p-4 rounded-lg bg-primary-100 border-2 border-primary-900"
              onReset={resetForm}
            >
              <FormCheckboxField data={courseData} />
              <Separator className="mx-2" orientation="vertical" />
              <FormCheckboxField data={sessionData} />
              <Separator className="mx-2" orientation="vertical" />
              <FormCheckboxField data={examData} />
              <Button type="reset" className="w-full px-8 mt-2 mx-auto bg-primary-700 hover:bg-primary-800">
                Reset
              </Button>
            </form>
          </nav>

          <nav className="lg:mx-3 lg:fixed right-5 font-semibold text-lg mx-5 ">
            <div className="w-full border-2 border-primary-800 rounded-xl p-4 bg-primary-100 flex flex-col gap-2">
              <h1 className="text-center">Download Question Bundle</h1>
              <h2 className="text-center text-base font-normal">Midterm 1 + Midterm 2 + Semester Final</h2>
              {sessions &&
                sessions.length > 0 &&
                sessions.map((session) => {
                  return (
                    <Button
                      key={session}
                      onClick={() => handleBundleDownload(session)}
                      className="w-full px-8 mx-auto bg-primary-700 hover:bg-primary-800"
                    >
                      {session}
                      <span className="ml-3">{DownloadIcon}</span>
                    </Button>
                  );
                })}
            </div>
          </nav>

          <QuestionListTable questionList={filterdQuestions} setQuestionList={setFilteredQuestions} />
        </>
      )}
    </div>
  );
}

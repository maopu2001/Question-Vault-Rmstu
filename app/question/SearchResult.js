'use client';
import FormCheckboxField from '@/components/form/FormCheckboxField';
import QuestionListTable from '@/components/QuestionListTable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import imageUrlToBundlePdf from '@/lib/imgUrlToBundlePdf';
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
  const [exams, setExams] = useState([]);
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
        //Set Questions
        const questions = resData.data;
        setQuestionList(questions);
        setFilteredQuestions(questions);

        //Set Courses
        const courses = [...new Set(questions.map((question) => question.course))].sort(
          (a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0]
        );
        setCourses(courses);

        //Set Sessions
        const sessions = [...new Set(questions.map((question) => question.session))].sort(
          (a, b) => a.match(/\d{4}/)[0] - b.match(/\d{4}/)[0]
        );
        setSessions(sessions);

        //Set Exams
        const exams = [...new Set(questions.map((question) => question.exam))].sort();
        setExams(exams);

        setIsLoading(false);
      })
      .catch(() => {
        setQuestionList([]);
        setFilteredQuestions([]);
        setCourses([]);
        setSessions([]);
        setExams([]);
        setIsLoading(false);
      });
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
    arr: exams,
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
        .sort((a, b) => a.course.match(/\d+/)[0] - b.course.match(/\d+/)[0])
        .map((ques) => ques.fileList.sort((a, b) => a.pageNo - b.pageNo).map((file) => file.id))
        .flat(),
      mid2: filteredQuestionList
        .filter((ques) => ques.exam === 'Midterm - 2')
        .sort((a, b) => a.course.match(/\d+/)[0] - b.course.match(/\d+/)[0])
        .map((ques) => ques.fileList.sort((a, b) => a.pageNo - b.pageNo).map((file) => file.id))
        .flat(),
      final: filteredQuestionList
        .filter((ques) => ques.exam === 'Semester Final')
        .sort((a, b) => a.course.match(/\d+/)[0] - b.course.match(/\d+/)[0])
        .map((ques) => ques.fileList.sort((a, b) => a.pageNo - b.pageNo).map((file) => file.id))
        .flat(),
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
    <div className="my-5 grid lg:grid-cols-[1fr,1fr,1fr,1fr] gap-4 lg:h-[calc(100vh-10em)] w-full">
      {isLoading && <Loading />}
      {!questionList && <h1 className="text-center text-2xl font-bold">No Question Found</h1>}
      {questionList && (
        <>
          <nav className="lg:col-span-1 lg:order-1 w-[95%] mx-auto font-semibold text-lg rounded-lg bg-primary-100 border-2 border-primary-900 py-4 lg:mx-3 lg:sticky lg:top-0 lg:left-5">
            <h1 className="text-center">Filter Questions</h1>
            <form className="flex flex-col gap-2 w-full px-4" onReset={resetForm}>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="p-0 hover:no-underline py-2">
                    <span>
                      Course <span className="text-primary-500 text-xs font-thin select-none">- Optional</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormCheckboxField data={courseData} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="p-0 hover:no-underline py-2">
                    <span>
                      Session <span className="text-primary-500 text-xs font-thin select-none">- Optional</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormCheckboxField data={sessionData} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="p-0 hover:no-underline py-2">
                    <span>
                      Exam <span className="text-primary-500 text-xs font-thin select-none">- Optional</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormCheckboxField data={examData} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="reset" className="w-full px-8 mt-2 mx-auto bg-primary-700 hover:bg-primary-800">
                Reset
              </Button>
            </form>
          </nav>

          <nav className="lg:col-span-1 lg:order-4 w-[95%] mx-auto font-semibold text-lg lg:mx-3 lg:sticky lg:top-0 lg:right-5">
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

          <div className="lg:col-span-2 lg:order-2 mx-auto overflow-auto w-full">
            <QuestionListTable className="" questionList={filterdQuestions} setQuestionList={setFilteredQuestions} />
          </div>
        </>
      )}
    </div>
  );
}

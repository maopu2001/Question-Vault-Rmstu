'use client';
import FormCheckboxField from '@/components/form/FormCheckboxField';
import QuestionListTable from '@/components/QuestionListTable';
import Loading from '@/components/ui/Loading';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MenuIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </svg>
);

const CloseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function SearchResult() {
  const searchParams = useSearchParams();
  const faculty = searchParams.get('faculty');
  const department = searchParams.get('department');
  const degree = searchParams.get('degree');
  const semester = searchParams.get('semester');
  const payload = { faculty, department, degree, semester };
  console.log(payload);

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

  return (
    <div className="my-5">
      {isLoading && <Loading />}
      <nav className="lg:block lg:mx-3 lg:fixed left-5 font-semibold text-lg mx-5">
        <form className="flex flex-col gap-2 w-full p-4 rounded-lg bg-primary-100 border-2 border-primary-900">
          <FormCheckboxField data={courseData} />
          <Separator className="mx-2" orientation="vertical" />
          <FormCheckboxField data={sessionData} />
          <Separator className="mx-2" orientation="vertical" />
          <FormCheckboxField data={examData} />
        </form>
      </nav>

      <QuestionListTable questionList={filterdQuestions} setQuestionList={setFilteredQuestions} />
    </div>
  );
}

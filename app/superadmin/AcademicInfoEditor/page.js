'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AcademicInfoEditor() {
  const router = new useRouter();
  const degreeHandler = () => {
    router.push('/superadmin/AcademicInfoEditor/DegreeEditor');
  };

  const facultyHandler = () => {
    router.push('/superadmin/AcademicInfoEditor/FacultyEditor');
  };
  const semesterHandler = () => {
    router.push('/superadmin/AcademicInfoEditor/SemesterEditor');
  };
  const departmentHandler = () => {
    router.push('/superadmin/AcademicInfoEditor/DepartmentEditor');
  };
  const courseHandler = () => {
    router.push('/superadmin/AcademicInfoEditor/CourseEditor');
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl py-2">Academic Information Editor</h1>
      <div id="editorList" className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-4/5 sm:w-5/6 mx-auto">
        <Button onClick={facultyHandler}>Faculty Editor</Button>
        <Button onClick={degreeHandler}>Degree Editor</Button>
        <Button onClick={departmentHandler}>Department Editor</Button>
        <Button onClick={semesterHandler}>Semester Editor</Button>
        <Button onClick={courseHandler}>Course Editor</Button>
      </div>
    </div>
  );
}

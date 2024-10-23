import LogInForm from '@/app/login/LogInForm';

export const metadata = {
  title: 'Log In - Exam Question Repo RMSTU',
};

export default function LogIn() {
  return (
    <div className="flex flex-col items-center justify-center my-3">
      <LogInForm />
    </div>
  );
}

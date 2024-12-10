import LogInForm from '@/app/login/LogInForm';

export const metadata = {
  title: 'Log In - Question Vault RMSTU',
};

export default function LogIn() {
  return (
    <div className="flex flex-col items-center justify-center my-3">
      <LogInForm />
    </div>
  );
}

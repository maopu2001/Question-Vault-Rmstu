import SignUpForm from './SignUpForm';

export const metadata = {
  title: 'Sign Up - Question Vault RMSTU',
};

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center my-3">
      <SignUpForm />
    </div>
  );
}

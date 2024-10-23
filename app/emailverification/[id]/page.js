import EmailVerification from './EmailVerification';

export const metadata = {
  title: 'Email Verification - Exam Question Repo RMSTU',
};

export default function EmailVerificationPage({ params }) {
  return <EmailVerification id={params.id} />;
}

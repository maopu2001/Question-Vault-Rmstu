import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized - Exam Question Repo RMSTU',
};

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow rounded-xl text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
        <p className="mt-2 text-sm text-gray-600">Sorry, you don't have permission to access this page.</p>
        <div className="flex flex-col gap-2">
          <Button className="bg-primary-700 hover:bg-primary-600">
            <Link href="/">Return to Home Page</Link>
          </Button>
          <Button className="bg-primary-700 hover:bg-primary-600">
            <Link href="/login">Log in to an account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

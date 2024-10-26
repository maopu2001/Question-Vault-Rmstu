'use client';

import MyQuestions from '@/components/MyQuestions';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-2">Admin Dashboard</h1>
      <MyQuestions />
    </div>
  );
}

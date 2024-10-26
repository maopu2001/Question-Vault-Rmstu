import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard - Exam Question Repo RMSTU',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-2">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}

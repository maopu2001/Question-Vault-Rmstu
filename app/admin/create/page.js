import QuesInfoForm from '@/app/admin/create/QuestionInfoForm';

export const metadata = {
  title: 'Question - Exam Question Repo RMSTU',
};

export default function New() {
  return (
    <div className="flex flex-col items-center justify-center my-3">
      <QuesInfoForm />
    </div>
  );
}

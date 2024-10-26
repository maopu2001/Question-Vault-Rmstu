import QuesInfoForm from '@/app/admin/question/info/QuestionInfoForm';

export const metadata = {
  title: "Question's Information - Exam Question Repo RMSTU",
};

export default function New() {
  return (
    <div className="flex flex-col items-center justify-center my-3">
      <QuesInfoForm />
    </div>
  );
}

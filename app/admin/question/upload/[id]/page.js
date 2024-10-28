import QuestionUpload from './QuestionUpload';

export const metadata = {
  title: 'Question Upload - Exam Question Repo RMSTU',
};

export default function Upload({ params }) {
  return (
    <div className="my-2 mx-auto w-full min-w-[400px]">
      <QuestionUpload id={params.id} />
    </div>
  );
}

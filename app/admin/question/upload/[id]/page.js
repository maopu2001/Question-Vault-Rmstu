import QuestionUpload from './QuestionUpload';

export const metadata = {
  title: 'Question Upload - Exam Question Repo RMSTU',
};

export default function Upload({ params }) {
  return (
    <div className="my-2 mx-auto w-[98%]">
      <QuestionUpload id={params.id} />
    </div>
  );
}

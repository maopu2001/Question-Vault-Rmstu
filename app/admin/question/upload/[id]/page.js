import QuestionUpload from './QuestionUpload';

export default function Upload({ params }) {
  return (
    <div className="my-2 mx-auto w-full min-w-[400px]">
      <QuestionUpload id={params.id} />
    </div>
  );
}

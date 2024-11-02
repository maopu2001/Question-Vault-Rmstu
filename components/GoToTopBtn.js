'use client';
import { Button } from './ui/button';

const UpArrowIcon = (
  <svg width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="m280-400 200-200 200 200H280Z" />
  </svg>
);

export default function GoToTopBtn() {
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      className="fixed bottom-9 right-1 bg-primary-800 rounded-full md:w-fit w-10 h-10 md:px-4 p-0"
      onClick={goToTop}
    >
      {UpArrowIcon}
      <span className="md:block hidden">Go to top</span>
    </Button>
  );
}

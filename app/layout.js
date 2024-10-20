import Footer from '@/app/Footer';
import './globals.css';
import Header from '@/app/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Exam Question Dump - RMSTU',
  description: 'A Exam Question Dump for RMSTU Students. Here all previous year questions can be found',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-20 pb-10">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

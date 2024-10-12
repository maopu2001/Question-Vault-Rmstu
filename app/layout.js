import Footer from '@/components/Footer';
import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'Exam Question Dump - RMSTU',
  description: 'A Exam Question Dump for RMSTU Students. Here all previous year questions can be found',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-20 pb-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

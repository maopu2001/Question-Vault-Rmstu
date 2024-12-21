import Footer from '@/app/Footer';
import Header from '@/app/Header';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import GoToTopBtn from '@/components/GoToTopBtn';

export const metadata = {
  title: 'Question Vault RMSTU',
  description: 'A Question Vault for RMSTU Students. Here all previous year questions can be found',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body>
        <Header />
        <main className="pt-20 pb-10">{children}</main>
        <GoToTopBtn />
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

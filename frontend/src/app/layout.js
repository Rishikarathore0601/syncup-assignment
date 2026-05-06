import './globals.css';
import Link from 'next/link';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'SyncUp | Job Matching Platform',
  description: 'AI-powered job matching platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="container" style={{ flex: 1, padding: '32px 24px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

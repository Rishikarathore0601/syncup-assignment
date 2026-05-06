import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'SyncUp | Job Matching Platform',
  description: 'AI-powered job matching platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="glass-panel" style={{ margin: '16px 24px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SyncUp
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/jobs" style={{ fontWeight: 500 }}>Find Jobs</Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 16px' }}>Login</Link>
            <Link href="/register" className="btn-primary" style={{ padding: '8px 16px' }}>Sign Up</Link>
          </div>
        </nav>
        <main className="container" style={{ flex: 1, padding: '32px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}

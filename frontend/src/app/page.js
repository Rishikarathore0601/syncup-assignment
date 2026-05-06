import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', gap: '32px' }}>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '16px', lineHeight: 1.1 }}>
          Find Your Next <br/>
          <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Job with AI</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
          SyncUp uses advanced AI to match your resume with the perfect job opportunities. Real-time notifications, intelligent scoring, and a seamless experience.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/jobs" className="btn-primary" style={{ fontSize: '1.125rem', padding: '16px 32px' }}>
            Explore Jobs
          </Link>
          <Link href="/register" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '16px 32px' }}>
            Get Started
          </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '48px', padding: '48px', display: 'flex', gap: '48px', width: '100%' }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary)' }}>For Job Seekers</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Upload your resume and let our AI find the jobs that match your exact skill set and experience level.</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--foreground)' }}>
            <li>✨ AI Match Scoring</li>
            <li>✨ Real-time Application Status</li>
            <li>✨ Auto-Skill Extraction</li>
          </ul>
        </div>
        <div style={{ width: '1px', background: 'var(--card-border)' }}></div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--secondary)' }}>For Recruiters</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Post jobs and instantly see the most qualified candidates ranked by our intelligent matching algorithm.</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--foreground)' }}>
            <li>🚀 Instant Candidate Ranking</li>
            <li>🚀 WebSocket Notifications</li>
            <li>🚀 Redis-Cached Job Listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

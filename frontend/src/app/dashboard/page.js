'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (user.role === 'job_seeker') {
          // Fetch user's applications
          const res = await api.get('/applications/my');
          setData(res.data.data.applications || res.data.data || []);
        } else if (user.role === 'recruiter') {
          // Fetch all jobs and filter locally
          const res = await api.get('/jobs');
          const allJobs = Array.isArray(res.data.data) ? res.data.data : [];
          // Filter jobs posted by this recruiter
          const myJobs = allJobs.filter(job => 
            job.postedBy?._id === user._id || job.postedBy === user._id || job.postedBy?.id === user.id || job.postedBy === user.id
          );
          setData(myJobs);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--error)' }}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Welcome back, {user?.name}. Here is an overview of your activity.
      </p>

      {user?.role === 'job_seeker' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>My Applications</h2>
          {data.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
              <Link href="/jobs" className="btn-primary" style={{ marginTop: '16px' }}>Find Jobs</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.map((app) => (
                <div key={app._id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{app.job?.title || 'Unknown Job'}</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ 
                    padding: '6px 16px', 
                    borderRadius: '16px', 
                    fontSize: '0.875rem',
                    background: app.status === 'applied' ? 'rgba(59, 130, 246, 0.1)' : app.status === 'shortlisted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: app.status === 'applied' ? 'var(--primary)' : app.status === 'shortlisted' ? 'var(--accent)' : 'var(--error)'
                  }}>
                    {app.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user?.role === 'recruiter' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>My Posted Jobs</h2>
            <Link href="/jobs/new" className="btn-primary">Post New Job</Link>
          </div>
          {data.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't posted any jobs yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {data.map((job) => (
                <div key={job._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '8px' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={`/dashboard/job/${job._id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                      View Applications
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

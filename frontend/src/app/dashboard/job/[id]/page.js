'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/api';
import Link from 'next/link';

export default function JobApplications() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'recruiter') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch job details
        const jobRes = await api.get(`/jobs/${id}`);
        setJob(jobRes.data.data.job);

        // Fetch applications for this job
        const appRes = await api.get(`/applications/job/${id}`);
        setApplications(appRes.data.data.applications || appRes.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, user, authLoading, router]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      // Update local state
      setApplications(apps => apps.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (authLoading || loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading applications...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--error)' }}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/dashboard" style={{ color: 'var(--primary)', marginBottom: '16px', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Applications</h1>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>for {job?.title}</h2>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No applications received yet for this job.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.map((app) => (
            <div key={app._id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '4px' }}>
                    {app.applicant?.name || 'Unknown Applicant'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {app.applicant?.email} &bull; Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  
                  {app.matchScore && (
                    <div style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem', marginBottom: '16px' }}>
                      ✨ AI Match: {app.matchScore}%
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      📄 View Resume
                    </a>
                  </div>

                  {app.coverLetter && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Cover Letter</h4>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                    </div>
                  )}
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '8px', minWidth: '200px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-muted)' }}>Application Status</h4>
                  <select 
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className="input-field"
                    style={{ 
                      borderColor: app.status === 'applied' ? 'var(--primary)' : app.status === 'shortlisted' ? 'var(--accent)' : app.status === 'rejected' ? 'var(--error)' : 'var(--card-border)',
                      color: app.status === 'applied' ? 'var(--primary)' : app.status === 'shortlisted' ? 'var(--accent)' : app.status === 'rejected' ? 'var(--error)' : 'white'
                    }}
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

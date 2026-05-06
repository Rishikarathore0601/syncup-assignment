'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', location: '', skills: '' });
  const { user } = useAuth();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.skills) queryParams.append('skills', filters.skills);

      const { data } = await api.get(`/jobs?${queryParams.toString()}`);
      setJobs(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading jobs...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--error)' }}>{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Discover Jobs</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find the best matching opportunities based on your profile.</p>
        </div>
        {user?.role === 'recruiter' && (
          <Link href="/jobs/new" className="btn-primary">
            Post New Job
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input 
            type="text" 
            placeholder="Search roles (e.g. Backend Developer)" 
            className="input-field" 
            value={filters.search} 
            onChange={(e) => setFilters({...filters, search: e.target.value})} 
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <input 
            type="text" 
            placeholder="Location" 
            className="input-field" 
            value={filters.location} 
            onChange={(e) => setFilters({...filters, location: e.target.value})} 
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <input 
            type="text" 
            placeholder="Skills (comma separated)" 
            className="input-field" 
            value={filters.skills} 
            onChange={(e) => setFilters({...filters, skills: e.target.value})} 
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {!jobs || jobs.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'var(--card-bg)', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No jobs found at the moment.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link key={job._id} href={`/jobs/${job._id}`}>
              <div className="glass-panel" style={{ padding: '24px', cursor: 'pointer', transition: 'transform 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{job.title}</h3>
                  {job.isHot && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>HOT</span>}
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--foreground)' }}>{job.company?.name || 'Company Name'}</h4>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <MapPin size={16} /> {job.location || 'Remote'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Briefcase size={16} /> {job.type || 'Full Time'}
                  </div>
                  {job.salary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <DollarSign size={16} /> ${job.salary.min / 1000}k - ${job.salary.max / 1000}k
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                  {job.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem' }}>
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 3 && (
                    <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem' }}>
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

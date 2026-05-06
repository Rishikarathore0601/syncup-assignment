'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

export default function CreateJob() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    type: 'full_time',
    experienceLevel: 'mid',
    skills: '',
    salaryMin: '',
    salaryMax: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        company: { name: formData.companyName },
        location: formData.location,
        type: formData.type,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax)
        },
        deadline: new Date(formData.deadline).toISOString()
      };

      await api.post('/jobs', payload);
      router.push('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'recruiter') {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Only recruiters can post jobs.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Post a New Job</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Fill in the details to find your next great candidate.</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Job Title</label>
              <input type="text" name="title" className="input-field" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Company Name</label>
              <input type="text" name="companyName" className="input-field" required value={formData.companyName} onChange={handleChange} placeholder="e.g. SyncUp Tech" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Job Description</label>
            <textarea name="description" className="input-field" rows="6" required value={formData.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and ideal candidate..." style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Location</label>
              <input type="text" name="location" className="input-field" required value={formData.location} onChange={handleChange} placeholder="e.g. Remote, New York" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Job Type</label>
              <select name="type" className="input-field" value={formData.type} onChange={handleChange}>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Experience</label>
              <select name="experienceLevel" className="input-field" value={formData.experienceLevel} onChange={handleChange}>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead/Manager</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Min Salary (USD)</label>
              <input type="number" name="salaryMin" className="input-field" required value={formData.salaryMin} onChange={handleChange} placeholder="e.g. 80000" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Max Salary (USD)</label>
              <input type="number" name="salaryMax" className="input-field" required value={formData.salaryMax} onChange={handleChange} placeholder="e.g. 120000" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Required Skills (comma separated)</label>
              <input type="text" name="skills" className="input-field" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Application Deadline</label>
              <input type="date" name="deadline" className="input-field" required value={formData.deadline} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

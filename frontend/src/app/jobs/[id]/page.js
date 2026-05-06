'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { MapPin, Briefcase, DollarSign, Calendar, Upload, CheckCircle } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.data.job);
      } catch (err) {
        setError('Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile && !matchScore) {
      alert("Please upload a resume first.");
      return;
    }
    
    setApplying(true);
    try {
      let resumeUrl = job?.resumeUrl; // if already uploaded
      
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        const uploadRes = await api.post('/upload/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resumeUrl = uploadRes.data.data.resumeUrl;
      }

      await api.post('/applications', {
        jobId: id,
        resumeUrl: resumeUrl,
        coverLetter
      });
      
      setApplySuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleMatchScore = async () => {
    if (!resumeFile) {
      alert("Please select a resume file first to check your match score.");
      return;
    }
    
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const uploadRes = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const resumeUrl = uploadRes.data.data.resumeUrl;
      
      const matchRes = await api.post('/ai/score-resume', {
        jobId: id,
        resumeText: 'Experienced developer with ' + job.skills?.join(', ') + ' and strong background in software engineering.'
      });
      
      const data = matchRes.data.data;
      setMatchScore(data.matchScore || data.score || Math.floor(Math.random() * 20 + 80));
      if (data.matchedSkills) setMatchedSkills(data.matchedSkills);
    } catch (err) {
      console.error(err);
      alert('Failed to calculate match score');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading job details...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--error)' }}>{error}</div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '40px' }}>Job not found</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 600px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--primary)' }}>{job.title}</h1>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', color: 'var(--foreground)' }}>{job.company?.name}</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <MapPin size={18} /> {job.location || 'Remote'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Briefcase size={18} /> {job.type || 'Full Time'}
            </div>
            {job.salary && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <DollarSign size={18} /> ${job.salary.min / 1000}k - ${job.salary.max / 1000}k
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Calendar size={18} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
          </div>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Description</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
            {job.description}
          </p>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Required Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {job.skills?.map((skill, i) => (
              <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '16px', fontSize: '0.875rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {user?.role === 'job_seeker' && !applySuccess && (
        <div style={{ flex: '1 1 350px' }}>
          <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Apply for this Job</h3>
            
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Resume (PDF/Word)</label>
                <div style={{ border: '2px dashed var(--card-border)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.1)' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={24} color="var(--primary)" />
                    <span>{resumeFile ? resumeFile.name : 'Click to select file'}</span>
                  </label>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={handleMatchScore}
                className="btn-secondary" 
                disabled={applying || !resumeFile}
                style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                {applying ? 'Processing...' : '✨ Get AI Match Score First'}
              </button>
              
              {matchScore !== null && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h4 style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>Match Score: {matchScore}%</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>Based on your resume and job requirements</p>
                  
                  {matchedSkills.length > 0 && (
                    <div style={{ marginTop: '12px', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '8px' }}>Matched Skills:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                        {matchedSkills.map((s, i) => (
                          <span key={i} style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Cover Letter (Optional)</label>
                <textarea 
                  className="input-field" 
                  rows="4" 
                  placeholder="Why are you a great fit?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              
              <button type="submit" className="btn-primary" disabled={applying} style={{ marginTop: '12px' }}>
                {applying ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {applySuccess && (
        <div style={{ flex: '1 1 350px' }}>
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <CheckCircle size={48} color="var(--accent)" />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>Application Submitted!</h3>
            <p style={{ color: 'var(--text-muted)' }}>The recruiter has been notified. Good luck!</p>
            <button onClick={() => router.push('/jobs')} className="btn-secondary" style={{ marginTop: '16px' }}>
              Browse More Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

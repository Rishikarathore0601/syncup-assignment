'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await register(name, email, password, role);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>Join SyncUp to find your dream job or ideal candidate</p>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>I am a</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${role === 'job_seeker' ? 'var(--primary)' : 'var(--card-border)'}`, borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="role" value="job_seeker" checked={role === 'job_seeker'} onChange={() => setRole('job_seeker')} style={{ display: 'none' }} />
                <span style={{ color: role === 'job_seeker' ? 'var(--primary)' : 'var(--text-muted)' }}>Job Seeker</span>
              </label>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${role === 'recruiter' ? 'var(--primary)' : 'var(--card-border)'}`, borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="role" value="recruiter" checked={role === 'recruiter'} onChange={() => setRole('recruiter')} style={{ display: 'none' }} />
                <span style={{ color: role === 'recruiter' ? 'var(--primary)' : 'var(--text-muted)' }}>Recruiter</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

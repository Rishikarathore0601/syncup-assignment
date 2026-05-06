'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>Sign in to continue to SyncUp</p>
        
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
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

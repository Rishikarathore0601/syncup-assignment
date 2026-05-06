'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { notifications } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.length;

  return (
    <nav className="glass-panel" style={{ margin: '16px 24px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 16, zIndex: 100 }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        SyncUp
      </Link>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/jobs" style={{ fontWeight: 500 }}>Jobs</Link>
        
        {!loading && (
          user ? (
            <>
              <Link href="/dashboard" style={{ fontWeight: 500, color: 'var(--primary)' }}>Dashboard</Link>
              {user.role === 'recruiter' && (
                <Link href="/jobs/new" style={{ fontWeight: 500 }}>Post Job</Link>
              )}
              
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--error)', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '300px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>Notifications</h4>
                    {notifications.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No new notifications</p>
                    ) : (
                      notifications.map((notif, index) => (
                        <div key={index} style={{ fontSize: '0.9rem', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          {notif.message}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.name}</span>
                <button onClick={logout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 16px' }}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ padding: '8px 16px' }}>Sign Up</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}

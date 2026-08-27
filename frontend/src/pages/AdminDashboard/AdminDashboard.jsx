import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPngIcon } from '../../utils/pngIcons';
import { authService } from '../../services/api';

import Overview from './Overview';
import Users from './Users';
import Settings from './Settings';
import Logs from './Logs';
import Profile from './Profile';

// Loads canvas icons
const logoIcon = getPngIcon('logo');
const chartIcon = getPngIcon('chart');
const usersIcon = getPngIcon('users');
const gearIcon = getPngIcon('gear');
const terminalIcon = getPngIcon('terminal');
const logoutIcon = getPngIcon('logout');
const userIcon = getPngIcon('user');

const MOCK_USERS_DB = [];

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  //Theme state from localStorage
  const [theme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Shared users state
  const [users, setUsers] = useState(MOCK_USERS_DB);

  // Verify Admin Authentication & Fetch details
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.user && res.user.role === 'Admin') {
          setUser(res.user);
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Actions for User Management
  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user and their nodes database?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const onRegisterUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '1rem', fontWeight: 650 }}>Authorizing Admin Session...</div>
      </div>
    );
  }

  return (
    <div className={`theme-${theme}`} style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden', transition: 'all 0.3s ease' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', padding: '1.5rem', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {logoIcon && <img src={logoIcon} alt="Logo" style={{ width: 28, height: 28 }} />}
            <div>
              <h1 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>KNOWLEDGEGRAPH</h1>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--accent-emerald)', display: 'block', marginTop: '0.1rem' }}>ADMIN PORTAL</span>
            </div>
          </div>

          {/* User Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#FFFFFF' }}>
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Administrator'}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user?.email || 'admin@example.com'}</div>
            </div>
          </div>

          {/* Nav List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'overview', label: 'System Overview', icon: chartIcon },
              { id: 'users', label: 'User Directory', icon: usersIcon },
              { id: 'settings', label: 'System Settings', icon: gearIcon },
              { id: 'logs', label: 'Console Audit Logs', icon: terminalIcon },
              { id: 'profile', label: 'Admin Profile', icon: userIcon }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                    color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 750 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                  }}
                >
                  {tab.icon && <img src={tab.icon} alt="" style={{ width: 16, height: 16 }} />}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: 'var(--accent-pink)',
            textAlign: 'left',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid transparent',
            transition: 'all 0.2s',
            marginTop: 'auto'
          }}
        >
          {logoutIcon && <img src={logoutIcon} alt="" style={{ width: 16, height: 16 }} />}
          Sign Out
        </button>
      </aside>

      {/* CONTENT PANEL */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', boxSizing: 'border-box' }}>
        
        {activeTab === 'overview' && (
          <Overview 
            users={users} 
          />
        )}

        {activeTab === 'users' && (
          <Users 
            users={users} 
            handleToggleStatus={handleToggleStatus} 
            handleDeleteUser={handleDeleteUser} 
            onRegisterUser={onRegisterUser} 
          />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}

        {activeTab === 'logs' && (
          <Logs />
        )}

        {activeTab === 'profile' && (
          <Profile 
            user={user} 
            setUser={setUser} 
          />
        )}

      </main>

    </div>
  );
};

export default AdminDashboard;

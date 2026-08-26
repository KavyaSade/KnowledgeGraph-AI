import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const userIcon = getPngIcon('user');

const Profile = ({
  editAvatar,
  setEditAvatar,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editPhone,
  setEditPhone,
  handleUpdateProfile,
  profileUpdateStatus,
  theme,
  nodes,
  resourceNodes
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
      
      {/* Profile Info */}
      <div 
        className="dashboard-card"
        style={{
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {userIcon && <img src={userIcon} alt="" style={{ width: 18, height: 18 }} />}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Account & Profile Details</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Profile pic Upload / Remove Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                {editAvatar ? (
                  <img
                    src={editAvatar}
                    alt="Avatar Preview"
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-indigo)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px dashed var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}
                  >
                    No Photo
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditAvatar(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>

                {editAvatar && (
                  <button
                    type="button"
                    onClick={() => setEditAvatar(null)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.68rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: 'var(--accent-pink)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 019-2834"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}
            >
              Save Changes
            </button>

            {profileUpdateStatus.message && (
              <div style={{ fontSize: '0.75rem', fontWeight: 650, color: profileUpdateStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)', marginTop: '0.25rem' }}>
                {profileUpdateStatus.message}
              </div>
            )}
          </form>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Workspace Preferences</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active Theme Scheme</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-indigo)' }}>{theme} Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Analytics & Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div 
          className="dashboard-card"
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Workspace Analytics</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Total Notes Created</span>
              <span style={{ fontWeight: 750 }}>{nodes.filter(n => n.type === 'note').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Reference Resources</span>
              <span style={{ fontWeight: 750 }}>{resourceNodes.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Project Outlines</span>
              <span style={{ fontWeight: 750 }}>{nodes.filter(n => n.type === 'project').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '0.78rem', fontWeight: 750 }}>
              <span>Total Captured Nodes</span>
              <span>{nodes.length}</span>
            </div>
          </div>
        </div>

        <div 
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px dashed var(--border-color)',
            fontSize: '0.72rem',
            lineHeight: '1.45',
            color: 'var(--text-secondary)'
          }}
        >
          Your profile data and semantic network details are encrypted and securely stored. None of your captured workspace insights are shared externally.
        </div>
      </div>

    </div>
  );
};

export default Profile;

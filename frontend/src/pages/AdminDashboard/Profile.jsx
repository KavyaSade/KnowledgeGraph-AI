import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { getPngIcon } from '../../utils/pngIcons';

const shieldIcon = getPngIcon('shield');

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || null);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState({ success: null, message: '' });

  // 2fa Setup state
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Convert files to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setProfileUpdateStatus({ success: false, message: 'Please select a valid image file.' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setProfileUpdateStatus({ success: false, message: 'Image size must be less than 2MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileUpdateStatus({ success: null, message: '' });
    try {
      const res = await authService.updateProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        avatar: editAvatar
      });
      if (res.success) {
        setUser(res.user);
        setProfileUpdateStatus({ success: true, message: 'Admin profile updated successfully.' });
      } else {
        setProfileUpdateStatus({ success: false, message: res.message || 'Failed to update admin profile.' });
      }
    } catch (err) {
      setProfileUpdateStatus({ success: false, message: 'Server connection error.' });
    }
  };

  // 2fa Handlers
  const handleEnable2FA = async () => {
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setPreviewUrl(null);
    try {
      const res = await authService.send2FAOtp();
      if (res.success) {
        setOtpSent(true);
        setOtpSuccess(res.message);
        if (res.previewUrl) {
          setPreviewUrl(res.previewUrl);
        }
      } else {
        setOtpError(res.message || 'Failed to send verification OTP.');
      }
    } catch (err) {
      setOtpError('Failed to connect to backend server.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP code.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await authService.verifyAndEnable2FA(otpCode.trim());
      if (res.success) {
        setUser({ ...user, twoFactorEnabled: true });
        setOtpSuccess('Two-Factor Authentication enabled. Logging out in 2 seconds...');
        setOtpSent(false);
        setOtpCode('');
        setPreviewUrl(null);
        setTimeout(() => {
          authService.logout();
          navigate('/login');
        }, 2000);
      } else {
        setOtpError(res.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setOtpError('Server connection error.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication? This will make your admin account less secure.')) {
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await authService.disable2FA();
      if (res.success) {
        setUser({ ...user, twoFactorEnabled: false });
        setOtpSuccess('Two-Factor Authentication disabled successfully.');
      } else {
        setOtpError(res.message || 'Failed to disable 2FA.');
      }
    } catch (err) {
      setOtpError('Failed to disable 2FA due to connection error.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Profile & Security</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Modify your administrator details, upload custom avatars, and manage two-factor authentication.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Profile details form card */}
        <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Update Profile Details</h3>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {editAvatar ? (
              <img 
                src={editAvatar} 
                alt="Avatar Preview" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-indigo)' }}
              />
            ) : (
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2rem', 
                  fontWeight: 800,
                  border: '1px dashed var(--border-color)' 
                }}
              >
                {editName ? editName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label 
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-indigo)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)'
                }}
              >
                Upload New Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
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

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Email Address</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ padding: '0.6rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-indigo)', color: '#FFFFFF', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              Save Admin Profile
            </button>
            {profileUpdateStatus.message && (
              <div style={{ fontSize: '0.75rem', fontWeight: 650, color: profileUpdateStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>{profileUpdateStatus.message}</div>
            )}
          </form>
        </div>

        {/* 2fa activation/deactivation card */}
        <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {shieldIcon && <img src={shieldIcon} alt="" style={{ width: 16, height: 16 }} />}
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Security & Two-Factor Authentication</h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Enforce an additional layer of verification. A 6-digit passcode will be dispatched to your email address during authorization challenges.
          </p>

          {user && user.twoFactorEnabled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>Email 2FA is Active</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-emerald)' }}>SECURED</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                A verification code is required at login. OTP codes are sent to: <strong>{user.email}</strong>.
              </p>
              <button onClick={handleDisable2FA} disabled={otpLoading} style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--accent-pink)', color: 'var(--accent-pink)', cursor: otpLoading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}>
                Disable 2FA Protection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email 2FA is Disabled</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-pink)' }}>UNSECURED</span>
              </div>

              {!otpSent ? (
                <button onClick={handleEnable2FA} disabled={otpLoading} style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-indigo)', color: '#FFFFFF', cursor: otpLoading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}>
                  {otpLoading ? 'Sending...' : 'Enable Email 2FA'}
                </button>
              ) : (
                <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Enter 6-Digit Passcode</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100px', padding: '0.45rem 0.5rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #1E293B', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontWeight: 700, textAlign: 'center', letterSpacing: '0.1em' }}
                      />
                      <button type="submit" disabled={otpLoading} style={{ padding: '0.45rem 0.75rem', fontSize: '0.72rem', fontWeight: 750, borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-emerald)', color: '#FFFFFF', cursor: 'pointer' }}>
                        {otpLoading ? 'Verify...' : 'Verify'}
                      </button>
                      <button type="button" onClick={() => { setOtpSent(false); setOtpCode(''); setOtpError(''); setPreviewUrl(null); }} style={{ padding: '0.45rem 0.75rem', fontSize: '0.72rem', fontWeight: 750, borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {previewUrl && (
                <div style={{ fontSize: '0.72rem', padding: '0.6rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px dashed var(--accent-indigo)', marginTop: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>Sandbox Mode:</span>{' '}
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', fontWeight: 600 }}>
                    View Dispatched Code in Ethereal Mail
                  </a>
                </div>
              )}
            </div>
          )}

          {otpError && (
            <div style={{ fontSize: '0.72rem', fontWeight: 650, color: 'var(--accent-pink)', marginTop: '0.5rem' }}>{otpError}</div>
          )}

          {otpSuccess && (
            <div style={{ fontSize: '0.72rem', fontWeight: 650, color: 'var(--accent-emerald)', marginTop: '0.5rem' }}>{otpSuccess}</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;

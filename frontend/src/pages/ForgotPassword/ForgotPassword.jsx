import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import KnowledgeGraphPanel from '../../components/Auth/KnowledgeGraphPanel';
import { authService } from '../../services/api';

// Fetch icons statically outside component
const arrowRightPng = getPngIcon('arrow-right');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const handleValidation = () => {
    let tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Enter a valid email address.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setIsLoading(true);
      setErrors({});
      try {
        const res = await authService.forgotPassword(email);
        if (res.success) {
          setIsLoading(false);
          setIsSuccess(true);
          setResetUrl(res.resetUrl);
        } else {
          setIsLoading(false);
          setErrors({ form: res.message || 'Failed to request reset link.' });
        }
      } catch (err) {
        setIsLoading(false);
        setErrors({ form: 'Server connection error. Please try again.' });
      }
    }
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 42%) 1fr',
        backgroundColor: '#F7F7F3',
        overflow: 'hidden'
      }}
      className="auth-layout-container"
    >
      <style>{`
        @media (max-width: 768px) {
          .auth-layout-container {
            grid-template-columns: 1fr !important;
          }
          .desktop-panel {
            display: none !important;
          }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="desktop-panel" style={{ height: '100vh', position: 'sticky', top: 0 }}>
        <KnowledgeGraphPanel />
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 4.5rem',
          height: '100vh',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}>
          <Link
            to="/login"
            style={{
              color: '#666666',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color 0.25s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#111111'}
            onMouseLeave={(e) => e.target.style.color = '#666666'}
          >
            ← Back to Sign In
          </Link>
        </div>

        <div style={{ maxWidth: '420px', width: '100%', margin: 'auto' }}>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#10B981', marginBottom: '1.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L20 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', fontFamily: "'Manrope', sans-serif" }}>
                  Reset Email Sent
                </h3>
                <p style={{ color: '#666666', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  We have sent a password recovery link to your registered email address <strong>{email}</strong>. Please check your inbox to complete the reset process.
                </p>
                <Link 
                  to="/login"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}
                >
                  Return to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-form-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div variants={elementVariants} style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: '#666666', display: 'inline-block', marginBottom: '0.35rem' }}>
                    PASSWORD RECOVERY
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#111111', marginBottom: '0.4rem', fontFamily: "'Manrope', sans-serif" }}>
                    Forgot your
                    <br />
                    password?
                  </h2>
                  <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                    Enter your email address and we'll generate a secure reset link.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <motion.div variants={elementVariants} className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#111111', marginBottom: '0.25rem' }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 0.85rem',
                        fontSize: '0.85rem',
                        color: '#111111',
                        backgroundColor: 'transparent',
                        border: errors.email ? '1px solid #EF4444' : '1px solid rgba(17, 17, 17, 0.15)',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ display: 'block', color: '#EF4444', fontSize: '0.8rem', marginTop: '0.35rem' }}
                        >
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence>
                    {errors.form && (
                      <motion.div style={{ color: '#EF4444', fontSize: '0.8rem', textAlign: 'center' }}>
                        {errors.form}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={elementVariants} style={{ marginTop: '0.25rem' }}>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      onHoverStart={() => setIsBtnHovered(true)}
                      onHoverEnd={() => setIsBtnHovered(false)}
                      whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(17, 17, 17, 0.12)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        height: '38px',
                        backgroundColor: '#111111',
                        color: '#FAFAF8',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isLoading ? <span>Generating...</span> : <span>Send Reset Link</span>}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#8A8A8E', textAlign: 'center' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: '#111111', fontWeight: 600, textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

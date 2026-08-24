import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import KnowledgeGraphPanel from '../../components/Auth/KnowledgeGraphPanel';
import KnowledgeGraph from '../../components/Auth/KnowledgeGraph';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  
  const navigate = useNavigate();

  // Load canvas-rendered PNG icons
  const googlePng = getPngIcon('google');
  const eyePng = getPngIcon('eye');
  const eyeOffPng = getPngIcon('eye-off');
  const arrowRightPng = getPngIcon('arrow-right');
  const logoNodePng = getPngIcon('logo-node');

  const handleValidation = () => {
    let tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Enter a valid email address.';
    }
    
    if (!password) {
      tempErrors.password = 'Please enter your password.';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setIsLoading(true);
      // Simulate API loading
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        // Staggered transition before navigating to home
        setTimeout(() => {
          navigate('/');
        }, 1600);
      }, 1500);
    }
  };

  const pageEntranceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
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
      {/* Dynamic responsive CSS overrides handled in CSS/style blocks */}
      <style>{`
        @media (max-width: 992px) {
          .auth-layout-container {
            grid-template-columns: 35% 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .auth-layout-container {
            grid-template-columns: 1fr !important;
            height: auto !important;
            overflow: auto !important;
          }
          .desktop-panel {
            display: none !important;
          }
          .mobile-header {
            display: block !important;
          }
          .right-form-panel {
            padding: 2rem 1.5rem !important;
            min-height: auto !important;
            height: auto !important;
          }
        }
      `}</style>

      {/* LEFT PANEL - Sticky Visual Panel for Desktop/Tablet */}
      <div className="desktop-panel" style={{ height: '100vh', position: 'sticky', top: 0 }}>
        <KnowledgeGraphPanel />
      </div>

      {/* RIGHT PANEL - Warm editorial Form Panel */}
      <div
        className="right-form-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 4.5rem',
          height: '100vh',
          position: 'relative'
        }}
      >
        {/* Top Header Row with Go Back */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
            fontSize: '0.85rem'
          }}
        >
          <Link
            to="/"
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
            ← Back to Home
          </Link>
        </div>
        {/* Center Section: Success view or Login view */}
        <div style={{ maxWidth: '420px', width: '100%', margin: 'auto' }}>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0070F3', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(0, 112, 243, 0.2)' }}>
                  <img src={arrowRightPng} alt="success" style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', fontFamily: "'Manrope', sans-serif" }}>
                  Access Granted
                </h3>
                <p style={{ color: '#666666', fontSize: '0.95rem' }}>
                  Opening your personal knowledge space...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login-form-screen"
                variants={pageEntranceVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Mobile top branding and compact graph */}
                <div className="mobile-header" style={{ display: 'none', marginBottom: '2.5rem', textAlign: 'center' }}>
                  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#111111', marginBottom: '1.5rem' }}>
                    {logoNodePng && <img src={logoNodePng} alt="Logo" style={{ width: 24, height: 24 }} />}
                    <span>KnowledgeGraph AI</span>
                  </Link>
                  <div style={{ height: '140px', background: 'linear-gradient(145deg, #0B0D10 0%, #111827 100%)', borderRadius: '8px', overflow: 'hidden', padding: '0.5rem 1rem', marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', fontSize: '0.65rem', color: '#06B6D4', fontWeight: 600, letterSpacing: '0.1em' }}>
                      PERSONAL KNOWLEDGE GRAPH
                    </div>
                    <KnowledgeGraph />
                  </div>
                </div>

                {/* Heading */}
                <motion.div variants={elementVariants} style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: '#666666', display: 'inline-block', marginBottom: '0.35rem' }}>
                    WELCOME BACK
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#111111', lineHeight: '1.25', marginBottom: '0.4rem', fontFamily: "'Manrope', sans-serif" }}>
                    Continue where
                    <br />
                    you left off.
                  </h2>
                  <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                    Sign in to access your personal knowledge space.
                  </p>
                </motion.div>

                {/* Form inputs */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Email */}
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
                        outline: 'none',
                        transition: 'border-color 0.25s, box-shadow 0.25s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4F46E5';
                        e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.06)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email ? '#EF4444' : 'rgba(17, 17, 17, 0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ display: 'block', color: '#EF4444', fontSize: '0.8rem', marginTop: '0.35rem' }}
                        >
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={elementVariants} className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#111111', marginBottom: '0.25rem' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 2.5rem 0 0.85rem',
                          fontSize: '0.85rem',
                          color: '#111111',
                          backgroundColor: 'transparent',
                          border: errors.password ? '1px solid #EF4444' : '1px solid rgba(17, 17, 17, 0.15)',
                          borderRadius: '4px',
                          outline: 'none',
                          transition: 'border-color 0.25s, box-shadow 0.25s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#4F46E5';
                          e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.06)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.password ? '#EF4444' : 'rgba(17, 17, 17, 0.15)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {/* Show/Hide button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          opacity: 0.6,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                      >
                        {(showPassword ? eyeOffPng : eyePng) && (
                          <img
                            src={showPassword ? eyeOffPng : eyePng}
                            alt="Toggle Password Visibility"
                            style={{ width: '18px', height: '18px' }}
                          />
                        )}
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ display: 'block', color: '#EF4444', fontSize: '0.8rem', marginTop: '0.35rem' }}
                        >
                          {errors.password}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Remember me & Forgot Password */}
                  <motion.div
                    variants={elementVariants}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      marginTop: '0.2rem'
                    }}
                  >
                    {/* Custom Checkbox */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        style={{ display: 'none' }}
                      />
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: rememberMe ? '1px solid #111111' : '1px solid rgba(17, 17, 17, 0.3)',
                          borderRadius: '3px',
                          backgroundColor: rememberMe ? '#111111' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s, border-color 0.2s'
                        }}
                      >
                        {rememberMe && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ color: '#666666' }}>Remember me</span>
                    </label>

                    <a
                      href="#"
                      style={{
                        color: '#666666',
                        fontWeight: 400,
                        borderBottom: '1px dashed rgba(17, 17, 17, 0.2)',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#111111'}
                      onMouseLeave={(e) => e.target.style.color = '#666666'}
                    >
                      Forgot password?
                    </a>
                  </motion.div>

                  {/* Submit Button */}
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
                        opacity: isLoading ? 0.75 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span>Signing in...</span>
                          {/* Mini loading spinner */}
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              border: '2px solid rgba(250, 250, 248, 0.3)',
                              borderTop: '2px solid #FAFAF8',
                              borderRadius: '50%',
                              animation: 'spinner-spin 0.6s linear infinite'
                            }}
                          />
                          <style>{`
                            @keyframes spinner-spin {
                              0% { transform: rotate(0deg); }
                              100% { transform: rotate(360deg); }
                            }
                          `}</style>
                        </>
                      ) : (
                        <>
                          <span>Sign in</span>
                          {arrowRightPng && (
                            <motion.img
                              src={arrowRightPng}
                              alt="Arrow"
                              style={{ width: '12px', height: '12px' }}
                              animate={{ x: isBtnHovered ? 4 : 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                 {/* Divider */}
                <motion.div
                  variants={elementVariants}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '0.85rem 0'
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(17, 17, 17, 0.08)' }} />
                  <span style={{ fontSize: '0.7rem', color: '#8E8E8A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    or continue with
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(17, 17, 17, 0.08)' }} />
                </motion.div>

                {/* Google Sign In Button */}
                <motion.div variants={elementVariants}>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setIsSuccess(true);
                        setTimeout(() => navigate('/'), 1600);
                      }, 1000);
                    }}
                    whileHover={{ backgroundColor: 'rgba(17, 17, 17, 0.03)' }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      width: '100%',
                      height: '38px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(17, 17, 17, 0.15)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#111111'
                    }}
                  >
                    {googlePng && (
                      <img src={googlePng} alt="Google" style={{ width: '16px', height: '16px' }} />
                    )}
                    <span>Continue with Google</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: create account */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#666666',
            marginTop: '1.25rem'
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#111111',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#111111'}
            onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
          >
            Create your knowledge space →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

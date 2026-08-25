import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const logoPng = getPngIcon('logo');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkLogin);
    const interval = setInterval(checkLogin, 1000);
    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: isScrolled ? '0.75rem' : '1.5rem',
        left: isScrolled ? '1.5rem' : '2.5rem',
        right: isScrolled ? '1.5rem' : '2.5rem',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="nav-inset-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isScrolled ? '0.65rem 1.5rem' : '0.85rem 2rem',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {logoPng && <img src={logoPng} alt="Logo" style={{ width: 26, height: 26, filter: 'drop-shadow(0 0 8px var(--accent-indigo))' }} />}
          <span style={{ letterSpacing: '-0.02em' }}>
            KnowledgeGraph <span style={{ color: 'var(--accent-indigo)' }}>AI</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }} className="desktop-menu">
          {['features', 'how-it-works', 'ai-capabilities'].map((sec) => (
            <motion.button
              key={sec}
              onClick={() => scrollToSection(sec)}
              whileHover={{ color: 'var(--accent-indigo)', y: -1 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 650,
                transition: 'color 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {sec === 'features' ? 'Product' : sec === 'how-it-works' ? 'How it Works' : 'AI Insights'}
            </motion.button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-actions">
          {isLoggedIn ? (
            <motion.button
              onClick={handleLogout}
              whileHover={{ color: 'var(--accent-indigo)' }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 650,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Logout
            </motion.button>
          ) : (
            <>
              <motion.div whileHover={{ color: 'var(--accent-indigo)' }}>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Login</Link>
              </motion.div>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.35rem', fontSize: '0.8rem' }}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '22px',
            height: '15px',
            background: 'none',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 10px 30px rgba(0,243,255,0.15)',
            }}
          >
            <button onClick={() => scrollToSection('features')} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>Product</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>How it Works</button>
            <button onClick={() => scrollToSection('ai-capabilities')} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>AI Insights</button>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
            {isLoggedIn ? (
              <button onClick={handleLogout} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-toggle {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-menu, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Navbar;

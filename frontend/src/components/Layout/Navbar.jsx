import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';

// Fetch icons statically outside component to prevent render latency
const logoPng = getPngIcon('logo');
const sunPng = getPngIcon('sun');
const moonPng = getPngIcon('moon');

const Navbar = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.35rem' }} className="desktop-menu">
          {[
            { id: 'features', label: 'Features' },
            { id: 'how-it-works', label: 'How it Works' },
            { id: 'about-us', label: 'About Us' },
            { id: 'faq', label: 'FAQ' },
            { id: 'contact-us', label: 'Contact Us' }
          ].map((sec) => (
            <motion.button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              whileHover={{ color: 'var(--accent-indigo)', y: -1 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 650,
                transition: 'color 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {sec.label}
            </motion.button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.72rem' }}>
                Workspace
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ color: 'var(--accent-indigo)' }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 650,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ color: 'var(--accent-indigo)' }}>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Login</Link>
              </motion.div>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.72rem' }}>Get Started</Link>
            </>
          )}

          {/* Theme Changer Toggle */}
          {toggleTheme && (
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                marginLeft: '0.2rem'
              }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={theme}
                  src={theme === 'light' ? moonPng : sunPng}
                  alt={theme === 'light' ? 'Moon' : 'Sun'}
                  initial={{ y: 8, opacity: 0, rotate: -40 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -8, opacity: 0, rotate: 40 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ width: '12px', height: '12px', display: 'block' }}
                />
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        {/* Mobile Actions Panel (includes toggle icon) */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.8rem' }} className="mobile-actions-panel">
          {toggleTheme && (
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer'
              }}
            >
              <img
                src={theme === 'light' ? moonPng : sunPng}
                alt="Toggle Theme"
                style={{ width: '16px', height: '16px' }}
              />
            </motion.button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '22px',
              height: '15px',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
          </button>
        </div>
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
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            }}
          >
            <button onClick={() => scrollToSection('features')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>How it Works</button>
            <button onClick={() => scrollToSection('about-us')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>About Us</button>
            <button onClick={() => scrollToSection('faq')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>FAQ</button>
            <button onClick={() => scrollToSection('contact-us')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>Contact Us</button>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Workspace</Link>
                <button onClick={handleLogout} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-actions-panel {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-menu, .desktop-actions {
            display: none !important;
          }
          .mobile-actions-panel {
            display: flex !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Navbar;

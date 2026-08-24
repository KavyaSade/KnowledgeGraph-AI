import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logoPng = getPngIcon('logo');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          {logoPng && <img src={logoPng} alt="Logo" style={{ width: 24, height: 24 }} />}
          <span>KnowledgeGraph AI</span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-menu">
          <button onClick={() => scrollToSection('features')} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Product</button>
          <button onClick={() => scrollToSection('how-it-works')} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>How it Works</button>
          <button onClick={() => scrollToSection('ai-capabilities')} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>AI Insights</button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-actions">
          <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.8rem' }}>Get Started</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '20px',
            height: '14px',
            background: 'none',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
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
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            }}
          >
            <button onClick={() => scrollToSection('features')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>Product</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>How it Works</button>
            <button onClick={() => scrollToSection('ai-capabilities')} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>AI Insights</button>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>Login</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Get Started</Link>
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

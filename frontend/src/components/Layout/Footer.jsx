import React from 'react';
import { Link } from 'react-router-dom';
import { getPngIcon } from '../../utils/pngIcons';

const Footer = () => {
  const logoPng = getPngIcon('logo');

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '5rem 0 3rem 0', marginTop: 'auto' }}>
      <div className="container">
        
        {/* Top Minimal Content Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '4rem' }} className="footer-top-row">
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '300px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              {logoPng && <img src={logoPng} alt="Logo" style={{ width: 24, height: 24 }} />}
              <span>KnowledgeGraph AI</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Personal intelligence, connected. Build a visual database of your digital mind.
            </p>
          </div>

          {/* Links Columns */}
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="footer-links-wrap">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Navigation</span>
              <Link to="/#features" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product</Link>
              <Link to="/#how-it-works" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>How It Works</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Resources</span>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Docs</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>GitHub</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Account</span>
              <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Login</Link>
              <Link to="/register" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get Started</Link>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '2rem' }} />

        {/* Copyright Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} KnowledgeGraph AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top-row {
            flex-direction: column !important;
            gap: 2.5rem !important;
          }
          .footer-links-wrap {
            gap: 2.5rem !important;
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { getPngIcon } from '../../utils/pngIcons';

const Footer = () => {
  const logoPng = getPngIcon('logo');

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '3rem 0 2rem 0', marginTop: 'auto', position: 'relative' }}>
      
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '100px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.03) 0%, transparent 80%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
      
      <div className="container">
        
        {/* Top Minimal Content Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '2.5rem' }} className="footer-top-row">
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {logoPng && <img src={logoPng} alt="Logo" style={{ width: 24, height: 24, filter: 'drop-shadow(0 0 8px var(--accent-indigo))' }} />}
              <span>KnowledgeGraph <span style={{ color: 'var(--accent-indigo)' }}>AI</span></span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              Personal intelligence, connected. Build a visual database of your digital mind.
            </p>
          </div>
 
           {/* Links Columns */}
           <div style={{ display: 'flex', gap: '4.5rem', flexWrap: 'wrap' }} className="footer-links-wrap">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Navigation</span>
               <Link to="/#features" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Product</Link>
               <Link to="/#how-it-works" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>How It Works</Link>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Resources</span>
               <a href="#" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Docs</a>
               <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>GitHub</a>
             </div>
 
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Account</span>
               <Link to="/login" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Login</Link>
               <Link to="/register" className="foot-link" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Get Started</Link>
             </div>
           </div>
 
         </div>
 
         {/* Divider */}
         <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '1.75rem' }} />
 
         {/* Copyright Area */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
           <p>© {new Date().getFullYear()} KnowledgeGraph AI. All rights reserved.</p>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
             <a href="#" className="foot-link" style={{ transition: 'color 0.2s' }}>Privacy</a>
             <a href="#" className="foot-link" style={{ transition: 'color 0.2s' }}>Terms</a>
           </div>
         </div>
 
       </div>
 
       <style>{`
         .foot-link:hover {
           color: var(--accent-indigo) !important;
         }
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

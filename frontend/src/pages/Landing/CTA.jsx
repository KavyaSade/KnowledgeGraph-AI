import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="light-section" style={{ padding: '9rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Central glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.04) 0%, transparent 80%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '200px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 80%)', filter: 'blur(45px)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Background Animated SVG Connections */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15, zIndex: 0 }}>
        <line x1="10%" y1="20%" x2="30%" y2="50%" stroke="rgba(79, 70, 229, 0.12)" strokeWidth="1.5" />
        <line x1="30%" y1="50%" x2="20%" y2="80%" stroke="rgba(79, 70, 229, 0.12)" strokeWidth="1.5" />
        <line x1="90%" y1="10%" x2="70%" y2="40%" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="1.5" />
        <line x1="70%" y1="40%" x2="80%" y2="70%" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="1.5" />
        
        <circle cx="10%" cy="20%" r="5" fill="var(--accent-indigo)" />
        <circle cx="30%" cy="50%" r="6" fill="var(--accent-indigo)" />
        <circle cx="20%" cy="80%" r="4" fill="var(--accent-indigo)" />
        <circle cx="90%" cy="10%" r="4" fill="var(--accent-violet)" />
        <circle cx="70%" cy="40%" r="6" fill="var(--accent-violet)" />
        <circle cx="80%" cy="70%" r="5" fill="var(--accent-violet)" />
      </svg>

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2.5rem' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <span className="text-label" style={{ color: 'var(--accent-indigo)' }}>Get Started</span>
          
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, maxWidth: '780px', letterSpacing: '-0.02em' }}>
            You already have <br />
            the knowledge. <span className="accent-highlight">Now connect it.</span>
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', lineHeight: 1.65 }}>
            Initialize your personal intelligence dashboard in less than a minute. Free to brainstorm, build, and organize.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.95rem 2.75rem', fontSize: '0.95rem', display: 'flex', gap: '0.6rem', fontWeight: 800 }}>
            Build My Knowledge Graph <span>→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CTA;

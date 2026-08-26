import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import KnowledgeGraph from './KnowledgeGraph';

// Fetch logo icon
const logoNodePng = getPngIcon('logo-node');

const KnowledgeGraphPanel = () => {

  // Entrance variants for staggered fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #0B0D10 0%, #111827 55%, #0B1F33 100%)',
        position: 'relative',
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 3.5rem',
        overflow: 'hidden',
        color: '#FAFAF8'
      }}
    >
      {/* Subtle blue/indigo atmospheric lighting */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '0%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.03) 60%, transparent 100%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Brand Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#FFFFFF'
          }}
        >
          {logoNodePng && <img src={logoNodePng} alt="Logo" style={{ width: 28, height: 28 }} />}
          <span>KnowledgeGraph AI</span>
        </Link>
      </motion.div>

      {/* Main Content & Graph */}
      <div style={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '2rem', maxWidth: '440px' }}
        >
          <motion.span
            variants={itemVariants}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#06B6D4',
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}
          >
            PERSONAL KNOWLEDGE INTELLIGENCE
          </motion.span>
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              fontFamily: "'Manrope', sans-serif",
              color: '#FFFFFF'
            }}
          >
            Everything you know.
            <br />
            <span style={{ background: 'linear-gradient(to right, #FFFFFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Connected.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#94A3B8',
              fontWeight: 400
            }}
          >
            Your notes, ideas, documents and resources become a connected knowledge system.
          </motion.p>
        </motion.div>

        {/* Animated Knowledge Graph */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <KnowledgeGraph />

          {/* Floating Intelligence Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '-5%',
              width: '210px',
              padding: '1.25rem',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              borderRadius: '8px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
              zIndex: 3
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', color: '#06B6D4', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              KNOWLEDGE INSIGHT
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#F1F5F9', marginBottom: '0.75rem' }}>
              12 connected items
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0070F3' }}></span>
                <span>Research</span>
              </div>
              <div style={{ paddingLeft: '9px', fontSize: '0.7rem', color: '#64748B' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4F46E5' }}></span>
                <span style={{ color: '#E2E8F0' }}>Project Alpha</span>
              </div>
              <div style={{ paddingLeft: '9px', fontSize: '0.7rem', color: '#64748B' }}>↓</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#06B6D4' }}></span>
                <span>Battery Storage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Branding Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ fontSize: '0.75rem', color: '#94A3B8', position: 'relative', zIndex: 1 }}
      >
        KnowledgeGraph AI © {new Date().getFullYear()} — Secure personal workspace
      </motion.div>
    </div>
  );
};

export default KnowledgeGraphPanel;

import React from 'react';
import { motion } from 'framer-motion';

const DarkGraphInsights = () => {
  // Defining simple node positions for the central dark graph
  const nodes = [
    { id: 'c1', x: 200, y: 150, r: 8, color: 'var(--accent-cyan)' },
    { id: 'c2', x: 120, y: 80, r: 5, color: '#ffffff' },
    { id: 'c3', x: 280, y: 80, r: 6, color: 'var(--accent-violet)' },
    { id: 'c4', x: 100, y: 220, r: 5, color: 'var(--accent-cyan)' },
    { id: 'c5', x: 300, y: 220, r: 7, color: '#ffffff' },
    { id: 'c6', x: 200, y: 270, r: 6, color: 'var(--accent-violet)' }
  ];

  const links = [
    { s: 'c1', t: 'c2' }, { s: 'c1', t: 'c3' },
    { s: 'c1', t: 'c4' }, { s: 'c1', t: 'c5' },
    { s: 'c1', t: 'c6' }, { s: 'c2', t: 'c3' },
    { s: 'c4', t: 'c6' }, { s: 'c5', t: 'c6' }
  ];

  const getCoords = (id) => nodes.find(n => n.id === id);

  return (
    <section className="dark-section" style={{ padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Pattern Discovery</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-dark-primary)', marginBottom: '1.25rem' }}>
            See the connections <br />
            you couldn’t see before.
          </h2>
          <p style={{ color: 'var(--text-dark-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our background neural parsing maps your items into a relational semantic graph. Watch suggestions turn into active nodes automatically.
          </p>
        </div>

        {/* Central Graph & Surrounding Badges Container */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Central SVG Network Map */}
          <div style={{ position: 'relative', width: '380px', height: '320px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 320" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="darkGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Links */}
              {links.map((link, idx) => {
                const s = getCoords(link.s);
                const t = getCoords(link.t);
                return (
                  <g key={idx}>
                    <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                    {/* Glowing flow lines */}
                    <motion.line
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke={s.color}
                      strokeWidth="1.5"
                      opacity="0.5"
                      strokeDasharray="5, 15"
                      animate={{ strokeDashoffset: [-30, 30] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={node.r} fill="var(--bg-dark-primary)" stroke={node.color} strokeWidth="2" style={{ filter: 'url(#darkGlow)' }} />
                  <circle cx={node.x} cy={node.y} r={2} fill={node.color} />
                </g>
              ))}
            </svg>
          </div>

          {/* Surrounding Telemetry Badge Cards */}
          
          {/* Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(28, 28, 28, 0.85)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '6px',
              maxWidth: '220px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            className="insight-badge"
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>Note Cluster</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>12 related notes</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)', marginTop: '0.25rem' }}>Grouped automatically under 'Renewable Battery Tech'.</div>
          </motion.div>

          {/* Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(28, 28, 28, 0.85)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '6px',
              maxWidth: '220px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            className="insight-badge"
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-violet)', marginBottom: '0.2rem' }}>Entity Links</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>4 connected projects</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)', marginTop: '0.25rem' }}>Sharing collaborators and files in Project Alpha boards.</div>
          </motion.div>

          {/* Bottom Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(28, 28, 28, 0.85)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '6px',
              maxWidth: '220px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            className="insight-badge"
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Semantic mapping</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>7 recurring topics</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)', marginTop: '0.25rem' }}>Identified across bookmarks and idea drafts.</div>
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(28, 28, 28, 0.85)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '6px',
              maxWidth: '220px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            className="insight-badge"
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>AI Suggestion</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>2 new relationships</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)', marginTop: '0.25rem' }}>Discovered between Energy Draft and Proposal B notes.</div>
          </motion.div>

        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .insight-badge {
            position: static !important;
            margin: 1rem 0;
            max-width: 100% !important;
            width: 100%;
          }
          /* Stack layout on mobile */
          div[style*="maxWidth: 800px"] {
            height: auto !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
};

export default DarkGraphInsights;

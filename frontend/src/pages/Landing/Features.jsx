import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  return (
    <section id="features" className="light-section" style={{ padding: '8rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Capabilities</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Powering knowledge <span className="accent-highlight">intelligence.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Five custom-tailored vectors that capture, analyze, connect, search, and map your digital mind.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="features-editorial-grid">
          
          {/* Row 1: AI Entity Extraction (2fr) & Smart Search (1.2fr) */}
          <div className="grid-row-1" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Card 1: AI Entity Extraction */}
            <motion.div
              whileHover={{ y: -4 }}
              className="minimal-card"
              style={{ display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: '2rem' }}
            >
              <div>
                <span className="text-label" style={{ color: 'var(--accent-indigo)' }}>Engine 01</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111', margin: '0.5rem 0' }}>AI Entity Extraction</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Scans notes and documents instantly to pull names, projects, and custom concepts, tagging them to your library.
                </p>
              </div>
              
              {/* Interactive Visual: Entity Extraction simulation */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>"Drop file draft_final_rev.pdf"</span>
                <span style={{ color: 'var(--text-muted)' }}>➔</span>
                <span style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-indigo)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Project Alpha</span>
                <span style={{ backgroundColor: 'rgba(0, 112, 243, 0.1)', color: 'var(--accent-blue)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Emily Lin</span>
              </div>
            </motion.div>

            {/* Card 2: Smart Search */}
            <motion.div
              whileHover={{ y: -4 }}
              className="minimal-card"
              style={{ display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: '2rem' }}
            >
              <div>
                <span className="text-label" style={{ color: 'var(--accent-blue)' }}>Engine 02</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111', margin: '0.5rem 0' }}>Smart Search</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Search queries evaluate semantic paths so you discover relevant files and links instantly.
                </p>
              </div>

              {/* Interactive Visual: Small search bar layout */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}>⌕</span>
                <span style={{ color: 'var(--text-secondary)' }}>How is Jane related to...</span>
              </div>
            </motion.div>

          </div>

          {/* Row 2: AI Insights (1.2fr) & Knowledge Graph (1.8fr) */}
          <div className="grid-row-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Card 3: AI Insights */}
            <motion.div
              whileHover={{ y: -4 }}
              className="minimal-card"
              style={{ display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: '2rem' }}
            >
              <div>
                <span className="text-label" style={{ color: 'var(--accent-violet)' }}>Engine 03</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111', margin: '0.5rem 0' }}>AI Insights</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Calculates contextual overlaps in the background to serve suggested connection logs.
                </p>
              </div>

              {/* Interactive Visual: AI Connection suggestion card */}
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>Link Suggestion</div>
                <div style={{ color: '#111', fontWeight: 600 }}>Note A ➔ Proposal B</div>
              </div>
            </motion.div>

            {/* Card 4: Knowledge Graph */}
            <motion.div
              whileHover={{ y: -4 }}
              className="minimal-card"
              style={{ display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: '2rem' }}
            >
              <div>
                <span className="text-label" style={{ color: 'var(--accent-indigo)' }}>Engine 04</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111', margin: '0.5rem 0' }}>Knowledge Graph</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Visualizes your notes database as a dynamic, responsive mind map that updates in real-time.
                </p>
              </div>

              {/* Interactive Visual: Miniature SVG cluster */}
              <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <svg width="120" height="60" style={{ overflow: 'visible' }}>
                  <line x1="20" y1="30" x2="60" y2="15" stroke="rgba(17,17,17,0.06)" strokeWidth="1.5" />
                  <line x1="60" y1="15" x2="100" y2="30" stroke="rgba(17,17,17,0.06)" strokeWidth="1.5" />
                  <line x1="60" y1="15" x2="60" y2="45" stroke="rgba(17,17,17,0.06)" strokeWidth="1.5" />
                  
                  <circle cx="20" cy="30" r="5" fill="var(--bg-secondary)" stroke="var(--accent-indigo)" strokeWidth="1.5" />
                  <circle cx="100" cy="30" r="5" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
                  <circle cx="60" cy="45" r="4" fill="var(--bg-secondary)" stroke="#111" strokeWidth="1.5" />
                  <circle cx="60" cy="15" r="6" fill="var(--bg-secondary)" stroke="var(--accent-indigo)" strokeWidth="2" />
                </svg>
              </div>
            </motion.div>

          </div>

          {/* Row 3: Smart Organization (1.0fr, Full Width) */}
          <div className="grid-row-3">
            
            {/* Card 5: Smart Organization */}
            <motion.div
              whileHover={{ y: -4 }}
              className="minimal-card"
              style={{ display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: '2rem' }}
            >
              <div>
                <span className="text-label" style={{ color: 'var(--accent-indigo)' }}>Engine 05</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111', margin: '0.5rem 0' }}>Smart Organization</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Replaces rigid directories with structured topic mapping, grouping inputs logically without folders.
                </p>
              </div>

              {/* Interactive Visual: Bubble Tag Cloud */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.50rem' }}>
                {['Batteries', 'YOLOv8', 'IEEE Papers', 'Jane Smith', 'Carbon MVP', 'Advisory Logs'].map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-secondary)',
                      color: idx % 2 === 0 ? 'var(--accent-indigo)' : 'var(--text-primary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-row-1, .grid-row-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;

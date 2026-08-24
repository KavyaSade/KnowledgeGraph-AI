import React from 'react';
import { motion } from 'framer-motion';

const InsightsShowcase = () => {
  const suggestedConnections = [
    {
      source: 'Paper: Attention Is All You Need',
      target: 'Project: Chatbot Assistant MVP',
      reason: 'Both share the term "Transformer Architecture"',
      confidence: '94%'
    },
    {
      source: 'Meeting Note: Q3 Product Planning',
      target: 'Collaborator: Dave Harrison',
      reason: 'Dave is tagged in related task boards',
      confidence: '88%'
    }
  ];

  const clusters = [
    { name: 'Machine Learning', count: 12, color: 'var(--accent-primary)' },
    { name: 'UI/UX Design Systems', count: 8, color: 'var(--accent-secondary)' },
    { name: 'Personal Productivity', count: 15, color: '#ffffff' },
    { name: 'Finance & Investments', count: 5, color: 'var(--accent-primary)' }
  ];

  return (
    <section style={{ padding: '8rem 0', position: 'relative' }}>
      <div className="container insights-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left Side: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ padding: '0.4rem 1rem', alignSelf: 'flex-start', background: 'rgba(124, 77, 255, 0.05)', border: '1px solid rgba(124, 77, 255, 0.2)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>
            Predictive AI Insights
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Connections Discovered <br />For You <span className="gradient-text-purple">While You Sleep.</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            The AI backend runs constant background indexing. It analyzes semantic weights, notices topic overlaps, and serves connection cards directly on your dashboard. Discover relationships you forgot existed.
          </p>
        </motion.div>

        {/* Right Side: Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {/* Suggested Connections Panel */}
          <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Suggested Relationships</span>
              <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 500 }}>AI Agent Active</span>
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suggestedConnections.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                      {item.source} <span style={{ color: 'var(--text-muted)' }}>➔</span> {item.target}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {item.confidence} match
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Reason: {item.reason}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'var(--accent-primary)', color: '#000', borderRadius: '4px', fontWeight: 600 }}>Approve Link</button>
                    <button style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>Ignore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Clusters Panel */}
          <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Automated Topic Clusters</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {clusters.map((cluster, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `1px solid ${cluster.color}`,
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    color: '#fff',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    gap: '0.5rem',
                    boxShadow: `0 0 10px ${cluster.color}08`
                  }}
                >
                  <span>{cluster.name}</span>
                  <span style={{ color: cluster.color, fontWeight: 700 }}>({cluster.count})</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .insights-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default InsightsShowcase;

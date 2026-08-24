import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIUnderstanding = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 5;

  useEffect(() => {
    if (step >= totalSteps) return;

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [step]);

  const handleRestart = () => {
    setStep(0);
  };

  const stepsList = [
    'Understanding query...',
    'Extracting entities...',
    'Finding relationships...',
    'Mapping knowledge...',
  ];

  const treeNodes = [
    { label: 'Solar Research', type: 'document', color: 'var(--accent-indigo)' },
    { label: 'Project Alpha', type: 'project', color: 'var(--accent-blue)' },
    { label: 'Battery Storage', type: 'topic', color: 'var(--accent-cyan)' },
    { label: 'Research Notes', type: 'note', color: '#111111' },
  ];

  return (
    <section className="light-section" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
      <div className="container understanding-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <span className="text-label">Entity Extraction</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            Automated semantic <br />
            entity parsing.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Type natural commands, drop PDFs, or add bookmarks. Our language pipeline extracts keywords, identifies subject fields, and maps the results straight to your graph database in real-time.
          </p>
        </motion.div>

        {/* Right Processing Interface Console */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="minimal-card"
          style={{
            minHeight: '380px',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2.5rem',
          }}
        >
          {/* Console Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AI Processing Pipeline</div>
          </div>

          {/* User Input Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Input Command</span>
            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 500, color: '#111' }}>
              "Find everything related to my renewable energy research and Project Alpha."
            </div>
          </div>

          {/* Processing Loading steps */}
          <div style={{ minHeight: '160px', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
            
            {/* Loading sequence indicators */}
            {step > 0 && step < 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stepsList.slice(0, step).map((stepText, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '0.85rem', fontWeight: 600, color: idx === step - 1 ? 'var(--accent-indigo)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {idx === step - 1 ? <span className="console-spinner" /> : '✓'}
                    {stepText}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Finished State Tree Graph Representation */}
            <AnimatePresence>
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase' }}>✓ Graph Mapping Finalized</span>
                    <button onClick={handleRestart} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Replay simulation</button>
                  </div>

                  {/* Visual Node Tree */}
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {/* Root Node */}
                    <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--accent-indigo)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-indigo)', backgroundColor: 'var(--bg-primary)' }}>
                      Renewable Energy
                    </div>
                    {/* Connection Line */}
                    <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--border-color)' }} />
                    
                    {/* Children column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {treeNodes.map((node, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          style={{
                            padding: '0.4rem 0.85rem',
                            border: `1px solid var(--border-color)`,
                            borderLeft: `3px solid ${node.color}`,
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-surface)'
                          }}
                        >
                          {node.label}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style>{`
        .understanding-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .understanding-grid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes rotateSpinner {
          to { transform: rotate(360deg); }
        }
        .console-spinner {
          width: 10px;
          height: 10px;
          border: 1.5px solid var(--border-color);
          border-top-color: var(--accent-indigo);
          border-radius: 50%;
          display: inline-block;
          animation: rotateSpinner 0.8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AIUnderstanding;

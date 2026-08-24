import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NLSearch = () => {
  const [queryText, setQueryText] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const targetQuery = 'How is Project Alpha related to battery storage?';

  useEffect(() => {
    let index = 0;
    let typingTimer;

    const startTyping = () => {
      typingTimer = setInterval(() => {
        setQueryText(targetQuery.slice(0, index + 1));
        index++;
        if (index >= targetQuery.length) {
          clearInterval(typingTimer);
          setTimeout(() => {
            setShowAnswer(true);
          }, 600);
        }
      }, 50);
    };

    // Auto-trigger when in view
    const delay = setTimeout(startTyping, 1200);

    return () => {
      clearTimeout(delay);
      clearInterval(typingTimer);
    };
  }, []);

  const handleReplay = () => {
    setQueryText('');
    setShowAnswer(false);
    let index = 0;
    const timer = setInterval(() => {
      setQueryText(targetQuery.slice(0, index + 1));
      index++;
      if (index >= targetQuery.length) {
        clearInterval(timer);
        setTimeout(() => setShowAnswer(true), 600);
      }
    }, 50);
  };

  const pathSteps = [
    { name: 'Project Alpha', color: 'var(--accent-cyan)' },
    { name: 'Battery Storage', color: 'var(--accent-violet)' },
    { name: 'Energy Research', color: 'var(--accent-blue)' },
    { name: 'Research Note', color: '#FAFAF8' }
  ];

  return (
    <section className="dark-section" style={{ padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Conversational Search</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-dark-primary)', marginBottom: '1.25rem' }}>
            Ask your knowledge base anything.
          </h2>
          <p style={{ color: 'var(--text-dark-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Run complex queries across your papers, tasks, and bookmarks. The AI retrieves matching links and renders paths of connected insights.
          </p>
        </div>

        {/* Search Console and Answers */}
        <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Custom Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.85rem 1.25rem',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '8px',
              position: 'relative',
              fontSize: '1rem',
              color: '#fff',
            }}
          >
            <span style={{ marginRight: '0.75rem', color: 'var(--text-dark-secondary)' }}>⌕</span>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {queryText}
              <span className="cursor-blink-dark" style={{ width: '2px', height: '18px', backgroundColor: 'var(--accent-cyan)', marginLeft: '2px' }} />
            </div>
          </div>

          {/* Answer Panel */}
          <div style={{ minHeight: '160px' }}>
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    padding: '2rem',
                    backgroundColor: 'rgba(28, 28, 28, 0.5)',
                    border: '1px solid var(--border-dark-color)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>4 connections found</span>
                    <button onClick={handleReplay} style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)', fontWeight: 600 }}>Replay Search</button>
                  </div>

                  {/* Horizontal Connection Pathway */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }} className="pathway-row">
                    {pathSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.2 }}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid var(--border-dark-color)',
                            borderLeft: `3px solid ${step.color}`,
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#fff',
                          }}
                        >
                          {step.name}
                        </motion.div>
                        
                        {idx < pathSteps.length - 1 && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: idx * 0.2 + 0.1 }}
                            style={{ padding: '0 0.25rem', color: 'var(--text-dark-secondary)', fontWeight: 'bold' }}
                          >
                            ➔
                          </motion.span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes blinkCursorDark {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .cursor-blink-dark {
          animation: blinkCursorDark 1s step-end infinite;
        }
        @media (max-width: 600px) {
          .pathway-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .pathway-row span {
            transform: rotate(90deg) !important;
            align-self: center !important;
            margin: 0.25rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default NLSearch;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchShowcase = () => {
  const [typedText, setTypedText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const targetPrompt = 'What projects are related to machine learning?';

  useEffect(() => {
    let index = 0;
    let typingTimer;

    const startTyping = () => {
      typingTimer = setInterval(() => {
        setTypedText(targetPrompt.slice(0, index + 1));
        index++;
        if (index >= targetPrompt.length) {
          clearInterval(typingTimer);
          // Show results after typing is complete
          setTimeout(() => {
            setShowResults(true);
          }, 600);
        }
      }, 60);
    };

    // Delay start of typing effect slightly
    const startDelay = setTimeout(startTyping, 1500);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingTimer);
    };
  }, []);

  const resetSearch = () => {
    setTypedText('');
    setShowResults(false);
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(targetPrompt.slice(0, index + 1));
      index++;
      if (index >= targetPrompt.length) {
        clearInterval(timer);
        setTimeout(() => setShowResults(true), 600);
      }
    }, 60);
  };

  const results = [
    { title: 'Project: Neural Predictive Model', type: 'Project', match: '98%', desc: 'Current workspace predictive model in Python.', tags: ['ML', 'Neural Net'] },
    { title: 'Note: Backpropagation Optimizer', type: 'Note', match: '89%', desc: 'Mathematical formulations for loss optimization.', tags: ['Deep Learning', 'Math'] },
    { title: 'Person: Dr. Emily Lin', type: 'Collaborator', match: '85%', desc: 'Machine learning advisory researcher.', tags: ['Research', 'Team'] },
  ];

  return (
    <section style={{ padding: '8rem 0', backgroundColor: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container search-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left Side: Search Console */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-surface)' }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Natural Language Engine</div>
          </div>

          {/* Input Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '1rem', color: 'var(--accent-primary)', fontWeight: 700 }}>➔</span>
            <div
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.25rem',
                fontSize: '0.95rem',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {typedText}
              <span className="cursor-blink" style={{ marginLeft: '2px', width: '2px', height: '16px', backgroundColor: 'var(--accent-primary)', display: 'inline-block' }} />
            </div>
          </div>

          {/* Results Console */}
          <div style={{ minHeight: '220px' }}>
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Semantic matches discovered (3)</div>
                    <button onClick={resetSearch} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Replay Animation</button>
                  </div>

                  {results.map((res, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'var(--accent-glow)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', backgroundColor: 'rgba(69,243,255,0.1)', color: 'var(--accent-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            {res.type}
                          </span>
                          <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{res.title}</h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{res.desc}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>{res.match}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Match relevance</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Copy */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ padding: '0.4rem 1rem', alignSelf: 'flex-start', background: 'rgba(69, 243, 255, 0.05)', border: '1px solid rgba(69, 243, 255, 0.2)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            Conversational Interface
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Search Your Notes <br />Like You’re <span className="gradient-text">Asking a Friend.</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            No more keyword hunting or strict date searches. Type natural questions to search. The AI understands the context of your query and retrieves not only matching files, but the surrounding relationships that add context.
          </p>

          <blockquote style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            "Retrieve projects Jane Smith advised on that involve natural language processing."
          </blockquote>
        </motion.div>
      </div>

      <style>{`
        .search-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
          .search-grid > div:first-child {
            order: 2;
          }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .cursor-blink {
          animation: cursorBlink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};

export default SearchShowcase;

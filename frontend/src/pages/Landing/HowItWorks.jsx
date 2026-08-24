import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Capture',
      desc: 'Add web bookmarks, meeting notes, PDFs, or code blocks from any workspace or browse logs.'
    },
    {
      num: '02',
      title: 'Understand',
      desc: 'The background AI parser extracts subjects, dates, projects, and entities immediately.'
    },
    {
      num: '03',
      title: 'Connect',
      desc: 'Our semantic database uncovers bi-directional tag connections and mapping nodes.'
    },
    {
      num: '04',
      title: 'Discover',
      desc: 'Explore your entire knowledge network via visual graph canvases or natural search queries.'
    }
  ];

  // steps loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Dynamic coordinates depending on the active stage
  const getGraphDataForStep = (stepIdx) => {
    const baseNodes = [
      { id: 'n1', label: 'PDF Draft' },
      { id: 'n2', label: 'Note' },
      { id: 'n3', label: 'Project Alpha' },
      { id: 'n4', label: 'Emily Lin' }
    ];

    if (stepIdx === 0) {
      // Step 1: Capture (Isolated, scattered nodes, no lines)
      return {
        nodes: [
          { ...baseNodes[0], x: 70, y: 70, color: 'var(--text-dark-secondary)' },
          { ...baseNodes[1], x: 310, y: 80, color: 'var(--text-dark-secondary)' },
          { ...baseNodes[2], x: 90, y: 220, color: 'var(--text-dark-secondary)' },
          { ...baseNodes[3], x: 290, y: 230, color: 'var(--text-dark-secondary)' }
        ],
        links: []
      };
    } else if (stepIdx === 1) {
      // Step 2: Understand (Nodes positioned, colors light up representing classification, no links yet)
      return {
        nodes: [
          { ...baseNodes[0], x: 120, y: 90, color: 'var(--accent-indigo)' },
          { ...baseNodes[1], x: 260, y: 90, color: '#ffffff' },
          { ...baseNodes[2], x: 100, y: 210, color: 'var(--accent-blue)' },
          { ...baseNodes[3], x: 280, y: 210, color: 'var(--accent-cyan)' }
        ],
        links: []
      };
    } else {
      // Step 3 & 4: Connect & Discover (Nodes connected, connections glowing)
      return {
        nodes: [
          { ...baseNodes[0], x: 120, y: 90, color: 'var(--accent-indigo)' },
          { ...baseNodes[1], x: 260, y: 90, color: '#ffffff' },
          { ...baseNodes[2], x: 100, y: 210, color: 'var(--accent-blue)' },
          { ...baseNodes[3], x: 280, y: 210, color: 'var(--accent-cyan)' }
        ],
        links: [
          { s: 'n1', t: 'n2' },
          { s: 'n2', t: 'n4' },
          { s: 'n3', t: 'n4' },
          { s: 'n1', t: 'n3' }
        ]
      };
    }
  };

  const currentGraph = getGraphDataForStep(activeStep);

  return (
    <section id="how-it-works" className="dark-section" style={{ padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Visual Journey</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-dark-primary)', marginBottom: '1.25rem' }}>
            How it works.
          </h2>
          <p style={{ color: 'var(--text-dark-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            A self-structuring semantic database built in four progressive steps.
          </p>
        </div>

        {/* Step Visual Journey split grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '5rem', alignItems: 'center' }} className="how-it-works-grid">
          
          {/* Left Column Steps list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : isPast ? 0.6 : 0.35,
                    transition: 'opacity 0.4s ease',
                    borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    paddingLeft: '1.25rem',
                    marginLeft: '-1.25rem'
                  }}
                >
                  {/* Step Num */}
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isActive ? 'var(--accent-cyan)' : 'var(--text-dark-secondary)' }}>
                    {step.num}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-dark-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column Graph Visualization Canvas */}
          <div
            style={{
              height: '320px',
              backgroundColor: 'rgba(28,28,28,0.5)',
              border: '1px solid var(--border-dark-color)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Step label on canvas */}
            <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
              Step {steps[activeStep].num}: {steps[activeStep].title}
            </span>

            <svg width="100%" height="100%" viewBox="0 0 380 280" style={{ overflow: 'visible' }}>
              {/* Render Connections */}
              {currentGraph.links.map((link, idx) => {
                const s = currentGraph.nodes.find(n => n.id === link.s);
                const t = currentGraph.nodes.find(n => n.id === link.t);
                if (!s || !t) return null;

                return (
                  <motion.line
                    key={`l-${idx}`}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="var(--accent-cyan)"
                    strokeWidth="1.5"
                    opacity={activeStep === 3 ? 0.6 : 0.25}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                );
              })}

              {/* Render Nodes */}
              <AnimatePresence>
                {currentGraph.nodes.map((node) => (
                  <motion.g
                    key={node.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  >
                    <circle cx={node.x} cy={node.y} r={6} fill="var(--bg-dark-primary)" stroke={node.color} strokeWidth="2" />
                    <text x={node.x} y={node.y + 16} fill="var(--text-dark-primary)" fontSize="8.5" fontWeight="600" textAnchor="middle">
                      {node.label}
                    </text>
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;

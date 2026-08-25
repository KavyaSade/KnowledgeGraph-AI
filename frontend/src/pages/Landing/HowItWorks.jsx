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
          { ...baseNodes[0], x: 70, y: 70, color: 'var(--text-muted)' },
          { ...baseNodes[1], x: 310, y: 80, color: 'var(--text-muted)' },
          { ...baseNodes[2], x: 90, y: 220, color: 'var(--text-muted)' },
          { ...baseNodes[3], x: 290, y: 230, color: 'var(--text-muted)' }
        ],
        links: []
      };
    } else if (stepIdx === 1) {
      // Step 2: Understand (Nodes positioned, colors light up representing classification, no links yet)
      return {
        nodes: [
          { ...baseNodes[0], x: 120, y: 90, color: 'var(--accent-indigo)' },
          { ...baseNodes[1], x: 260, y: 90, color: 'var(--accent-pink)' },
          { ...baseNodes[2], x: 100, y: 210, color: 'var(--accent-blue)' },
          { ...baseNodes[3], x: 280, y: 210, color: 'var(--accent-violet)' }
        ],
        links: []
      };
    } else {
      // Step 3 & 4: Connect & Discover (Nodes connected, connections glowing)
      return {
        nodes: [
          { ...baseNodes[0], x: 120, y: 90, color: 'var(--accent-indigo)' },
          { ...baseNodes[1], x: 260, y: 90, color: 'var(--accent-pink)' },
          { ...baseNodes[2], x: 100, y: 210, color: 'var(--accent-blue)' },
          { ...baseNodes[3], x: 280, y: 210, color: 'var(--accent-violet)' }
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
    <section id="how-it-works" className="light-section" style={{ padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
          <span className="text-label" style={{ color: 'var(--accent-indigo)', marginBottom: '1rem', display: 'inline-block', textShadow: 'none' }}>Visual Journey</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            How it works.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
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
                    opacity: isActive ? 1 : isPast ? 0.65 : 0.35,
                    transition: 'all 0.3s ease',
                    borderLeft: isActive ? '3.5px solid var(--accent-indigo)' : '3.5px solid transparent',
                    paddingLeft: '1.5rem',
                    marginLeft: '-1.5rem'
                  }}
                >
                  {/* Step Num */}
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isActive ? 'var(--accent-indigo)' : 'var(--text-muted)' }}>
                    {step.num}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{step.title}</h3>
                    <p style={{ color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column Graph Visualization Canvas */}
          <div
            className="minimal-card"
            style={{
              height: '340px',
              backgroundImage: 'linear-gradient(rgba(79, 70, 229, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.015) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Step label on canvas */}
            <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-indigo)', letterSpacing: '0.05em' }}>
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
                    stroke="var(--accent-indigo)"
                    strokeWidth="2"
                    opacity={activeStep === 3 ? 0.8 : 0.35}
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
                    <circle cx={node.x} cy={node.y} r={6.5} fill="var(--bg-surface)" stroke={node.color} strokeWidth="2.5" />
                    <text x={node.x} y={node.y + 18} fill="var(--text-primary)" fontSize="9.5" fontWeight="700" textAnchor="middle">
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

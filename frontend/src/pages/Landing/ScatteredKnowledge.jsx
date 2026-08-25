import React, { useState } from 'react';

const ScatteredKnowledge = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const fragments = [
    { 
      id: 'note', 
      label: 'Note draft', 
      emoji: '📝',
      x: -170, 
      y: -95, 
      color: '#4F46E5', // indigo
      description: 'Contains project scope. Connected to Proposal and Web bookmark.' 
    },
    { 
      id: 'paper', 
      label: 'ML Research Paper', 
      emoji: '🔬',
      x: 0, 
      y: -185, 
      color: '#8B5CF6', // violet
      description: 'Summarizes transformer-based semantic mapping logic.' 
    },
    { 
      id: 'pdf', 
      label: 'Project Proposal.pdf', 
      emoji: '📄',
      x: 170, 
      y: -95, 
      color: '#4F46E5', // indigo
      description: 'Main project documentation. Links research to energy Tech drafts.' 
    },
    { 
      id: 'idea', 
      label: 'Idea: Graph DB', 
      emoji: '💡',
      x: 190, 
      y: 35, 
      color: '#D97706', // amber
      description: 'Discovered matching schema concepts with React codebase.' 
    },
    { 
      id: 'person', 
      label: 'Lead Collaborator', 
      emoji: '👤',
      x: 105, 
      y: 160, 
      color: '#2563EB', // blue
      description: 'Main developer. Accessing codebase and 3 documentation drafts.' 
    },
    { 
      id: 'code', 
      label: 'React Codebase', 
      emoji: '💻',
      x: -105, 
      y: 160, 
      color: '#0D9488', // teal
      description: '12 active components, initialized with Vite and React 19.' 
    },
    { 
      id: 'bookmark', 
      label: 'Web bookmark', 
      emoji: '📌',
      x: -190, 
      y: 35, 
      color: '#2563EB', // blue
      description: 'Neo4j visualization docs, linked to Note drafts.' 
    }
  ];

  // Outer ring connections
  const ringLinks = [
    { from: 'note', to: 'paper' },
    { from: 'paper', to: 'pdf' },
    { from: 'pdf', to: 'idea' },
    { from: 'idea', to: 'person' },
    { from: 'person', to: 'code' },
    { from: 'code', to: 'bookmark' },
    { from: 'bookmark', to: 'note' }
  ];

  const getBadgeStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    marginRight: '8px',
    backgroundColor: `${color}12`,
    border: `1px solid ${color}25`,
    fontSize: '0.85rem'
  });

  const activeNodeData = fragments.find(f => f.id === hoveredNode);

  return (
    <section id="scattered-knowledge" className="light-section" style={{ padding: '8rem 0', borderTop: '1px solid rgba(0, 243, 255, 0.15)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
        
        {/* Title & Description */}
        <div style={{ textAlign: 'center', maxWidth: '640px' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Semantic Layer</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Your information is scattered. <br />
            Your knowledge <span className="accent-highlight">isn’t.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every bookmark, PDF draft, and codebase snippet contains implicit relations. Hover over nodes to visualize semantic mapping.
          </p>
        </div>

        {/* Static Minimal Graph Container */}
        <div
          className="graph-outer-container"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '740px',
            height: '460px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
            overflow: 'visible'
          }}
        >
          {/* SVG Connection Lines */}
          <div className="graph-wrapper" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <svg width="100%" height="100%" viewBox="-370 -230 740 460" style={{ overflow: 'visible' }}>
              
              {/* 1. Outer Ring Connection Lines */}
              {ringLinks.map((link, idx) => {
                const fromNode = fragments.find(f => f.id === link.from);
                const toNode = fragments.find(f => f.id === link.to);
                if (!fromNode || !toNode) return null;
                
                const isActive = hoveredNode === link.from || hoveredNode === link.to;
                const activeColor = hoveredNode ? (fragments.find(f => f.id === hoveredNode)?.color || 'var(--accent-indigo)') : 'var(--accent-indigo)';

                return (
                  <line 
                    key={`ring-${idx}`}
                    x1={fromNode.x} 
                    y1={fromNode.y} 
                    x2={toNode.x} 
                    y2={toNode.y} 
                    stroke={isActive ? activeColor : 'rgba(15, 23, 42, 0.06)'} 
                    strokeWidth={isActive ? 2.5 : 1.2}
                    style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                  />
                );
              })}

              {/* 2. Hub-to-Node Connection Lines */}
              {fragments.map((node) => {
                const isActive = hoveredNode === node.id;
                
                return (
                  <line
                    key={`hub-${node.id}`}
                    x1={0}
                    y1={0}
                    x2={node.x}
                    y2={node.y}
                    stroke={isActive ? node.color : 'rgba(15, 23, 42, 0.04)'}
                    strokeWidth={isActive ? 2.5 : 1}
                    style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Central AI Hub Node */}
          <div
            style={{
              position: 'absolute',
              width: '145px',
              height: '145px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1.25rem',
              background: 'var(--bg-surface)',
              border: hoveredNode 
                ? `2px solid ${activeNodeData?.color}` 
                : '2px solid var(--accent-indigo)',
              boxShadow: hoveredNode
                ? `0 6px 20px rgba(15,23,42,0.06), 0 0 15px ${activeNodeData?.color}20`
                : '0 4px 15px rgba(15, 23, 42, 0.04)',
              zIndex: 15,
              pointerEvents: 'none',
              transition: 'border-color 0.25s, box-shadow 0.25s',
            }}
          >
            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '0.625rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em', 
                color: hoveredNode ? activeNodeData?.color : 'var(--accent-indigo)',
                transition: 'color 0.25s'
              }}>
                {hoveredNode ? 'Semantic Link' : 'System Core'}
              </span>
              <h4 style={{ 
                fontSize: '0.8rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)',
                margin: '0.25rem 0',
                fontFamily: "'Manrope', sans-serif"
              }}>
                {hoveredNode ? activeNodeData?.label : 'Knowledge Hub'}
              </h4>
              <p style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-secondary)', 
                lineHeight: 1.35,
                maxWidth: '120px',
                margin: 0
              }}>
                {hoveredNode 
                  ? activeNodeData?.description 
                  : 'Hover nodes to trace relationships.'}
              </p>
            </div>
          </div>

          {/* Floating fragments */}
          {fragments.map((frag) => {
            const isHovered = hoveredNode === frag.id;
            const isAnyHovered = hoveredNode !== null;

            return (
              <div
                key={frag.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${frag.x}px), calc(-50% + ${frag.y}px))`,
                  padding: '0.55rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: isHovered 
                    ? `2px solid ${frag.color}` 
                    : '1px solid rgba(15, 23, 42, 0.1)',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: isHovered 
                    ? '0 6px 20px rgba(15, 23, 42, 0.08)' 
                    : '0 2px 8px rgba(15, 23, 42, 0.02)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isHovered ? 1 : (isAnyHovered ? 0.35 : 1),
                  transition: 'all 0.25s ease',
                  zIndex: isHovered ? 20 : 10
                }}
                onMouseEnter={() => setHoveredNode(frag.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <span style={getBadgeStyle(frag.color)}>
                  {frag.emoji}
                </span>
                {frag.label}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Mobile Graph Scaling */
        @media (max-width: 768px) {
          .graph-wrapper {
            transform: scale(0.75);
          }
          .graph-outer-container {
            height: 380px !important;
          }
          /* Adjust node sizes and positions on mobile */
          div[style*="145px"] {
            width: 110px !important;
            height: 110px !important;
            padding: 0.5rem !important;
          }
          div[style*="145px"] h4 {
            font-size: 0.65rem !important;
          }
          div[style*="145px"] p {
            font-size: 0.55rem !important;
            max-width: 90px !important;
          }
        }

        @media (max-width: 500px) {
          .graph-wrapper {
            transform: scale(0.55);
          }
          .graph-outer-container {
            height: 290px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ScatteredKnowledge;

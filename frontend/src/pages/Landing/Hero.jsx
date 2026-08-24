import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Nodes list for the editorial neural network graph
  const nodes = [
    { id: 'Research', x: 230, y: 70, size: 28, importance: 'high', label: 'Research', category: 'Intelligence Cluster', stats: { connections: 5, topics: 3, notes: 4 } },
    { id: 'Document', x: 120, y: 150, size: 20, importance: 'medium', label: 'Document', category: 'Data Sources', stats: { connections: 3, topics: 2, notes: 1 } },
    { id: 'AI', x: 340, y: 150, size: 24, importance: 'high', label: 'AI Engine', category: 'Core Processor', stats: { connections: 4, topics: 4, notes: 3 } },
    { id: 'Topic', x: 90, y: 250, size: 22, importance: 'medium', label: 'Topic Map', category: 'Taxonomy', stats: { connections: 3, topics: 1, notes: 2 } },
    { id: 'Project', x: 370, y: 250, size: 24, importance: 'high', label: 'Project Alpha', category: 'Workspace', stats: { connections: 4, topics: 2, notes: 3 } },
    { id: 'Note', x: 230, y: 350, size: 18, importance: 'low', label: 'Note Draft', category: 'Knowledge Unit', stats: { connections: 3, topics: 1, notes: 2 } },
    { id: 'Person', x: 80, y: 80, size: 20, importance: 'medium', label: 'Dr. Emily', category: 'Collaborator', stats: { connections: 2, topics: 1, notes: 1 } },
    { id: 'Idea', x: 390, y: 80, size: 18, importance: 'low', label: 'Graphene Idea', category: 'Brainstorm', stats: { connections: 2, topics: 2, notes: 1 } },
    { id: 'Bookmark', x: 100, y: 340, size: 16, importance: 'low', label: 'IEEE Article', category: 'Reference', stats: { connections: 2, topics: 1, notes: 0 } },
  ];

  // Connections list between nodes
  const links = [
    { source: 'Research', target: 'Document' },
    { source: 'Research', target: 'AI' },
    { source: 'Document', target: 'Topic' },
    { source: 'AI', target: 'Project' },
    { source: 'Topic', target: 'Note' },
    { source: 'Project', target: 'Note' },
    { source: 'Person', target: 'Research' },
    { source: 'Idea', target: 'AI' },
    { source: 'Bookmark', target: 'Topic' },
    { source: 'Bookmark', target: 'Note' },
    { source: 'Project', target: 'Research' },
  ];

  // Coords fetch helper
  const getNode = (id) => nodes.find(n => n.id === id);

  // Check connection overlap
  const isConnected = (nodeA, nodeB) => {
    if (nodeA === nodeB) return true;
    return links.some(l => 
      (l.source === nodeA && l.target === nodeB) ||
      (l.source === nodeB && l.target === nodeA)
    );
  };

  const handleScrollToSection = () => {
    const el = document.getElementById('scattered-knowledge');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="light-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', overflow: 'hidden', position: 'relative' }}>
      <div className="container">
        <div className="asymmetric-grid">
          {/* Left Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            <span className="text-label">Personal Knowledge Intelligence</span>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
              Your knowledge <br />
              has a <span className="accent-highlight">hidden structure.</span>
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '480px', lineHeight: 1.6 }}>
              Connect notes, documents, ideas and resources. <br />
              Let AI reveal the relationships hiding between them.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
                Build Your Knowledge <span>→</span>
              </Link>
              <button onClick={handleScrollToSection} className="btn btn-secondary">
                Explore the Graph
              </button>
            </div>
          </motion.div>

          {/* Right SVG Living Graph */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '480px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(13, 13, 13, 0.45) 0%, rgba(13, 13, 13, 0.45) 100%), url("/semantic-eye.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
          }}>
            
            {/* SVG Viewport */}
            <svg width="100%" height="100%" viewBox="0 0 460 420" style={{ overflow: 'visible', maxWidth: '460px', zIndex: 1 }}>
              <defs>
                {/* Subtle Glow Defs */}
                <filter id="glow-light" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connections (Background lines) */}
              {links.map((link, idx) => {
                const sNode = getNode(link.source);
                const tNode = getNode(link.target);
                if (!sNode || !tNode) return null;

                // Connection Opacity states
                let opacity = 0.08;
                let strokeColor = 'rgba(250, 250, 248, 0.4)';
                let strokeWidth = 1;
                let isPulse = false;

                if (hoveredNode) {
                  const sHovered = sNode.id === hoveredNode.id;
                  const tHovered = tNode.id === hoveredNode.id;
                  if (sHovered || tHovered) {
                    opacity = 0.6;
                    strokeColor = sHovered ? 'var(--accent-indigo)' : 'var(--accent-blue)';
                    strokeWidth = 2;
                    isPulse = true;
                  } else {
                    opacity = 0.03;
                  }
                }

                return (
                  <g key={`edge-${idx}`}>
                    <motion.line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: idx * 0.05 }}
                    />
                    
                    {/* Animated Flowing Particles */}
                    {isPulse && (
                      <motion.line
                        x1={sNode.x}
                        y1={sNode.y}
                        x2={tNode.x}
                        y2={tNode.y}
                        stroke="var(--accent-indigo)"
                        strokeWidth="2.5"
                        strokeDasharray="8, 20"
                        opacity="0.8"
                        animate={{ strokeDashoffset: [-40, 40] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Graph Nodes */}
              {nodes.map((node) => {
                const isHovered = hoveredNode && hoveredNode.id === node.id;
                const isDimmed = hoveredNode && !isConnected(node.id, hoveredNode.id);

                let nodeColor = 'rgba(250, 250, 248, 0.5)';
                if (node.importance === 'high') nodeColor = 'var(--accent-cyan)';
                else if (node.importance === 'medium') nodeColor = 'var(--accent-violet)';

                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isHovered ? 1.15 : 1,
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    whileHover={{ scale: 1.12 }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing ring around highly important nodes */}
                    {node.importance === 'high' && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size / 2 + 6}
                        fill="none"
                        stroke="var(--accent-glow)"
                        strokeWidth="1.5"
                        style={{
                          transformOrigin: `${node.x}px ${node.y}px`,
                          animation: 'pulseScale 3s infinite ease-in-out',
                        }}
                      />
                    )}

                    {/* Outer core node border */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2}
                      fill="#151515"
                      stroke={isHovered ? 'var(--accent-cyan)' : nodeColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{
                        transition: 'stroke 0.25s, stroke-width 0.25s',
                        filter: isHovered ? 'url(#glow-light)' : 'none',
                      }}
                    />

                    {/* Core node dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={4}
                      fill={isHovered ? 'var(--accent-cyan)' : nodeColor}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + (node.size / 2) + 14}
                      fill="rgba(250, 250, 248, 0.85)"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                      opacity={isDimmed ? 0.3 : 1}
                      style={{ transition: 'opacity 0.25s' }}
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>

            {/* Hover Floating Details Panel */}
            <AnimatePresence>
              {hoveredNode && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '260px',
                    padding: '1.25rem',
                    backgroundColor: 'rgba(20, 20, 20, 0.92)',
                    backdropFilter: 'var(--glass-blur)',
                    border: '1px solid rgba(250, 250, 248, 0.12)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    zIndex: 10,
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>
                    {hoveredNode.category}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FAFAF8', marginBottom: '0.5rem' }}>
                    {hoveredNode.label}
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(250, 250, 248, 0.12)', margin: '0.5rem 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'rgba(250, 250, 248, 0.75)' }}>
                    <div>🔗 <strong>{hoveredNode.stats.connections}</strong> connected items</div>
                    <div>🏷 <strong>{hoveredNode.stats.topics}</strong> related topics</div>
                    <div>📝 <strong>{hoveredNode.stats.notes}</strong> recent notes</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

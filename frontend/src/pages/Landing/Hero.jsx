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
    <section className="light-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '110px', overflow: 'hidden', position: 'relative' }}>
      {/* Background ambient lighting */}
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(0, 243, 255, 0.1) 0%, transparent 75%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, transparent 75%)', filter: 'blur(75px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="asymmetric-grid">
          {/* Left Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="text-label">System Active</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', boxShadow: '0 0 10px var(--accent-emerald)', display: 'inline-block', animation: 'pulseScale 1.5s infinite' }} />
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Your knowledge <br />
              has a <span className="accent-highlight">hidden structure.</span>
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '520px', lineHeight: 1.65 }}>
              Connect notes, documents, ideas and resources. <br />
              Let our semantic engine map the relationships hiding between them instantly.
            </p>

            {/* Live Dashboard Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '440px', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nodes Ingested</div>
                <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>1,482</div>
              </div>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connections Analyzed</div>
                <div style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>9,215</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
                Build Your Knowledge <span>→</span>
              </Link>
              <button onClick={handleScrollToSection} className="btn btn-secondary">
                Explore the Graph
              </button>
            </div>
          </motion.div>

          {/* Right SVG Living Graph Dashboard Panel */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '500px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(11, 15, 26, 0.6) 0%, rgba(8, 10, 16, 0.85) 100%), url("/semantic-eye.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 243, 255, 0.1)'
          }}>
            {/* Dashboard Frame Highlights */}
            <div style={{ position: 'absolute', top: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }} />
                <span>Semantic Visualizer v2.4</span>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                LATENCY: <span style={{ color: 'var(--accent-emerald)' }}>12ms</span>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none', fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              <span>DB CLUSTER: SHARD_01</span>
              <span>INDEX STATUS: <span style={{ color: 'var(--accent-cyan)' }}>SYNCED</span></span>
            </div>
            
            {/* SVG Viewport */}
            <svg width="100%" height="100%" viewBox="0 0 460 420" style={{ overflow: 'visible', maxWidth: '460px', zIndex: 1 }}>
              <defs>
                {/* Neon Glow Defs */}
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connections (Background lines) */}
              {links.map((link, idx) => {
                const sNode = getNode(link.source);
                const tNode = getNode(link.target);
                if (!sNode || !tNode) return null;

                // Connection Opacity states
                let opacity = 0.22;
                let strokeColor = 'rgba(0, 243, 255, 0.3)';
                let strokeWidth = 1.25;
                let isPulse = false;

                if (hoveredNode) {
                  const sHovered = sNode.id === hoveredNode.id;
                  const tHovered = tNode.id === hoveredNode.id;
                  if (sHovered || tHovered) {
                    opacity = 0.9;
                    strokeColor = sHovered ? 'var(--accent-violet)' : 'var(--accent-cyan)';
                    strokeWidth = 2.5;
                    isPulse = true;
                  } else {
                    opacity = 0.08;
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
                      transition={{ duration: 1.2, delay: idx * 0.04 }}
                    />
                    
                    {/* Animated Flowing Particles */}
                    {isPulse && (
                      <motion.line
                        x1={sNode.x}
                        y1={sNode.y}
                        x2={tNode.x}
                        y2={tNode.y}
                        stroke={sNode.id === hoveredNode.id ? 'var(--accent-violet)' : 'var(--accent-cyan)'}
                        strokeWidth="3"
                        strokeDasharray="10, 24"
                        opacity="0.95"
                        animate={{ strokeDashoffset: [-50, 50] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Graph Nodes */}
              {nodes.map((node) => {
                const isHovered = hoveredNode && hoveredNode.id === node.id;
                const isDimmed = hoveredNode && !isConnected(node.id, hoveredNode.id);

                let nodeColor = 'rgba(255, 255, 255, 0.7)';
                let glowColor = 'rgba(255, 255, 255, 0.2)';
                if (node.importance === 'high') {
                  nodeColor = 'var(--accent-cyan)';
                  glowColor = 'rgba(0, 243, 255, 0.4)';
                } else if (node.importance === 'medium') {
                  nodeColor = 'var(--accent-violet)';
                  glowColor = 'rgba(217, 70, 239, 0.4)';
                } else if (node.importance === 'low') {
                  nodeColor = 'var(--accent-blue)';
                  glowColor = 'rgba(59, 130, 246, 0.4)';
                }

                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                    whileHover={{ scale: 1.15 }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing ring around highly important nodes */}
                    {node.importance === 'high' && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size / 2 + 7}
                        fill="none"
                        stroke={isHovered ? 'var(--accent-cyan)' : 'var(--accent-glow)'}
                        strokeWidth="1.5"
                        style={{
                          transformOrigin: `${node.x}px ${node.y}px`,
                          animation: 'pulseScale 2.5s infinite ease-in-out',
                        }}
                      />
                    )}

                    {/* Outer core node border */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2}
                      fill="#090C15"
                      stroke={isHovered ? 'var(--accent-cyan)' : nodeColor}
                      strokeWidth={isHovered ? 3 : 2}
                      style={{
                        transition: 'stroke 0.2s, stroke-width 0.2s',
                        filter: isHovered ? 'url(#neon-glow)' : `drop-shadow(0 0 4px ${glowColor})`,
                      }}
                    />

                    {/* Core node dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={4.5}
                      fill={isHovered ? '#ffffff' : nodeColor}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + (node.size / 2) + 15}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      opacity={isDimmed ? 0.35 : 1}
                      style={{ transition: 'opacity 0.25s', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
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
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '260px',
                    padding: '1.25rem',
                    backgroundColor: 'rgba(11, 15, 26, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    boxShadow: '0 10px 30px rgba(0, 243, 255, 0.2)',
                    borderRadius: '8px',
                    zIndex: 10,
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
                    {hoveredNode.category}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                    {hoveredNode.label}
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(0, 243, 255, 0.2)', margin: '0.5rem 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>
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

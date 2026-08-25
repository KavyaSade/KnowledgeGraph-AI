import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkGraphInsights = () => {
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Topics and their percentages
  const topics = [
    { id: 'AI / ML', label: 'AI / ML', percentage: 92, count: 142, color: 'var(--accent-cyan)', barChar: '███████████████' },
    { id: 'Research', label: 'Research', percentage: 76, count: 98, color: 'var(--accent-violet)', barChar: '███████████' },
    { id: 'Web Development', label: 'Web Development', percentage: 65, count: 82, color: 'var(--accent-pink)', barChar: '█████████' },
    { id: 'Productivity', label: 'Productivity', percentage: 58, count: 74, color: 'var(--accent-blue)', barChar: '████████' },
    { id: 'Design', label: 'Design', percentage: 48, count: 52, color: 'var(--accent-emerald)', barChar: '██████' },
    { id: 'Database', label: 'Database', percentage: 38, count: 41, color: 'var(--accent-amber)', barChar: '█████' }
  ];

  // Defined node list with their respective categories
  const nodes = [
    { id: 'c1', label: 'Transformer API', category: 'AI / ML', x: 200, y: 150, r: 9, color: 'var(--accent-cyan)', count: 42 },
    { id: 'c2', label: 'Graphene Research Paper', category: 'Research', x: 110, y: 80, r: 7, color: 'var(--accent-violet)', count: 28 },
    { id: 'c3', label: 'Navbar Component', category: 'Web Development', x: 290, y: 80, r: 8, color: 'var(--accent-pink)', count: 35 },
    { id: 'c4', label: 'Priority Inbox Drafts', category: 'Productivity', x: 90, y: 220, r: 7, color: 'var(--accent-blue)', count: 19 },
    { id: 'c5', label: 'Figma Token Schema', category: 'Design', x: 310, y: 220, r: 8, color: 'var(--accent-emerald)', count: 24 },
    { id: 'c6', label: 'PostgreSQL Indexing Logs', category: 'Database', x: 200, y: 270, r: 8, color: 'var(--accent-amber)', count: 15 }
  ];

  const links = [
    { s: 'c1', t: 'c2' }, { s: 'c1', t: 'c3' },
    { s: 'c1', t: 'c4' }, { s: 'c1', t: 'c5' },
    { s: 'c1', t: 'c6' }, { s: 'c2', t: 'c3' },
    { s: 'c4', t: 'c6' }, { s: 'c5', t: 'c6' }
  ];

  const getCoords = (id) => nodes.find(n => n.id === id);

  return (
    <section id="ai-capabilities" className="light-section" style={{ padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
      {/* Glow Effects */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.02) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <span className="text-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Pattern Discovery</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Interactive Dashboard & <br />
            <span className="accent-highlight">Knowledge Analytics.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our neural classification agent monitors incoming files, maps subjects automatically, and tracks cluster growth in real-time.
          </p>
        </div>

        {/* Dual Panel Dashboard */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'stretch' }}>
          
          {/* Top Topics Custom Bar Chart */}
          <div className="minimal-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  Top Classification Topics
                </h3>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-indigo)', letterSpacing: '0.05em' }}>Live Metrics</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                Categorized database entities. Hover over any topic bar to highlight matching nodes in the network structure.
              </p>

              {/* Colourful Bar Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {topics.map((topic) => {
                  const isHovered = hoveredTopic === topic.id || (hoveredNode && hoveredNode.category === topic.id);
                  const isAnyHovered = hoveredTopic !== null || hoveredNode !== null;

                  return (
                    <motion.div
                      key={topic.id}
                      onMouseEnter={() => setHoveredTopic(topic.id)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      whileHover={{ x: 4 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : (isAnyHovered ? 0.35 : 1),
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      {/* Label & Details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                        <span style={{ color: isHovered ? topic.color : 'var(--text-primary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: topic.color }} />
                          {topic.label}
                        </span>
                        <span style={{ color: topic.color }}>
                          {topic.count} nodes ({topic.percentage}%)
                        </span>
                      </div>

                      {/* Custom Bar Container */}
                      <div style={{ position: 'relative', height: '14px', background: 'var(--bg-secondary)', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {/* Animated Inward Glowing Bar */}
                        <motion.div
                          initial={{ width: '0%' }}
                          whileInView={{ width: `${topic.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                          style={{
                            height: '100%',
                            background: `linear-gradient(90deg, ${topic.color}80, ${topic.color})`,
                            borderRadius: '7px',
                            boxShadow: isHovered ? `0 0 12px ${topic.color}` : 'none',
                            transition: 'box-shadow 0.25s ease'
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '2rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              <span>DATABASE NODES: <strong style={{ color: 'var(--text-primary)' }}>489</strong></span>
              <span>EXTRACTION SUCCESS: <strong style={{ color: 'var(--accent-emerald)' }}>99.8%</strong></span>
            </div>
          </div>

          {/* Interactive Graph Canvas */}
          <div className="minimal-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Visual HUD Canvas Indicators */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-indigo)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ✦ Cluster Mapping Viewport
            </div>

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              COORD_SYSTEM: SEMANTIC_RELATIONS_3D
            </div>

            <div style={{ width: '100%', height: '340px' }}>
              <svg width="100%" height="100%" viewBox="50 40 300 250" style={{ overflow: 'visible' }}>
                <defs>
                  <filter id="neon-glow-violet" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Links */}
                {links.map((link, idx) => {
                  const s = getCoords(link.s);
                  const t = getCoords(link.t);
                  
                  const isLineHighlighted = 
                    (hoveredTopic && (s.category === hoveredTopic || t.category === hoveredTopic)) ||
                    (hoveredNode && (link.s === hoveredNode.id || link.t === hoveredNode.id));

                  return (
                    <g key={idx}>
                      <line 
                        x1={s.x} y1={s.y} 
                        x2={t.x} y2={t.y} 
                        stroke={isLineHighlighted ? 'var(--accent-indigo)' : 'rgba(15, 23, 42, 0.06)'} 
                        strokeWidth={isLineHighlighted ? 2.5 : 1}
                        style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                      />
                      
                      {/* Flowing particle indicators on highlighted connection */}
                      {isLineHighlighted && (
                        <motion.line
                          x1={s.x} y1={s.y}
                          x2={t.x} y2={t.y}
                          stroke="var(--accent-indigo)"
                          strokeWidth="2.5"
                          strokeDasharray="6, 15"
                          opacity="0.9"
                          animate={{ strokeDashoffset: [-30, 30] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isNodeHighlighted = 
                    hoveredTopic === node.category || 
                    (hoveredNode && hoveredNode.id === node.id);
                  const isAnyHigh = hoveredTopic !== null || hoveredNode !== null;
                  const opacity = isNodeHighlighted ? 1 : (isAnyHigh ? 0.25 : 1);

                  return (
                    <motion.g 
                      key={node.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      animate={{ scale: isNodeHighlighted ? 1.25 : 1, opacity }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <circle 
                        cx={node.x} cy={node.y} 
                        r={node.r} 
                        fill="var(--bg-surface)" 
                        stroke={node.color} 
                        strokeWidth={isNodeHighlighted ? 3 : 2} 
                        style={{ filter: isNodeHighlighted ? 'url(#neon-glow-violet)' : 'none' }} 
                      />
                      <circle cx={node.x} cy={node.y} r={2.5} fill={node.color} />
                    </motion.g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Telemetry Details Overlay */}
            <AnimatePresence>
              {(hoveredNode || hoveredTopic) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    padding: '0.65rem 1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    minWidth: '180px',
                    zIndex: 20,
                    boxShadow: '0 6px 15px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  {hoveredNode ? (
                    <>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: hoveredNode.color, textTransform: 'uppercase' }}>
                        {hoveredNode.category}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {hoveredNode.label}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Connected nodes: {hoveredNode.count}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: topics.find(t => t.id === hoveredTopic)?.color, textTransform: 'uppercase' }}>
                        Topic Focus
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {hoveredTopic}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Total elements: {topics.find(t => t.id === hoveredTopic)?.count}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
        }
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default DarkGraphInsights;

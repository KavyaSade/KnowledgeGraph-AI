import React from 'react';
import { motion } from 'framer-motion';

const AIGraphShowcase = () => {
  // Define layout structure for showing Note -> Project <- Person -> Document -> Topic
  const nodes = [
    { id: 'note', label: 'Note', desc: 'Neural Network design rules', type: 'note', x: 50, y: 70, color: 'var(--accent-primary)' },
    { id: 'project', label: 'Project', desc: 'Self-driving vehicle MVP', type: 'project', x: 230, y: 150, color: 'var(--accent-secondary)' },
    { id: 'person', label: 'Person', desc: 'Jane (AI Engineer)', type: 'person', x: 50, y: 230, color: '#ffffff' },
    { id: 'document', label: 'Document', desc: 'sensor_api_v2.pdf', type: 'document', x: 230, y: 310, color: 'var(--accent-primary)' },
    { id: 'topic', label: 'Topic', desc: 'Computer Vision', type: 'topic', x: 410, y: 230, color: 'var(--accent-secondary)' }
  ];

  const connections = [
    { from: 'note', to: 'project', label: 'belongs to' },
    { from: 'person', to: 'project', label: 'lead engineer' },
    { from: 'person', to: 'document', label: 'uploaded' },
    { from: 'document', to: 'topic', label: 'related to' },
    { from: 'project', to: 'topic', label: 'categorized as' }
  ];

  const getCoords = (id) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <section id="ai-capabilities" style={{ padding: '8rem 0', position: 'relative' }}>
      <div className="container showcase-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left Side: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ padding: '0.4rem 1rem', alignSelf: 'flex-start', background: 'rgba(124, 77, 255, 0.05)', border: '1px solid rgba(124, 77, 255, 0.2)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>
            Semantic Engine
          </div>
          
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            From Disconnected Files to a <span className="gradient-text">Cohesive Network.</span>
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Traditional note tools lock your thoughts in isolated folders. KnowledgeGraph AI acts like your second brain: it automatically detects connections, maps semantic overlaps, and constructs an active, living network of your data.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Auto-Tagging & Clusters</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nodes group automatically by context, making discovery simple.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Bi-directional Linking</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Every connection works both ways, so you can trace links in reverse.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Graph Mapping Visual representation */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel"
          style={{
            position: 'relative',
            height: '420px',
            overflow: 'hidden',
            padding: '2rem',
            background: 'radial-gradient(circle at center, rgba(18, 24, 38, 0.4) 0%, rgba(5, 7, 12, 0.9) 100%)',
          }}
        >
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {connections.map((c, i) => {
              const start = getCoords(c.from);
              const end = getCoords(c.to);
              return (
                <g key={i}>
                  <motion.path
                    d={`M ${start.x + 60} ${start.y + 25} C ${(start.x + end.x)/2 + 60} ${start.y + 25}, ${(start.x + end.x)/2} ${end.y + 25}, ${end.x} ${end.y + 25}`}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                  {/* Glowing pulse line */}
                  <motion.path
                    d={`M ${start.x + 60} ${start.y + 25} C ${(start.x + end.x)/2 + 60} ${start.y + 25}, ${(start.x + end.x)/2} ${end.y + 25}, ${end.x} ${end.y + 25}`}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1], pathOffset: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                  />
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.05 }}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '150px',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(11, 15, 25, 0.85)',
                border: `1px solid ${node.color === '#ffffff' ? 'var(--border-color)' : node.color}`,
                borderRadius: '10px',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: `0 4px 15px rgba(0,0,0,0.4), 0 0 10px ${node.color}15`,
                zIndex: 2,
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: node.color, marginBottom: '0.2rem' }}>
                {node.type}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{node.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .showcase-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default AIGraphShowcase;

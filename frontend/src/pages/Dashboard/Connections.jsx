import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const networkIcon = getPngIcon('network');
const trashIcon = getPngIcon('trash');

const Connections = ({
  sourceNodeId,
  setSourceNodeId,
  targetNodeId,
  setTargetNodeId,
  relationshipLabel,
  setRelationshipLabel,
  handleConnect,
  connectStatus,
  nodes,
  links,
  getNodeTitleById,
  handleDeleteLink
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
      
      {/* Left: Create Relationship Form */}
      <div 
        className="dashboard-card"
        style={{
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          alignSelf: 'start'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {networkIcon && <img src={networkIcon} alt="" style={{ width: 16, height: 16 }} />}
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Link Knowledge Nodes</h3>
        </div>

        <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Source Node</label>
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="">-- Choose Source Node --</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>[{node.type.toUpperCase()}] {node.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
            ➡
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Target Node</label>
            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="">-- Choose Target Node --</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>[{node.type.toUpperCase()}] {node.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Relationship Label</label>
            <input
              type="text"
              placeholder="e.g. implemented_in, references, team_member"
              value={relationshipLabel}
              onChange={(e) => setRelationshipLabel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', width: '100%' }}
          >
            Connect Nodes
          </button>

          {connectStatus.message && (
            <div style={{ fontSize: '0.75rem', fontWeight: 650, color: connectStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)', textAlign: 'center', marginTop: '0.25rem' }}>
              {connectStatus.message}
            </div>
          )}
        </form>
      </div>

      {/* Right: Active Connections List */}
      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Active Graph Relationships ({links.length})</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
          {links.length > 0 ? (
            links.map((link) => (
              <div 
                key={link.id} 
                className="dashboard-card"
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '38%', wordBreak: 'break-word' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 750 }}>{getNodeTitleById(link.source)}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16%' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
                    {link.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--border-hover)', marginTop: '-0.1rem' }}>➡</span>
                </div>

                <div style={{ width: '38%', wordBreak: 'break-word', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 750 }}>{getNodeTitleById(link.target)}</div>
                </div>

                <div style={{ width: '8%', display: 'flex', justifyContent: 'flex-end', marginLeft: '0.5rem' }}>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this connection?')) {
                        handleDeleteLink(link.id);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '6px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.5,
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.5';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Delete Connection"
                  >
                    {trashIcon && <img src={trashIcon} alt="Delete" style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No connections created yet. Link your nodes using the form on the left.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Connections;

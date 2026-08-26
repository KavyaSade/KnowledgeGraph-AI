import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const captureIcon = getPngIcon('capture');
const insightIcon = getPngIcon('brain');

const Overview = ({
  nodes,
  links,
  resourceNodes,
  nodeType,
  setNodeType,
  nodeTitle,
  setNodeTitle,
  nodeContent,
  setNodeContent,
  nodeTags,
  setNodeTags,
  nodeUrl,
  setNodeUrl,
  captureStatus,
  docFileName,
  handleDocFileChange,
  setDocFile,
  setDocFileName,
  handleCapture,
  getAIInsights
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Captured Nodes', value: nodes.length, color: 'var(--accent-indigo)' },
          { label: 'Active Connections', value: links.length, color: 'var(--accent-cyan)' },
          { label: 'Resources Tracked', value: resourceNodes.length, color: 'var(--accent-emerald)' },
          { label: 'Workspace Network Density', value: nodes.length > 1 ? ((2 * links.length) / (nodes.length * (nodes.length - 1))).toFixed(2) : '0.00', color: 'var(--accent-pink)' }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="dashboard-card"
            style={{
              padding: '1.5rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{stat.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Dashboard Split Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Left: Quick Capture Form */}
        <div 
          className="dashboard-card"
          style={{
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {captureIcon && <img src={captureIcon} alt="" style={{ width: 16, height: 16 }} />}
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Capture New Knowledge</h3>
          </div>

          <form onSubmit={handleCapture} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Type</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="note">Note</option>
                  <option value="project">Project</option>
                  <option value="person">Person</option>
                  <option value="document">Document</option>
                  <option value="bookmark">Bookmark</option>
                  <option value="idea">Idea</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Title</label>
                <input
                  type="text"
                  placeholder="Node heading..."
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {nodeType === 'bookmark' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Resource URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {nodeType === 'document' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Attach Document File</label>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleDocFileChange}
                  style={{
                    width: '100%',
                    padding: '0.35rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)'
                  }}
                />
                {docFileName && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-indigo)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Selected: {docFileName}</span>
                    <button type="button" onClick={() => { setDocFile(null); setDocFileName(''); }} style={{ color: 'var(--accent-pink)', textDecoration: 'underline' }}>Remove</button>
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Content / Details</label>
              <textarea
                placeholder="Write description or body content here..."
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. AI, Research, Planning"
                value={nodeTags}
                onChange={(e) => setNodeTags(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem',
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
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}
            >
              Add to Graph
            </button>

            {captureStatus.message && (
              <div style={{ fontSize: '0.75rem', fontWeight: 650, color: captureStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)', marginTop: '0.5rem' }}>
                {captureStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Right: Latest Insights & Quick Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div 
            className="dashboard-card"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              flexGrow: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              {insightIcon && <img src={insightIcon} alt="" style={{ width: 16, height: 16 }} />}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Workspace Insights Summary</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {getAIInsights().slice(0, 2).map((item, i) => (
                <div key={i} style={{ borderBottom: i === 0 ? '1px solid var(--border-color)' : 'none', paddingBottom: i === 0 ? '0.75rem' : 0 }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 750, color: 'var(--accent-pink)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem', lineHeight: '1.4' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="dashboard-card"
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px dashed var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '0.75rem',
              lineHeight: '1.45',
              color: 'var(--text-secondary)'
            }}
          >
            <span style={{ fontWeight: 750, color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Intelligent Workspace Tip</span>
            Nodes represent individual entities or thoughts. Creating Links between them allows the AI engine to map clusters of knowledge. Keep your workspace structured by linking related notes.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;

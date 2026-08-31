import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const resourceIcon = getPngIcon('resource');

const Resources = ({
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
  docFileName,
  handleDocFileChange,
  setDocFile,
  setDocFileName,
  handleCapture,
  captureStatus,
  resourceNodes,
  selectedNodeIds = [],
  onToggleSelectNode,
  onNodeClick
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Resource Manager</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Filter bookmarks, documents, reference URLs, and planning deliverables.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem' }}>
        
        {/* Left: Quick Resource Upload Form */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {resourceIcon && <img src={resourceIcon} alt="" style={{ width: 16, height: 16 }} />}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Add Reference Resource</h4>
          </div>

          <form onSubmit={handleCapture} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Resource Type</label>
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
                <option value="bookmark">Bookmark/Web Link</option>
                <option value="document">PDF/Text Document</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Title</label>
              <input
                type="text"
                placeholder="e.g. Mongoose ODM Guide"
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
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Resource Description</label>
              <textarea
                placeholder="Describe this resource..."
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                rows={4}
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
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="documentation, tutorial"
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
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
            >
              Save Resource
            </button>

            {captureStatus.message && (
              <div style={{ fontSize: '0.75rem', fontWeight: 650, color: captureStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)', marginTop: '0.5rem' }}>
                {captureStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* Right: Resources Grid */}
        <div>
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Active Resources List ({resourceNodes.length})</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxHeight: '520px', overflowY: 'auto' }}>
            {resourceNodes.length > 0 ? (
              resourceNodes.map((res) => (
                <div 
                  key={res.id} 
                  onClick={() => onNodeClick && onNodeClick(res)}
                  className="dashboard-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'border 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  {/* Checkbox for multi-summarize selection */}
                  <div 
                    style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedNodeIds.includes(res.id)}
                      onChange={() => onToggleSelectNode && onToggleSelectNode(res.id)}
                      style={{ cursor: 'pointer', scale: 1.1, accentColor: 'var(--accent-indigo)' }}
                      title="Select to summarize"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', marginLeft: '1.8rem' }}>
                    <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', fontWeight: 750, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                      {res.type}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.9rem', fontWeight: 800, marginLeft: '1.8rem' }}>{res.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginLeft: '1.8rem' }}>{res.content}</p>

                  {res.metadata && res.metadata.url ? (
                    <div style={{ marginTop: '0.65rem', marginLeft: '1.8rem' }}>
                      <a 
                        href={res.metadata.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: 'var(--accent-emerald)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          textDecoration: 'none'
                        }}
                      >
                        Open Resource
                      </a>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '0.6rem', wordBreak: 'break-all' }}>
                        {res.metadata.url}
                      </span>
                    </div>
                  ) : res.metadata && res.metadata.docFile ? (
                    <div style={{ marginTop: '0.65rem', marginLeft: '1.8rem' }}>
                      <a 
                        href={res.metadata.docFile} 
                        download={res.metadata.fileName || 'document'}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: 'var(--accent-emerald)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                          textDecoration: 'none'
                        }}
                      >
                        Download: {res.metadata.fileName || 'Document'}
                      </a>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div style={{ padding: '4rem 1rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No resources uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Resources;

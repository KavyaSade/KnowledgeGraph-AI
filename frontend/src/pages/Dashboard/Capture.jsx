import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const captureIcon = getPngIcon('capture');
const trashIcon = getPngIcon('trash');

const Capture = ({
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
  organizeFilter,
  setOrganizeFilter,
  loadingGraph,
  filteredOrganizeNodes,
  handleDeleteNode
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem' }}>
      
      {/* Left Form: Capture Node */}
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
          {captureIcon && <img src={captureIcon} alt="" style={{ width: 16, height: 16 }} />}
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Capture Knowledge Node</h3>
        </div>

        <form onSubmit={handleCapture} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Node Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {['note', 'project', 'person', 'document', 'bookmark', 'idea'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNodeType(type)}
                  style={{
                    padding: '0.45rem 0.2rem',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    border: nodeType === type ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                    backgroundColor: nodeType === type ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                    color: nodeType === type ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                    fontWeight: nodeType === type ? 750 : 550,
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Title</label>
            <input
              type="text"
              placeholder="Node title..."
              value={nodeTitle}
              onChange={(e) => setNodeTitle(e.target.value)}
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

          {nodeType === 'bookmark' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Bookmark URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={nodeUrl}
                onChange={(e) => setNodeUrl(e.target.value)}
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
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Description / Context</label>
            <textarea
              placeholder="Detail the concepts, facts, or draft your notes..."
              value={nodeContent}
              onChange={(e) => setNodeContent(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '0.5rem',
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
              placeholder="TagA, TagB"
              value={nodeTags}
              onChange={(e) => setNodeTags(e.target.value)}
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
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', alignSelf: 'flex-start', width: '100%' }}
          >
            Save Node
          </button>

          {captureStatus.message && (
            <div style={{ fontSize: '0.75rem', fontWeight: 650, color: captureStatus.success ? 'var(--accent-emerald)' : 'var(--accent-pink)', textAlign: 'center', marginTop: '0.25rem' }}>
              {captureStatus.message}
            </div>
          )}
        </form>
      </div>

      {/* Right Panel: Organize/List and Filter Nodes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'note', 'project', 'person', 'document', 'bookmark', 'idea'].map((filter) => (
            <button
              key={filter}
              onClick={() => setOrganizeFilter(filter)}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.7rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                backgroundColor: organizeFilter === filter ? 'var(--accent-indigo)' : 'var(--bg-surface)',
                color: organizeFilter === filter ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: organizeFilter === filter ? 750 : 550,
                textTransform: 'capitalize',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}
            >
              {filter === 'all' ? 'All' : `${filter}s`}
            </button>
          ))}
        </div>

        {/* Nodes list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '560px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {loadingGraph ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Refreshing graph nodes...</p>
          ) : filteredOrganizeNodes.length > 0 ? (
            filteredOrganizeNodes.map((node) => (
              <div 
                key={node.id} 
                className="dashboard-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  position: 'relative'
                }}
              >
                {/* Trash Delete Action */}
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    opacity: 0.6,
                    cursor: 'pointer',
                    padding: '0.25rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                  title="Delete Node from local workspace"
                >
                  {trashIcon && <img src={trashIcon} alt="" style={{ width: 14, height: 14 }} />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--accent-indigo)' }}>
                    {node.type}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{node.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.45' }}>{node.content}</p>

                {node.metadata && node.metadata.url && (
                  <a href={node.metadata.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '0.4rem', textDecoration: 'underline' }}>
                    Visit Link: {node.metadata.url}
                  </a>
                )}

                {node.metadata && node.metadata.docFile && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <a 
                      href={node.metadata.docFile} 
                      download={node.metadata.fileName || 'document'}
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
                      Download Attached: {node.metadata.fileName || 'Document'}
                    </a>
                  </div>
                )}

                {node.tags && node.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.75rem' }}>
                    {node.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', border: '1px solid var(--border-color)', borderRadius: '3px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--bg-surface)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No captured nodes in this category yet.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Capture;

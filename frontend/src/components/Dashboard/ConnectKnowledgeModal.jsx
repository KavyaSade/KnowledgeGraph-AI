import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import { graphService } from '../../services/api';

const searchIcon = getPngIcon('search');

const RELATIONSHIP_TYPES = [
  'Related To',
  'Part Of',
  'Created For',
  'References',
  'Mentioned In',
  'Depends On',
  'Similar To'
];

const TYPE_COLORS = {
  note: '#3B82F6',
  person: '#EA580C',
  topic: '#8B5CF6',
  project: '#EC4899',
  document: '#06B6D4',
  bookmark: '#10B981',
  idea: '#F59E0B'
};

const ConnectKnowledgeModal = ({
  activeNode,
  allNodes = [],
  existingLinks = [],
  onClose,
  onSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [relationshipType, setRelationshipType] = useState('Related To');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!activeNode) return null;

  
  //The active node itself,nodes that already have a relationship with the active node
  const linkedNodeIds = existingLinks
    .filter(link => link.source === activeNode.id || link.target === activeNode.id)
    .map(link => link.source === activeNode.id ? link.target : link.source);

  const availableNodes = allNodes.filter(node => 
    node.id !== activeNode.id && !linkedNodeIds.includes(node.id)
  );

  // Search filtering
  const filteredNodes = availableNodes.filter(node => 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle selection
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Submit relationships
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setErrorMessage('Please select at least one knowledge node to connect.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Connect each selected node in parallel
      const promises = selectedIds.map(targetId => 
        graphService.createLink(activeNode.id || activeNode._id, targetId, relationshipType)
      );

      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        setErrorMessage(`Failed to create some links: ${failed.map(f => f.message).join(', ')}`);
      } else {
        onSave(); 
        onClose(); 
      }
    } catch (err) {
      console.error('Error connecting knowledge:', err);
      setErrorMessage('Failed to connect resources. Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        style={{
          width: '500px',
          maxWidth: '90%',
          maxHeight: '85vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Title */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Connect Knowledge</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Establish a semantic relationship from **{activeNode.title}** to other nodes.
          </p>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>
          
          {/* Relationship Label Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Relationship Type
            </label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.78rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              {RELATIONSHIP_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Search bar inside list */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Select target nodes
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                {searchIcon && <img src={searchIcon} alt="" style={{ width: 12, height: 12 }} />}
              </span>
              <input
                type="text"
                placeholder="Search knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 1rem 0.45rem 2rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Nodes list with scrollbar */}
          <div 
            style={{ 
              maxHeight: '220px', 
              overflowY: 'auto', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '0.5rem',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            {filteredNodes.length > 0 ? (
              filteredNodes.map(node => {
                const isSelected = selectedIds.includes(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => handleToggleSelect(node.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                      border: isSelected ? '1px solid var(--border-color)' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ cursor: 'pointer', accentColor: 'var(--accent-indigo)' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                        {node.title}
                      </span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: TYPE_COLORS[node.type] || '#3B82F6', textTransform: 'uppercase' }}>
                        {node.type}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                No unlinked resources match your query.
              </div>
            )}
          </div>

          {/* Submit Actions */}
          {errorMessage && (
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-pink)', fontWeight: 600 }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedIds.length === 0}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: submitting || selectedIds.length === 0 ? 'var(--border-color)' : 'var(--accent-indigo)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: submitting || selectedIds.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Linking...' : `Connect Selected (${selectedIds.length})`}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default ConnectKnowledgeModal;

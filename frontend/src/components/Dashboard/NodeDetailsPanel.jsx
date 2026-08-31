import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import { graphService } from '../../services/api';

const brainIcon = getPngIcon('brain');
const connectIcon = getPngIcon('connect');
const trashIcon = getPngIcon('trash');
const summaryIcon = getPngIcon('summary');

// Group nodes by type for Related Knowledge display
const TYPE_LABELS = {
  note: 'Notes',
  person: 'People',
  topic: 'Topics',
  project: 'Projects',
  document: 'Documents',
  bookmark: 'Bookmarks',
  idea: 'Ideas'
};

const TYPE_COLORS = {
  note: '#3B82F6',
  person: '#EA580C',
  topic: '#8B5CF6',
  project: '#EC4899',
  document: '#06B6D4',
  bookmark: '#10B981',
  idea: '#F59E0B'
};

const NodeDetailsPanel = ({
  node,
  onClose,
  onNodeNavigate,
  onRefreshGraph, 
  onOpenConnectModal 
}) => {
  const [related, setRelated] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryStep, setSummaryStep] = useState(0);
  const [aiSummaryText, setAiSummaryText] = useState(node.aiSummary || '');

  // Fetch related knowledge & suggested connections when node changes
  useEffect(() => {
    if (!node) return;
    
    setAiSummaryText(node.aiSummary || '');
    fetchRelatedAndSuggestions();
  }, [node]);

  const fetchRelatedAndSuggestions = async () => {
    setLoadingRelated(true);
    setLoadingSuggestions(true);
    try {
      const relRes = await graphService.getRelatedKnowledge(node.id);
      if (relRes.success) {
        setRelated(relRes.related || []);
      }
      const sugRes = await graphService.getSuggestedConnections(node.id);
      if (sugRes.success) {
        setSuggestions(sugRes.suggestions || []);
      }
    } catch (err) {
      console.error('Failed to load details panel data:', err);
    } finally {
      setLoadingRelated(false);
      setLoadingSuggestions(false);
    }
  };

  // Generates AI Summary with step-by-step progress animation
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    setSummaryStep(0);
    
    const stepsCount = 4;
    const interval = setInterval(() => {
      setSummaryStep(prev => {
        if (prev < stepsCount - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    try {
      const res = await graphService.generateNodeSummary(node.id);
      clearInterval(interval);
      if (res.success) {
        setAiSummaryText(res.summary);
        onRefreshGraph(); 
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // AI Connection Suggestion Actions: Accept
  const handleAcceptSuggestion = async (suggestedId, reason) => {
    try {
      const sourceId = node.id || node._id;
      const res = await graphService.createLink(sourceId, suggestedId, 'Related To');
      if (res.success) {
        // Remove from list
        setSuggestions(prev => prev.filter(s => (s.id || s._id) !== suggestedId));
        // Refresh relations and graph
        fetchRelatedAndSuggestions();
        onRefreshGraph();
      }
    } catch (err) {
      console.error('Failed to link suggestion:', err);
    }
  };

  // AI Connection Suggestion Actions: Dismiss/Ignore
  const handleIgnoreSuggestion = (suggestedId) => {
    setSuggestions(prev => prev.filter(s => (s.id || s._id) !== suggestedId));
  };

  if (!node) return null;

  // Group related nodes by type
  const groupedRelated = related.reduce((acc, curr) => {
    acc[curr.type] = acc[curr.type] || [];
    acc[curr.type].push(curr);
    return acc;
  }, {});

  const stepsText = [
    'Finding related resources...',
    'Analyzing connections...',
    'Identifying key concepts...',
    'Generating insights...'
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        maxWidth: '100%',
        height: '100vh',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '2rem'
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem', backgroundColor: `${TYPE_COLORS[node.type]}20`, color: TYPE_COLORS[node.type], borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
            {node.type}
          </span>
        </div>
        <button 
          onClick={onClose}
          style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      {/* Resource Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-word', margin: 0 }}>
          {node.title}
        </h2>
        
        {/* Render tags */}
        {node.tags && node.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
            {node.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details / Content Body */}
      {node.content && (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Resource Details
          </label>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {node.content}
          </p>

          {node.metadata && node.metadata.url && (
            <div style={{ marginTop: '0.75rem' }}>
              <a 
                href={node.metadata.url} 
                target="_blank" 
                rel="noreferrer" 
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
                Open Resource Link
              </a>
            </div>
          )}
        </div>
      )}

      {/* AI Summary Section */}
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {brainIcon && <img src={brainIcon} alt="" style={{ width: 14, height: 14 }} />}
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800 }}>✦ AI Summary</h3>
          </div>
          
          {!generatingSummary && (
            <button
              onClick={handleGenerateSummary}
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: 'var(--accent-indigo)',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {aiSummaryText ? 'Regenerate' : 'Generate Summary'}
            </button>
          )}
        </div>

        {generatingSummary ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: '1px dashed var(--accent-indigo)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner" style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid var(--accent-indigo)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              AI is analyzing your knowledge...
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={summaryStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}
              >
                {stepsText[summaryStep]}
              </motion.div>
            </AnimatePresence>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.25rem' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(summaryStep + 1) * 25}%` }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                style={{ height: '100%', backgroundColor: 'var(--accent-indigo)' }}
              />
            </div>
          </div>
        ) : aiSummaryText ? (
          <div 
            style={{ 
              fontSize: '0.78rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.5', 
              padding: '1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-secondary)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {aiSummaryText}
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
            No summary generated yet. Click Generate to let AI analyze this node and its neighbors.
          </p>
        )}
      </div>

      {/* Related Knowledge Section */}
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {connectIcon && <img src={connectIcon} alt="" style={{ width: 14, height: 14 }} />}
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800 }}>Related Knowledge</h3>
          </div>

          <button
            onClick={onOpenConnectModal}
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--accent-indigo)',
              backgroundColor: 'transparent',
              border: '1px solid var(--accent-indigo)',
              padding: '0.25rem 0.55rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Connect Knowledge
          </button>
        </div>

        {loadingRelated ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loading relationships...</p>
        ) : Object.keys(groupedRelated).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(groupedRelated).map(type => (
              <div key={type}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  {TYPE_LABELS[type] || type}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {groupedRelated[type].map(item => (
                    <div
                      key={item.id}
                      onClick={() => onNodeNavigate(item)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 650,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'border 0.2s',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = TYPE_COLORS[type]}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 850, padding: '0.1rem 0.35rem', backgroundColor: `${TYPE_COLORS[type]}15`, color: TYPE_COLORS[type], borderRadius: '3px', textTransform: 'uppercase' }}>
                        {item.relationship.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
            No connections established. Use the manual connection button above to link related knowledge.
          </p>
        )}
      </div>

      {/* AI Suggest Connections Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {brainIcon && <img src={brainIcon} alt="" style={{ width: 14, height: 14 }} />}
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800 }}>AI Suggested Connections</h3>
        </div>

        {loadingSuggestions ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scanning graph relationships...</p>
        ) : suggestions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestions.map(sug => {
              const sugId = sug.id || sug._id;
              return (
                <div
                  key={sugId}
                style={{
                  padding: '0.85rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 750, color: 'var(--text-primary)' }}>{sug.title}</span>
                  <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', backgroundColor: `${TYPE_COLORS[sug.type]}15`, color: TYPE_COLORS[sug.type], borderRadius: '3px', textTransform: 'uppercase', fontWeight: 800 }}>
                    {sug.type}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                  Reason: {sug.reason}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <button
                    onClick={() => handleAcceptSuggestion(sug.id || sug._id, sug.reason)}
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 750,
                      color: '#FFFFFF',
                      backgroundColor: 'var(--accent-emerald)',
                      border: 'none',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => handleIgnoreSuggestion(sug.id || sug._id)}
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 750,
                      color: 'var(--text-muted)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Ignore
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
            No new suggested connections detected for this resource.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default NodeDetailsPanel;

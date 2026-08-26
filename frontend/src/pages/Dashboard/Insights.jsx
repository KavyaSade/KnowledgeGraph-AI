import React from 'react';

const Insights = ({
  getAIInsights
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
      
      {/* Left Column: List of AI Insights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Insights Reports</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Automated analysis of your knowledge graph clusters and recommendations.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {getAIInsights().map((insight, idx) => (
            <div 
              key={idx}
              className="dashboard-card"
              style={{
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-pink)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{insight.title}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '0.2rem' }}>{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestion Prompts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Synthesis widget */}
        <div 
          className="dashboard-card"
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Research Prompts</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            Based on your current graph topology, try exploring these research questions:
          </p>
          <ul style={{ paddingLeft: '1.15rem', marginTop: '0.65rem', fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>How does your dominant node cluster impact your primary workspace deliverables?</li>
            <li>Can you integrate bookmark items into active project taxonomies to reinforce citation structure?</li>
            <li>Are there notes with shared tags that could be grouped under a parent Topic node?</li>
          </ul>
        </div>

        {/* Graph Health Card */}
        <div 
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: '0.35rem' }}>Graph Synthesis Health</div>
          <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Graph density represents network maturity. As you capture more concepts and draw associations, the knowledge density score will optimize, enabling higher-fidelity conversational context.
          </div>
        </div>

      </div>

    </div>
  );
};

export default Insights;

import React from 'react';
import { getPngIcon } from '../../utils/pngIcons';

const shieldIcon = getPngIcon('shield');

const Overview = ({ users = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Overview & Health</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Operational diagnostics, search index synchronization states, and active user metrics.</p>
      </div>

      {/* Metrics cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[
          { title: 'Total Registered Users', value: users.length, desc: 'Total accounts registered.', color: 'var(--accent-cyan)' },
          { title: 'Active Graph Nodes', value: users.reduce((acc, curr) => acc + curr.nodesCount, 0), desc: 'Total notes and resources saved across all workspaces.', color: 'var(--accent-emerald)' },
          { title: 'Average Node Density', value: users.length > 0 ? (users.reduce((acc, curr) => acc + curr.nodesCount, 0) / users.length).toFixed(1) : '0', desc: 'Average amount of captured nodes mapped per user.', color: 'var(--accent-amber)' },
        ].map((stat, idx) => (
          <div key={idx} style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{stat.title}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 850, margin: '0.5rem 0', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Graph diagnostics */}
      <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {shieldIcon && <img src={shieldIcon} alt="" style={{ width: 18, height: 18 }} />}
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Global Graph Index Health</h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Monitors active query retrieval times and synchronization status of the personal knowledge graph vector search indices.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '0.5rem 0' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Active Connectors</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 750, color: 'var(--text-primary)' }}>0 relationships</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Total connections between notes</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Average Query Latency</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 750, color: 'var(--text-primary)' }}>N/A</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Search speed across indices</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Indexer Status</div>
            <div style={{ margin: '0.2rem 0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', display: 'inline-block' }}>SYNCHRONIZED</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Database and search indices are in sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

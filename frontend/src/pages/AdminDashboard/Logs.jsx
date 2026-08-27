import React, { useState } from 'react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', boxSizing: 'border-box' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Terminal Audit Logs</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Monitor operational activities, background extraction events, database sync runs, and security challenge alerts.</p>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLogFilter(lvl)}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.7rem',
              fontWeight: 750,
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: logFilter === lvl ? 'var(--accent-emerald)' : 'var(--bg-surface)',
              color: logFilter === lvl ? '#090D16' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {lvl}
          </button>
        ))}
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Logs are fed automatically via system stream</span>
        <button
          onClick={() => setLogs([])}
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.7rem',
            fontWeight: 750,
            borderRadius: '4px',
            border: '1px solid var(--accent-pink)',
            backgroundColor: 'transparent',
            color: 'var(--accent-pink)',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          Clear Terminal Logs
        </button>
      </div>

      {/* Terminal Window */}
      <div style={{ flex: 1, backgroundColor: '#020617', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', fontFamily: 'Courier New, Courier, monospace', fontSize: '0.78rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxPercentage: '550px' }}>
        {logs
          .filter(log => logFilter === 'ALL' || log.type === logFilter)
          .map((log) => {
            let badgeColor = '#94A3B8';
            if (log.type === 'WARN') badgeColor = '#FBBF24';
            if (log.type === 'ERROR') badgeColor = '#EF4444';
            if (log.type === 'INFO') badgeColor = '#10B981';

            return (
              <div key={log.id} style={{ display: 'flex', gap: '0.75rem', lineHeight: '1.4' }}>
                <span style={{ color: '#64748B' }}>[{log.time}]</span>
                <span style={{ color: badgeColor, fontWeight: 700 }}>[{log.type}]</span>
                <span style={{ color: '#E2E8F0' }}>{log.text}</span>
              </div>
            );
          })}
        {logs.length === 0 && (
          <div style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>Console terminal is empty. No logs recorded.</div>
        )}
      </div>
    </div>
  );
};

export default Logs;

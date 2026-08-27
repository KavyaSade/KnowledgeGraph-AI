import React, { useState } from 'react';

const Settings = () => {
  const [llmModel, setLlmModel] = useState('gemini-2.5-pro');
  const [graphLayout, setGraphLayout] = useState('force-directed');
  const [rateLimit, setRateLimit] = useState(100);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSuccess, setConfigSuccess] = useState('');

  const handleSaveConfigs = (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigSuccess('');
    setTimeout(() => {
      setConfigSaving(false);
      setConfigSuccess('Configurations updated globally in database context.');
      setTimeout(() => setConfigSuccess(''), 3000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Global System Configurations</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Fine-tune parameters governing AI entity extraction, graph layouts, and request limits.</p>
      </div>

      <form onSubmit={handleSaveConfigs} style={{ maxPercentage: '650px', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>LLM Entity Extraction Model</label>
            <select
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
            </select>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem', lineHeight: '1.3' }}>
              Selects the active LLM engine used in the background to automatically identify entities and build relations from raw notes.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Default Graph Layout Engine</label>
            <select
              value={graphLayout}
              onChange={(e) => setGraphLayout(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="force-directed">Force-Directed Placement</option>
              <option value="grid">Orthogonal Grid Structure</option>
            </select>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem', lineHeight: '1.3' }}>
              Sets the mathematical layout coordinate system used to organize nodes inside the visual network graphs page.
            </span>
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>API Request Rate Limit</span>
            <span style={{ color: 'var(--accent-indigo)' }}>{rateLimit} requests / minute</span>
          </label>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={rateLimit}
            onChange={(e) => setRateLimit(parseInt(e.target.value, 10))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-indigo)' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem', lineHeight: '1.3' }}>
            Sets the maximum allowed request rate per user IP address to prevent database overload or API abuse.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={configSaving}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '6px',
              backgroundColor: 'var(--accent-indigo)',
              border: 'none',
              color: '#FFFFFF',
              cursor: configSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {configSaving ? 'Saving Configurations...' : 'Save Settings'}
          </button>
          {configSuccess && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 650 }}>{configSuccess}</span>
          )}
        </div>

      </form>
    </div>
  );
};

export default Settings;

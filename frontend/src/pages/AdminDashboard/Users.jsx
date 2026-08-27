import React, { useState } from 'react';

const Users = ({ users = [], handleToggleStatus, handleDeleteUser, onRegisterUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Registration Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('User');
  const [regSuccess, setRegSuccess] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'Active',
      nodesCount: 0,
      joined: new Date().toISOString().split('T')[0]
    };

    onRegisterUser(newUser);

    setNewName('');
    setNewEmail('');
    setRegSuccess('New account registered successfully!');
    setTimeout(() => setRegSuccess(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Directory & Access Controls</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Browse registered directories, monitor active node counts, and manage authorization states.</p>
      </div>

      {/* Registration Form & Search */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Directory Listing Table */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search users by name or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                fontSize: '0.82rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.82rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin Only</option>
              <option value="User">User Only</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>User Details</th>
                  <th style={{ padding: '1rem' }}>System Role</th>
                  <th style={{ padding: '1rem' }}>Nodes Count</th>
                  <th style={{ padding: '1rem' }}>Access State</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => {
                    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map((usr) => (
                    <tr key={usr.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700 }}>{usr.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{usr.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.4rem', borderRadius: '4px', backgroundColor: usr.role === 'Admin' ? 'var(--accent-glow)' : 'var(--bg-secondary)', color: usr.role === 'Admin' ? 'var(--accent-emerald)' : 'var(--accent-indigo)' }}>
                          {usr.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 650 }}>{usr.nodesCount} items</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: usr.status === 'Active' ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                          {usr.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleStatus(usr.id)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            fontWeight: 600
                          }}
                          title="Toggle user between Active and Suspended state"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--accent-pink)',
                            color: 'var(--accent-pink)',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                          title="Permanently delete user and clear their node collection"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New User Form */}
        <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Register User</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
            Register a researcher account to verify graph index partitioning locally.
          </p>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.82rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none' }}
              >
                <option value="User">Standard User</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '0.78rem', fontWeight: 700, borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-indigo)', color: '#FFFFFF', cursor: 'pointer', marginTop: '0.5rem' }}>
              Create Account
            </button>
            {regSuccess && (
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 650, marginTop: '0.25rem' }}>{regSuccess}</div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default Users;

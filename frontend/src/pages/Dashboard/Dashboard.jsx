import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPngIcon } from '../../utils/pngIcons';
import { authService, graphService } from '../../services/api';
import Overview from './Overview';
import Capture from './Capture';
import Resources from './Resources';
import Connections from './Connections';
import Insights from './Insights';
import Profile from './Profile';

// PNG Icons loaded dynamically via canvas generator statically outside component to prevent render latency
const logoIcon = getPngIcon('logo');
const homeIcon = getPngIcon('home');
const captureIcon = getPngIcon('capture');
const organizeIcon = getPngIcon('organize');
const resourceIcon = getPngIcon('resource');
const searchIcon = getPngIcon('search');
const networkIcon = getPngIcon('network');
const insightIcon = getPngIcon('brain');
const trashIcon = getPngIcon('trash');
const logoutIcon = getPngIcon('logout');
const userIcon = getPngIcon('user');

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Theme state inherited from localStorage 
  const [theme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Graph state
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Capture Form State
  const [nodeType, setNodeType] = useState('note');
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeTags, setNodeTags] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [captureStatus, setCaptureStatus] = useState({ success: null, message: '' });
  const [docFile, setDocFile] = useState(null); // base64 string
  const [docFileName, setDocFileName] = useState(''); // filename

  // Connection Builder State
  const [sourceNodeId, setSourceNodeId] = useState('');
  const [targetNodeId, setTargetNodeId] = useState('');
  const [relationshipLabel, setRelationshipLabel] = useState('');
  const [connectStatus, setConnectStatus] = useState({ success: null, message: '' });

  const [organizeFilter, setOrganizeFilter] = useState('all');

  // Editable Profile
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState(null); // base64 string
  const [profileUpdateStatus, setProfileUpdateStatus] = useState({ success: null, message: '' });



  // Authenticate user and fetch data
  useEffect(() => {
    const initDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoadingUser(true);
        const userRes = await authService.getMe();
        if (userRes.success) {
          setUser(userRes.user);
          setEditName(userRes.user.name || '');
          setEditEmail(userRes.user.email || '');
          setEditPhone(userRes.user.phone || '');
          setEditAvatar(userRes.user.avatar || null);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        navigate('/login');
        return;
      } finally {
        setLoadingUser(false);
      }

      // Load graph data
      fetchGraphData();
    };

    initDashboard();
  }, [navigate]);

  const fetchGraphData = async () => {
    setLoadingGraph(true);
    try {
      const res = await graphService.getGraph();
      if (res.success) {
        setNodes(res.nodes || []);
        setLinks(res.links || []);
      }
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setLoadingGraph(false);
    }
  };

  const handleDocFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setDocFile(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Capture Knowledge Action
  const handleCapture = async (e) => {
    e.preventDefault();
    if (!nodeTitle.trim()) {
      setCaptureStatus({ success: false, message: 'Please enter a title.' });
      return;
    }

    setCaptureStatus({ success: null, message: '' });
    const tagsArray = nodeTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const nodeData = {
      type: nodeType,
      title: nodeTitle.trim(),
      content: nodeContent.trim(),
      tags: tagsArray,
      metadata: nodeType === 'bookmark' 
        ? { url: nodeUrl.trim() } 
        : nodeType === 'document'
          ? { docFile, fileName: docFileName }
          : {}
    };

    try {
      const res = await graphService.createNode(nodeData);
      if (res.success) {
        setCaptureStatus({ success: true, message: 'Knowledge captured successfully!' });
        // Clear form
        setNodeTitle('');
        setNodeContent('');
        setNodeTags('');
        setNodeUrl('');
        setDocFile(null);
        setDocFileName('');
        
        fetchGraphData();
        // Clear status alert after 3s
        setTimeout(() => setCaptureStatus({ success: null, message: '' }), 3000);
      } else {
        setCaptureStatus({ success: false, message: res.message || 'Capture failed.' });
      }
    } catch (err) {
      console.error('Failed to capture node:', err);
      setCaptureStatus({ success: false, message: 'Connection error.' });
    }
  };

  // Delete Node Action 
  const handleDeleteNode = async (id) => {
    try {
      const res = await graphService.deleteNode(id);
      if (res.success) {
        // Filter out node
        setNodes((prev) => prev.filter((node) => node.id !== id));
        // Filter out connections involving this node
        setLinks((prev) => prev.filter((link) => link.source !== id && link.target !== id));
      } else {
        console.error('Failed to delete node:', res.message);
      }
    } catch (err) {
      console.error('Error deleting node:', err);
    }
  };

  // Build Connection Action
  const handleConnect = async (e) => {
    e.preventDefault();
    if (!sourceNodeId || !targetNodeId) {
      setConnectStatus({ success: false, message: 'Please select both nodes.' });
      return;
    }
    if (sourceNodeId === targetNodeId) {
      setConnectStatus({ success: false, message: 'Cannot connect a node to itself.' });
      return;
    }

    setConnectStatus({ success: null, message: '' });

    try {
      const res = await graphService.createLink(sourceNodeId, targetNodeId, relationshipLabel.trim() || 'connected_to');
      if (res.success) {
        setConnectStatus({ success: true, message: 'Relationship created successfully!' });
        setRelationshipLabel('');
        setSourceNodeId('');
        setTargetNodeId('');
        fetchGraphData();
        setTimeout(() => setConnectStatus({ success: null, message: '' }), 3000);
      } else {
        setConnectStatus({ success: false, message: res.message || 'Failed to create connection.' });
      }
    } catch (err) {
      console.error('Failed to link nodes:', err);
      setConnectStatus({ success: false, message: 'Connection error.' });
    }
  };

  // Searching Knowledge Action
  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await graphService.search(val);
      if (res.success) {
        setSearchResults(res.results);
      }
    } catch (err) {
      console.error('Search request failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      setProfileUpdateStatus({ success: false, message: 'Name and Email are required.' });
      return;
    }
    setProfileUpdateStatus({ success: null, message: '' });
    try {
      const res = await authService.updateProfile(editName.trim(), editEmail.trim(), editPhone.trim(), editAvatar);
      if (res.success) {
        setUser(res.user);
        setProfileUpdateStatus({ success: true, message: 'Profile details updated successfully!' });
      } else {
        setProfileUpdateStatus({ success: false, message: res.message || 'Failed to update profile details.' });
      }
    } catch (err) {
      console.error('Update profile request failed:', err);
      setProfileUpdateStatus({ success: false, message: 'Server connection error.' });
    }
    setTimeout(() => setProfileUpdateStatus({ success: null, message: '' }), 3000);
  };

  const getNodeTitleById = (id) => {
    const node = nodes.find((n) => n.id === id);
    return node ? node.title : `Node [${id}]`;
  };

  // Get resources filtered nodes
  const resourceNodes = nodes.filter((n) => ['bookmark', 'document'].includes(n.type));

  // AI Insights Generation Logic 
  const getAIInsights = () => {
    const nodeCount = nodes.length;
    const linkCount = links.length;
    const density = nodeCount > 1 ? ((2 * linkCount) / (nodeCount * (nodeCount - 1))).toFixed(3) : '0.000';
    
    // Insights lists
    const insights = [];
    
    // 1. Cluster highlight
    const typesCount = nodes.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});
    
    const primaryType = Object.keys(typesCount).reduce((a, b) => (typesCount[a] > typesCount[b] ? a : b), '');
    if (primaryType) {
      insights.push({
        title: 'Primary Domain Concentration',
        description: `Your workspace is highly focused on ${primaryType} elements (${typesCount[primaryType]} nodes). Consider capturing more related nodes to widen the context.`
      });
    }

    // 2. Suggested Connections
    // Suggest connection if two nodes share same tags but are not linked
    const recommendedLinks = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nA = nodes[i];
        const nB = nodes[j];
        const sharedTags = nA.tags.filter((t) => nB.tags.includes(t));
        
        if (sharedTags.length > 0) {
          // Check if already linked
          const alreadyLinked = links.some(
            (l) => (l.source === nA.id && l.target === nB.id) || (l.source === nB.id && l.target === nA.id)
          );
          if (!alreadyLinked && recommendedLinks.length < 2) {
            recommendedLinks.push({
              source: nA,
              target: nB,
              tag: sharedTags[0]
            });
          }
        }
      }
    }

    recommendedLinks.forEach((rl) => {
      insights.push({
        title: 'Connection Recommendation',
        description: `AI suggests linking "${rl.source.title}" and "${rl.target.title}" because both share the tag "${rl.tag}".`
      });
    });

    // 3. Density report
    if (linkCount > 0) {
      insights.push({
        title: 'Workspace Network Health',
        description: `Knowledge density is currently at ${density}. Higher density improves AI synthesis and semantic recall of related concepts.`
      });
    } else {
      insights.push({
        title: 'Knowledge Isolation Alert',
        description: 'You have not connected any nodes yet. Go to the "Connection Explorer" tab to form associations between your notes and projects.'
      });
    }

    return insights;
  };

  if (loadingUser) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6', color: '#0F172A' }}>
        <p style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Loading Workspace...</p>
      </div>
    );
  }

  const userDisplayName = user ? user.name : 'Researcher';
  const filteredOrganizeNodes = organizeFilter === 'all' 
    ? nodes 
    : nodes.filter((n) => n.type === organizeFilter);

  return (
    <div className={`theme-${theme}`} style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
      
      {/* Sidebar Panel */}
      <aside 
        className="dashboard-sidebar"
        style={{
          width: '260px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          flexShrink: 0
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
          {logoIcon && <img src={logoIcon} alt="Logo" style={{ width: 24, height: 24 }} />}
          <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
            KnowledgeGraph <span style={{ color: 'var(--accent-indigo)' }}>AI</span>
          </span>
        </div>

        {/* User Card */}
        <div 
          style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            backgroundColor: 'var(--bg-secondary)', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {user && user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
            />
          ) : (
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-indigo)', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 800
              }}
            >
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Logged in as</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.15rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{userDisplayName}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
          {[
            { id: 'overview', label: 'Overview', icon: homeIcon },
            { id: 'capture', label: 'Capture & Organize', icon: captureIcon },
            { id: 'resources', label: 'Resource Manager', icon: resourceIcon },
            { id: 'connections', label: 'Connection Explorer', icon: networkIcon },
            { id: 'insights', label: 'AI Insights', icon: insightIcon },
            { id: 'profile', label: 'User Profile', icon: userIcon }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                  setSearchResults(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 750 : 600,
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                {tab.icon && <img src={tab.icon} alt="" style={{ width: 16, height: 16 }} />}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 650,
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            marginTop: 'auto'
          }}
        >
          {logoutIcon && <img src={logoutIcon} alt="" style={{ width: 15, height: 15 }} />}
          Logout
        </button>
      </aside>

      {/* Main Container */}
      <main style={{ flexGrow: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100vh' }}>
        
        {/* Top Header Bar */}
        <header 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid var(--border-color)', 
            paddingBottom: '1.5rem', 
            marginBottom: '2.5rem' 
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Intelligent Knowledge Workspace
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Map ideas, link references, and synthesize network graphs.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
              {searchIcon && <img src={searchIcon} alt="" style={{ width: 14, height: 14 }} />}
            </span>
            <input
              type="text"
              placeholder="Search knowledge graph..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.2rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border 0.2s'
              }}
            />
          </div>
        </header>

        {/* Search Results Override View */}
        {searchQuery.trim() !== '' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Search Results for "{searchQuery}"</h2>
              <button 
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-secondary)' }}
              >
                Clear
              </button>
            </div>

            {searching ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filtering knowledge assets...</p>
            ) : searchResults && (searchResults.nodes.length > 0 || searchResults.links.length > 0) ? (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Node Results */}
                <div>
                  <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Matches ({searchResults.nodes.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {searchResults.nodes.map((node) => (
                      <div 
                        key={node.id} 
                        className="dashboard-card"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-surface)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                            {node.type}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{node.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{node.content}</p>
                        {node.tags && node.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                            {node.tags.map((tag) => (
                              <span key={tag} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', border: '1px solid var(--border-color)', borderRadius: '3px', color: 'var(--text-muted)' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connections Results */}
                <div>
                  <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Related Links</h3>
                  {searchResults.links.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {searchResults.links.map((link) => (
                        <div 
                          key={link.id} 
                          style={{
                            padding: '0.85rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface)',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div style={{ fontWeight: 650 }}>{getNodeTitleById(link.source)}</div>
                          <div style={{ color: 'var(--accent-indigo)', fontSize: '0.65rem', margin: '0.15rem 0', textTransform: 'uppercase', fontWeight: 700 }}>
                            ➡ [{link.label}] ➡
                          </div>
                          <div style={{ fontWeight: 650 }}>{getNodeTitleById(link.target)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No direct connections matched.</p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No matching nodes or connection loops found.</p>
              </div>
            )}
          </div>
        ) : (
          /* Normal Tab Content Switcher */
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* VIEW 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <Overview
                nodes={nodes}
                links={links}
                resourceNodes={resourceNodes}
                nodeType={nodeType}
                setNodeType={setNodeType}
                nodeTitle={nodeTitle}
                setNodeTitle={setNodeTitle}
                nodeContent={nodeContent}
                setNodeContent={setNodeContent}
                nodeTags={nodeTags}
                setNodeTags={setNodeTags}
                nodeUrl={nodeUrl}
                setNodeUrl={setNodeUrl}
                captureStatus={captureStatus}
                docFileName={docFileName}
                handleDocFileChange={handleDocFileChange}
                setDocFile={setDocFile}
                setDocFileName={setDocFileName}
                handleCapture={handleCapture}
                getAIInsights={getAIInsights}
              />
            )}

            {/* VIEW 2: CAPTURE & ORGANIZE */}
            {activeTab === 'capture' && (
              <Capture
                nodeType={nodeType}
                setNodeType={setNodeType}
                nodeTitle={nodeTitle}
                setNodeTitle={setNodeTitle}
                nodeContent={nodeContent}
                setNodeContent={setNodeContent}
                nodeTags={nodeTags}
                setNodeTags={setNodeTags}
                nodeUrl={nodeUrl}
                setNodeUrl={setNodeUrl}
                captureStatus={captureStatus}
                docFileName={docFileName}
                handleDocFileChange={handleDocFileChange}
                setDocFile={setDocFile}
                setDocFileName={setDocFileName}
                handleCapture={handleCapture}
                organizeFilter={organizeFilter}
                setOrganizeFilter={setOrganizeFilter}
                loadingGraph={loadingGraph}
                filteredOrganizeNodes={filteredOrganizeNodes}
                handleDeleteNode={handleDeleteNode}
              />
            )}

            {/* VIEW 3: REFERENCE RESOURCES */}
            {activeTab === 'resources' && (
              <Resources
                nodeType={nodeType}
                setNodeType={setNodeType}
                nodeTitle={nodeTitle}
                setNodeTitle={setNodeTitle}
                nodeContent={nodeContent}
                setNodeContent={setNodeContent}
                nodeTags={nodeTags}
                setNodeTags={setNodeTags}
                nodeUrl={nodeUrl}
                setNodeUrl={setNodeUrl}
                docFileName={docFileName}
                handleDocFileChange={handleDocFileChange}
                setDocFile={setDocFile}
                setDocFileName={setDocFileName}
                handleCapture={handleCapture}
                captureStatus={captureStatus}
                resourceNodes={resourceNodes}
              />
            )}

            {/* VIEW 4: CONNECTION EXPLORER */}
            {activeTab === 'connections' && (
              <Connections
                sourceNodeId={sourceNodeId}
                setSourceNodeId={setSourceNodeId}
                targetNodeId={targetNodeId}
                setTargetNodeId={setTargetNodeId}
                relationshipLabel={relationshipLabel}
                setRelationshipLabel={setRelationshipLabel}
                handleConnect={handleConnect}
                connectStatus={connectStatus}
                nodes={nodes}
                links={links}
                getNodeTitleById={getNodeTitleById}
              />
            )}

            {/* VIEW 5: AI INSIGHTS */}
            {activeTab === 'insights' && (
              <Insights
                getAIInsights={getAIInsights}
              />
            )}

            {/* VIEW 6: USER PROFILE */}
            {activeTab === 'profile' && (
              <Profile
                user={user}
                setUser={setUser}
                editAvatar={editAvatar}
                setEditAvatar={setEditAvatar}
                editName={editName}
                setEditName={setEditName}
                editEmail={editEmail}
                setEditEmail={setEditEmail}
                editPhone={editPhone}
                setEditPhone={setEditPhone}
                handleUpdateProfile={handleUpdateProfile}
                profileUpdateStatus={profileUpdateStatus}
                theme={theme}
                nodes={nodes}
                resourceNodes={resourceNodes}
              />
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

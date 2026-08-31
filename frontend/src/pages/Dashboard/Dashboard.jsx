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

// Import our new components
import InteractiveKnowledgeGraph from '../../components/Dashboard/InteractiveKnowledgeGraph';
import NodeDetailsPanel from '../../components/Dashboard/NodeDetailsPanel';
import ConnectKnowledgeModal from '../../components/Dashboard/ConnectKnowledgeModal';

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
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory')) || [];
    } catch {
      return [];
    }
  });

  // Selection states for multi-node summaries
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [combinedSummary, setCombinedSummary] = useState('');
  const [generatingCombined, setGeneratingCombined] = useState(false);


  const [selectedNode, setSelectedNode] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

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

  const [searchGraphExpanded, setSearchGraphExpanded] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('nl-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

      fetchGraphData();
    };

    initDashboard();
  }, [navigate]);

  async function fetchGraphData() {
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
  }

  // Keep selectedNode details updated if nodes change
  useEffect(() => {
    if (selectedNode) {
      const updated = nodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [nodes, selectedNode]);

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
        setNodeTitle('');
        setNodeContent('');
        setNodeTags('');
        setNodeUrl('');
        setDocFile(null);
        setDocFileName('');

        fetchGraphData();
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
        setNodes((prev) => prev.filter((node) => node.id !== id));
        setLinks((prev) => prev.filter((link) => link.source !== id && link.target !== id));
        if (selectedNode && selectedNode.id === id) {
          setSelectedNode(null);
        }
      } else {
        console.error('Failed to delete node:', res.message);
      }
    } catch (err) {
      console.error('Error deleting node:', err);
    }
  };

  // Delete Link Action
  const handleDeleteLink = async (id) => {
    try {
      const res = await graphService.deleteLink(id);
      if (res.success) {
        setLinks((prev) => prev.filter((link) => link.id !== id));
      } else {
        console.error('Failed to delete link:', res.message);
      }
    } catch (err) {
      console.error('Error deleting link:', err);
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
      // Add query to local history
      const updatedHistory = [val, ...searchHistory.filter(item => item !== val)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

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

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
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

  // Toggle selection checkbox for combined summarization
  const handleToggleSelectNode = (id) => {
    setSelectedNodeIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Generate Combined Summary of Selected nodes
  const handleGenerateCombinedSummary = async () => {
    if (selectedNodeIds.length === 0) return;
    setGeneratingCombined(true);
    setCombinedSummary('');
    try {
      const res = await graphService.generateMultiSummary(selectedNodeIds);
      if (res.success) {
        setCombinedSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to generate combined summary:', err);
    } finally {
      setGeneratingCombined(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedNodeIds([]);
    setCombinedSummary('');
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
            recommendedLinks.push({ source: nA, target: nB, tag: sharedTags[0] });
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
                  handleClearSelection();
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
              Map ideas, link references, and synthesize network graphs. (Press <kbd style={{ padding: '0.1rem 0.35rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>Ctrl K</kbd> to search)
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
              {searchIcon && <img src={searchIcon} alt="" style={{ width: 14, height: 14 }} />}
            </span>
            <input
              id="nl-search-input"
              type="text"
              placeholder="Search your knowledge..."
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

        {/* FLOATING MULTI-SELECT SUMMARY BAR */}
        {selectedNodeIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--accent-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 650 }}>
              Selected **{selectedNodeIds.length}** resources to summarize.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleGenerateCombinedSummary}
                style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.35rem 0.85rem', backgroundColor: 'var(--accent-indigo)', color: '#FFFFFF', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Summarize Selected
              </button>
              <button
                onClick={handleClearSelection}
                style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.35rem 0.85rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}

        {/* COMBINED SUMMARY PANEL */}
        {generatingCombined && (
          <div style={{ padding: '1.5rem', border: '1px dashed var(--accent-indigo)', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', margin: 0 }}>✦ Generating combined summary of selected assets...</p>
          </div>
        )}
        {combinedSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              marginBottom: '2rem',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setCombinedSummary('')}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear Summary
            </button>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {insightIcon && <img src={insightIcon} alt="" style={{ width: 14, height: 14 }} />}
              Combined Summary
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.55', whiteSpace: 'pre-wrap' }}>
              {combinedSummary}
            </div>
          </motion.div>
        )}

        {/* Search Results Override View */}
        {searchQuery.trim() !== '' ? (
          <div>

            {/* Header / History info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Conversational search matching "{searchQuery}"</h2>
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                  style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Clear Search
                </button>
              </div>

              {searchHistory.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Recent:</span>
                  {searchHistory.map((h, i) => (
                    <span
                      key={i}
                      onClick={() => handleSearch(h)}
                      style={{ cursor: 'pointer', color: 'var(--accent-indigo)', textDecoration: 'underline', padding: '0 0.2rem' }}
                    >
                      "{h}"
                    </span>
                  ))}
                  <button onClick={handleClearHistory} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent-pink)', fontSize: '0.65rem' }}>Clear History</button>
                </div>
              )}
            </div>

            {searching ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '3rem 1rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-indigo)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--accent-indigo)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Understanding your question...
                </span>
              </div>
            ) : searchResults ? (


              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* AI Answer Card */}
                  {searchResults.answer && (
                    <div
                      style={{
                        padding: '1.5rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                        {insightIcon && <img src={insightIcon} alt="" style={{ width: 15, height: 15 }} />}
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--accent-indigo)' }}>AI Synthesis Answer</h4>
                      </div>
                      <div className="search-markdown-answer" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {searchResults.answer}
                      </div>
                    </div>
                  )}

                  {/* Grouped Match categories */}
                  <div>
                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Matched Knowledge Clusters ({searchResults.nodes.length})</h3>
                    {searchResults.nodes.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {searchResults.nodes.map((node) => (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className="dashboard-card"
                            style={{
                              padding: '1.25rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--bg-surface)',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                                {node.type}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{node.title}</h4>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineClamp: 2 }}>{node.content.slice(0, 140)}...</p>

                            {/* Explanation match reason */}
                            {searchResults.reasons && searchResults.reasons[node.id] && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--accent-pink)', marginTop: '0.5rem', fontWeight: 650 }}>
                                Relevance: {searchResults.reasons[node.id]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No node items resolved in matches.</p>
                    )}
                  </div>

                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Query Network Graph</h4>
                      <button
                        onClick={() => setSearchGraphExpanded(!searchGraphExpanded)}
                        style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        {searchGraphExpanded ? 'Shrink' : 'Expand Visual'}
                      </button>
                    </div>

                    <InteractiveKnowledgeGraph
                      nodes={searchResults.nodes}
                      links={searchResults.links}
                      highlightedNodeIds={searchResults.nodes.map(n => n.id)}
                      onNodeClick={(node) => setSelectedNode(node)}
                      height={searchGraphExpanded ? 520 : 320}
                    />
                  </div>

                  {/* Summary options for matched cluster */}
                  <div style={{ padding: '1.5rem', borderRadius: '10px', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 800, margin: 0 }}>Synthesize Search Cluster</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                      Let AI synthesize these {searchResults.nodes.length} matched assets into a single cohesive summary.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedNodeIds(searchResults.nodes.map(n => n.id));
                        handleGenerateCombinedSummary();
                      }}
                      style={{
                        marginTop: '0.75rem',
                        fontSize: '0.7rem',
                        fontWeight: 750,
                        color: '#FFFFFF',
                        backgroundColor: 'var(--accent-indigo)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Generate Cluster Summary
                    </button>
                  </div>

                  {/* Sources References List */}
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sources</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {searchResults.nodes.map((node) => (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {node.title} ({node.type.toUpperCase()})
                        </div>
                      ))}
                    </div>
                  </div>
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
                onNodeClick={(node) => setSelectedNode(node)}
                selectedNodeIds={selectedNodeIds}
                onToggleSelectNode={handleToggleSelectNode}
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
                selectedNodeIds={selectedNodeIds}
                onToggleSelectNode={handleToggleSelectNode}
                onNodeClick={(node) => setSelectedNode(node)}
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
                selectedNodeIds={selectedNodeIds}
                onToggleSelectNode={handleToggleSelectNode}
                onNodeClick={(node) => setSelectedNode(node)}
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
                handleDeleteLink={handleDeleteLink}
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

      {/* DETAILED RESOURCE DRAWER SIDE PANEL */}
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onNodeNavigate={(item) => setSelectedNode(item)}
            onRefreshGraph={fetchGraphData}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* RELATIONSHIP BUILDER MODAL */}
      <AnimatePresence>
        {isConnectModalOpen && selectedNode && (
          <ConnectKnowledgeModal
            activeNode={selectedNode}
            allNodes={nodes}
            existingLinks={links}
            onClose={() => setIsConnectModalOpen(false)}
            onSave={fetchGraphData}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper for handling auth tokens
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const authService = {
  // Register user
  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Google Sign-In
  googleLogin: async (idToken, userDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: userDetails.name, 
          email: userDetails.email, 
          uid: userDetails.uid,
          idToken
        }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Google login API connection failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Get current user profile
  getMe: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Fetching user failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error('Forgot password request failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Reset Password
  resetPassword: async (token, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      return await response.json();
    } catch (error) {
      console.error('Reset password request failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Update Profile Details
  updateProfile: async (name, email, phone, avatar) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, phone, avatar }),
      });
      return await response.json();
    } catch (error) {
      console.error('Profile update request failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Sends 2fa verification OTP
  send2FAOtp: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/send-otp`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Sending 2FA OTP failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Verify and enable 2fa
  verifyAndEnable2FA: async (otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/verify-enable`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ otp }),
      });
      return await response.json();
    } catch (error) {
      console.error('Verifying 2FA activation failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Disable 2FA
  disable2FA: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Disabling 2FA failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Verify login 2fa OTP
  verify2FALogin: async (userId, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Verifying 2FA login failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  }
};

export const graphService = {
  // Fetch complete graph nodes and connections
  getGraph: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Fetching graph failed:', error);
      return { success: false, nodes: [], links: [] };
    }
  },

  // Create a new graph node
  createNode: async (nodeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(nodeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Creating node failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Link two existing graph nodes
  createLink: async (sourceId, targetId, label) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/links`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ source: sourceId, target: targetId, label }),
      });
      return await response.json();
    } catch (error) {
      console.error('Linking nodes failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Delete a graph node
  deleteNode: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Deleting node failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Delete a graph link (relationship)
  deleteLink: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/links/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Deleting link failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Conversational natural language search query
  search: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Search failed:', error);
      return { success: false, results: { nodes: [], links: [], answer: '', reasons: {} } };
    }
  },

  // Generate AI summary for a node
  generateNodeSummary: async (nodeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes/${nodeId}/summary`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Generating node summary failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Generate combined AI summary for multiple selected nodes
  generateMultiSummary: async (nodeIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes/summarize-selected`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ids: nodeIds }),
      });
      return await response.json();
    } catch (error) {
      console.error('Generating combined summary failed:', error);
      return { success: false, message: 'Server connection error' };
    }
  },

  // Get AI insights
  getAIInsights: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/insights`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Fetching AI insights failed:', error);
      return { success: false, insights: [] };
    }
  },

  // Get AI suggested connections
  getSuggestedConnections: async (nodeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes/${nodeId}/suggestions`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Fetching suggested connections failed:', error);
      return { success: false, suggestions: [] };
    }
  },

  // Get direct related knowledge nodes
  getRelatedKnowledge: async (nodeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/nodes/${nodeId}/related`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Fetching related knowledge failed:', error);
      return { success: false, related: [] };
    }
  }
};

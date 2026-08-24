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
      return { success: false, results: { nodes: [], links: [] } };
    }
  }
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const graphRoutes = require('./routes/graphRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KnowledgeGraph AI API (Skeleton Mode)',
    version: '1.0.0',
    status: 'Running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/graph', graphRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

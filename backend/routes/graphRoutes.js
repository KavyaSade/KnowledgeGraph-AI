const express = require('express');
const router = express.Router();
const { 
  getGraphData, 
  createNode, 
  createLink, 
  deleteLink,
  deleteNode, 
  searchGraph,
  getNodeSummary,
  summarizeSelected,
  getAIInsights,
  suggestConnections,
  getRelatedKnowledge
} = require('../controllers/graphController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGraphData);
router.post('/nodes', protect, createNode);
router.post('/links', protect, createLink);
router.delete('/links/:id', protect, deleteLink);
router.delete('/nodes/:id', protect, deleteNode);
router.get('/search', protect, searchGraph);

// AI & Relationship Extensions
router.post('/nodes/:id/summary', protect, getNodeSummary);
router.post('/nodes/summarize-selected', protect, summarizeSelected);
router.get('/insights', protect, getAIInsights);
router.get('/nodes/:id/suggestions', protect, suggestConnections);
router.get('/nodes/:id/related', protect, getRelatedKnowledge);

module.exports = router;

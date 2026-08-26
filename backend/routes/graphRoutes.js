const express = require('express');
const router = express.Router();
const { getGraphData, createNode, createLink, deleteNode, searchGraph } = require('../controllers/graphController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGraphData);
router.post('/nodes', protect, createNode);
router.post('/links', protect, createLink);
router.delete('/nodes/:id', protect, deleteNode);
router.get('/search', protect, searchGraph);

module.exports = router;

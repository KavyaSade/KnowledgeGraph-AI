const express = require('express');
const router = express.Router();
const { getGraphData, createNode, createLink, searchGraph } = require('../controllers/graphController');

router.get('/', getGraphData);
router.post('/nodes', createNode);
router.post('/links', createLink);
router.get('/search', searchGraph);

module.exports = router;

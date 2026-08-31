const GraphNode = require('../models/GraphNode');
const Link = require('../models/Link');
const relationshipService = require('../services/relationshipService');
const aiService = require('../services/aiService');
const searchService = require('../services/searchService');
const knowledgeService = require('../services/knowledgeService');

// Get complete knowledge graph data for the logged-in user
exports.getGraphData = async (req, res) => {
  try {
    const nodes = await GraphNode.find({ user: req.user.id });
    const links = await Link.find({ user: req.user.id });

    const formattedNodes = nodes.map(node => ({
      id: node._id.toString(),
      type: node.type,
      title: node.title,
      content: node.content,
      tags: node.tags,
      metadata: node.metadata || {},
      aiSummary: node.aiSummary || '',
      createdAt: node.createdAt
    }));

    const formattedLinks = links.map(link => ({
      id: link._id.toString(),
      source: link.source.toString(),
      target: link.target.toString(),
      label: link.label,
      strength: link.strength,
      createdAt: link.createdAt
    }));

    res.status(200).json({
      success: true,
      nodes: formattedNodes,
      links: formattedLinks,
    });
  } catch (err) {
    console.error('Error fetching graph data:', err);
    res.status(500).json({ success: false, message: 'Server error fetching graph data' });
  }
};

// Create a new node in the graph
exports.createNode = async (req, res) => {
  const { type, title, content, tags, metadata } = req.body;

  if (!type || !title) {
    return res.status(400).json({ success: false, message: 'Please provide type and title' });
  }

  try {
    const node = await GraphNode.create({
      user: req.user.id,
      type,
      title,
      content: content || '',
      tags: tags || [],
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      message: 'Node created successfully',
      node: {
        id: node._id.toString(),
        type: node.type,
        title: node.title,
        content: node.content,
        tags: node.tags,
        metadata: node.metadata,
        aiSummary: node.aiSummary || '',
        createdAt: node.createdAt
      }
    });
  } catch (err) {
    console.error('Error creating node:', err);
    res.status(500).json({ success: false, message: 'Server error creating node' });
  }
};

// Create a new link (connection) between nodes
exports.createLink = async (req, res) => {
  const { source, target, label } = req.body;

  if (!source || !target) {
    return res.status(400).json({ success: false, message: 'Please provide source and target nodes' });
  }

  try {
    const link = await relationshipService.createRelationship(req.user.id, source, target, label);
    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      link: {
        id: link._id.toString(),
        source: link.source.toString(),
        target: link.target.toString(),
        label: link.label,
        strength: link.strength,
        createdAt: link.createdAt
      }
    });
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating link' });
  }
};

// Delete a connection between nodes
exports.deleteLink = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await relationshipService.deleteRelationship(req.user.id, id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ success: false, message: 'Server error deleting link' });
  }
};

// Delete a node and its connections
exports.deleteNode = async (req, res) => {
  const { id } = req.params;

  try {
    const node = await GraphNode.findOneAndDelete({ _id: id, user: req.user.id });

    if (!node) {
      return res.status(404).json({ success: false, message: 'Node not found or unauthorized' });
    }

    // Also delete any links associated with this node
    await Link.deleteMany({
      user: req.user.id,
      $or: [{ source: id }, { target: id }]
    });

    res.status(200).json({ success: true, message: 'Node and connections deleted successfully' });
  } catch (err) {
    console.error('Error deleting node:', err);
    res.status(500).json({ success: false, message: 'Server error deleting node' });
  }
};

// Natural language search
exports.searchGraph = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, message: 'Please provide search query' });
  }

  try {
    const searchResults = await searchService.search(req.user.id, q);
    res.status(200).json({
      success: true,
      query: q,
      results: searchResults
    });
  } catch (err) {
    console.error('Search graph error:', err);
    res.status(500).json({ success: false, message: 'Server error during graph search' });
  }
};

// Generates AI summary for a single node
exports.getNodeSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const node = await knowledgeService.getNodeById(req.user.id, id);
    if (!node) {
      return res.status(404).json({ success: false, message: 'Node not found or unauthorized' });
    }

    const relatedNodes = await relationshipService.getRelatedKnowledge(req.user.id, id);
    const summary = await aiService.generateSummary(node, relatedNodes);

    node.aiSummary = summary;
    await node.save();

    res.status(200).json({
      success: true,
      summary
    });
  } catch (err) {
    console.error('Error generating node summary:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error generating summary' });
  }
};

// Generates combined AI summary for multiple selected nodes
exports.summarizeSelected = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide array of node ids to summarize' });
  }

  try {
    const nodes = await GraphNode.find({ _id: { $in: ids }, user: req.user.id });
    if (nodes.length !== ids.length) {
      return res.status(403).json({ success: false, message: 'Unauthorized or invalid node IDs' });
    }

    const summary = await aiService.generateMultiSummary(nodes);
    res.status(200).json({
      success: true,
      summary
    });
  } catch (err) {
    console.error('Error generating combined summary:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error generating combined summary' });
  }
};

// Generates custom graph insights
exports.getAIInsights = async (req, res) => {
  try {
    const nodes = await GraphNode.find({ user: req.user.id });
    const links = await Link.find({ user: req.user.id });
    const insights = await aiService.generateInsights(nodes, links);

    res.status(200).json({
      success: true,
      insights
    });
  } catch (err) {
    console.error('Error generating insights:', err);
    res.status(500).json({ success: false, message: 'Server error generating insights' });
  }
};

// Get AI suggested connections for a node
exports.suggestConnections = async (req, res) => {
  const { id } = req.params;

  try {
    const node = await knowledgeService.getNodeById(req.user.id, id);
    if (!node) {
      return res.status(404).json({ success: false, message: 'Node not found or unauthorized' });
    }

    const allNodes = await knowledgeService.getAllNodes(req.user.id);
    const suggestions = await aiService.suggestConnections(node, allNodes);

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (err) {
    console.error('Error suggesting connections:', err);
    res.status(500).json({ success: false, message: 'Server error suggesting connections' });
  }
};

// Gets the list of direct related knowledge for a node
exports.getRelatedKnowledge = async (req, res) => {
  const { id } = req.params;

  try {
    const related = await relationshipService.getRelatedKnowledge(req.user.id, id);
    res.status(200).json({
      success: true,
      related
    });
  } catch (err) {
    console.error('Error fetching related knowledge:', err);
    res.status(500).json({ success: false, message: 'Server error fetching related knowledge' });
  }
};

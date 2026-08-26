const GraphNode = require('../models/GraphNode');
const Link = require('../models/Link');

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
    // Verify source and target nodes exist and belong to the user
    const sourceNode = await GraphNode.findOne({ _id: source, user: req.user.id });
    const targetNode = await GraphNode.findOne({ _id: target, user: req.user.id });

    if (!sourceNode || !targetNode) {
      return res.status(404).json({ success: false, message: 'Source or target node not found' });
    }

    // Check if the link already exists
    let link = await Link.findOne({
      user: req.user.id,
      source,
      target,
      label: label || 'connected_to'
    });

    if (link) {
      return res.status(400).json({ success: false, message: 'Link already exists between these nodes' });
    }

    link = await Link.create({
      user: req.user.id,
      source,
      target,
      label: label || 'connected_to'
    });

    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      link: {
        id: link._id.toString(),
        source: link.source.toString(),
        target: link.target.toString(),
        label: link.label,
        createdAt: link.createdAt
      }
    });
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ success: false, message: 'Server error creating link' });
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
    // Find all nodes matching query in title, content, or tags
    const matchedNodes = await GraphNode.find({
      user: req.user.id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    const formattedNodes = matchedNodes.map(node => ({
      id: node._id.toString(),
      type: node.type,
      title: node.title,
      content: node.content,
      tags: node.tags,
      metadata: node.metadata || {},
      createdAt: node.createdAt
    }));

    const matchedNodeIds = formattedNodes.map(n => n.id);

    // Find links that connect the matched nodes
    const matchedLinks = await Link.find({
      user: req.user.id,
      $or: [
        { source: { $in: matchedNodeIds } },
        { target: { $in: matchedNodeIds } }
      ]
    });

    const formattedLinks = matchedLinks.map(link => ({
      id: link._id.toString(),
      source: link.source.toString(),
      target: link.target.toString(),
      label: link.label,
      strength: link.strength,
      createdAt: link.createdAt
    }));

    res.status(200).json({
      success: true,
      query: q,
      results: {
        nodes: formattedNodes,
        links: formattedLinks,
      },
    });
  } catch (err) {
    console.error('Search graph error:', err);
    res.status(500).json({ success: false, message: 'Server error during graph search' });
  }
};

const Link = require('../models/Link');
const GraphNode = require('../models/GraphNode');

const relationshipService = {
  // Create relationship between source and target
  createRelationship: async (userId, sourceId, targetId, label) => {
    // 1. Guard self-links
    if (sourceId === targetId) {
      throw new Error('Cannot link a resource to itself');
    }

    // 2. Verify source and target exist and belong to the user
    const sourceNode = await GraphNode.findOne({ _id: sourceId, user: userId });
    const targetNode = await GraphNode.findOne({ _id: targetId, user: userId });
    if (!sourceNode || !targetNode) {
      throw new Error('Source or target resource not found');
    }

    // 3. Prevent duplicate relationships
    const labelTrimmed = label ? label.trim() : 'connected_to';
    const existingLink = await Link.findOne({
      user: userId,
      source: sourceId,
      target: targetId,
      label: labelTrimmed
    });

    if (existingLink) {
      return existingLink;
    }

    return await Link.create({
      user: userId,
      source: sourceId,
      target: targetId,
      label: labelTrimmed
    });
  },

  // Delete relationship
  deleteRelationship: async (userId, linkId) => {
    const result = await Link.findOneAndDelete({ _id: linkId, user: userId });
    if (!result) {
      throw new Error('Relationship not found or unauthorized');
    }
    return result;
  },

  // Get related knowledge items for a specific resource
  getRelatedKnowledge: async (userId, nodeId) => {
    // Find all links where source or target is the node
    const links = await Link.find({
      user: userId,
      $or: [{ source: nodeId }, { target: nodeId }]
    });

    // Extract other node IDs
    const relatedNodeIds = links.map(link => 
      link.source.toString() === nodeId.toString() ? link.target : link.source
    );

    // Fetch related nodes
    const nodes = await GraphNode.find({
      user: userId,
      _id: { $in: relatedNodeIds }
    });

    // Map each related node with its relationship details
    return nodes.map(node => {
      const link = links.find(l => 
        (l.source.toString() === nodeId.toString() && l.target.toString() === node._id.toString()) ||
        (l.target.toString() === nodeId.toString() && l.source.toString() === node._id.toString())
      );
      
      if (!link) return null;
      
      const direction = link.source.toString() === nodeId.toString() ? 'outgoing' : 'incoming';

      return {
        id: node._id.toString(),
        type: node.type,
        title: node.title,
        content: node.content,
        tags: node.tags,
        metadata: node.metadata || {},
        relationship: {
          id: link._id.toString(),
          label: link.label,
          strength: link.strength,
          direction
        }
      };
    }).filter(Boolean);
  },

  // Get all user relationships
  getKnowledgeConnections: async (userId) => {
    return await Link.find({ user: userId });
  }
};

module.exports = relationshipService;

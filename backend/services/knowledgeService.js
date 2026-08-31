const GraphNode = require('../models/GraphNode');

const knowledgeService = {
  // Get all nodes for a user
  getAllNodes: async (userId) => {
    return await GraphNode.find({ user: userId });
  },

  // Get specific node with ownership validation
  getNodeById: async (userId, nodeId) => {
    return await GraphNode.findOne({ _id: nodeId, user: userId });
  },

  // Save node
  createNode: async (userId, nodeData) => {
    return await GraphNode.create({
      user: userId,
      ...nodeData
    });
  }
};

module.exports = knowledgeService;

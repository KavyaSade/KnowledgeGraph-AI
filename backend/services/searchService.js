const GraphNode = require('../models/GraphNode');
const Link = require('../models/Link');
const aiService = require('./aiService');

const searchService = {
  search: async (userId, query) => {
    if (!query || !query.trim()) {
      return { answer: '', nodes: [], links: [], reasons: {} };
    }

    // 1. Fetch complete graph context for this user
    const nodes = await GraphNode.find({ user: userId });
    const links = await Link.find({ user: userId });

    // 2. Calls AI answer engine
    const aiResult = await aiService.answerKnowledgeQuestion(query, nodes, links);

    // 3. Resolve matched node details
    const matchedNodes = nodes.filter(node => 
      aiResult.relevantNodeIds.includes(node._id.toString())
    );

    // 4. Resolve links that connect the matched nodes
    const matchedNodeIds = matchedNodes.map(n => n._id.toString());
    const matchedLinks = links.filter(link => 
      matchedNodeIds.includes(link.source.toString()) || 
      matchedNodeIds.includes(link.target.toString())
    );

    // Format output matching API schemas
    const formattedNodes = matchedNodes.map(node => ({
      id: node._id.toString(),
      type: node.type,
      title: node.title,
      content: node.content,
      tags: node.tags,
      metadata: node.metadata || {},
      createdAt: node.createdAt
    }));

    const formattedLinks = matchedLinks.map(link => ({
      id: link._id.toString(),
      source: link.source.toString(),
      target: link.target.toString(),
      label: link.label,
      strength: link.strength,
      createdAt: link.createdAt
    }));

    return {
      answer: aiResult.answer,
      nodes: formattedNodes,
      links: formattedLinks,
      reasons: aiResult.reasons || {}
    };
  }
};

module.exports = searchService;

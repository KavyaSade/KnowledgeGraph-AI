/**
 * Graph Controller (Mock APIs for frontend connection)
 */

// Initial mock data for the personal knowledge graph
let mockNodes = [
  { id: '1', type: 'project', title: 'Machine Learning Model', content: 'Developing a neural network for prediction.', tags: ['ML', 'Python'] },
  { id: '2', type: 'person', title: 'Jane Smith', content: 'Data scientist collaborator.', tags: ['Team', 'AI'] },
  { id: '3', type: 'note', title: 'Neural Net Architecture', content: 'Using ResNet-50 as backbone.', tags: ['Deep Learning', 'ResNet'] },
  { id: '4', type: 'document', title: 'Project Proposal.pdf', content: 'Q3 project outline and deliverables.', tags: ['Planning', 'PDF'] },
  { id: '5', type: 'topic', title: 'Artificial Intelligence', content: 'Broad category of intelligent systems.', tags: ['Core'] },
  { id: '6', type: 'bookmark', title: 'Mongoose Documentation', content: 'Useful ODM guide.', tags: ['Docs', 'MongoDB'], metadata: { url: 'https://mongoosejs.com/' } },
  { id: '7', type: 'idea', title: 'Knowledge Graph Integration', content: 'Integrate graph representation with notes.', tags: ['Idea', 'Brainstorm'] },
];

let mockLinks = [
  { id: 'l1', source: '1', target: '2', label: 'collaborator_on' },
  { id: 'l2', source: '3', target: '1', label: 'implemented_in' },
  { id: 'l3', source: '4', target: '1', label: 'defines' },
  { id: 'l4', source: '1', target: '5', label: 'subfield_of' },
  { id: 'l5', source: '2', target: '5', label: 'specializes_in' },
  { id: 'l6', source: '7', target: '1', label: 'feature_of' },
  { id: 'l7', source: '3', target: '7', label: 'inspires' },
];

// Get complete knowledge graph data
exports.getGraphData = async (req, res) => {
  res.status(200).json({
    success: true,
    nodes: mockNodes,
    links: mockLinks,
  });
};

// Create a new node in the graph
exports.createNode = async (req, res) => {
  const { type, title, content, tags, metadata } = req.body;

  if (!type || !title) {
    return res.status(400).json({ success: false, message: 'Please provide type and title' });
  }

  const newNode = {
    id: String(mockNodes.length + 1),
    type,
    title,
    content: content || '',
    tags: tags || [],
    metadata: metadata || {},
    createdAt: new Date(),
  };

  mockNodes.push(newNode);

  res.status(201).json({
    success: true,
    message: 'Node created successfully (Mock API)',
    node: newNode,
  });
};

//Create a new link (connection) between nodes
exports.createLink = async (req, res) => {
  const { source, target, label } = req.body;

  if (!source || !target) {
    return res.status(400).json({ success: false, message: 'Please provide source and target nodes' });
  }

  const newLink = {
    id: `l${mockLinks.length + 1}`,
    source,
    target,
    label: label || 'connected_to',
    createdAt: new Date(),
  };

  mockLinks.push(newLink);

  res.status(201).json({
    success: true,
    message: 'Link created successfully (Mock API)',
    link: newLink,
  });
};

// Natural language search 
// GET /api/graph/search

exports.searchGraph = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, message: 'Please provide search query' });
  }

  const query = q.toLowerCase();
  
  // Filter nodes matching the query in title, content, or tags
  const matchedNodes = mockNodes.filter(
    (node) =>
      node.title.toLowerCase().includes(query) ||
      node.content.toLowerCase().includes(query) ||
      node.tags.some((tag) => tag.toLowerCase().includes(query))
  );

  // Find links connecting the matched nodes
  const matchedNodeIds = matchedNodes.map((n) => n.id);
  const matchedLinks = mockLinks.filter(
    (link) => matchedNodeIds.includes(link.source) || matchedNodeIds.includes(link.target)
  );

  res.status(200).json({
    success: true,
    query: q,
    results: {
      nodes: matchedNodes,
      links: matchedLinks,
    },
  });
};

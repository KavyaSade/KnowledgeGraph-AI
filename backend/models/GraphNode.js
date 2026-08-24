const mongoose = require('mongoose');

const graphNodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['project', 'person', 'note', 'document', 'idea', 'topic', 'bookmark'],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a node title'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  metadata: {
    url: String,        // For bookmarks
    author: String,     // For documents or ideas
    color: String,      // Visual styling in the graph
    position: {         // Graphical positioning if needed
      x: Number,
      y: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GraphNode', graphNodeSchema);

const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GraphNode',
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GraphNode',
    required: true,
  },
  label: {
    type: String,
    default: 'connected_to',
    trim: true,
  },
  strength: {
    type: Number,
    default: 1.0, // Weight or AI confidence score of connection
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensures a user doesn't have duplicate links for the exact same source, target, and label
linkSchema.index({ user: 1, source: 1, target: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('Link', linkSchema);

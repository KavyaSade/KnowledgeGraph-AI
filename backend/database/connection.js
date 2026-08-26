const mongoose = require('mongoose');

// Fallback to local MongoDB URI if environment variable is not defined
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_graph_ai';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[WARNING] MongoDB not running: ${error.message}`);
    console.log('Backend will run in sandbox mode with simulated database operations.');
  }
};

module.exports = connectDB;

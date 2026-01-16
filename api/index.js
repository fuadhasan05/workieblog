// Vercel Serverless Function Handler
import app from '../server/index.js';
import { connectToMongoDB } from '../server/utils/mongodb.js';

// Ensure MongoDB is connected before handling requests
let isConnected = false;

export default async function handler(req, res) {
  try {
    // Connect to MongoDB on first request
    if (!isConnected) {
      await connectToMongoDB();
      isConnected = true;
    }
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

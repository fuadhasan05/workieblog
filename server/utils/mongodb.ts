import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workieblog';
const DB_NAME = process.env.MONGODB_DB_NAME || 'workieblog';

interface IConnection {
  isConnected?: number;
}

const connection: IConnection = {};

export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  if (connection.isConnected) {
    console.log('Already connected to MongoDB');
    return mongoose;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log(`MongoDB connected successfully to database: ${DB_NAME}`);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export const disconnectFromMongoDB = async (): Promise<void> => {
  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = 0;
    console.log('Disconnected from MongoDB');
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectFromMongoDB();
  process.exit(0);
});

export default mongoose;
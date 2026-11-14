import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance using Mongoose.
 * Supports connection event listening and graceful shutdown.
 * 
 * @param {string} [customUri] - Optional URI override (used during testing)
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  // Prevent multiple connections if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Attach connection lifecycle event handlers once
  if (mongoose.connection.listenerCount('error') === 0) {
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('MongoDB disconnected. Attempting reconnection...');
      }
    });

    mongoose.connection.on('connected', () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log('MongoDB connected successfully.');
      }
    });
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true, // Build indexes on startup
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if host is unreachable
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log(`Connected to MongoDB host: ${conn.connection.host}, database: ${conn.connection.name}`);
    }

    return conn;
  } catch (error) {
    console.error('Failed to establish MongoDB connection:', error.message);
    throw error;
  }
};

/**
 * Gracefully disconnect from MongoDB.
 * Useful for automated tests and application shutdown.
 */
export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export default { connectDB, disconnectDB };


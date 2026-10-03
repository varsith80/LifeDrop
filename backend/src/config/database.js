const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('./environment');

let memoryServerInstance = null;

const connectDB = async () => {
  try {
    let uri = config.mongoUri;

    if (!uri || uri === 'memory' || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      // Try connecting to configured URI first if provided
      if (uri && uri !== 'memory') {
        try {
          const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000,
          });
          console.log(`[Database] Connected to external MongoDB: ${conn.connection.host}`);
          return conn;
        } catch (localErr) {
          console.warn(`[Database] Local MongoDB not reachable (${localErr.message}). Initializing embedded in-memory MongoDB...`);
        }
      }

      // Initialize MongoMemoryServer for reliable, friction-free local execution
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'hemolinkDB',
        },
      });
      uri = memoryServerInstance.getUri();
      console.log(`[Database] In-memory MongoDB instance started at: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully to database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      memoryServerInstance = null;
    }
    console.log('[Database] MongoDB connection closed.');
  } catch (error) {
    console.error(`[Database] Disconnect error: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };

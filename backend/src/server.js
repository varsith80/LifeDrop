const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');
const notificationService = require('./services/notificationService');
const { initEscalationJob } = require('./jobs/escalationJob');
const { initExpiryJob } = require('./jobs/expiryJob');
const { initReminderJob } = require('./jobs/reminderJob');

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT'],
  },
});

// Configure Socket.IO in notificationService
notificationService.setSocketIO(io);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // User joins their personal room for targeted alerts
  socket.on('join:user', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined room user:${userId}`);
    }
  });

  // Client joins specific emergency request room for live timeline updates
  socket.on('join:request', (requestId) => {
    if (requestId) {
      socket.join(`request:${requestId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined room request:${requestId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed demo data if database is empty
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding comprehensive demo data...');
      const seed = require('./utils/seedData');
      await seed(false);
    }

    // Start background scheduled jobs in non-test mode
    if (config.nodeEnv !== 'test') {
      initEscalationJob();
      initExpiryJob();
      initReminderJob();
    }

    server.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 HemoLink API Server running on port ${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Health check: http://localhost:${config.port}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing HTTP server and database...');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

if (require.main === module) {
  startServer();
}

module.exports = { app, server, io };

import 'dotenv/config';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { validateProductionEnvironment } from './utils/envValidator.js';

const PORT = parseInt(process.env.PORT, 10) || 5001;

// Initialize server and database connection
export const startServer = async () => {
  try {
    const envCheck = validateProductionEnvironment();
    if (!envCheck.valid) {
      console.error('❌ Refusing to start production server due to invalid configuration:');
      for (const err of envCheck.errors) {
        console.error(`   - ${err}`);
      }
      process.exit(1);
    }

    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('⚠️ MONGODB_URI is not set. Database-backed routes will return 503 until connected.');
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 ClearFiling API Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });

    // Graceful shutdown handling with force-exit timeout for keep-alive sockets
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      const forceTimer = setTimeout(() => {
        console.error('Forced shutdown after timeout waiting for open connections.');
        process.exit(1);
      }, 10000);
      forceTimer.unref();

      server.close(async () => {
        await disconnectDB();
        console.log('Server and database connections closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    return server;
  } catch (error) {
    console.error('Fatal error starting ClearFiling server:', error.message);
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

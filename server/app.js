import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import corsOptions from './config/cors.js';
import authRoutes from './routes/authRoutes.js';
import adminCategoryRoutes from './routes/adminCategoryRoutes.js';
import adminDocumentRoutes from './routes/adminDocumentRoutes.js';
import publicDocumentRoutes from './routes/publicDocumentRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

/**
 * Resolve safe Express trust proxy setting.
 * Avoids blindly trusting arbitrary multi-hop headers when not configured.
 */
export const resolveTrustProxy = () => {
  const raw = process.env.TRUST_PROXY;
  if (raw !== undefined && raw !== '') {
    const normalized = String(raw).trim().toLowerCase();
    if (normalized === 'false' || normalized === '0') {
      return false;
    }
    if (/^\d+$/.test(normalized)) {
      return Number(normalized);
    }
  }
  return process.env.NODE_ENV === 'production' ? 1 : false;
};

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

const requireDatabaseReady = (req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Database connection is not ready.',
    });
  }
  next();
};

const app = express();

// 1. Reverse Proxy Trust Configuration (1 hop by default in production)
app.set('trust proxy', resolveTrustProxy());

// 2. Security Headers via Helmet
app.use(helmet());

// 3. Cross-Origin Resource Sharing with Credentials
app.use(cors(corsOptions));

// 4. Cookie Parser for reading HttpOnly JWT session cookies
app.use(cookieParser());

// 5. Request Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Health & Database Readiness Checks
app.get('/api/status', (req, res) => {
  const dbConnected = isDatabaseReady();
  if (!dbConnected) {
    return res.status(503).json({
      status: 'degraded',
      message: 'ClearFiling API is running, but database is unavailable.',
      database: 'disconnected',
    });
  }

  return res.status(200).json({
    status: 'online',
    message: 'ClearFiling API is running',
    database: 'connected',
  });
});

app.get('/api/health/ready', (req, res) => {
  const dbConnected = isDatabaseReady();
  return res.status(dbConnected ? 200 : 503).json({
    ready: dbConnected,
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// 7. Public APIs (DB readiness gated)
app.use('/api/public', requireDatabaseReady, publicDocumentRoutes);

// 8. Admin Authentication & Management APIs (DB readiness gated)
app.use('/api/admin/auth', requireDatabaseReady, authRoutes);
app.use('/api/admin/categories', requireDatabaseReady, adminCategoryRoutes);
app.use('/api/admin/documents', requireDatabaseReady, adminDocumentRoutes);

// 9. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

/**
 * CORS configuration restricting access to approved ClearFiling domains.
 * Prevents wildcard access when credentials (HttpOnly cookies) are enabled.
 */

const isLoopbackOrigin = (origin = '') =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin);

export const getAllowedOrigins = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowed = [];

  if (process.env.CLIENT_ORIGIN) {
    allowed.push(...process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()));
  } else {
    allowed.push('https://www.clearfiling.co.in', 'https://clearfiling.co.in');
  }

  if (process.env.ADMIN_ORIGIN) {
    allowed.push(...process.env.ADMIN_ORIGIN.split(',').map((o) => o.trim()));
  } else {
    allowed.push('https://admin.clearfiling.co.in');
  }

  // Include local development origins ONLY outside production
  if (!isProduction) {
    allowed.push(
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    );
  }

  return [...new Set(allowed.filter(Boolean))].filter(
    (origin) => !isProduction || !isLoopbackOrigin(origin)
  );
};

export const corsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) with no origin
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
    }
  },
  credentials: true, // Allow cookies across origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'Accept'],
  maxAge: 86400, // 24 hours pre-flight caching
};

export default corsOptions;

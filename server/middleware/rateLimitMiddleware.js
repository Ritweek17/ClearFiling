import rateLimit from 'express-rate-limit';

const createAdaptiveLimiter = ({ windowMs, prodMax, testOverrideMax = 5, message }) =>
  rateLimit({
    windowMs,
    max: (req) => {
      if (process.env.NODE_ENV === 'test' && req.headers['x-test-rate-limit']) {
        return testOverrideMax;
      }
      if (process.env.NODE_ENV === 'test') {
        return 1000;
      }
      return prodMax;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
    handler: (req, res, next, options) => {
      res.status(429).json(options.message);
    },
  });

/**
 * Rate limiter for admin login endpoint to prevent brute-force credential stuffing.
 * 5 requests per 15-minute window per IP.
 */
export const loginRateLimiter = createAdaptiveLimiter({
  windowMs: 15 * 60 * 1000,
  prodMax: 5,
  testOverrideMax: 5,
  message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
});

/**
 * Practical rate limiter for public document listing, detail views, and categories.
 * 120 requests per minute per IP.
 */
export const publicBrowseRateLimiter = createAdaptiveLimiter({
  windowMs: 60 * 1000,
  prodMax: 120,
  testOverrideMax: 5,
  message: 'Too many document requests from this IP. Please try again shortly.',
});

/**
 * Rate limiter for public document downloads to limit scraping/bandwidth abuse.
 * 60 requests per 5-minute window per IP.
 */
export const publicDownloadRateLimiter = createAdaptiveLimiter({
  windowMs: 5 * 60 * 1000,
  prodMax: 60,
  testOverrideMax: 5,
  message: 'Too many download requests from this IP. Please try again in a few minutes.',
});

export default {
  loginRateLimiter,
  publicBrowseRateLimiter,
  publicDownloadRateLimiter,
};

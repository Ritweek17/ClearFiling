import { getAllowedOrigins } from '../config/cors.js';
import { COOKIE_NAME } from '../utils/tokenUtils.js';

/**
 * CSRF Protection Middleware for Cookie-Authenticated Requests.
 * 
 * Protects state-changing operations (POST, PUT, PATCH, DELETE) against Cross-Site Request Forgery.
 * Enforces dual-layer verification:
 * 1. Checks that the request includes the standard custom header `X-Requested-With: XMLHttpRequest`
 *    (which cannot be attached in standard cross-origin simple form submissions without CORS pre-flight).
 * 2. Or validates that the `Origin` or `Referer` matches our strict allowed origins.
 */
export const csrfProtection = (req, res, next) => {
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  // Safe read-only requests (GET, HEAD, OPTIONS) do not require CSRF token checks
  if (!isStateChanging) {
    return next();
  }

  // Exempt unauthenticated routes like login (cookie is not established yet)
  if (req.path.endsWith('/auth/login')) {
    return next();
  }

  // Only enforce if the request is carrying an authentication cookie
  const hasAuthCookie = Boolean(req.cookies?.[COOKIE_NAME]);
  if (!hasAuthCookie) {
    return next(); // Unauthenticated or token-based requests handled by authMiddleware
  }

  const requestedWith = req.headers['x-requested-with'];
  const customCsrfHeader = req.headers['x-csrf-token'];
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const allowedOrigins = getAllowedOrigins();

  // 1. Check for custom anti-CSRF headers
  const hasCustomHeader =
    requestedWith === 'XMLHttpRequest' ||
    Boolean(customCsrfHeader) ||
    req.headers['x-clearfiling-admin'] === 'true';

  // 2. Check exact origin/referer-origin match
  let originMatches = false;
  if (origin && allowedOrigins.includes(origin)) {
    originMatches = true;
  } else if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      originMatches = allowedOrigins.includes(refererOrigin);
    } catch {
      originMatches = false;
    }
  }

  // Pass if either trusted custom header is present or origin is verified
  if (hasCustomHeader || originMatches) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'CSRF validation failed: Missing security header (X-Requested-With) or untrusted origin.',
  });
};

export default csrfProtection;


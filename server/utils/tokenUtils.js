import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'clearfiling_admin_token';
const DEFAULT_EXPIRATION = '8h';
const DEFAULT_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const JWT_ALGORITHM = 'HS256';
const MIN_PRODUCTION_SECRET_LENGTH = 32;

const UNIT_MULTIPLIERS_MS = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Convert JWT expiresIn strings (e.g., "8h", "30m", "7d", "3600s") or numeric
 * seconds into milliseconds so cookie maxAge remains synchronized with JWT expiry.
 */
export const parseExpiresInToMs = (expiresIn) => {
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
    return expiresIn * 1000;
  }

  if (typeof expiresIn !== 'string') {
    return DEFAULT_COOKIE_MAX_AGE_MS;
  }

  const trimmed = expiresIn.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed);
    return seconds > 0 ? seconds * 1000 : DEFAULT_COOKIE_MAX_AGE_MS;
  }

  const match = trimmed.match(/^(\d+)\s*(ms|s|m|h|d)$/);
  if (!match) {
    return DEFAULT_COOKIE_MAX_AGE_MS;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  return amount > 0 ? amount * UNIT_MULTIPLIERS_MS[unit] : DEFAULT_COOKIE_MAX_AGE_MS;
};

const getValidatedJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    throw new Error('JWT_SECRET is not configured in environment variables.');
  }
  if (process.env.NODE_ENV === 'production' && secret.trim().length < MIN_PRODUCTION_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be at least ${MIN_PRODUCTION_SECRET_LENGTH} characters in production.`);
  }
  return secret;
};

/**
 * Sign JWT token with given payload using pinned HS256 algorithm.
 *
 * @param {Object} payload
 * @param {string|number} [expiresIn]
 * @returns {string} Signed JWT
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRATION) => {
  const secret = getValidatedJwtSecret();
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: JWT_ALGORITHM,
  });
};

/**
 * Verify and decode JWT token strictly pinned to HS256.
 *
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  const secret = getValidatedJwtSecret();
  return jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
  });
};

/**
 * Get standardized cookie options based on environment and JWT expiration.
 *
 * @returns {import('express').CookieOptions}
 */
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const rawSameSite = (process.env.COOKIE_SAMESITE || 'lax').trim().toLowerCase();
  const sameSite = ['lax', 'strict', 'none'].includes(rawSameSite) ? rawSameSite : 'lax';
  const expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRATION;

  return {
    httpOnly: true, // Inaccessible to client-side JavaScript
    secure: isProduction || sameSite === 'none', // HTTPS required in production and whenever SameSite=None
    sameSite, // 'lax' for admin. + api. under clearfiling.co.in; 'none' only for separate domains
    maxAge: parseExpiresInToMs(expiresIn),
    path: '/',
  };
};

/**
 * Attach authentication cookie to Express response.
 *
 * @param {import('express').Response} res
 * @param {string} token
 */
export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

/**
 * Clear authentication cookie on logout.
 *
 * @param {import('express').Response} res
 */
export const clearAuthCookie = (res) => {
  const options = getCookieOptions();
  res.clearCookie(COOKIE_NAME, {
    ...options,
    maxAge: 0,
  });
};

export default {
  COOKIE_NAME,
  parseExpiresInToMs,
  generateToken,
  verifyToken,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
};

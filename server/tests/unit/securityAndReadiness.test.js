import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {
  escapeRegex,
  parseSearchQuery,
  parseAllowedSort,
  ADMIN_DOCUMENT_SORT_FIELDS,
} from '../../utils/queryUtils.js';
import { getAllowedOrigins, corsOptions } from '../../config/cors.js';
import { csrfProtection } from '../../middleware/csrfMiddleware.js';
import { resolveTrustProxy } from '../../app.js';
import { validateProductionEnvironment } from '../../utils/envValidator.js';
import { COOKIE_NAME } from '../../utils/tokenUtils.js';

const withEnv = (overrides, fn) => {
  const prev = {};
  for (const key of Object.keys(overrides)) {
    prev[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (prev[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = prev[key];
      }
    }
  }
};

test('QueryUtils: escapes regex metacharacters and rejects malformed/oversized/non-string queries', () => {
  const escaped = escapeRegex('GSTR-1 [2026] (v2).*+?^${}|\\');
  assert.doesNotThrow(() => new RegExp(escaped, 'i'));
  assert.equal(new RegExp(escaped, 'i').test('GSTR-1 [2026] (v2).*+?^${}|\\'), true);

  const bracket = parseSearchQuery('[');
  assert.equal(bracket.valid, true);
  assert.equal(bracket.regexPattern, '\\[');

  const tooLong = parseSearchQuery('a'.repeat(101));
  assert.equal(tooLong.valid, false);
  assert.match(tooLong.message, /cannot exceed 100/i);

  const objInjection = parseSearchQuery({ $ne: '' });
  assert.equal(objInjection.valid, false);
});

test('QueryUtils: allowlists sort fields and safely defaults invalid sort inputs', () => {
  assert.deepEqual(
    parseAllowedSort('title', ADMIN_DOCUMENT_SORT_FIELDS),
    { title: 1 }
  );
  assert.deepEqual(
    parseAllowedSort('-viewCount', ADMIN_DOCUMENT_SORT_FIELDS),
    { viewCount: -1 }
  );
  assert.deepEqual(
    parseAllowedSort({ updatedAt: 'asc' }, ADMIN_DOCUMENT_SORT_FIELDS),
    { updatedAt: 1 }
  );

  // Disallowed / dangerous / malformed inputs must fall back to { createdAt: -1 }
  assert.deepEqual(parseAllowedSort('passwordHash', ADMIN_DOCUMENT_SORT_FIELDS), { createdAt: -1 });
  assert.deepEqual(parseAllowedSort('$where', ADMIN_DOCUMENT_SORT_FIELDS), { createdAt: -1 });
  assert.deepEqual(parseAllowedSort({ $gt: '' }, ADMIN_DOCUMENT_SORT_FIELDS), { createdAt: -1 });
  assert.deepEqual(parseAllowedSort({ title: 'sideways' }, ADMIN_DOCUMENT_SORT_FIELDS), { createdAt: -1 });
  assert.deepEqual(parseAllowedSort({ title: 1, status: -1 }, ADMIN_DOCUMENT_SORT_FIELDS), { createdAt: -1 });
});

test('CORS: excludes localhost in production, allows X-CSRF-Token header, and blocks untrusted origins', () => {
  withEnv(
    {
      NODE_ENV: 'production',
      CLIENT_ORIGIN: 'http://localhost:5173,https://www.clearfiling.co.in',
      ADMIN_ORIGIN: 'http://localhost:5174,https://admin.clearfiling.co.in',
    },
    () => {
      const allowed = getAllowedOrigins();
      assert.ok(allowed.includes('https://www.clearfiling.co.in'));
      assert.ok(allowed.includes('https://admin.clearfiling.co.in'));
      assert.equal(allowed.some((o) => o.includes('localhost')), false);
      assert.ok(corsOptions.allowedHeaders.includes('X-CSRF-Token'));
      assert.equal(corsOptions.credentials, true);

      let blockedErr = null;
      corsOptions.origin('https://evil.example.com', (err) => {
        blockedErr = err;
      });
      assert.ok(blockedErr);
      assert.match(blockedErr.message, /CORS blocked/i);
    }
  );
});

test('CSRF Middleware: blocks Referer prefix-spoofing domain and allows trusted origin', () => {
  withEnv(
    {
      NODE_ENV: 'production',
      CLIENT_ORIGIN: 'https://www.clearfiling.co.in',
      ADMIN_ORIGIN: 'https://admin.clearfiling.co.in',
    },
    () => {
      let status = 200;
      let nextCalled = false;
      const res = {
        status(code) {
          status = code;
          return this;
        },
        json() {
          return this;
        },
      };

      // Prefix-spoofing evil domain must be rejected (403)
      csrfProtection(
        {
          method: 'POST',
          path: '/api/admin/documents',
          cookies: { [COOKIE_NAME]: 'token' },
          headers: { referer: 'https://admin.clearfiling.co.in.evil.com/pwn' },
        },
        res,
        () => {
          nextCalled = true;
        }
      );
      assert.equal(nextCalled, false);
      assert.equal(status, 403);

      // Legitimate exact origin Referer passes
      nextCalled = false;
      csrfProtection(
        {
          method: 'POST',
          path: '/api/admin/documents',
          cookies: { [COOKIE_NAME]: 'token' },
          headers: { referer: 'https://admin.clearfiling.co.in/documents' },
        },
        res,
        () => {
          nextCalled = true;
        }
      );
      assert.equal(nextCalled, true);
    }
  );
});

test('App & Env Hardening: resolves trust proxy safely and validates production env fail-closed', () => {
  withEnv({ NODE_ENV: 'production', TRUST_PROXY: undefined }, () => {
    assert.equal(resolveTrustProxy(), 1);
  });
  withEnv({ NODE_ENV: 'production', TRUST_PROXY: '2' }, () => {
    assert.equal(resolveTrustProxy(), 2);
  });
  withEnv({ NODE_ENV: 'development', TRUST_PROXY: undefined }, () => {
    assert.equal(resolveTrustProxy(), false);
  });

  withEnv(
    {
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb+srv://<username>:<password>@cluster/db',
      JWT_SECRET: 'short',
      CLIENT_ORIGIN: 'http://localhost:5173',
      ADMIN_ORIGIN: '',
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    () => {
      const check = validateProductionEnvironment();
      assert.equal(check.valid, false);
      assert.equal(check.errors.length, 5);
    }
  );

  withEnv(
    {
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb+srv://user:pass@cluster.mongodb.net/clearfiling',
      JWT_SECRET: 'a_very_strong_random_secret_that_is_over_32_characters_long',
      CLIENT_ORIGIN: 'https://www.clearfiling.co.in',
      ADMIN_ORIGIN: 'https://admin.clearfiling.co.in',
      CLOUDINARY_CLOUD_NAME: 'clearfiling-live',
      CLOUDINARY_API_KEY: '1234567890',
      CLOUDINARY_API_SECRET: 'live_secret_value',
    },
    () => {
      const check = validateProductionEnvironment();
      assert.equal(check.valid, true);
      assert.deepEqual(check.errors, []);
    }
  );
});


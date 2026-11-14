import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import {
  generateToken,
  verifyToken,
  getCookieOptions,
  parseExpiresInToMs,
  COOKIE_NAME,
} from '../../utils/tokenUtils.js';

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

test('TokenUtils: generates and verifies valid HS256 JWT token', () => {
  process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_12345';

  const payload = { id: '663f1234567890abcdef1234', role: 'admin' };
  const token = generateToken(payload, '1h');

  assert.ok(token);
  assert.equal(typeof token, 'string');

  const decodedHeader = jwt.decode(token, { complete: true }).header;
  assert.equal(decodedHeader.alg, 'HS256');

  const decoded = verifyToken(token);
  assert.equal(decoded.id, payload.id);
  assert.equal(decoded.role, payload.role);
});

test('TokenUtils: rejects non-HS256 JWT algorithms (algorithm pinning)', () => {
  const secret = 'test_secret_key_minimum_32_characters_12345';
  process.env.JWT_SECRET = secret;

  const hs512Token = jwt.sign({ id: '123', role: 'super_admin' }, secret, {
    algorithm: 'HS512',
    expiresIn: '1h',
  });

  assert.throws(() => verifyToken(hs512Token), {
    name: 'JsonWebTokenError',
  });
});

test('TokenUtils: rejects tampered token and short production secret', () => {
  const secret = 'test_secret_key_minimum_32_characters_12345';
  process.env.JWT_SECRET = secret;

  const token = generateToken({ id: '123' });
  const tampered = token + 'tamper';

  assert.throws(() => verifyToken(tampered), {
    name: 'JsonWebTokenError',
  });

  withEnv({ NODE_ENV: 'production', JWT_SECRET: 'short_secret' }, () => {
    assert.throws(() => generateToken({ id: '123' }), /at least 32 characters/i);
  });
});

test('TokenUtils: getCookieOptions synchronizes maxAge with JWT_EXPIRES_IN and secures production cookies', () => {
  assert.equal(parseExpiresInToMs('30m'), 30 * 60 * 1000);
  assert.equal(parseExpiresInToMs('12h'), 12 * 60 * 60 * 1000);
  assert.equal(parseExpiresInToMs('2d'), 2 * 24 * 60 * 60 * 1000);
  assert.equal(parseExpiresInToMs('3600'), 3600 * 1000);

  withEnv({ NODE_ENV: 'production', JWT_EXPIRES_IN: '4h', COOKIE_SAMESITE: 'lax' }, () => {
    const options = getCookieOptions();
    assert.equal(COOKIE_NAME, 'clearfiling_admin_token');
    assert.equal(options.httpOnly, true);
    assert.equal(options.secure, true);
    assert.equal(options.path, '/');
    assert.equal(options.sameSite, 'lax');
    assert.equal(options.maxAge, 4 * 60 * 60 * 1000);
  });

  withEnv({ NODE_ENV: 'development', COOKIE_SAMESITE: 'none' }, () => {
    const options = getCookieOptions();
    assert.equal(options.sameSite, 'none');
    assert.equal(options.secure, true);
  });
});

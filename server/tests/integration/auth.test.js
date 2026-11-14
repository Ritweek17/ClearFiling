import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import AdminUser from '../../models/AdminUser.js';
import { startTestDb, stopTestDb, clearTestDb, TEST_MONGODB_URI } from '../helpers/testDb.js';
import { connectDB, disconnectDB } from '../../config/db.js';
import { generateToken, COOKIE_NAME } from '../../utils/tokenUtils.js';

let server;
let baseUrl;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_12345';
  process.env.CLIENT_ORIGIN = 'https://www.clearfiling.co.in';
  process.env.ADMIN_ORIGIN = 'https://admin.clearfiling.co.in';

  await startTestDb();

  // Start ephemeral HTTP server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await stopTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

test('API Health: GET /api/status returns online status', async () => {
  const res = await fetch(`${baseUrl}/api/status`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.equal(data.message, 'ClearFiling API is running');
});

test('Auth API: POST /api/admin/auth/login requires email and password', async () => {
  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Email and password are required.');
});

test('Auth API: POST /api/admin/auth/login rejects non-existent email', async () => {
  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nonexistent@clearfiling.co.in',
      password: 'SomePassword123!',
    }),
  });

  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Invalid email or password.');
});

test('Auth API: POST /api/admin/auth/login rejects incorrect password', async () => {
  const hash = await AdminUser.hashPassword('CorrectPassword123!');
  await AdminUser.create({
    name: 'Test Admin',
    email: 'admin@clearfiling.co.in',
    passwordHash: hash,
  });

  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@clearfiling.co.in',
      password: 'WrongPassword!',
    }),
  });

  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Invalid email or password.');
});

test('Auth API: POST /api/admin/auth/login rejects deactivated admin', async () => {
  const hash = await AdminUser.hashPassword('CorrectPassword123!');
  await AdminUser.create({
    name: 'Inactive Admin',
    email: 'inactive@clearfiling.co.in',
    passwordHash: hash,
    isActive: false,
  });

  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'inactive@clearfiling.co.in',
      password: 'CorrectPassword123!',
    }),
  });

  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.message, /deactivated/i);
});

test('Auth API: POST /api/admin/auth/login succeeds for valid credentials', async () => {
  const hash = await AdminUser.hashPassword('ValidPassword123!');
  const user = await AdminUser.create({
    name: 'Active Super Admin',
    email: 'superadmin@clearfiling.co.in',
    passwordHash: hash,
    role: 'super_admin',
  });

  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'SUPERADMIN@CLEARFILING.CO.IN', // Test normalization
      password: 'ValidPassword123!',
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, 'superadmin@clearfiling.co.in');
  assert.equal(data.user.role, 'super_admin');
  assert.equal(data.user.passwordHash, undefined, 'passwordHash must never be exposed');

  // Verify Set-Cookie header contains HttpOnly session token
  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie, 'Response must include set-cookie header');
  assert.ok(setCookie.includes(COOKIE_NAME));
  assert.ok(setCookie.includes('HttpOnly'));

  // Verify lastLogin updated in DB
  const updatedUser = await AdminUser.findById(user._id);
  assert.ok(updatedUser.lastLogin);
});

test('Auth API: GET /api/admin/auth/me returns 401 when unauthenticated', async () => {
  const res = await fetch(`${baseUrl}/api/admin/auth/me`);
  assert.equal(res.status, 401);

  const data = await res.json();
  assert.equal(data.success, false);
});

test('Auth API: GET /api/admin/auth/me returns profile for valid session cookie', async () => {
  const hash = await AdminUser.hashPassword('SecretP@ss123');
  const user = await AdminUser.create({
    name: 'Session Admin',
    email: 'session@clearfiling.co.in',
    passwordHash: hash,
    role: 'admin',
  });

  const token = generateToken({ id: user._id, role: user.role });

  const res = await fetch(`${baseUrl}/api/admin/auth/me`, {
    headers: {
      Cookie: `${COOKIE_NAME}=${token}`,
    },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, 'session@clearfiling.co.in');
  assert.equal(data.user.name, 'Session Admin');
  assert.equal(data.user.role, 'admin');
});

test('Auth API: GET /api/admin/auth/me rejects deactivated user even with valid token', async () => {
  const hash = await AdminUser.hashPassword('SecretP@ss123');
  const user = await AdminUser.create({
    name: 'Soon Deactivated Admin',
    email: 'soon_deactivated@clearfiling.co.in',
    passwordHash: hash,
    isActive: false, // Deactivated
  });

  const token = generateToken({ id: user._id, role: user.role });

  const res = await fetch(`${baseUrl}/api/admin/auth/me`, {
    headers: {
      Cookie: `${COOKIE_NAME}=${token}`,
    },
  });

  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.message, /deactivated/i);
});

test('Auth API: POST /api/admin/auth/logout clears auth cookie', async () => {
  const hash = await AdminUser.hashPassword('SecretP@ss123');
  const user = await AdminUser.create({
    name: 'Logout Admin',
    email: 'logout@clearfiling.co.in',
    passwordHash: hash,
  });

  const token = generateToken({ id: user._id, role: user.role });

  const res = await fetch(`${baseUrl}/api/admin/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${token}`,
      'X-Requested-With': 'XMLHttpRequest', // Anti-CSRF header
    },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);

  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie);
  assert.ok(setCookie.includes('clearfiling_admin_token=;'));
});

test('Security: CSRF protection blocks cookie-authenticated state changes missing security headers', async () => {
  const hash = await AdminUser.hashPassword('SecretP@ss123');
  const user = await AdminUser.create({
    name: 'CSRF Target Admin',
    email: 'csrf@clearfiling.co.in',
    passwordHash: hash,
  });

  const token = generateToken({ id: user._id, role: user.role });

  // Simulate cross-site POST with cookie but without X-Requested-With and foreign referer
  const res = await fetch(`${baseUrl}/api/admin/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${token}`,
      Referer: 'https://malicious-cross-origin.com/attack.html',
    },
  });

  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.message, /CSRF validation failed/i);
});

test('Security: Rate limiting triggers 429 when threshold exceeded', async () => {
  // Trigger 6 attempts with x-test-rate-limit header
  let lastStatus = 200;
  for (let i = 0; i < 6; i++) {
    const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-test-rate-limit': 'true',
      },
      body: JSON.stringify({ email: 'ratelimit@clearfiling.co.in', password: 'bad' }),
    });
    lastStatus = res.status;
  }

  assert.equal(lastStatus, 429);
});

test('Phase A Security: Rejects JWT signed with non-HS256 algorithm (HS512)', async () => {
  const hash = await AdminUser.hashPassword('StrongPassword123!');
  const user = await AdminUser.create({
    name: 'Alg Test Admin',
    email: 'algtest@clearfiling.co.in',
    passwordHash: hash,
    role: 'admin',
  });

  const hs512Token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { algorithm: 'HS512', expiresIn: '1h' }
  );

  const res = await fetch(`${baseUrl}/api/admin/auth/me`, {
    headers: { Cookie: `${COOKIE_NAME}=${hs512Token}` },
  });
  assert.equal(res.status, 401);
});

test('Phase A Security: CORS preflight exposes X-CSRF-Token in allowedHeaders for allowed admin origin', async () => {
  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://admin.clearfiling.co.in',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, X-CSRF-Token',
    },
  });
  assert.ok([200, 204].includes(res.status));
  const allowHeaders = res.headers.get('access-control-allow-headers') || '';
  assert.match(allowHeaders, /X-CSRF-Token/i);
});

test('Phase A Readiness: GET /api/health/ready returns 200 when connected and endpoints return 503 when DB is disconnected', async () => {
  const readyRes = await fetch(`${baseUrl}/api/health/ready`);
  assert.equal(readyRes.status, 200);
  const readyData = await readyRes.json();
  assert.equal(readyData.ready, true);
  assert.equal(readyData.database, 'connected');

  try {
    await disconnectDB();

    const statusDownRes = await fetch(`${baseUrl}/api/status`);
    assert.equal(statusDownRes.status, 503);
    const statusDownData = await statusDownRes.json();
    assert.equal(statusDownData.database, 'disconnected');

    const readyDownRes = await fetch(`${baseUrl}/api/health/ready`);
    assert.equal(readyDownRes.status, 503);

    const apiDownRes = await fetch(`${baseUrl}/api/public/documents`);
    assert.equal(apiDownRes.status, 503);
  } finally {
    await connectDB(TEST_MONGODB_URI);
  }

  const recoveredRes = await fetch(`${baseUrl}/api/health/ready`);
  assert.equal(recoveredRes.status, 200);
});

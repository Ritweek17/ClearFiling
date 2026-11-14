import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import AdminUser from '../../models/AdminUser.js';
import { startTestDb, stopTestDb, clearTestDb, TEST_MONGODB_URI } from '../helpers/testDb.js';
import { authenticateAdmin, authorizeRoles } from '../../middleware/authMiddleware.js';
import { generateToken, COOKIE_NAME } from '../../utils/tokenUtils.js';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let server;
let baseUrl;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_12345';
  process.env.MONGODB_URI = TEST_MONGODB_URI;

  await startTestDb();

  // Create isolated express app to test RBAC roles specifically
  const app = express();
  app.use(cookieParser());

  app.get(
    '/api/test/super-admin-only',
    authenticateAdmin,
    authorizeRoles('super_admin'),
    (req, res) => res.json({ success: true, message: 'Welcome Super Admin' })
  );

  app.get(
    '/api/test/admin-or-super',
    authenticateAdmin,
    authorizeRoles('super_admin', 'admin'),
    (req, res) => res.json({ success: true, message: 'Welcome Admin' })
  );

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

test('RBAC: Super Admin route permits super_admin and denies admin & editor', async () => {
  const hash = await AdminUser.hashPassword('Pass12345!');

  const superAdmin = await AdminUser.create({
    name: 'Super',
    email: 'super@clearfiling.co.in',
    passwordHash: hash,
    role: 'super_admin',
  });

  const normalAdmin = await AdminUser.create({
    name: 'Normal Admin',
    email: 'admin_normal@clearfiling.co.in',
    passwordHash: hash,
    role: 'admin',
  });

  const editor = await AdminUser.create({
    name: 'Editor',
    email: 'editor@clearfiling.co.in',
    passwordHash: hash,
    role: 'editor',
  });

  const superToken = generateToken({ id: superAdmin._id, role: superAdmin.role });
  const adminToken = generateToken({ id: normalAdmin._id, role: normalAdmin.role });
  const editorToken = generateToken({ id: editor._id, role: editor.role });

  // 1. Super admin access -> 200
  const res1 = await fetch(`${baseUrl}/api/test/super-admin-only`, {
    headers: { Cookie: `${COOKIE_NAME}=${superToken}` },
  });
  assert.equal(res1.status, 200);

  // 2. Normal admin access -> 403
  const res2 = await fetch(`${baseUrl}/api/test/super-admin-only`, {
    headers: { Cookie: `${COOKIE_NAME}=${adminToken}` },
  });
  assert.equal(res2.status, 403);
  const data2 = await res2.json();
  assert.match(data2.message, /Forbidden/i);

  // 3. Editor access -> 403
  const res3 = await fetch(`${baseUrl}/api/test/super-admin-only`, {
    headers: { Cookie: `${COOKIE_NAME}=${editorToken}` },
  });
  assert.equal(res3.status, 403);

  // 4. Admin-or-super permits admin
  const res4 = await fetch(`${baseUrl}/api/test/admin-or-super`, {
    headers: { Cookie: `${COOKIE_NAME}=${adminToken}` },
  });
  assert.equal(res4.status, 200);
});

test('CLI Seed Script: provisions super admin and rejects overwriting existing account', async () => {
  const scriptPath = path.resolve(__dirname, '../../scripts/seedAdmin.js');

  const runSeed = (args) => {
    return new Promise((resolve, reject) => {
      execFile(
        'node',
        [scriptPath, ...args],
        {
          env: {
            ...process.env,
            MONGODB_URI: TEST_MONGODB_URI,
            NODE_ENV: 'test',
          },
        },
        (error, stdout, stderr) => {
          resolve({ error, stdout, stderr });
        }
      );
    });
  };

  // 1. Initial provisioning should succeed
  const result1 = await runSeed([
    '--email', 'initial.super@clearfiling.co.in',
    '--password', 'SecretPass12345!',
    '--name', 'Initial Super Admin',
  ]);

  assert.equal(result1.error, null, `Seed script failed: ${result1.stderr}`);
  assert.match(result1.stdout, /Super Administrator provisioned successfully/i);

  // Verify in database
  const user = await AdminUser.findOne({ email: 'initial.super@clearfiling.co.in' }).select('+passwordHash');
  assert.ok(user);
  assert.equal(user.role, 'super_admin');
  assert.equal(user.isActive, true);
  const valid = await user.comparePassword('SecretPass12345!');
  assert.equal(valid, true);

  // 2. Second attempt with same email must ABORT and NOT overwrite
  const result2 = await runSeed([
    '--email', 'initial.super@clearfiling.co.in',
    '--password', 'AttemptedOverwrite123!',
    '--name', 'Hacker Attempt',
  ]);

  const combinedOutput2 = result2.stdout + result2.stderr;
  assert.match(combinedOutput2, /ABORTED/i);
  assert.match(combinedOutput2, /Existing accounts are never overwritten/i);

  // Password must still be original
  const userAfter = await AdminUser.findOne({ email: 'initial.super@clearfiling.co.in' }).select('+passwordHash');
  const stillOriginal = await userAfter.comparePassword('SecretPass12345!');
  assert.equal(stillOriginal, true);
  const attemptedOverwrite = await userAfter.comparePassword('AttemptedOverwrite123!');
  assert.equal(attemptedOverwrite, false);
});

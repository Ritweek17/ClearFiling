import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import AdminUser from '../../models/AdminUser.js';
import { startTestDb, stopTestDb, clearTestDb } from '../helpers/testDb.js';

before(async () => {
  await startTestDb();
});

after(async () => {
  await stopTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

test('AdminUser Model: static hashPassword produces valid bcrypt hash with 12 rounds', async () => {
  const plain = 'StrongP@ssw0rd!';
  const hash = await AdminUser.hashPassword(plain);

  assert.ok(hash.startsWith('$2'));
  const rounds = bcrypt.getRounds(hash);
  assert.equal(rounds, 12, 'Must use exactly 12 bcrypt salt rounds');

  const matches = await bcrypt.compare(plain, hash);
  assert.equal(matches, true);
});

test('AdminUser Model: hashPassword rejects passwords under 8 characters', async () => {
  await assert.rejects(
    async () => {
      await AdminUser.hashPassword('short');
    },
    {
      name: 'Error',
      message: 'Password must be at least 8 characters long.',
    }
  );
});

test('AdminUser Model: comparePassword accurately validates passwords', async () => {
  const plain = 'SecretKey123!';
  const hash = await AdminUser.hashPassword(plain);

  const user = new AdminUser({
    name: 'Test Administrator',
    email: 'admin@clearfiling.co.in',
    passwordHash: hash,
  });

  const valid = await user.comparePassword('SecretKey123!');
  assert.equal(valid, true);

  const invalid = await user.comparePassword('WrongPassword!');
  assert.equal(invalid, false);
});

test('AdminUser Model: validates required fields and normalizes email', async () => {
  const hash = await AdminUser.hashPassword('Password123!');

  const user = await AdminUser.create({
    name: '  John Doe  ',
    email: '  Admin.User@ClearFiling.co.in  ',
    passwordHash: hash,
  });

  assert.equal(user.name, 'John Doe');
  assert.equal(user.email, 'admin.user@clearfiling.co.in'); // Trimmed & lowercased
  assert.equal(user.role, 'admin'); // Default role
  assert.equal(user.isActive, true); // Default active status
  assert.equal(user.lastLogin, null);
});

test('AdminUser Model: enforces unique email index', async () => {
  const hash = await AdminUser.hashPassword('Password123!');

  await AdminUser.create({
    name: 'Admin One',
    email: 'duplicate@clearfiling.co.in',
    passwordHash: hash,
  });

  await assert.rejects(
    async () => {
      await AdminUser.create({
        name: 'Admin Two',
        email: 'duplicate@clearfiling.co.in',
        passwordHash: hash,
      });
    },
    (err) => {
      assert.equal(err.code, 11000);
      return true;
    }
  );
});

test('AdminUser Model: rejects invalid email format', async () => {
  const hash = await AdminUser.hashPassword('Password123!');

  await assert.rejects(
    async () => {
      await AdminUser.create({
        name: 'Invalid Email Admin',
        email: 'not-an-email',
        passwordHash: hash,
      });
    },
    {
      name: 'ValidationError',
    }
  );
});

test('AdminUser Model: excludes passwordHash from default queries (select: false)', async () => {
  const hash = await AdminUser.hashPassword('SecretP@ss123');

  const created = await AdminUser.create({
    name: 'Private Admin',
    email: 'private@clearfiling.co.in',
    passwordHash: hash,
  });

  const fetched = await AdminUser.findById(created._id);
  assert.equal(fetched.passwordHash, undefined, 'passwordHash must be omitted by default');

  const fetchedWithSecret = await AdminUser.findById(created._id).select('+passwordHash');
  assert.ok(fetchedWithSecret.passwordHash, 'passwordHash must be retrievable when explicitly selected');
});


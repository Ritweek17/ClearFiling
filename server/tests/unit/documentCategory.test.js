import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import DocumentCategory from '../../models/DocumentCategory.js';
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

test('DocumentCategory Model: creates category and auto-slugifies name', async () => {
  const category = await DocumentCategory.create({
    name: 'Income Tax & TDS',
    description: 'Forms and guides for direct tax filings',
  });

  assert.equal(category.name, 'Income Tax & TDS');
  assert.equal(category.slug, 'income-tax-tds');
  assert.equal(category.displayOrder, 0);
  assert.equal(category.isActive, true);
  assert.ok(category.createdAt);
});

test('DocumentCategory Model: enforces unique slug index', async () => {
  await DocumentCategory.create({
    name: 'Corporate Compliance',
    slug: 'corporate-compliance',
  });

  await assert.rejects(
    async () => {
      await DocumentCategory.create({
        name: 'Corporate Compliance 2',
        slug: 'corporate-compliance',
      });
    },
    (err) => {
      assert.equal(err.code, 11000);
      return true;
    }
  );
});

test('DocumentCategory Model: rejects missing name', async () => {
  await assert.rejects(
    async () => {
      await DocumentCategory.create({ description: 'No name category' });
    },
    {
      name: 'ValidationError',
    }
  );
});


import test from 'node:test';
import assert from 'node:assert/strict';
import { connectDB, disconnectDB } from '../../config/db.js';

test('Database Configuration: throws error when MONGODB_URI is undefined', async () => {
  const originalUri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;

  await assert.rejects(
    async () => {
      await connectDB();
    },
    {
      name: 'Error',
      message: 'MONGODB_URI is not defined in environment variables.',
    }
  );

  process.env.MONGODB_URI = originalUri;
});

test('Database Connection: throws error on unreachable host', async () => {
  // Try connecting to a non-listening port with short timeout
  await assert.rejects(
    async () => {
      await connectDB('mongodb://127.0.0.1:29999/unreachable_db');
    },
    (err) => {
      assert.ok(err instanceof Error);
      return true;
    }
  );

  await disconnectDB();
});


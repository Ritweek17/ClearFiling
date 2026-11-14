import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../config/db.js';

const DEFAULT_TEST_PORT = 27019;
const TEST_DATABASE_NAME = 'clearfiling_test';
const STARTUP_TIMEOUT_MS = 10000;
const TCP_PROBE_TIMEOUT_MS = 250;
const DIAGNOSTIC_BUFFER_LIMIT = 12000;
const SHUTDOWN_TIMEOUT_MS = 5000;

const configuredPort = Number(process.env.CLEARFILING_TEST_MONGOD_PORT || DEFAULT_TEST_PORT);
if (!Number.isInteger(configuredPort) || configuredPort < 1024 || configuredPort > 65535) {
  throw new Error('CLEARFILING_TEST_MONGOD_PORT must be an integer between 1024 and 65535.');
}

// Keep the existing default port and database name for current tests. A port
// override is explicit; an occupied port is an error, never a reason to attach
// to or terminate an unrelated MongoDB process.
export const TEST_PORT = configuredPort;
export const TEST_MONGODB_URI = `mongodb://127.0.0.1:${TEST_PORT}/${TEST_DATABASE_NAME}`;
export let TEST_DB_PATH = null;

let mongodProcess = null;
let connectedTestUri = null;
let processSpawnError = null;
let processExit = null;
let mongodbReadyMessageSeen = false;
let stdoutBuffer = '';
let stderrBuffer = '';

const appendDiagnostic = (current, chunk) => {
  const combined = current + chunk.toString();
  return combined.length > DIAGNOSTIC_BUFFER_LIMIT
    ? combined.slice(-DIAGNOSTIC_BUFFER_LIMIT)
    : combined;
};

const redactDiagnostic = (value = '') =>
  String(value)
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[REDACTED MONGODB URI]')
    .replace(/(password|secret|token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]');

const getProcessDiagnostics = () => {
  const exit = processExit
    ? `exitCode=${processExit.code ?? 'null'}, signal=${processExit.signal ?? 'none'}`
    : 'process has not exited';
  const spawnError = processSpawnError
    ? `spawnError=${redactDiagnostic(processSpawnError.message)}`
    : 'spawnError=none';

  return [
    `MongoDB binary: ${process.env.CLEARFILING_TEST_MONGOD_PATH || 'mongod (resolved from PATH)'}`,
    `Test port: ${TEST_PORT}`,
    `Test database path: ${TEST_DB_PATH || 'not created'}`,
    `MongoDB readiness message observed: ${mongodbReadyMessageSeen}`,
    exit,
    spawnError,
    `MongoDB stdout (last ${DIAGNOSTIC_BUFFER_LIMIT} chars):\n${redactDiagnostic(stdoutBuffer) || '(empty)'}`,
    `MongoDB stderr (last ${DIAGNOSTIC_BUFFER_LIMIT} chars):\n${redactDiagnostic(stderrBuffer) || '(empty)'}`,
  ].join('\n');
};

const probeTcpPort = (port) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(TCP_PROBE_TIMEOUT_MS);
    socket.once('connect', () => finish({ open: true }));
    socket.once('timeout', () => finish({ open: false, error: 'TCP probe timed out' }));
    socket.once('error', (error) =>
      finish({ open: false, error: `${error.code || error.name}: ${error.message}` })
    );
    socket.connect(port, '127.0.0.1');
  });

const assertPortAvailable = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        reject(
          new Error(
            `MongoDB test port ${TEST_PORT} is already in use. Refusing to connect to or stop an existing process.`
          )
        );
        return;
      }
      reject(
        new Error(
          `Cannot verify MongoDB test port ${TEST_PORT} availability (${error.code || error.name}: ${error.message}).`
        )
      );
    });
    server.listen({ host: '127.0.0.1', port: TEST_PORT, exclusive: true }, () => {
      server.close((error) => {
        if (error) {
          reject(new Error(`Could not release temporary test-port check: ${error.message}`));
          return;
        }
        resolve();
      });
    });
  });

const waitForMongoStartup = async () => {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  let lastProbeError = 'no TCP probe completed';

  while (Date.now() < deadline) {
    if (processSpawnError) {
      throw new Error(
        `MongoDB process failed to start: ${redactDiagnostic(processSpawnError.message)}\n${getProcessDiagnostics()}`
      );
    }
    if (processExit) {
      throw new Error(
        `MongoDB process exited before accepting connections (code=${processExit.code ?? 'null'}, signal=${processExit.signal ?? 'none'}).\n${getProcessDiagnostics()}`
      );
    }

    const probe = await probeTcpPort(TEST_PORT);
    // Require output from the child we started as well as an open socket. This
    // prevents connecting to an unrelated listener that wins a port race.
    if (probe.open && mongodbReadyMessageSeen) return;
    lastProbeError = probe.error || lastProbeError;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(
    `MongoDB startup timeout: process did not accept TCP connections on 127.0.0.1:${TEST_PORT} within ${STARTUP_TIMEOUT_MS}ms. Last probe: ${lastProbeError}.\n${getProcessDiagnostics()}`
  );
};

const waitForOwnedProcessExit = (child, timeoutMs = SHUTDOWN_TIMEOUT_MS) =>
  new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.signalCode !== null) {
      resolve(true);
      return;
    }

    const timer = setTimeout(() => resolve(false), timeoutMs);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });

const stopOwnedMongod = async () => {
  const child = mongodProcess;
  if (!child) return;

  // A failed spawn has no PID; do not wait for exit events a nonexistent child
  // cannot emit or send signals to a process we do not own.
  if (child.pid && child.exitCode === null && child.signalCode === null) {
    child.kill('SIGTERM');
    const exited = await waitForOwnedProcessExit(child);
    if (!exited && child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
      await waitForOwnedProcessExit(child, 1000);
    }
  }

  mongodProcess = null;
};

const ownsCurrentConnection = () => {
  const connection = mongoose.connection;
  return Boolean(
    connectedTestUri &&
      connection.readyState === 1 &&
      connection.name === TEST_DATABASE_NAME &&
      connection.host === '127.0.0.1' &&
      Number(connection.port) === TEST_PORT
  );
};

/**
 * Start an isolated MongoDB process for tests. Only a process spawned by this
 * helper is managed or stopped; an already occupied test port is rejected.
 */
export const startTestDb = async () => {
  if (mongodProcess) {
    throw new Error('The test MongoDB process is already running in this worker.');
  }
  if (mongoose.connection.readyState !== 0) {
    throw new Error(
      'Refusing to start the test database while Mongoose already has an open connection.'
    );
  }

  const binary = process.env.CLEARFILING_TEST_MONGOD_PATH?.trim() || 'mongod';
  processSpawnError = null;
  processExit = null;
  mongodbReadyMessageSeen = false;
  stdoutBuffer = '';
  stderrBuffer = '';

  await assertPortAvailable();
  TEST_DB_PATH = fs.mkdtempSync(path.join(os.tmpdir(), 'clearfiling-test-db-'));

  try {
    mongodProcess = spawn(
      binary,
      [
        '--dbpath', TEST_DB_PATH,
        '--port', String(TEST_PORT),
        '--bind_ip', '127.0.0.1',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    mongodProcess.stdout.on('data', (chunk) => {
      stdoutBuffer = appendDiagnostic(stdoutBuffer, chunk);
      if (/waiting for connections/i.test(stdoutBuffer)) {
        mongodbReadyMessageSeen = true;
      }
    });
    mongodProcess.stderr.on('data', (chunk) => {
      stderrBuffer = appendDiagnostic(stderrBuffer, chunk);
    });
    mongodProcess.once('error', (error) => {
      processSpawnError = error;
    });
    mongodProcess.once('exit', (code, signal) => {
      processExit = { code, signal };
    });

    await waitForMongoStartup();

    try {
      await connectDB(TEST_MONGODB_URI);
    } catch (error) {
      throw new Error(
        `MongoDB process accepted TCP connections on port ${TEST_PORT}, but Mongoose could not connect to the isolated test database: ${redactDiagnostic(error.message)}.\n${getProcessDiagnostics()}`
      );
    }

    connectedTestUri = TEST_MONGODB_URI;
    if (!ownsCurrentConnection()) {
      throw new Error(
        `Mongoose connected to an unexpected database endpoint. Expected ${TEST_DATABASE_NAME} at 127.0.0.1:${TEST_PORT}; refusing to use it.`
      );
    }
  } catch (error) {
    if (mongoose.connection.readyState !== 0 && ownsCurrentConnection()) {
      await disconnectDB();
    }
    await stopOwnedMongod();
    if (TEST_DB_PATH && fs.existsSync(TEST_DB_PATH)) {
      fs.rmSync(TEST_DB_PATH, { recursive: true, force: true });
    }
    TEST_DB_PATH = null;
    connectedTestUri = null;
    throw error;
  }
};

/** Clear collections only after confirming the owned isolated test connection. */
export const clearTestDb = async () => {
  if (!mongodProcess || !ownsCurrentConnection()) {
    throw new Error(
      'Refusing to clear collections because the helper does not own an active isolated test database connection.'
    );
  }

  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({});
  }
};

/** Disconnect from the owned test database and stop only the child we spawned. */
export const stopTestDb = async () => {
  let connectionError = null;

  if (connectedTestUri) {
    if (!ownsCurrentConnection()) {
      connectionError = new Error(
        'Refusing to disconnect an unexpected Mongoose connection while stopping the test database.'
      );
    } else {
      try {
        await disconnectDB();
      } catch (error) {
        connectionError = error;
      }
    }
  }

  await stopOwnedMongod();

  if (TEST_DB_PATH && fs.existsSync(TEST_DB_PATH)) {
    fs.rmSync(TEST_DB_PATH, { recursive: true, force: true });
  }
  TEST_DB_PATH = null;
  connectedTestUri = null;

  if (connectionError) throw connectionError;
};

# Server Test Environment Investigation

Date: 2026-11-14  
Scope: read-only investigation. No tests were started, no MongoDB process or port was changed, and no environment file or database was opened.

## Findings at a glance

- The server suite is Node's built-in test runner, serial across files, with Mongoose tests backed by a separately spawned local `mongod`.
- The configured test database is `clearfiling_test` on `127.0.0.1:27019`; its data directory is `/tmp/clearfiling_test_db`.
- The helper hardcodes `/opt/homebrew/bin/mongod`. That binary **does exist on this macOS host** and reports MongoDB `8.0.34`; however, that path is not portable to typical Linux CI.
- No `mongodb-memory-server` or equivalent test-server package is declared in `server/package.json` or its lockfile.
- The supplied prior run's `59/86` failures all correspond to test files whose `before()` hook starts the DB and timed out waiting for it. The other **27 tests passed**.
- The observed `EPERM` for `127.0.0.1:29999` belongs to the explicit “unreachable host” test in `server/tests/unit/db.test.js`; that test expects a rejected connection and passed. It is distinct from the failing helper's port `27019`.
- The precise reason `mongod` failed to become ready is **not determinable** from the prior logs or current helper: it does not log most child stderr or exit details. A local socket/process restriction is plausible from the `EPERM` evidence, but cannot be confirmed without a safe reproduction.

## Current architecture and execution flow

`server/package.json` declares:

```text
"test": "node --test --test-concurrency=1 tests/**/*.test.js"
```

There are 13 server test files and 86 tests: five integration files and eight unit files. Node runs files serially. Eight files use `server/tests/helpers/testDb.js`; each has a suite-level `before(startTestDb)`, a `beforeEach(clearTestDb)`, and an `after(stopTestDb)` hook.

The helper flow is:

1. Probe the fixed port `27019` on loopback. If it is open, connect Mongoose to the fixed test database URI.
2. If closed, run `pkill -f "mongod.*27019"`, wait for the port, remove `/tmp/clearfiling_test_db` if it exists, then recreate it.
3. Spawn the absolute path `/opt/homebrew/bin/mongod` with that db path, port `27019`, and bind address `127.0.0.1`.
4. Attempt Mongoose connection after a “Waiting for connections” stdout line, an “Address already in use” stderr line, or a successful loopback poll. Otherwise reject after 8 seconds with `Timed out waiting for test mongod to start.`
5. Before each test, delete every collection in the active Mongoose database.
6. At suite end, disconnect and kill the spawned process, then also run `pkill -f "mongod.*27019"`.

`server/config/db.js` connects to the provided URI or, absent one, `process.env.MONGODB_URI`. The helper normally passes its explicit test URI to `connectDB`; integration tests do not need to load application credentials. Some tests set a child-process `MONGODB_URI` to the helper's test URI when exercising the seed CLI. `server/server.js` is not used to boot the HTTP server for tests; the app is imported directly by API integration tests.

## MongoDB availability and alternatives

- `mongod` is on this machine's PATH at `/opt/homebrew/bin/mongod` (Homebrew symlink to MongoDB Community 8.0.34). `/usr/local/bin/mongod` and `/usr/bin/mongod` are absent.
- The hardcoded binary is therefore available here; its absence is not the cause established by this inspection. It would be missing at that exact path on Linux CI and on many non-Homebrew macOS setups.
- Package/lock inspection found the MongoDB Node driver and Mongoose only. No in-memory server package, MongoDB test container, or alternative URI-based test mode is already configured.
- There is a separate negative connection test at `127.0.0.1:29999`. It asserts that `connectDB()` rejects an unreachable host. The earlier run logged `EPERM` for this connection but marked that test passed, so it is not one of the 59 failures.

## Failure classification for the prior 59 failures

The previous full run output showed `Timed out waiting for test mongod to start` from the `before()` setup hook. The failures were distributed across every test in these DB-backed files:

| Test file | Failed tests | What those tests cover | Classification |
|---|---:|---|---|
| `server/tests/integration/adminCategories.test.js` | 7 | Admin category API, auth/RBAC, CRUD, activity logging, delete guards | Setup blocked; controller assertions did not run. |
| `server/tests/integration/adminDocuments.test.js` | 10 | Document CRUD, upload validation, status changes, storage cleanup, editor permissions, query safety | Setup blocked; API/controller logic not evaluated. |
| `server/tests/integration/auth.test.js` | 15 | Health, login/session, CSRF, rate limits, JWT, CORS, DB readiness | Setup blocked; auth/security assertions not evaluated. |
| `server/tests/integration/publicDocuments.test.js` | 10 | Public document/category visibility, filtering, downloads, rate limits | Setup blocked; public API assertions not evaluated. |
| `server/tests/integration/rbac_and_seed.test.js` | 2 | Super-admin RBAC and seed CLI behavior | Setup blocked; RBAC/seed assertions not evaluated. |
| `server/tests/unit/adminUser.test.js` | 7 | Admin model/password and validation rules | Suite-level DB startup prevented even model-level tests from running. |
| `server/tests/unit/document.test.js` | 5 | Document model validation, indexes, publication timestamps | Setup blocked. |
| `server/tests/unit/documentCategory.test.js` | 3 | Category model validation and indexes | Setup blocked. |
| **Total** | **59** |  | **All attributable to the shared DB `before()` startup timeout in the supplied run.** |

The 27 passing tests are the two `db.test.js` cases, five `securityAndReadiness.test.js` cases, six storage tests, four token tests, and ten upload-validation tests. The direct unreachable-host attempt in `db.test.js` produced EPERM but passed its expected-rejection assertion.

### Root-cause confidence

The top-level failure is clear: the 8 DB-backed suites did not get a usable test database before their setup timeout. An application/controller defect is not indicated by these 59 results, because the test bodies were blocked by setup. This does **not** prove there are no application defects; those assertions remain unrun in the prior attempt.

The more specific OS-level cause is uncertain. The host binary exists, but the helper's timeout error omits the child's exit code and most stderr. `EPERM` from the explicit loopback connection check suggests this execution environment may restrict local networking; it does not conclusively show whether MongoDB could bind port 27019. I did not try to start MongoDB, probe the configured port, or rerun tests in this investigation.

## Isolation and safety assessment

The helper's intended database name and URI are separate from normal development/production names, and normal suite setup uses this fixed test URI rather than reading a real `.env` file. The seed CLI test also supplies this test URI to its subprocess.

However, the current helper is **not reliably isolated enough to run blindly**:

- If any service is listening on `27019`, it accepts that service as the test database and proceeds to delete every collection in database `clearfiling_test` on each test.
- `pkill -f "mongod.*27019"` may terminate another process whose command line matches; the helper runs this both before and after the suite.
- It recursively removes the fixed `/tmp/clearfiling_test_db` directory before starting the database.
- The literal `127.0.0.1` test URI makes production access unlikely, but the helper does not prove that an existing listener belongs to the test run.

No production/development URI was read or used in this investigation. For future testing, use a database server instance created and owned by the test process, with a unique temporary database and process-managed teardown. Do not run the current helper against an unverified listener.

## Recommended minimal portable solution

Recommended approach: use `mongodb-memory-server` as an explicit server dev dependency, then update the shared test helper to create a fresh ephemeral MongoDB instance and expose its generated URI. Keep the existing helper API (`startTestDb`, `clearTestDb`, `stopTestDb`) so the 8 suites do not need broad edits.

Minimal proposed files:

1. `server/package.json` — add the test-only server dependency.
2. `server/package-lock.json` — lock the approved dependency and its platform artifacts.
3. `server/tests/helpers/testDb.js` — replace the absolute Homebrew path, fixed port/data path, `pkill`, and fixed-directory deletion with an in-process-managed ephemeral server; set the database name explicitly to `clearfiling_test`, connect only to the generated local URI, and stop only the instance owned by the helper. Retain collection cleanup between cases.

The server package needs access to a MongoDB binary; `mongodb-memory-server` can manage/download a compatible binary, so CI should cache/pin the binary version. It still uses local loopback sockets; if this execution sandbox blocks loopback binding, run verification in an approved local/CI environment that permits the isolated test process. Adding the dependency does not itself bypass OS sandbox network policy.

An even smaller PATH-based change (`spawn(process.env.MONGOD_BINARY || 'mongod')`) would address the Homebrew-path portability defect, but it still requires MongoDB to be installed and retains the fixed port, shared `/tmp` path, and broad process-kill behavior. It is not the preferred safety fix.

## Future safe verification commands

After the proposed helper/dependency changes are approved and implemented, run from the repository root:

```sh
npm ci --prefix server
npm test --prefix server
git status --short
```

The test helper should assert/use only its process-owned ephemeral URI; no `.env`, development database, or production database should be needed. `npm ci` may fetch the new test dependency and MongoDB binary; this is a future command only and was not run here. If the first command is already satisfied by the approved lockfile install, the test command can be run alone. Do not use the current fixed-port helper for a verification run until its external-process and fixed-path behavior has been replaced or the test listener has been positively identified as disposable.

## Remaining uncertainties

- The prior run did not preserve `mongod` stderr/exit details, so the exact reason startup did not reach readiness cannot be named beyond the shared setup timeout. The `29999` EPERM is an expected connection failure from a passing negative test.
- This investigation deliberately did not reproduce the problem because running the current tests can kill a process and delete `/tmp/clearfiling_test_db`.
- Whether local loopback bind is permitted in the target runner is unknown. A managed in-memory server still requires local IPC/socket access.
- The existing tests are not fully independent from database startup; `adminUser.test.js` initializes MongoDB for tests that could otherwise be pure unit tests. Splitting those cases is optional follow-up, not required for the minimal harness portability change.

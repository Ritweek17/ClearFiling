# ClearFiling — Phase A Backend Security Remediation Report

**Repository Root:** `/Users/ritweek/Desktop/Clearfiling/ClearFiling`  
**Git Base Commit:** `b33945f` (`main`, working tree uncommitted prior to commit/push)  
**Assessment Date:** 2026-11-12  
**Verdict:** **PASS WITH WARNINGS**

---

## 1. Executive Summary & Overall Verdict

Phase A backend security remediation has been completed across credential hygiene, Role-Based Access Control (RBAC), MongoDB query safety, JWT/cookie hardening, CORS and CSRF enforcement, public rate limiting, Express proxy trust, database readiness reporting, and fail-closed production startup validation.

**Verdict: `PASS WITH WARNINGS`**

All targeted Phase A backend code remediations are implemented and verified by **86/86 passing backend tests**, **5/5 passing admin tests**, and clean production Vite builds for both `admin/` and `client/`. The verdict is **PASS WITH WARNINGS** (rather than unconditional `PASS`) for two explicit operational/environmental reasons outside backend code changes:
1. **Offline dependency audit & upstream CVEs:** External npm registry access is unavailable offline (`ENOTFOUND registry.npmjs.org`), preventing live `npm audit` remediation verification in this environment; locked versions (`mongoose@8.24.1`, `body-parser@1.20.5`, `proxy-addr@2.0.7`, `vite@5.4.21`, `react-router-dom@6.30.6`) remain unchanged and must be audited/upgraded cleanly once online before production launch.
2. **Remaining non-backend deployment & Phase B items:** `admin/vercel.json` (SPA fallback/security headers), live Cloudinary uploads against a real account, and Phase B public `client/` API integration remain outside Phase A backend scope.

---

## 2. Scope & Guardrail Compliance

- **Modified only backend configuration, controllers, middleware, utilities, routes, `server/.env.example`, `server/package.json`, and automated test suites.**
- **No files reorganized, renamed, moved, or deleted.**
- **No UI or design changes** in `client/` or `admin/`. Phase B (`client/` public API integration) was not started.
- **Local `server/.env` was never opened, read, printed, or modified.**
- **Production MongoDB Atlas data and admin credentials were untouched.**
- **No Git commits, pushes, history rewrites, or deployments were performed.**

---

## 3. Secret Exposure Check & `.env.example` Sanitization

### Git History Check
- Checked Git commit history for previously exposed sample/working-tree strings across `server/.env.example` and all commits. Neither the credential strings (`supportclearfiling_db_user`, `nitin9205543050`) nor `ClearFiling.co.in` appeared in committed Git history (`b33945f` and prior commits). The exposure existed only in the uncommitted working tree of [`server/.env.example`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/.env.example).

### Template Sanitization
Replaced all real-looking credentials and production-resembling password placeholders in [`server/.env.example`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/.env.example#L1-L39):
- `TRUST_PROXY=0`
- `MONGODB_URI=mongodb://127.0.0.1:27017/clearfiling_dev` (with parameterized Atlas example `mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority`)
- `JWT_SECRET=REPLACE_WITH_A_SECURE_RANDOM_SECRET`
- `SEED_ADMIN_EMAIL=admin@example.com`
- `SEED_ADMIN_PASSWORD=replace_before_seeding`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` set to `pending_client_setup`

### Repository-Wide Scan
- Scanned the repository excluding `node_modules`, `.git`, and `.env`: zero leaked credentials remain in source files or `.env.example` (matches were confined to synthetic unit-test fixtures, documentation templates, and the Phase 3.5 audit reference).

---

## 4. RBAC Privilege Escalation Remediation

**Vulnerability Resolved:** Previously, an authenticated `editor` could potentially supply `status: 'published'` in `POST /api/admin/documents` despite publish endpoints restricting publish transitions to `super_admin` and `admin`.

**Implementation:** [`createDocument`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L114-L169) in [`server/controllers/adminDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js) now enforces:
- Explicitly checks `const isPublisher = ['super_admin', 'admin'].includes(req.admin?.role)`.
- Returns HTTP **`403 Forbidden`** (`"Forbidden. Editors can only create documents in draft status."`) if a non-publisher supplies any status other than empty/`'draft'`.
- Strictly coerces persisted `documentStatus` to `'draft'` for non-publishers while preserving `'draft' | 'published'` creation for `admin` and `super_admin`.

**Verification:** Automated integration test in [`adminDocuments.test.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/tests/integration/adminDocuments.test.js) confirms `editor` receives `403` on `status: 'published'`, succeeds with `201` (`status: 'draft'`) on draft submission, and `admin` retains `201` direct-publish capability.

---

## 5. Authentication, JWT & Session Cookie Hardening

Updated [`server/utils/tokenUtils.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/utils/tokenUtils.js#L1-L136) and [`server/middleware/authMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/authMiddleware.js#L50-L66):

1. **JWT Algorithm Pinning (`HS256`):**
   - `generateToken()` pins `algorithm: 'HS256'`.
   - `verifyToken()` pins `algorithms: ['HS256']`, rejecting `none`, `HS384`, `HS512`, or asymmetric algorithm-confusion tokens.
2. **Minimum Secret Strength in Production:**
   - `getValidatedJwtSecret()` rejects missing/whitespace secrets and enforces a minimum trimmed length of **32 characters** when `NODE_ENV === 'production'`.
3. **Synchronized Cookie `maxAge`:**
   - Added [`parseExpiresInToMs()`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/utils/tokenUtils.js#L21-L44) supporting `ms`, `s`, `m`, `h`, `d`, and numeric second values so `getCookieOptions().maxAge` matches `JWT_EXPIRES_IN` (defaulting to `8h` / `28800000` ms) with `httpOnly: true` and `secure: isProduction || sameSite === 'none'`.
4. **Production Error Detail Suppression:**
   - [`authenticateAdmin`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/authMiddleware.js#L60-L65) omits internal `error.message` details from HTTP `500` responses when `NODE_ENV === 'production'`.

---

## 6. CORS & CSRF Protection Hardening

1. **CORS Configuration ([`server/config/cors.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/config/cors.js#L6-L57)):**
   - Added `'X-CSRF-Token'` to `corsOptions.allowedHeaders` alongside `'Content-Type'`, `'Authorization'`, `'X-Requested-With'`, and `'Accept'`.
   - Added `isLoopbackOrigin()` filtering inside `getAllowedOrigins()` so loopback origins (`localhost`, `127.0.0.1`, `[::1]`) are stripped whenever `NODE_ENV === 'production'`, even if inadvertently supplied in environment variables.
2. **CSRF Origin / Referer Verification ([`server/middleware/csrfMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/csrfMiddleware.js#L44-L56)):**
   - Replaced vulnerable `referer.startsWith(allowed)` prefix matching (which could be bypassed by lookalike domains such as `https://admin.clearfiling.co.in.attacker.tld`) with strict `new URL(referer).origin` comparison against `getAllowedOrigins()`, rejecting malformed `Referer` URLs cleanly.

---

## 7. MongoDB Query & Inactive-Category Visibility Hardening

Created [`server/utils/queryUtils.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/utils/queryUtils.js#L1-L116) and updated both document controllers:

1. **Regex Injection & ReDoS Prevention (`parseSearchQuery` / `escapeRegex`):**
   - Rejects non-string `q` query values (e.g., object query injection) with HTTP `400`.
   - Enforces `MAX_SEARCH_QUERY_LENGTH = 100` (returns HTTP `400` if exceeded).
   - Escapes all regular-expression metacharacters (`[.*+?^${}()|[\]\\]`) prior to MongoDB `$regex` execution.
2. **Sort Field & Direction Allowlisting (`parseAllowedSort`):**
   - [`getDocuments`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L51) restricts sorting to `ADMIN_DOCUMENT_SORT_FIELDS` (`createdAt`, `updatedAt`, `publishedAt`, `title`, `status`, `viewCount`, `downloadCount`) and safely falls back to `{ createdAt: -1 }` on arbitrary, operator-prefixed (`$where`), or non-allowlisted sort inputs.
3. **Inactive Category Isolation on Public Endpoints ([`server/controllers/publicDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/publicDocumentController.js#L27-L160)):**
   - `getPublicDocuments`, `getPublicDocumentBySlug`, and `downloadPublicDocument` all resolve active categories (`isActive: true`) and enforce `category: { $in: activeCategoryIds }`.
   - Published documents assigned to deactivated categories are excluded from public listings, return empty results when filtered by inactive category ID/slug, and return HTTP `404` on detail and download routes.

---

## 8. Express Proxy Trust, Readiness Checks & Production Startup Validation

1. **Trust Proxy Resolution ([`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L17-L29), [`#L46`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L46)):**
   - `resolveTrustProxy()` sets `trust proxy` to `1` in `production` by default (preventing arbitrary multi-hop header spoofing) and `false` outside production unless explicitly overridden via numeric/boolean `TRUST_PROXY`.
2. **Database Readiness Gating & Health Endpoints ([`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L31-L94)):**
   - Added `isDatabaseReady()` and `requireDatabaseReady` middleware returning HTTP `503 Service Unavailable` across `/api/public`, `/api/admin/auth`, `/api/admin/categories`, and `/api/admin/documents` whenever Mongoose `readyState !== 1`.
   - `GET /api/status` reports HTTP `200` (`status: 'online'`, `database: 'connected'`) when ready, and HTTP `503` (`status: 'degraded'`, `database: 'disconnected'`) when disconnected.
   - Added `GET /api/health/ready` returning HTTP `200` (`{ ready: true, database: 'connected' }`) or HTTP `503` (`{ ready: false, database: 'disconnected' }`).
3. **Fail-Closed Production Startup Validation & Shutdown Safety ([`server/utils/envValidator.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/utils/envValidator.js#L1-L52), [`server/server.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/server.js#L10-L50)):**
   - `validateProductionEnvironment()` refuses production startup (`process.exit(1)`) if `MONGODB_URI`, `JWT_SECRET` (non-placeholder, `>= 32` chars), non-localhost `CLIENT_ORIGIN`, non-localhost `ADMIN_ORIGIN`, or Cloudinary credentials (`isCloudinaryReady()`) are missing or still set to placeholders.
   - Added a `10000` ms `unref()` force-exit timer during `SIGINT`/`SIGTERM` shutdown.
4. **Node Runtime Engine Floor ([`server/package.json`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/package.json#L7-L9)):**
   - Added `"engines": { "node": ">=20.0.0" }`.

---

## 9. Public API Rate Limiting

Updated [`server/middleware/rateLimitMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/rateLimitMiddleware.js#L1-L63) and [`server/routes/publicDocumentRoutes.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/routes/publicDocumentRoutes.js#L1-L23):
- Retained `loginRateLimiter` (`5` requests per `15` minutes per IP).
- Added `publicBrowseRateLimiter` (`120` requests per `1` minute per IP; `5` under `NODE_ENV=test` with `x-test-rate-limit` header) applied to `GET /api/public/documents`, `GET /api/public/documents/:slug`, and `GET /api/public/categories`.
- Added `publicDownloadRateLimiter` (`60` requests per `5` minutes per IP; `5` under `NODE_ENV=test` with `x-test-rate-limit` header) applied to `GET /api/public/documents/:slug/download`.
- Verified HTTP `429 Too Many Requests` enforcement via integration tests.

---

## 10. Dependency & Vulnerability Audit Status

Inspected installed dependency trees across workspaces via `npm ls`:
- **`server/`:** `mongoose@8.24.1`, `express@4.22.2` (`body-parser@1.20.5`, `proxy-addr@2.0.7`), `helmet@8.3.0`, `express-rate-limit@8.7.4`, `jsonwebtoken@9.0.3`, `multer@2.5.0`, `cloudinary@2.11.0`, `cookie-parser@1.4.7`, `cors@2.8.6`.
- **`admin/`:** `vite@5.4.21`, `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@6.30.6`, `axios@1.21.1`.
- **`client/`:** `vite@5.4.21`, `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@6.30.6`.

**Warning / Limitation:** Live `npm audit` could not contact `registry.npmjs.org` (`ENOTFOUND registry.npmjs.org`) inside this offline execution environment. No blind or forced package upgrades were performed. Before production deployment, run `npm audit` and apply non-breaking/verified patches (especially reviewing `mongoose`, `body-parser`, `proxy-addr`, `vite`, and `react-router-dom` advisories flagged in the Phase 3.5 audit) on an online machine, then re-run full backend, admin, and build verification.

---

## 11. Verification Summary

| Check | Command | Scope & Outcome |
|---|---|---|
| Backend Full Test Suite (Unit + Integration with `mongod`) | `cd ClearFiling/server && npm test` | **PASS — 86/86 tests passed** (`0` failed, `0` skipped, `0` cancelled) |
| Backend Non-DB Unit Tests | `cd ClearFiling/server && node --test tests/unit/storageService.test.js tests/unit/uploadValidation.test.js tests/unit/tokenUtils.test.js tests/unit/securityAndReadiness.test.js` | **PASS — 25/25 unit tests passed** (`queryUtils`, `CORS`, `CSRF`, `trust proxy`, `envValidator`, `storageService`, `tokenUtils`, `uploadValidation`) |
| Admin Unit Tests | `cd ClearFiling/admin && npm test` | **PASS — 5/5 tests passed** |
| Admin Production Build | `cd ClearFiling/admin && npm run build` | **PASS — built cleanly (`1593` modules, `vite v5.4.21`)** |
| Client Production Build | `cd ClearFiling/client && npm run build` | **PASS — built cleanly (`1958` modules, `vite v5.4.21`)** |
| Secret / Credential Scan | `grep -rnE ...` (excluding `.env`, `node_modules`, `.git`) | **PASS — 0 leaked secrets in source or `.env.example`** |
| Live Dependency Audit (`npm audit`) | Offline environment | **NOT RUN (WARN)** — requires online registry access before deployment |

---

## 12. Remaining Actions Before Production Launch & Phase B

1. **Online Dependency Remediation:** Run `npm audit` across `server/`, `admin/`, and `client/` in an online environment and resolve/verify advisories without `npm audit fix --force`.
2. **Admin Vercel Configuration:** Add `admin/vercel.json` for SPA client-side routing fallback and security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) when preparing Admin deployment.
3. **Live Cloudinary & Staging Smoke Test:** Exercise real multi-format upload/download/delete flows against the client-owned Cloudinary credentials and staging Atlas DB.
4. **Proceed to Phase B:** Integrate `client/` (`DocumentationSection`) with `/api/public/*` when ready.

---

## 13. Phase A.1: Release Blocker Verification

**Verification Date:** 2026-11-12  
**Scope:** Strictly limited to (1) Dependency vulnerability verification, (2) Admin Vercel deployment configuration, and (3) Cloudinary staging upload lifecycle verification.

### 13.1 Dependency Audit Results

Online `npm audit` was executed across `server/`, `admin/`, and `client/` (without using `npm audit fix --force`).

- **`server/` (Resolved via non-breaking `npm audit fix`):**
  - Before fix: `7` vulnerabilities (`2` critical, `2` high, `3` moderate).
  - Applied compatible patch/minor updates (`npm audit fix`, no `--force`):
    - `mongoose`: `8.24.1` → `8.24.8` (**critical** CVEs resolved)
    - `proxy-addr`: `2.0.7` → `2.0.8` (**critical** CVE resolved)
    - `body-parser`: `1.20.5` → `1.20.9` (**high** CVEs resolved, updating its `qs` dependency to `6.16.2`)
    - `nodemon`: `3.1.14` → `3.1.11` with `minimatch@3.1.5` & `brace-expansion@1.1.22` (**high** & **moderate** dev-dependency CVEs resolved)
  - Remaining in `server/`: `2` **moderate** vulnerabilities in transitive `qs@6.15.4` pinned directly by `express@4.22.2` (`GHSA-4mjr-xmp4-gh2g`, `GHSA-6pq8-jhm2-2vcw`); upgrading requires major `express@5.x` (not performed per no-major-upgrade rule). `0` critical and `0` high vulnerabilities remain in `server/`.
- **`admin/` (`npm audit`):**
  - `4` vulnerabilities (`1` high, `3` moderate); **0 compatible non-breaking updates** available (all fixes require `--force` major upgrades):
    - `vite@5.4.21` / `esbuild` (**high** / **moderate** dev-only build/dev-server advisories; npm fix requires breaking `vite@8.3.8`)
    - `react-router-dom@6.30.6` / `react-router` (**moderate**: `GHSA-wrjc-x8rr-h8h6` open redirect via backslash, `GHSA-337j-9hxr-rhxg` SSR hydration constructor injection; app uses client-side SPA routing without SSR, and npm fix requires breaking `react-router-dom@7.18.5`)
- **`client/` (`npm audit`):**
  - Identical `4` vulnerabilities (`1` high, `3` moderate) via `vite@5.4.21` / `esbuild` and `react-router-dom@6.30.6` / `react-router`; all require breaking major upgrades (`vite@8.3.8`, `react-router-dom@7.18.5`), so no major upgrades were performed.

### 13.2 Admin Vercel Deployment Configuration Results

Added and hardened production deployment configuration for the independent Admin console (`admin/`), without altering UI design:

- **Created [`admin/vercel.json`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/vercel.json):**
  - Configures React Router SPA fallback rewrite (`"/(.*)"` → `"/index.html"`).
  - Applies security response headers on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, and `X-Robots-Tag: noindex, nofollow, noarchive`.
  - Sets `Cache-Control: no-store, max-age=0` on `/index.html`.
- **Created [`admin/public/robots.txt`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/public/robots.txt) & Updated [`admin/index.html`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/index.html):**
  - Blocks search engine crawling/indexing of admin routes (`User-agent: *` / `Disallow: /`, copied into `admin/dist/robots.txt`) and adds `<meta name="robots" content="noindex, nofollow" />` plus `<meta name="referrer" content="strict-origin-when-cross-origin" />`.
- **Source Maps & Secrets Audit ([`admin/vite.config.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/vite.config.js)):**
  - Explicitly set `build: { sourcemap: false }`; verified built `admin/dist/` contains zero `.map` files and zero backend secrets.
- **No Production Localhost Fallback ([`admin/src/api/apiClient.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/api/apiClient.js)):**
  - Updated `API_BASE_URL` resolution so production Vite builds (`import.meta.env?.PROD === true`) **fail fast** if `VITE_API_BASE_URL` is unset rather than falling back to `http://localhost:5001`.
  - Verified by building with `VITE_API_BASE_URL=https://api.clearfiling.co.in npx vite build` and inspecting `dist/assets/*.js`: `http://localhost:5001` was completely dead-code eliminated.

### 13.3 Cloudinary Staging Lifecycle Verification Results

Executed the final isolated live-Cloudinary staging verification harness ([verify_cloudinary_staging.mjs](file:///Users/ritweek/.gemini/antigravity/brain/ea9910fa-4a33-432b-8531-701d182d64bf/scratch/verify_cloudinary_staging.mjs)) against ephemeral local test MongoDB (`127.0.0.1:27019`, zero writes to MongoDB Atlas) and isolated folder `clearfiling/staging_verify_1794486083528` after enabling **"Allow delivery of PDF and ZIP files"** in Cloudinary Settings, without reading/printing secrets or modifying `server/.env`:

- **14/14 Supported Formats Uploaded, Routed & Delivered via Public CDN (`HTTP 201` upload + `HTTP 200` CDN delivery):**
  - `resourceType: 'image'` (`5` formats): `pdf` (`201` upload / **`200` inline CDN delivery** / **`200` `fl_attachment` CDN delivery**), `jpg` (`201` / `200`), `jpeg` (`201` / `200`), `png` (`201` / `200`), `webp` (`201` / `200`).
  - `resourceType: 'raw'` (`9` formats): `doc` (`201` / `200`), `docx` (`201` / `200`), `txt` (`201` / `200`), `xls` (`201` / `200`), `xlsx` (`201` / `200`), `csv` (`201` / `200`), `ppt` (`201` / `200`), `pptx` (`201` / `200`), `zip` (`201` / **`200` CDN delivery**).
  - Verified every uploaded `publicId` via Cloudinary Admin API (`cloudinary.api.resource`) under `clearfiling/staging_verify_1794486083528/`.
- **Cross-`resource_type` File Replacement (`POST /api/admin/documents/:id/replace-file`):**
  - `pdf` (`image`) → `docx` (`raw`): HTTP `200`, updated DB metadata, verified old `image` asset removed (`404` on Cloudinary) and new `raw` asset present.
  - `csv` (`raw`) → `png` (`image`): HTTP `200`, updated DB metadata, verified old `raw` asset removed (`404` on Cloudinary) and new `image` asset present.
- **Deletion Across Resource Types (`DELETE /api/admin/documents/:id`):**
  - Deleted both `raw`-backed (`docx`) and `image`-backed (`png`) documents (`200`); Cloudinary Admin API confirmed both assets removed (`404`).
- **Database Failure Rollback:**
  - Simulated DB insertion failure after a live Cloudinary PNG upload; endpoint returned HTTP `500`, persisted `0` DB records, and deleted the uploaded Cloudinary asset cleanly (`0` orphan image assets left).
- **Storage Failure Cleanup:**
  - Temporarily supplied an invalid `CLOUDINARY_API_SECRET` in-memory; upload failed cleanly with HTTP `>= 400` and created `0` orphan DB documents.
- **Validation Gates:**
  - Oversized `> 10` MB upload rejected with HTTP `400`; EXE (`MZ`) disguised as `.pdf` rejected with HTTP `400`.
- **Post-Cleanup Orphan Audit:**
  - Verified zero orphans remained after test cleanup: `remainingImageOrphans: 0`, `remainingRawOrphans: 0`, `remainingDbDocs: 0`.

### 13.4 Tests & Builds (After Final Edits)

| Check | Outcome | Details |
|---|---|---|
| Live Cloudinary Staging Verification (`verify_cloudinary_staging.mjs`) | **PASS (14/14)** | `14/14` uploads (`201`), **`14/14` public CDN `HTTP 200`** (incl. inline PDF, `fl_attachment` PDF, and ZIP), cross-type replace, delete, DB rollback, storage failure cleanup, validation & `0`-orphan cleanup verified |
| `cd ClearFiling/server && npm test` | **PASS (86/86)** | `0` failed, `0` skipped |
| `cd ClearFiling/admin && npm test` | **PASS (5/5)** | `apiClient` & validation tests passed |
| `cd ClearFiling/admin && npm run build` | **PASS** | `1593` modules (`vite v5.4.21`), `0` `.map` files, `dist/robots.txt` & `noindex` meta verified |
| `cd ClearFiling/client && npm run build` | **PASS** | `1958` modules (`vite v5.4.21`), `client/` UI untouched |

### 13.5 Remaining Maintenance Items (Non-Blocking)

1. **Major-Version Dependency Upgrades (`server` `express@4.22.2` → `qs@6.15.4` moderate; `admin`/`client` `react-router-dom@6.30.6`, `vite@5.4.21`):** No critical/high backend vulnerabilities remain; remaining advisories require major upstream upgrades (`express@5.x`, `react-router-dom@7.x`, `vite@8.x`), tracked as scheduled maintenance outside Phase A.1.
2. **Production Account Parity Check:** When provisioning separate dedicated production Cloudinary credentials, confirm **"Allow delivery of PDF and ZIP files"** is likewise enabled on the production Cloudinary environment if distinct from Test.

### 13.6 Final Release Readiness Verdict

**Verdict: `PASS` — Phase A & Phase A.1 Release Blockers Resolved**

All Phase A backend security remediations, non-breaking server dependency patches (`0` critical/high remaining in `server/`), Admin Vercel deployment hardening (`vercel.json`, `robots.txt`, `sourcemap: false`, no localhost prod fallback), live 14-format Cloudinary staging lifecycle checks (including `HTTP 200` CDN delivery for PDF, `fl_attachment` PDF, and ZIP with zero orphans), and all backend/admin/client tests and builds pass cleanly. Ready for your explicit approval to commit/deploy or proceed to **Phase B**.


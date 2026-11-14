# ClearFiling — Phase 3.5: Production Readiness Audit

**Date:** 2026-11-11  
**Project:** ClearFiling — Document Management System (DMS)  
**Repository:** `https://github.com/Ritweek17/ClearFiling` (Local: `/Users/ritweek/Desktop/Clearfiling/ClearFiling`)  
**Branch Audited:** `main` (`b33945f`, 1 commit ahead of `origin/main` + uncommitted working tree)  
**Proposed Targets (Unprovisioned):** Public (`https://www.clearfiling.co.in`), Admin (`https://admin.clearfiling.co.in`), Backend API (`https://api.clearfiling.co.in`)  
**Audit Mode:** Strict Read-Only Pre-Release Audit  
**Final Verdict:** **NOT READY FOR DEPLOYMENT**

---

## 1. Executive Summary

A full-stack, read-only production readiness audit was conducted across all four components of the ClearFiling workspace (`server/`, `admin/`, `client/`, and `docs/admin/`), dependency lockfiles, Git repository state, and target cloud architecture (Client-Owned MongoDB Atlas, Cloudinary, Vercel, and Node.js backend hosting).

While the Phase 2A, Phase 2B, and Phase 3 implementations establish a solid architectural base (ESM Express backend, HttpOnly cookie JWT auth, 12-round bcrypt hashing, magic-byte PDF verification, orphan cleanup on failed DB writes, decoupled React/Vite admin UI), **the repository is not ready for production release in its current state**.

The audit identified **6 CRITICAL**, **9 HIGH**, **8 MEDIUM**, **4 LOW**, and **3 INFORMATIONAL** findings spanning application security, runtime correctness behind reverse proxies, dependency vulnerabilities, missing deployment manifests, unimplemented audit/public features, and unprovisioned client-owned infrastructure.

### Key Verdict Drivers
1. **Broken Cloudinary Credential Guard & Silent Mock Fallback in Production:** [`server/services/storageService.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/services/storageService.js#L12) only checks `!cloudName.includes('placeholder')`, causing `pending_client_setup` to be treated as live credentials; conversely, unset credentials silently store mock URLs instead of failing fast.
2. **RBAC Privilege Escalation on Document Creation:** `editor` users are blocked from calling `PATCH /api/admin/documents/:id/publish`, yet [`createDocument`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L145) permits an `editor` to pass `status=published` during upload and bypass publisher authorization.
3. **Missing Reverse-Proxy Trust Configuration:** [`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js) omits `app.set('trust proxy', 1)`, breaking IP-scoped login rate limiting (`express-rate-limit` v8) and audit IP recording behind cloud load balancers.
4. **Critical Dependency CVEs:** `server/` carries 2 Critical (`mongoose@8.24.1`, `proxy-addr@2.0.7`) and 2 High (`body-parser@1.20.5`, `brace-expansion`) advisories.
5. **Missing Vercel Admin Routing & Security Headers:** `admin/` lacks `vercel.json`, causing HTTP 404 errors on SPA route refreshes and omitting security headers (`X-Frame-Options`, `nosniff`, `HSTS`).
6. **Unimplemented DMS End-to-End Surfaces:** Backend `GET /api/admin/activity-logs` does not exist (`ActivityLogsPage.jsx` displays a static notice), and `client/` has no public DMS API integration (`DocumentationSection.jsx` still reads empty static arrays).
7. **Uncommitted Codebase & Unprovisioned Client Infrastructure:** Phase 2A–3 files remain uncommitted locally; client-owned MongoDB Atlas, Cloudinary, backend host, Vercel admin project, and DNS records do not yet exist.

---

## 2. Repository Integrity Findings

### Summary of Observed State (`git status`, `git branch`, `git ls-files`)
- **Branch State:** `main` is at `b33945f` (*"refactor: improve contact form submit button styling and layout structure"*), **1 commit ahead of `origin/main`** (`bd7cea6`). Secondary branch `preview/contact-enhancements` is at `9321902`.
- **Modified Tracked Files (4):** `server/.env.example`, `server/package.json`, `server/package-lock.json`, `server/server.js`.
- **Untracked Directories & Files:** Entire `admin/` application, `docs/`, and ~25 Phase 2A/2B backend files under `server/`.
- **Tracked Build / Env Verification:** `git ls-files` confirmed only `client/.env.example` and `server/.env.example` are tracked; `server/.env`, `admin/.env`, `admin/dist/`, `client/dist/`, `.DS_Store`, and `node_modules/` are properly excluded by root `.gitignore` and `admin/.gitignore`.
- **Test Baseline Observed:**
  - `admin/` unit tests (`npm test`): **5/5 passing** (note: test title in `apiClient.test.js` references `localhost:5000` while code defaults to `localhost:5001`).
  - `server/` test suite (`npm test`, observed on current codebase prior to Phase 3.5): **62/62 passing** against local MongoDB.

### Repository Integrity Findings Table

| Finding | File Path / Component | Evidence | Severity | Required Action | Fix Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Unpushed commit and large uncommitted Phase 2A–3 working tree | Git workspace (`main`) | `git status` shows `ahead 1` plus 4 modified files and untracked `admin/`, `docs/`, `server/*` modules | **HIGH** | Review diff, exclude local `.env`/artifacts, commit clean Phase 2A–3 changes in logical commits before client fork/sync. | Workflow / Git |
| Root `package.json` omits `admin/` scripts | [`package.json`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/package.json#L6-L11) | `install-all` and `dev` only install/run `client` and `server`; `admin` has no root helper scripts | **LOW** | Add `"install-all"` / `"admin"` scripts if root orchestration is desired, or document per-package commands in `README.md`. | Code changes |
| Missing root `README.md` and setup runbook | Repository root | Directory listing shows `PROJECT_RULES.md` and `UI_SPECIFICATION.md`, no `README.md` | **LOW** | Add `README.md` documenting `client/`, `admin/`, `server/` setup, env vars, seeding, and deployment targets. | Code changes |
| Placeholder credential resembling real domain password in tracked `.env.example` | [`server/.env.example`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/.env.example#L25) | `SEED_ADMIN_PASSWORD=ClearFiling.co.in` is tracked in Git for `admin@clearfiling.co.in` | **MEDIUM** | Replace with non-guessable placeholder text (e.g., `<set-strong-password-min-8-chars>`) before pushing to GitHub. | Code changes |
| Residual `.gitkeep` files alongside real modules | [`server/config/.gitkeep`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/config/.gitkeep) (and `controllers/`, `middleware/`, `models/`, `routes/`) | Empty `.gitkeep` placeholders remain in populated directories | **INFORMATIONAL** | Remove obsolete `.gitkeep` files during cleanup commit. | Code changes |
| Local build output directories (`dist/`) and `.DS_Store` exist in workspace | `admin/dist/`, `client/dist/`, `.DS_Store` | Present on disk (`find` output); ignored by `.gitignore` | **INFORMATIONAL** | Verify `.gitignore` continues excluding them before commits. | None (verified ignored) |
| Legacy `dist` / stale test naming in `admin` | [`admin/tests/apiClient.test.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/tests/apiClient.test.js#L13) | Test title says `defaults to configured base URL or localhost:5000` while [`apiClient.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/api/apiClient.js#L6) defaults to `http://localhost:5001` | **LOW** | Update test title to match `5001` or configured env expectation. | Code changes |

---

## 3. Backend Readiness (`server/`)

### Subsystem Inspection Summary
- **Runtime & Startup (`Node v24.21.0`, ESM):** [`server/server.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/server.js) imports `'dotenv/config'` first, resolves `parseInt(process.env.PORT, 10) || 5001`, calls `connectDB()`, and binds `SIGINT`/`SIGTERM`. However, [`server/package.json`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/package.json) lacks an `"engines"` field, and if `MONGODB_URI` is missing, `server.js` logs a warning and starts serving HTTP traffic anyway without a DB.
- **Health Endpoint (`/api/status`):** [`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L28-L30) returns `200 OK` unconditionally without verifying `mongoose.connection.readyState === 1`.
- **Logging:** Standard `console.log`/`console.warn`/`console.error` only; no HTTP request logger (`morgan`/Pino) or request correlation IDs.
- **Authentication & Authorization:**
  - `POST /api/admin/auth/login` uses `loginRateLimiter` (5 req/15m IP), normalizes email, selects `+passwordHash`, verifies `isActive`, compares via `bcryptjs` (12 salt rounds), issues JWT signed with `JWT_SECRET` (`8h` default), and sets `HttpOnly` cookie `clearfiling_admin_token`.
  - `authenticateAdmin` verifies JWT (no explicit `algorithms: ['HS256']` pin), re-queries `AdminUser.findById(decoded.id)`, and rejects deactivated accounts (`!admin.isActive`).
  - **Missing Auth Capabilities:** No `tokenVersion` revocation (tokens remain valid for 8h on role change or logout if copied), no admin user CRUD endpoints, and no password rotation/recovery API (recovery requires CLI DB update).
- **Documents & Storage:** Multer memory storage + `fileFilter` + `%PDF` magic-byte check (`verifyPdfMagicBytes`), atomic slug generation (`slugify.js`), orphan cleanup on DB creation failure, and two-phase replacement (`upload new -> save DB -> delete old`). Contains critical defects detailed below.
- **Activity Logs:** `ActivityLog` schema (`timestamps: { createdAt: true, updatedAt: false }`) and `sanitizeMetadata()` (redacts passwords/tokens/cookies/secrets) record document and category mutations, **but login/logout calls are missing, no listing endpoint exists, and no retention/TTL policy is defined**.

### Backend Findings Table

| Finding | File Path / Component | Evidence | Severity | Required Action | Fix Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Cloudinary placeholder check accepts `pending_client_setup` as live, and missing creds silently store mock URLs in production | [`server/services/storageService.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/services/storageService.js#L12), [`L87-L97`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/services/storageService.js#L87-L97) | Line 12 checks only `!cloudName.includes('placeholder')` while `.env.example` uses `pending_client_setup`; unset creds return `https://res.cloudinary.com/clearfiling-pending-setup/...` even when `NODE_ENV === 'production'` | **CRITICAL** | Fail fast (`throw Error`) in `NODE_ENV === 'production'` if Cloudinary credentials are missing or equal placeholder tokens (`placeholder`, `pending_client_setup`); restrict mock fallback strictly to `development`/`test`. | Code changes |
| Editor role can publish documents on creation, bypassing RBAC | [`server/routes/adminDocumentRoutes.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/routes/adminDocumentRoutes.js#L25-L30), [`server/controllers/adminDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L145) | `PATCH /:id/publish` enforces `authorizeRoles('super_admin', 'admin')`, but `POST /` has no role check and line 145 accepts `status === 'published'` from `req.body` | **CRITICAL** | Enforce server-side rule in `createDocument`: if `req.admin.role === 'editor'`, force `documentStatus = 'draft'` (or return 403 if `'published'` is requested). | Code changes |
| Missing `app.set('trust proxy', 1)` breaks rate limiter & IP logging behind proxies | [`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L12) | `trust proxy` is never configured; `express-rate-limit` v8 inspects `X-Forwarded-For` vs `req.ip` and warns/throws `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` or buckets all traffic under the proxy IP | **CRITICAL** | Configure `app.set('trust proxy', 1)` (or configurable hop count) before rate limiters/routes. | Code changes |
| Missing `GET /api/admin/activity-logs` endpoint & missing login/logout audit logging | [`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js), [`server/controllers/authController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/authController.js#L60-L92) | `ActivityLog.js` defines `ADMIN_LOGIN`/`ADMIN_LOGOUT`, yet `authController.js` never calls `logActivity()`, and no read endpoint exists for `ActivityLogsPage.jsx` | **HIGH** | Implement paginated/filterable `GET /api/admin/activity-logs` (restricted to `super_admin`/`admin`), log `ADMIN_LOGIN` (success + failed attempts safely) & `ADMIN_LOGOUT`, and define TTL/archive retention. | Code changes |
| ReDoS & invalid regex 500 error in search queries | [`server/controllers/adminDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L32-L38), [`server/controllers/publicDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/publicDocumentController.js#L43-L49) | Raw `req.query.q` passed directly into `$regex: q`; regex metacharacters (`[`, `(`) throw HTTP 500 and nested quantifiers risk MongoDB ReDoS | **HIGH** | Escape regex special characters via `escapeRegex(q)` before constructing `$regex`, or use `$text: { $search: q }` (index already exists on `Document`), and cap `q` length (e.g., 100 chars). | Code changes |
| Unvalidated `req.query.sort` parameter passed directly to Mongoose `.sort()` | [`server/controllers/adminDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/adminDocumentController.js#L45) | `.sort(req.query.sort \|\| { createdAt: -1 })` accepts arbitrary strings or `qs` objects | **HIGH** | Enforce strict allowlist of permitted sort fields (e.g., `createdAt`, `updatedAt`, `title`, `viewCount`, `downloadCount`). | Code changes |
| Public endpoints expose published docs under deactivated categories & lack rate limits | [`server/controllers/publicDocumentController.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/controllers/publicDocumentController.js#L20-L40), [`server/routes/publicDocumentRoutes.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/routes/publicDocumentRoutes.js) | `getPublicDocuments` ignores `isActive` when `?category=<ObjectId>` or no category is specified; `getPublicDocumentBySlug` and `download` do not check category `isActive`; zero rate limiting on public routes | **HIGH** | Filter public document queries/retrievals against active category IDs (`isActive: true`), and add reasonable rate limiting on `/api/public/*` (especially search & counter-increment endpoints). | Code changes |
| `MulterError` returns `"Unknown error: INVALID_FILE_TYPE"` for non-PDF MIME/extension | [`server/middleware/uploadMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/uploadMiddleware.js#L21-L24) | Verified via Node execution: `new multer.MulterError('INVALID_FILE_TYPE', 'Only genuine...')` sets `err.field` instead of `err.message`, returning `'Unknown error: INVALID_FILE_TYPE'` | **MEDIUM** | Pass a standard `Error` (with `statusCode = 400`) or handle `err.code === 'INVALID_FILE_TYPE'` explicitly in `requirePdfUpload`. | Code changes |
| Cross-domain / cross-subdomain cookie & CORS edge cases in staging/production | [`server/utils/tokenUtils.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/utils/tokenUtils.js#L41-L52), [`server/config/cors.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/config/cors.js#L47) | `COOKIE_MAX_AGE_MS` is hardcoded `8h` instead of matching `JWT_EXPIRES_IN`; `SameSite=Lax` fails on separate PSL domains (`*.vercel.app` -> `*.onrender.com`) and requires `SameSite=None; Secure` (plus Safari ITP considerations); `cors.js` omits `X-CSRF-Token` in `allowedHeaders` while `csrfMiddleware.js` checks it | **HIGH** | Enforce `admin.` and `api.` under same parent domain `clearfiling.co.in` with `NODE_ENV=production`, `COOKIE_SAMESITE=lax` (or `none` + `secure: true` if separate preview domains used); sync cookie `maxAge` with `JWT_EXPIRES_IN`; add `X-CSRF-Token` to `allowedHeaders`. | Code changes + External config |
| `/api/status` & startup do not fail/degrade when DB is unreachable | [`server/server.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/server.js#L11-L15), [`server/app.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/app.js#L28-L30) | Server boots without `MONGODB_URI`, and `/api/status` returns HTTP 200 even if Mongoose is disconnected; shutdown lacks force-exit timeout for keep-alive sockets | **MEDIUM** | Fail fast at startup if `NODE_ENV === 'production'` and `MONGODB_URI` or strong `JWT_SECRET` ($\ge 32$ chars) is missing; report DB status (`503` if disconnected) in `/api/status`; add shutdown timeout. | Code changes |
| Raw `error.message` leaked in 500 auth middleware error & non-production stack risk | [`server/middleware/authMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/authMiddleware.js#L60-L64) | Returns `error: error.message` in HTTP 500 JSON payload regardless of `NODE_ENV` | **MEDIUM** | Omit `error.message` in production HTTP 500 responses; log internally instead. | Code changes |
| `cors.js` allows `localhost` in production if env vars copied from `.env.example` | [`server/config/cors.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/config/cors.js#L9-L19), [`server/.env.example`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/.env.example#L19-L20) | `.env.example` mixes `http://localhost:*` with `https://*.clearfiling.co.in` in `CLIENT_ORIGIN` and `ADMIN_ORIGIN` | **MEDIUM** | Ensure production hosting env variables set ONLY HTTPS `clearfiling.co.in` origins, never localhost. Optionally reject `http://localhost` origins when `NODE_ENV === 'production'`. | External config / Code changes |
| In-memory rate limiter, static Multer config, missing Node `"engines"`, no `tokenVersion` revocation, no user management / password reset | [`server/middleware/rateLimitMiddleware.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/middleware/rateLimitMiddleware.js), [`server/package.json`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/package.json) | `MemoryStore` resets on deploy/scale-out; `uploadMiddleware.js` reads `MAX_FILE_SIZE_MB` once at import time; `package.json` lacks `"engines": { "node": ">=20" }`; JWT verify lacks `algorithms: ['HS256']`; no admin user management or password reset API | **LOW–MEDIUM** | Pin `algorithms: ['HS256']`, add `"engines"` in `package.json`, document CLI password reset procedure, and add user management / persistent rate-limit store before multi-admin or multi-instance scaling. | Code changes |

---

## 4. Admin Frontend Readiness (`admin/`)

### Inspection Summary
- **Stack & Build:** React 18.3.1, Vite 5.4.21, Tailwind CSS 3.4.3, React Router 6.30.6, Axios 1.21.1. Production build (`vite build`) produces clean assets in `admin/dist/`.
- **Environment Security:** Only `VITE_API_BASE_URL` is read in [`admin/src/api/apiClient.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/api/apiClient.js#L3-L6). Zero secrets, DB URIs, or private keys exist in `admin/` source or `.env.example`.
- **Auth & CSRF Client Plumbing:** `apiClient` sets `withCredentials: true` and attaches `X-Requested-With: XMLHttpRequest` via request interceptor. `AuthContext` validates session on mount via `GET /api/admin/auth/me`.
- **Documents & Categories UI:** Full CRUD, pagination, debounced/submit search, category filtering, active category checks + quick-create category flow inside upload modal, two-phase PDF replacement modal with progress bar, and deletion safety guard when categories contain documents.

### Admin Frontend Findings Table

| Finding | File Path / Component | Evidence | Severity | Required Action | Fix Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Missing `admin/vercel.json` causes 404s on SPA routes & omits browser security headers | [`admin/`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin) | `client/vercel.json` exists with SPA rewrites and 5 security headers, whereas `admin/` has no `vercel.json` | **CRITICAL** | Add `admin/vercel.json` with SPA rewrite (`/(.*) -> /index.html`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`, and `X-Robots-Tag: noindex, nofollow`. | Code changes |
| Missing `robots.txt`, `noindex` meta tag, and broken `/vite.svg` favicon | [`admin/index.html`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/index.html#L5) | References `/vite.svg` which does not exist (`admin/public/` is absent); no `robots.txt` (`Disallow: /`) or `noindex` meta | **MEDIUM** | Create `admin/public/robots.txt` (`Disallow: /`), add `<meta name="robots" content="noindex, nofollow" />`, and supply ClearFiling favicon. | Code changes |
| `ActivityLogsPage.jsx` is a static architectural notice (no live audit logs) | [`admin/src/pages/ActivityLogsPage.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/pages/ActivityLogsPage.jsx#L32-L36) | Explicitly displays alert stating `GET /api/admin/activity-logs` does not exist yet | **HIGH** | Connect to new backend `GET /api/admin/activity-logs` endpoint with pagination, filters, and actor details. | Code changes |
| No global HTTP 401 session-expiration handler in Axios interceptor | [`admin/src/api/apiClient.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/api/apiClient.js#L26-L42) | Response interceptor normalizes errors but does not clear `AuthContext` or redirect to `/login` when an 8h session expires mid-work | **MEDIUM** | Dispatch unauthorized event/callback on HTTP 401 (excluding `/auth/login` and `/auth/me`) to trigger clean re-authentication prompt/redirect. | Code changes |
| UI does not enforce RBAC visibility for `editor` role | [`DocumentTable.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/components/documents/DocumentTable.jsx#L170-L226), [`CategoriesPage.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/pages/CategoriesPage.jsx#L90-L125) | Publish, Archive, Replace File, Delete Document, and Category CRUD actions render for all roles regardless of `user.role`, causing 403 errors if an `editor` clicks them | **MEDIUM** | Gate restricted controls (`super_admin`, `admin`) using `user.role` from `useAuth()`. | Code changes |
| Client-side PDF validation uses `&&` instead of `\|\|` vs backend MIME+ext check | [`DocumentFormModal.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/components/documents/DocumentFormModal.jsx#L66), [`ReplaceFileModal.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/components/documents/ReplaceFileModal.jsx#L37) | Checks `if (!isPdfExt && !isPdfMime)` — allowing a `.pdf` file with non-PDF MIME (or vice versa) to pass client check and hit backend Multer error bug | **LOW** | Align to `if (!isPdfExt \|\| !isPdfMime)` matching `validation.test.js` and `uploadMiddleware.js`. | Code changes |
| `apiClient.js` silently falls back to `http://localhost:5001` in production if `VITE_API_BASE_URL` missing | [`admin/src/api/apiClient.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/api/apiClient.js#L3-L6) | `import.meta.env?.VITE_API_BASE_URL \|\| ... \|\| 'http://localhost:5001'` runs even in `import.meta.env.PROD` | **MEDIUM** | Ensure `VITE_API_BASE_URL` is mandatory in Vercel and guard production build/runtime against falling back to `localhost`. | Code changes + External config |
| `DocumentFormModal` retains prior draft text across cancel/re-open; `DashboardPage` runs 6 API calls; no in-app PDF previewer | [`DocumentFormModal.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/components/documents/DocumentFormModal.jsx#L62-L67), [`DashboardPage.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/pages/DashboardPage.jsx#L41-L55), [`DocumentTable.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/admin/src/components/documents/DocumentTable.jsx#L131) | Modal keeps `prev.title` after cancel; dashboard fires 5 `getDocuments` calls + 1 `getCategories`; file preview opens external Cloudinary URL directly | **LOW / INFORMATIONAL** | Reset modal state when closing (while preserving on quick-category child modal), consider `/api/admin/dashboard/stats`, and optionally add PDF preview modal. | Code changes |

---

## 5. Public Website Compatibility (`client/`)

### Inspection Findings
1. **Public Document Listing Integration:** **Not integrated.** [`client/src/App.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/src/App.jsx) has no `/documents` or `/documents/:slug` routes. [`client/src/components/features/DocumentationSection.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/src/components/features/DocumentationSection.jsx#L10-L12) (rendered on `Home.jsx`) initializes `const draftedDocuments = []; const publicDocuments = [];` and performs zero API calls.
2. **Public Document Detail Pages:** **Do not exist.** Existing `ResourcesListing` / `ResourceDetail` (`resources/:slug`) serve static marketing guides from `src/data/resourcesContent.js`.
3. **Document Downloads:** **Not connected.** `DocumentationSection.jsx` line 49 renders `<a href={doc.fileUrl || '#'} download>` statically; `GET /api/public/documents/:slug/download` is unused by `client/`.
4. **Public Categories:** **Not displayed.** `GET /api/public/categories` is unused by `client/`.
5. **SEO & Sitemap Configuration:** [`client/public/sitemap.xml`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/public/sitemap.xml) lists static core, service, resource, blog, and legal routes; [`client/public/robots.txt`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/public/robots.txt) allows all crawling. Both will require updates once public document listing/detail pages are built (Phase 4).
6. **Impact of Deploying Backend + Admin Today:** **Zero breaking risk** to `https://www.clearfiling.co.in/`. The live site relies solely on static bundles and EmailJS (`client/src/services/emailService.js`) and does not communicate with the backend API.

| Finding | File Path / Component | Evidence | Severity | Required Action | Fix Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Public website is not yet connected to DMS public endpoints | [`client/src/App.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/src/App.jsx), [`DocumentationSection.jsx`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/src/components/features/DocumentationSection.jsx#L10-L12) | `DocumentationSection` uses empty arrays; zero `fetch`/Axios calls to `/api/public/*` exist in `client/src` | **HIGH** *(Feature Gap)* | Implement Phase 4 in `client/`: public document catalog, category filters, search, preview/download integration (`VITE_API_BASE_URL`), and sitemap updates. Note: does not affect current brochure site uptime. | Code changes |
| `client/vite.config.js` dev proxy targets `localhost:5000` | [`client/vite.config.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/client/vite.config.js#L11) | `target: 'http://localhost:5000'` (dev server only; unused in production build) | **INFORMATIONAL** | Update proxy target to `5001` when integrating `client/` with local backend in Phase 4. | Code changes |

---

## 6. MongoDB Atlas Requirements

All provisioning must comply with [`docs/admin/client_owned_infrastructure_guide.md`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/docs/admin/client_owned_infrastructure_guide.md):

| Requirement | Specification / Assessment | Notes & Risks |
| :--- | :--- | :--- |
| **Account Ownership** | Client official business email as Organization Owner & Billing Admin; 2FA enabled; developer invited as `Project Data Access Read/Write` / `Project Member` only. | Never use developer personal accounts. |
| **Cluster & Region** | AWS **ap-south-1 (Mumbai, India)** for ClearFiling user proximity and data locality. | **Backup Risk (HIGH):** Atlas **M0 Free Tier** lacks automated cloud backups and Point-in-Time Recovery (PITR). For production compliance documents, **M10 Dedicated** (or automated external `mongodump` snapshots stored securely off-cluster) is strongly recommended. |
| **Database User & Least Privilege** | Dedicated user `clearfiling_api_prod` scoped strictly (`readWrite`) to the target database (`clearfiling`). | Avoid cluster-wide admin roles for application runtime credentials; keep a separate admin/backup role if running `mongodump`. |
| **Network Access** | If backend host has static outbound IPs (e.g., Render static IPs / NAT / VPC peering), allowlist ONLY those IPs. If dynamic PaaS IPs are used, temporary `0.0.0.0/0` must be paired with TLS + strong 24+ char credentials. | Atlas TLS/SSL is mandatory (`mongodb+srv://`). |
| **Indexes** | Models define `email` unique index (`AdminUser`), `slug` unique + `{ isActive, displayOrder, name }` (`DocumentCategory`), `slug` unique + `{ status, category, createdAt }` + `{ status, publishedAt }` + `document_text_search` text index (`Document`), `{ createdAt, action }` + `{ entityType, entityId, createdAt }` (`ActivityLog`). | `autoIndex: true` in `db.js` creates indexes on first connection; verify database user has index creation permissions and monitor startup logs. |
| **Seed & Recovery Testing** | Initial `super_admin` must be provisioned against production DB once using `npm run seed:admin` from a secure shell (or one-off job) without committing credentials. | Test `mongodump`/`mongorestore` restoration into a staging cluster prior to launch. |

---

## 7. Cloudinary Requirements

| Requirement | Specification / Assessment | Critical Production Note |
| :--- | :--- | :--- |
| **Account Ownership** | Client-owned Cloudinary account using corporate email; developer added as `Technical` / `Media Manager` team member. | Account recovery & billing remain under ClearFiling control. |
| **Environment & Folder Isolation** | Production credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), folder `clearfiling/documents` (or `clearfiling/prod/documents` separated from staging). | Fixes to `storageService.js` required first so `pending_client_setup` cannot be accepted as valid. |
| **PDF Delivery Policy (CRITICAL)** | [`storageService.js`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/services/storageService.js#L65) uploads PDFs with `resource_type: 'raw'`, `format: 'pdf'`. | **CRITICAL PRODUCTION CHECK:** New Cloudinary accounts disable **PDF and ZIP delivery** by default under **Settings → Security → "Allow delivery of PDF and ZIP files"** (returns HTTP 401/403 on public download redirects!). This setting MUST be explicitly enabled and tested with a real uploaded PDF before go-live. |
| **Delivery & Deletion Flow** | `createDocument` rollback deletes orphans on DB error; `replaceDocumentFile` uploads new file first, commits DB, then deletes old `publicId`. | Verify `cloudinary.uploader.upload_stream` and `cloudinary.uploader.destroy(..., { resource_type: 'raw' })` against live client account during staging verification. |
| **Backup / Export** | Cloudinary stores files without built-in database-synchronized version recovery once `destroy()` executes. | Enable Cloudinary backup/auto-moderation or maintain periodic asset backup sync alongside MongoDB backups (note `deleteDocument` permanently purges assets). |

---

## 8. Hosting Configuration Requirements

### 8.1 Backend API Host (`api.clearfiling.co.in` — Node.js Hosting: Render / Railway / Fly / VPS)
- **Root Directory:** `server`
- **Node.js Runtime:** Node `>= 20 LTS` (tested locally on `v24.21.0`; add `"engines"` to `server/package.json`).
- **Build Command:** `npm ci` (or `npm install --omit=dev`)
- **Start Command:** `npm start` (`node server.js`)
- **Health Check Path:** `/api/status` (requires code update so it verifies DB readiness before reporting HTTP 200).
- **Proxy Configuration:** Requires `app.set('trust proxy', 1)` (code fix required) because cloud hosts terminate TLS at reverse proxies and forward `X-Forwarded-For` / `X-Forwarded-Proto`.
- **File Uploads & Ephemeral Filesystem:** Uploads use `multer.memoryStorage()` (up to `MAX_FILE_SIZE_MB`, default 10MB in RAM per concurrent upload). Verify host RAM headroom ($\ge 512\text{ MB}$ minimum recommended) and ensure proxy body limits allow $>10\text{ MB}$ (`15 MB` multipart overhead).
- **Persistent Logs & Monitoring:** Cloud container stdout/stderr logs are often short-lived (24h–7d on lower tiers). Configure log drain or structured monitoring alerts + uptime check on `https://api.clearfiling.co.in/api/status`.

### 8.2 Admin Frontend Host (`admin.clearfiling.co.in` — Vercel)
- **Account Ownership:** Client-owned Vercel Team / account.
- **Root Directory:** `admin`
- **Framework Preset:** Vite
- **Install Command:** `npm install` (or `npm ci`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing & Security Headers:** Requires creating `admin/vercel.json` (currently **missing**, blocking direct route loads/refreshes).
- **Domain & TLS:** Assign custom domain `admin.clearfiling.co.in` with Vercel-managed HTTPS certificate and CNAME/A DNS record under ClearFiling DNS control.

### 8.3 Public Website (`www.clearfiling.co.in` — Existing Vercel Deployment)
- Keep isolated in `client/`; already contains `client/vercel.json`. Only update `CLIENT_ORIGIN` on backend CORS when `client/` begins consuming `/api/public/*`.

---

## 9. Environment Variable Inventory

*Note: Only variable names, descriptions, and target locations are listed. Zero active secrets are exposed.*

### 9.1 Backend (`server/` — Hosting Provider Secret Environment)

| Variable | Required in Prod | Expected Production Value / Format | Security Scope |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` (forces `Secure` cookies, hides stack traces, disables localhost auto-allowlist) | Server-only |
| `PORT` | Injected by host | Platform-assigned port (`server.js` falls back to `5001` locally) | Server-only |
| `MONGODB_URI` | **Yes** | `mongodb+srv://clearfiling_api_prod:<secret>@<cluster>.mongodb.net/clearfiling?retryWrites=true&w=majority` | **Secret** |
| `JWT_SECRET` | **Yes** | Cryptographically random string ($\ge 32$–$64$ bytes, e.g., `openssl rand -hex 48`) | **Secret** |
| `JWT_EXPIRES_IN` | Recommended | `8h` (must stay aligned with cookie `maxAge`) | Config |
| `COOKIE_SAMESITE` | **Yes** | `lax` when `admin.` and `api.` are both under `clearfiling.co.in`; `none` only if separate domains (requires `NODE_ENV=production`) | Config |
| `CLIENT_ORIGIN` | **Yes** | `https://www.clearfiling.co.in,https://clearfiling.co.in` (NO `localhost` in production!) | Config |
| `ADMIN_ORIGIN` | **Yes** | `https://admin.clearfiling.co.in` (NO `localhost` in production!) | Config |
| `MAX_FILE_SIZE_MB` | Optional | `10` (default) | Config |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Client-owned Cloudinary Cloud Name | Config / Secret |
| `CLOUDINARY_API_KEY` | **Yes** | Client-owned Cloudinary API Key | **Secret** |
| `CLOUDINARY_API_SECRET` | **Yes** | Client-owned Cloudinary API Secret | **Secret** |
| `CLOUDINARY_DOCUMENTS_FOLDER` | Recommended | `clearfiling/documents` | Config |
| `SEED_ADMIN_*` (`NAME`, `EMAIL`, `PASSWORD`) | CLI provision only | Temporary/CLI-only during initial super-admin creation; **remove from persistent runtime web env** | **Secret** |

### 9.2 Admin Frontend (`admin/` — Vercel Build-Time Public Environment)

| Variable | Required in Prod | Expected Production Value | Security Scope |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | `https://api.clearfiling.co.in` | Public (bundled into browser JS) |

*Verification:* Zero secrets (`JWT_SECRET`, `MONGODB_URI`, `CLOUDINARY_API_SECRET`) exist in `admin/` `VITE_*` configuration.

### 9.3 Public Website (`client/` — Vercel Build-Time Public Environment)

| Variable | Required Now | Expected Value | Notes |
| :--- | :--- | :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID`, `_TEMPLATE_ID`, `_AUTOREPLY_TEMPLATE_ID`, `_PUBLIC_KEY` | Yes (contact forms) | Existing client EmailJS config | Preserved |
| `VITE_API_BASE_URL` | Future (Phase 4) | `https://api.clearfiling.co.in` | Not yet referenced in `client/` |

---

## 10. Security Assessment (Including Dependency Audit)

### 10.1 Dependency Vulnerabilities (`npm audit` observed directly)

#### Backend (`server/`) — **2 CRITICAL, 2 HIGH, 3 MODERATE**
| Package (Installed) | Vulnerable Range | Severity | Key Advisories / Impact | Fix / Action |
| :--- | :--- | :--- | :--- | :--- |
| `mongoose` (`8.24.1`) | `8.0.0 - 8.24.6` | **CRITICAL** | `GHSA-gg4r-jv3p-qx3c`, `GHSA-pcrw-h46h-c93h` (`sanitizeFilter` bypass), `GHSA-wr5m-5jph-8m96` (discriminator bypass), `GHSA-8332-j7wj-wjw4` (inherited property overwrites/DoS), `GHSA-6972-9mcm-vhwj` (prototype pollution) | Upgrade `mongoose` in `server/` (`npm audit fix` / verified minor bump). |
| `proxy-addr` (`2.0.7`) | `1.1.0 - 2.0.7` | **CRITICAL** | `GHSA-jqcg-44mw-7w3h` (IP spoofing via IPv4-mapped IPv6 trust subnet) | Update Express/transitive `proxy-addr` dependency. |
| `body-parser` (`1.20.5`) | `<=1.20.8` | **HIGH** | `GHSA-v422-hmwv-36x6` (DoS size enforcement), `GHSA-27r3-jxmh-p828` (DoS trailing bytes) | Upgrade `express` / `body-parser` in `server/`. |
| `brace-expansion` | `4.0.0 - 5.0.11` | **HIGH** | ReDoS / stack exhaustion / OOM (`GHSA-mh99-v99m-4gvg`, etc.) | Update via `npm audit fix`. |
| `qs`, `minimatch`/`nodemon` | various | **MODERATE** | Query-string DoS (`qs` array-limit/isBuffer), dev-only `nodemon`/`minimatch` | Update transitive `qs` and dev tooling. |

#### Admin & Public Frontends (`admin/` & `client/`) — **1 HIGH, 3 MODERATE each**
| Package (`admin` / `client`) | Vulnerable Range | Severity | Advisories / Impact | Fix / Action |
| :--- | :--- | :--- | :--- | :--- |
| `vite` (`5.4.21`) & `esbuild` | `vite <=6.4.3`, `esbuild <=0.24.2` | **HIGH** / **MODERATE** | Dev-server arbitrary request/response exposure (`GHSA-67mh-4wv8-2f99`) and dev static server flaws (affects local dev server; static `dist/` unaffected) | Plan upgrade to patched Vite major/minor with build verification. |
| `react-router` / `react-router-dom` (`6.30.6`) | `6.0.0 - 7.17.0` | **MODERATE** | `GHSA-wrjc-x8rr-h8h6` (open redirect via backslash in `<Link>`/`useNavigate`), `GHSA-337j-9hxr-rhxg` (SSR hydration injection — SSR unused here) | Validate any dynamic navigation paths; evaluate upgrade to patched router version. |

### 10.2 Application Security Matrix
- **Authentication:** Strong 12-round bcrypt hashing, email normalization, `isActive` DB re-check on every request, `HttpOnly` JWT cookies. Weaknesses: missing `algorithms: ['HS256']` pin, no token revocation (`tokenVersion`), no startup strength check on `JWT_SECRET`, and hardcoded 8h cookie `maxAge`.
- **RBAC:** Broken on `POST /api/admin/documents` where `editor` can directly upload with `status=published` (**CRITICAL**). Frontend also fails to hide admin-only actions from editors.
- **CORS & CSRF:** Explicit origin allowlist with `credentials: true` and `X-Requested-With` / Origin-Referer CSRF guard (`csrfMiddleware.js`). **Risk:** Do NOT weaken these; however, `cors.js` omits `X-CSRF-Token` from `allowedHeaders`, `CLIENT_ORIGIN`/`ADMIN_ORIGIN` must exclude `localhost` in prod, and preview deploys across different PSL domains (`*.vercel.app` -> `*.onrender.com`) will fail cookie transmission with `SameSite=Lax` (requiring same-parent domain `*.clearfiling.co.in` or `SameSite=None; Secure`, noting Safari third-party cookie restrictions).
- **Injection & DoS:** Unescaped `$regex: q` in public/admin search (**HIGH**), unvalidated `req.query.sort` (**HIGH**), and unthrottled `/api/public/*` endpoints (**HIGH**).
- **PDF Delivery:** Magic-byte `%PDF` validation is solid on upload (`requirePdfUpload`), though `MulterError('INVALID_FILE_TYPE')` obscures user error message (**MEDIUM**). Cloudinary PDF delivery security restriction ("Allow delivery of PDF and ZIP files") must be verified externally (**CRITICAL**).

---

## 11. Missing Features

Comparing implemented code against [`docs/admin/phase_1_admin_architecture_blueprint.md`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/docs/admin/phase_1_admin_architecture_blueprint.md) and production operational needs:

1. **Audit Log Query API & Live UI Table:** `GET /api/admin/activity-logs` does not exist; `ADMIN_LOGIN` / `ADMIN_LOGOUT` are not logged; `ActivityLogsPage.jsx` displays static policy cards instead of audit records.
2. **Audit Log Retention / TTL Policy:** `ActivityLog` schema has no TTL index or archival mechanism (`createdAt` grows indefinitely).
3. **Public Website Document Catalog (`client/`):** No `/documents` listing page, `/documents/:slug` detail page, category filter UI, search bar, PDF previewer, or `/api/public/documents/:slug/download` wiring exists in `client/`.
4. **Admin User Management & Password Recovery:** No UI or API to invite/create `admin` or `editor` users, deactivate compromised accounts, rotate passwords, or reset forgotten passwords without shell access.
5. **In-Admin PDF Preview Modal:** `DocumentTable.jsx` links directly to the raw external URL instead of an embedded viewer modal (`PDFPreview.jsx`).
6. **Automated Backup Scripts & Runbook:** No scheduled `mongodump` / Cloudinary export automation or disaster-recovery test script exists in the repo (critical if deploying on Atlas M0 Free Tier).

---

## 12. GitHub Fork Readiness

### Audit of `.gitignore`, Secrets & Fork Synchronization Strategy
- **`.gitignore` Verification:** Root `.gitignore` ignores `node_modules/`, `dist/`, `.env`, `.env.*`, `*.env`, `.DS_Store`, while whitelisting `!.env.example`. `admin/.gitignore` ignores `node_modules` and `dist`. `git check-ignore` confirmed local `server/.env`, `admin/.env`, `admin/dist`, and `client/dist` are all ignored.
- **Tracked Secret Scan:** Grepping source files found **zero** real production credentials, Atlas URIs, Cloudinary keys, or JWT secrets. **Action needed:** sanitize `SEED_ADMIN_PASSWORD=ClearFiling.co.in` in [`server/.env.example`](file:///Users/ritweek/Desktop/Clearfiling/ClearFiling/server/.env.example#L25) before committing/pushing.
- **Recommended Client-Owned Fork Workflow:**
  1. **Clean Upstream First:** Developer commits verified Phase 2A–3.5 changes (with blockers fixed and no `.env`/`dist` files) to `Ritweek17/ClearFiling` `main`.
  2. **Client Creates Fork:** Client logs into their **official ClearFiling GitHub organization/account** and forks `Ritweek17/ClearFiling` → `<client-org>/ClearFiling`.
  3. **Hosting Integrations on Client Fork Only:** Client connects Vercel (`client/` and `admin/` projects) and the Node.js backend host (`server/`) to `<client-org>/ClearFiling`. Developer does not own production deploy hooks or hosting secrets.
  4. **Controlled Synchronization:** Developer submits PRs on `Ritweek17/ClearFiling`; once reviewed/approved, client pulls upstream changes into `<client-org>/ClearFiling` via GitHub "Sync fork" or reviewed Pull Request.

---

## 13. Critical and High-Priority Blockers

Every item below MUST be resolved prior to production release:

### CRITICAL Blockers (Must Fix Before Any Deployment)
1. **`server/services/storageService.js` (Code change):** Fix `configureCloudinary()` (`pending_client_setup` currently evaluates as live) and eliminate silent mock fallback in `NODE_ENV=production` so misconfigured Cloudinary fails loudly instead of writing broken URLs to MongoDB.
2. **`server/controllers/adminDocumentController.js` (Code change):** Prevent `editor` role from bypassing publisher RBAC by creating a document with `status: 'published'` on `POST /api/admin/documents`.
3. **`server/app.js` (Code change):** Add `app.set('trust proxy', 1)` so `express-rate-limit` and `ActivityLog` IP logging work reliably behind cloud reverse proxies.
4. **`admin/vercel.json` (Code change):** Create Vercel configuration for `admin/` with SPA fallback rewrites (`/(.*) -> /index.html`) and mandatory security/noindex headers.
5. **`server/package.json` / `package-lock.json` (Code/Dependency change):** Resolve CRITICAL `mongoose` (`8.24.1`) and `proxy-addr` (`2.0.7`) CVEs and HIGH `body-parser`/`brace-expansion` advisories.
6. **External Client-Owned Services (External account configuration):** Client must provision MongoDB Atlas (`ap-south-1`, backups plan, least-privilege user), Cloudinary (explicitly enabling **"Allow delivery of PDF and ZIP files"** in Security settings), Node.js backend host, Vercel Admin project, and DNS for `api.clearfiling.co.in` & `admin.clearfiling.co.in`.

### HIGH-Priority Blockers (Must Resolve Before Production Sign-Off)
7. **`adminDocumentController.js` & `publicDocumentController.js` (Code change):** Escape user input in `$regex` search queries (or switch to `$text`) to prevent ReDoS / regex syntax 500 crashes, and validate `req.query.sort` against a strict field allowlist.
8. **`publicDocumentController.js` & `publicDocumentRoutes.js` (Code change):** Prevent public endpoints from serving/listing documents whose parent `DocumentCategory` has `isActive: false`, and add rate limiting to `/api/public/*`.
9. **Audit Logging End-to-End (Code change):** Implement `GET /api/admin/activity-logs` (with RBAC, pagination, filters), wire `logActivity()` into `authController.js` (`login`/`logout`), and connect `ActivityLogsPage.jsx`.
10. **`server/utils/tokenUtils.js` & `server/config/cors.js` (External config + Code change):** Align cookie/subdomain configuration (`*.clearfiling.co.in` with HTTPS `NODE_ENV=production`), ensure production `CLIENT_ORIGIN`/`ADMIN_ORIGIN` exclude `localhost`, sync `maxAge` with `JWT_EXPIRES_IN`, and pin `HS256` on `jwt.verify`.
11. **`server/.env.example` & Git Tree (Code change + Git workflow):** Replace `SEED_ADMIN_PASSWORD=ClearFiling.co.in` placeholder, commit audited code cleanly to upstream `main`, and verify `client/` DMS integration readiness if public document browsing is expected at launch.

---

## 14. Ordered Deployment Plan

1. **Step 1 — Remediation Sprint (Developer, Code Changes Only):**
   - Apply all Critical & High code fixes (`storageService.js`, `adminDocumentController.js` RBAC/sort/regex, `publicDocumentController.js` active category & regex/rate limits, `app.js` `trust proxy` + `/api/status` DB check, `uploadMiddleware.js` Multer error fix, `admin/vercel.json`, `admin/public/robots.txt`, ActivityLog listing endpoint + UI wiring, dependency security updates).
   - Sanitize `server/.env.example`, verify `npm test` (server + admin) and `npm run build` (admin) pass 100%, and commit cleanly to `Ritweek17/ClearFiling`.
2. **Step 2 — Client-Owned Infrastructure Provisioning (Client Admin):**
   - Fork `Ritweek17/ClearFiling` to client's GitHub account.
   - Create MongoDB Atlas (`ap-south-1`, M10+ or automated backup plan), database user `clearfiling_api_prod`, and network allowlist.
   - Create Cloudinary business account, enable **"Allow delivery of PDF and ZIP files"** in Security settings, and copy credentials.
3. **Step 3 — Backend Deployment (`api.clearfiling.co.in`):**
   - Connect Node.js host (`server/` root, Node >=20, `npm ci`, `npm start`) to client GitHub fork.
   - Set all production secrets (`NODE_ENV=production`, `MONGODB_URI`, 64-byte `JWT_SECRET`, `CLIENT_ORIGIN`, `ADMIN_ORIGIN`, `CLOUDINARY_*`) directly in host dashboard.
   - Verify DNS `api.clearfiling.co.in` SSL and `GET https://api.clearfiling.co.in/api/status` (confirm DB connected).
4. **Step 4 — Production Super-Admin Provisioning:**
   - Run `npm run seed:admin` once in a secure one-off host shell / protected CLI against production MongoDB using client's initial super-admin credentials (do not store `SEED_ADMIN_PASSWORD` in persistent web runtime env).
5. **Step 5 — Admin Frontend Deployment (`admin.clearfiling.co.in`):**
   - Connect Vercel project (`admin/` root directory, `npm run build`, `dist/` output) to client GitHub fork.
   - Set `VITE_API_BASE_URL=https://api.clearfiling.co.in`.
   - Bind custom domain `admin.clearfiling.co.in` + SSL.
6. **Step 6 — Controlled End-to-End Smoke Verification:**
   - Verify direct route refresh on `https://admin.clearfiling.co.in/documents` (200 OK via `vercel.json`).
   - Verify admin login issues `HttpOnly; Secure; SameSite=Lax` cookie across `admin.` -> `api.`.
   - Verify category creation, PDF upload -> live Cloudinary asset -> publish -> public `GET /api/public/documents` -> download redirect -> two-phase PDF replacement -> archive -> delete -> Activity Logs table -> logout.
   - Verify `robots.txt` blocks search indexing on `admin.clearfiling.co.in` and `https://www.clearfiling.co.in/` remains unaffected.
7. **Step 7 — Public Website DMS Integration (Phase 4, Separate Track):**
   - Build `/documents` UI in `client/` when ready, update `client/public/sitemap.xml`, and deploy via existing client Vercel workflow.

---

## 15. Final Readiness Verdict

**Verdict: `NOT READY FOR DEPLOYMENT`**

ClearFiling's core architecture and security foundations are well-structured, **but production deployment is blocked** until the Critical/High code defects (particularly `storageService.js` credential/mock handling, `editor` publish RBAC bypass, missing `trust proxy`, `mongoose`/`proxy-addr` CVEs, ReDoS/sort validation, missing `admin/vercel.json`, and disconnected Activity Logs) are fixed, committed, and paired with provisioned client-owned Atlas, Cloudinary (PDF delivery enabled), backend hosting, and Vercel Admin accounts.


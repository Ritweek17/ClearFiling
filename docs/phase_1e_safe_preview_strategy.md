# Phase 1E — Safe Preview Strategy and Dependency Analysis

**Scope:** Read-only planning. No branch, worktree, staging, commit, push, dependency installation, source/configuration edit, or deployment was performed. This report is the only file created for this phase.

## 1. Current repository state

- Current branch: `main`.
- HEAD: `b33945f5ee4f6691d54c5e90576960d3381cc96b` — `refactor: improve contact form submit button styling and layout structure`.
- Local `origin/main` tracking ref: `bd7cea621979b590885b1ff123fe575fa7dcd3c8`; local `main` is one commit ahead (`origin/main...HEAD` is `0 1`). The live remote could not be reached with `git ls-remote`, so the current server-side head is unverified.
- Other local branch: `preview/contact-enhancements` at `932190229b8332545ec1f1e66640bb704549f824`, tracking its local `origin/preview/contact-enhancements` ref. This is not the current branch.
- Before adding this report: 47 modified tracked files, 133 untracked files (shown by Git as 37 untracked directory/file entries), and no staged changes. No tracked deletion or rename was shown.
- The existing one-commit-ahead change only modifies `client/src/pages/Contact.jsx` (10 insertions, 3 deletions) to improve submit-button styling/layout. It is already committed locally but not in the locally known `origin/main` ref. Its reachability on the live remote was not verified.
- `git status` inventory and grouped file lists appear in Sections 3 and 4. The previous Phase 1D report recorded 132 untracked files; the current `git ls-files --others --exclude-standard` reports 133. This is a historical count difference, not evidence of a deleted file; the current inventory is authoritative for this inspection.
- `git diff --cached --stat` was empty. No `.env` contents were read.
- `client/.vercel` was absent in the preceding deployment investigation; no Vercel project linkage or authorized preview tooling was established. The Phase 1C report has no preview URL.

### Configuration and toolchain facts

- Root `package.json` has `install-all`, `client`, `server`, and `dev` scripts. Its only declared dependency is `concurrently`.
- `client/package.json` declares React 18, React DOM 18, React Router 6, Vite 5, the React Vite plugin, and the existing UI/runtime dependencies. Its production build script runs sitemap generation, `vite build`, then `scripts/prerender.mjs`; client tests use Node's test runner.
- The client build can be built from the `client/` package. Vercel should use `client` as the project root, `npm run build` as the build command, and `dist` as output. `client/vercel.json` carries clean URL handling, existing redirect rules and headers. These are repository/build facts; deployment settings must still be checked in Vercel before a preview.
- The root `.gitignore` ignores `dist/`, `node_modules/`, and `.env*` (with an `.env.example` exception). Generated `client/dist` is therefore a build artifact, not a source commit requirement.

## 2. Dependency map

### Public React/Vite application

`client/index.html` → `client/src/main.jsx` → `client/src/App.jsx` → `client/src/AppRoutes.jsx` → layouts/components/pages → client configuration, data, styles and assets. Vite configuration and `client/package.json` determine compilation. Browser navigation uses `BrowserRouter`; the shared route tree is also consumed by the static entry.

### Catalogue, metadata, page data and SEO

- Service detail/list pages use `client/src/data/services.js` and `client/src/data/serviceRegistry.js`. The registry carries indexability and redirect/service identity decisions; service detail rendering consumes catalogue records.
- Business/contact/office and SEO consumers use `client/src/config/business.js`, `client/src/config/contact.js`, `client/src/data/officeLocations.js`, `client/src/config/seo.js`, company/footer adapters, SEO components and `SchemaHelpers.js`.
- Route-specific metadata (`client/src/utils/routeSeo.js`) imports the business/SEO configuration, service registry/catalogue, resource and blog data, and legal content. It is a direct input to build-time metadata and the SSG renderer.
- Resources/blog/legal pages depend on `resourcesContent.js`, `blogContent.js`, and `legalContent.js` plus their layouts/pages. These files are part of the current public client even if they are not all sitemap entries.

### Sitemap generation

`client/package.json` build script → `client/scripts/generateSitemap.mjs` → `serviceRegistry.js` indexable slugs plus resource/blog route data → writes `client/public/sitemap.xml`. The later Vite build consumes public assets. The current build command mutates the tracked sitemap, so preview validation must compare its SHA-256 before/after in an isolated worktree and reject unexpected differences.

### Server rendering and static route generation

`client/scripts/prerender.mjs` starts Vite in build mode, reads the sitemap and registry, renders route metadata and invokes `client/src/entry-server.jsx`. That entry uses React 18 server rendering and `StaticRouter`, with shared `AppRoutes.jsx`. It generates the 44 sitemap routes, the 66 canonical noindex service routes, and a separate noindex 404 document (110 route documents plus `404.html`). The resolver and renderer depend on the complete route data/configuration chain above. This uses existing React DOM and Vite packages; no separate SSG dependency was identified.

### Hydration and runtime navigation

`client/src/main.jsx` uses `hydrateRoot` on generated markup, while `App.jsx` supplies `BrowserRouter` and the shared routes. SSG safety also depends on hydration-stable components: in particular route-aware breadcrumbs, `SEOHead`/`JsonLd`, query-dependent service filtering, and the homepage document panel. Lazy route imports must remain available in Vite's client bundle.

### Public documentation and backend API

The homepage's documentation panel imports `usePublicDocumentation` → `documentationController.js` → `publicApi.js` and `documentFileUtils.js`. The frontend resolves `VITE_API_BASE_URL`; categories, published documents, previews and downloads require a compatible API at runtime. These modules do **not** require the Express server source to compile the static client, but successful preview acceptance of the live document panel requires an owner-approved staging API and matching CORS configuration. Do not point an isolated preview at production or client-owned data without explicit authorization. Static generation should render a safe loading/empty state and must not fetch private data during build.

### Tests

`client/package.json` runs `node --test tests/**/*.test.js`. Current untracked client tests import the service registry/catalogue, business/contact/office/footer/legal/SEO modules, route metadata, documentation utilities/components and prerender output. Several use React DOM server rendering; multiple use `esbuild` to bundle JSX test fixtures. `esbuild` is available through the installed toolchain but is not a direct dependency in the shown client package manifest, so a clean-install test run should confirm the lockfile/transitive availability or surface a missing declared test dependency. The tests are source validation dependencies, not deployed runtime files.

### Vercel routing

`client/vercel.json` applies to the client Vercel project. Vite writes static documents/assets under `client/dist`; Vercel serves those generated files according to its filesystem routing plus the explicit redirect/clean URL configuration. Repository files such as `server/`, `admin/`, tests and docs are not part of the static client artifact merely because they are present in a branch. A client preview may still call a separately deployed API at runtime through the API base URL.

## 3. File classification and working-tree inventory

### Modified tracked files (47)

**Public client (43):**

`client/.env.example`, `client/index.html`, `client/package.json`, `client/src/App.jsx`, `client/src/components/common/CTAButtons.jsx`, `client/src/components/common/FloatingCTAs.jsx`, `client/src/components/common/Footer.jsx`, `client/src/components/common/Logo.jsx`, `client/src/components/contact/ContactHero.jsx`, `client/src/components/features/AboutSection.jsx`, `client/src/components/features/CTASection.jsx`, `client/src/components/features/DocumentationSection.jsx`, `client/src/components/features/FeaturedServices.jsx`, `client/src/components/features/Hero.jsx`, `client/src/components/features/TrustSection.jsx`, `client/src/components/features/WhyChooseSection.jsx`, `client/src/components/seo/Breadcrumbs.jsx`, `client/src/components/seo/JsonLd.jsx`, `client/src/components/seo/SEOHead.jsx`, `client/src/components/seo/SchemaHelpers.js`, `client/src/config/business.js`, `client/src/config/contact.js`, `client/src/config/seo.js`, `client/src/data/blogContent.js`, `client/src/data/companyInfo.js`, `client/src/data/consultants.js`, `client/src/data/faqContact.js`, `client/src/data/footerConfig.js`, `client/src/data/legalContent.js`, `client/src/data/officeLocations.js`, `client/src/data/resourcesContent.js`, `client/src/data/services.js`, `client/src/layouts/LegalPageLayout.jsx`, `client/src/layouts/ResourcePageLayout.jsx`, `client/src/main.jsx`, `client/src/pages/About.jsx`, `client/src/pages/BlogPost.jsx`, `client/src/pages/Contact.jsx`, `client/src/pages/Home.jsx`, `client/src/pages/ServiceDetail.jsx`, `client/src/pages/Services.jsx`, `client/vercel.json`, `client/vite.config.js`.

**Backend/API (4):** `server/.env.example`, `server/package-lock.json`, `server/package.json`, `server/server.js`.

No tracked admin, tests, or report/documentation file is modified in the current status. The current uncommitted edits mix earlier business/SEO/service work, public documentation integration, contact/UI changes and Phase 1B SSG; the history of individual hunks is not represented by commits, so file ownership cannot safely be inferred from a full-file diff alone.

### Untracked files (133)

**Admin-only (42):** `admin/.env.example`, `admin/.gitignore`, `admin/index.html`, `admin/package-lock.json`, `admin/package.json`, `admin/postcss.config.js`, `admin/public/robots.txt`, `admin/src/App.jsx`, `admin/src/api/apiClient.js`, `admin/src/api/authApi.js`, `admin/src/api/categoryApi.js`, `admin/src/api/documentApi.js`, `admin/src/components/categories/CategoryFormModal.jsx`, `admin/src/components/categories/CategoryTable.jsx`, `admin/src/components/common/Alert.jsx`, `admin/src/components/common/Badge.jsx`, `admin/src/components/common/Button.jsx`, `admin/src/components/common/ConfirmModal.jsx`, `admin/src/components/common/EmptyState.jsx`, `admin/src/components/common/LoadingSkeleton.jsx`, `admin/src/components/common/Modal.jsx`, `admin/src/components/documents/DocumentFormModal.jsx`, `admin/src/components/documents/DocumentTable.jsx`, `admin/src/components/documents/ReplaceFileModal.jsx`, `admin/src/components/layout/Header.jsx`, `admin/src/components/layout/Layout.jsx`, `admin/src/components/layout/Sidebar.jsx`, `admin/src/context/AuthContext.jsx`, `admin/src/index.css`, `admin/src/main.jsx`, `admin/src/pages/ActivityLogsPage.jsx`, `admin/src/pages/CategoriesPage.jsx`, `admin/src/pages/DashboardPage.jsx`, `admin/src/pages/DocumentsPage.jsx`, `admin/src/pages/LoginPage.jsx`, `admin/src/pages/NotFoundPage.jsx`, `admin/src/utils/fileFormats.js`, `admin/tailwind.config.js`, `admin/tests/apiClient.test.js`, `admin/tests/validation.test.js`, `admin/vercel.json`, `admin/vite.config.js`.

**Phase 1B and shared public-client prerequisites (25):**

`client/scripts/generateSitemap.mjs`, `client/scripts/prerender.mjs`, `client/src/AppRoutes.jsx`, `client/src/data/serviceRegistry.js`, `client/src/entry-server.jsx`, `client/src/hooks/documentationController.js`, `client/src/hooks/usePublicDocumentation.js`, `client/src/services/publicApi.js`, `client/src/utils/documentFileUtils.js`, `client/src/utils/routeSeo.js`, `client/tests/brandSeo.test.js`, `client/tests/companyProfileCentralization.test.js`, `client/tests/contactOfficeCentralization.test.js`, `client/tests/documentationSection.test.js`, `client/tests/legalContentCentralization.test.js`, `client/tests/prerenderOutput.test.js`, `client/tests/publicDocumentation.test.js`, `client/tests/seoCentralization.test.js`, `client/tests/serviceRegistry.test.js`, `client/tests/wave1Content.test.js`.

**Backend/API-only (39):** `server/app.js`, `server/config/cors.js`, `server/config/db.js`, `server/controllers/adminCategoryController.js`, `server/controllers/adminDocumentController.js`, `server/controllers/authController.js`, `server/controllers/publicDocumentController.js`, `server/middleware/authMiddleware.js`, `server/middleware/csrfMiddleware.js`, `server/middleware/errorMiddleware.js`, `server/middleware/rateLimitMiddleware.js`, `server/middleware/uploadMiddleware.js`, `server/middleware/validateObjectId.js`, `server/models/ActivityLog.js`, `server/models/AdminUser.js`, `server/models/Document.js`, `server/models/DocumentCategory.js`, `server/routes/adminCategoryRoutes.js`, `server/routes/adminDocumentRoutes.js`, `server/routes/authRoutes.js`, `server/routes/publicDocumentRoutes.js`, `server/scripts/seedAdmin.js`, `server/services/activityLogger.js`, `server/services/storageService.js`, `server/tests/helpers/testDb.js`, `server/tests/integration/adminCategories.test.js`, `server/tests/integration/adminDocuments.test.js`, `server/tests/integration/auth.test.js`, `server/tests/integration/publicDocuments.test.js`, `server/tests/integration/rbac_and_seed.test.js`, `server/tests/unit/adminUser.test.js`, `server/tests/unit/db.test.js`, `server/tests/unit/document.test.js`, `server/tests/unit/documentCategory.test.js`, `server/tests/unit/securityAndReadiness.test.js`, `server/tests/unit/storageService.test.js`, `server/tests/unit/tokenUtils.test.js`, `server/tests/unit/uploadValidation.test.js`, `server/utils/envValidator.js`, `server/utils/fileFormats.js`, `server/utils/queryUtils.js`, `server/utils/slugify.js`, `server/utils/tokenUtils.js`.

**Documentation/reports (28 before this report):** `docs/admin/client_owned_infrastructure_guide.md`, `docs/admin/phase_1_admin_architecture_blueprint.md`, `docs/admin/phase_2a_backend_foundation_report.md`, `docs/admin/phase_2b_document_management_report.md`, `docs/admin/phase_3_5_production_readiness_audit.md`, `docs/admin/phase_3_admin_frontend_report.md`, `docs/admin/phase_a_security_remediation_report.md`, `docs/admin/phase_b_public_documentation_integration_report.md`, `docs/admin/phase_c_final_release_audit.md`, `docs/batch_1_legal_name_standardization_report.md`, `docs/batch_2_contact_office_centralization_report.md`, `docs/batch_3_company_profile_centralization_report.md`, `docs/batch_4_legal_content_centralization_report.md`, `docs/batch_5_seo_static_metadata_centralization_report.md`, `docs/batch_6_final_centralization_audit_report.md`, `docs/business_information_centralization_plan.md`, `docs/business_information_verification_checklist.md`, `docs/final_production_readiness_audit.md`, `docs/initial_repository_baseline.md`, `docs/master_seo_optimization_report.md`, `docs/phase_1d_vercel_preview_branch_report.md`, `docs/seo_execution_baseline.md`, `docs/seo_prerendering_evaluation.md`, `docs/seo_prerendering_implementation_report.md`, `docs/seo_prerendering_preview_acceptance_report.md`, `docs/server_test_environment_investigation.md`, `docs/server_test_harness_implementation_report.md`, `docs/working_tree_ownership_review.md`.

The category line counts above are descriptive, not file ownership boundaries. In particular, public client data and components have mixed earlier feature and SEO work; the files must be reviewed as a dependency closure, not cherry-picked by name alone. The four untracked count annotations above are included to make the inventory auditable; the raw Git inventory remains the source of truth.

### Generated or ignored output

`client/dist/` is generated, ignored output. It is expected to contain the emitted client assets, 110 route HTML documents, and `404.html` after the build. Do not use a pre-existing local `dist` as the branch source of truth; rebuild from the isolated candidate commit. `node_modules` is ignored and should be installed from the selected lock/package manifest in the preview worktree, not copied into Git.

## 4. Classification by project area

| Area | Current changes | Preview relevance |
|---|---|---|
| Public website | Modified client UI, page, layout, contact and documentation files; Vite/HTML entry; untracked route tree, API/docs hooks and file utilities | Required to reproduce the current public site. Include the complete current client dependency closure, not only the SSG files. |
| SEO and service catalogue | Modified service/catalogue, business/contact/office/legal/resource/blog/SEO/schema files; untracked service registry, route SEO resolver and sitemap generator | Required for current route content, indexability decisions, metadata, sitemap and SSG. Earlier approved changes are inseparable at current hunk provenance. |
| Admin dashboard | Entire `admin/` app, tests, Vite/Vercel config, package files are untracked | Not imported into client build and not deployed by a Vercel project rooted at `client/`; exclude from this client-only preview snapshot unless a separate admin preview is explicitly planned. |
| Backend/API | Modified server package/entry/env example plus untracked server app/routes/controllers/models/services/middleware/tests | Not needed to compile static client. Needed only for a backend deployment and for runtime public-document API acceptance. Do not include/deploy server work as part of a client-only Vercel project. |
| Documentation/reports | All 29 listed docs are untracked | Useful provenance and review evidence, not build inputs. May remain in original repo; no need in the Vercel client artifact. Include selected reports in a versioned integration branch only if traceability is desired. |
| Configuration/deployment | Client package, Vite, HTML, and `client/vercel.json` modified; admin/server configuration is separate | Client files are required; admin/server configs should not leak into client project settings. Verify Vercel root/output against the client config. |
| Tests | Client tests are untracked; admin/server tests are untracked | Client tests and their dependencies should accompany the clean client baseline for reproducibility. Admin/server tests are not part of client validation. |

## 5. Safe deployment strategies compared

| Option | Included / excluded | Change-loss and history risk | Vercel fit / maintenance |
|---|---|---|---|
| **A. Integration branch with full approved client set and SSG** | Include all client source/data/config, service catalogue/registry, sitemap/SSG scripts, client tests, Vite/package/Vercel files and any required client assets. Exclude unrelated admin/server changes and docs unless desired. | A branch created directly from the dirty worktree is unsafe: full-file staging can sweep mixed earlier edits; selective staging can omit required imports. A reviewed, exact snapshot manifest avoids this. Existing original modifications remain untouched. | Builds the real client well. One integration branch is simple, but can obscure which public-client prerequisites predate SSG unless separated into commits. Vercel project root remains `client/`. |
| **B. Clean snapshot/worktree containing the public-client dependency closure** | Copy/apply the complete required current client closure into a disposable worktree based on a verified base; include client tests and locked build inputs. Exclude admin/server/docs from the client snapshot except report references if needed. | Lowest risk to original work if created from an explicit manifest and never sourced by destructive cleanup. Main challenge is proving the closure is complete and preserving all intended current client changes. | Strong Vercel fit, reproducible, and clearly isolates the client artifact. Maintenance is moderate: maintain manifest and verify runtime API dependency separately. |
| **C. Commit prerequisites, then separate SSG branch** | First establish all approved public-client prerequisites as a baseline commit; then layer only Phase 1B SSG on a child branch/commit. | Cleanest history only if the prerequisite scope is confirmed. Committing from the current mixed worktree or onto `main` would risk including unrelated or unreviewed changes. No prerequisite baseline currently exists. | Excellent for Vercel and later maintenance once safely prepared. More Git operations and review than B; should happen inside an isolated worktree, not the original checkout. |
| **D. Temporary filesystem snapshot / local candidate branch validated before remote branch** | Assemble a non-destructive snapshot of required paths, install from the client manifest/lockfile, run tests/build, inspect output, then promote that exact snapshot to a named branch after review. | Very low risk if copied to a fresh path and source files are only read; however, a copy without Git history is not itself a deployable preview branch. Avoid shell cleanup/sync tools that delete destination files. | Useful as a preflight step, but Vercel preview ultimately needs a Git-backed commit/branch. It adds one validation stage and should feed B/C rather than replace them. |

### Recommendation

Use **B with a two-commit history as in C**, performed only after owner approval and only in a new isolated worktree. This combines the original checkout's safety with reviewable dependency provenance:

1. Create a fresh worktree from a **verified remote base** (the live remote must be reachable and its head confirmed first).
2. Apply an explicit manifest of the complete, approved public-client prerequisite closure. Review the resulting diff. Commit it as `chore(client): add approved public-client baseline` only after confirming it contains no admin/backend-only changes and no unapproved content.
3. Add the Phase 1B route generation/hydration changes as a separate commit, `feat(seo): generate static route documents`, after verifying its diff contains only SSG-specific changes.
4. Build/test this exact tree and use it for a Vercel preview branch.

This is safer than committing unrelated changes to `main`, safer than attempting to stage SSG-looking hunks out of files whose ownership is mixed, and more reviewable than one opaque integration commit. If an exact approved client manifest cannot be agreed, stop at a tested local snapshot and do not push a preview branch.

## 6. Exact proposed branch/worktree structure (not created)

```text
Original checkout (preserved):
  branch: main
  HEAD: b33945f5ee4f6691d54c5e90576960d3381cc96b
  dirty working tree: untouched

Isolated preview worktree (proposed sibling path):
  path: ../ClearFiling-preview
  branch: seo/phase-1b-vercel-preview
  base: latest owner-approved, verified remote main commit (not yet confirmed)
  commit 1: approved public-client prerequisite closure
  commit 2: Phase 1B SSG only
  Vercel root: client/
  build: npm run build
  output: dist/
```

Do **not** base on local HEAD by default: it includes the one-contact-style commit not present in the local `origin/main` ref. First compare that commit with the owner's intended preview scope and confirm the live remote. If the owner wants that contact styling in preview, include it explicitly in the client baseline. If not, base on the verified remote and re-apply only the approved client snapshot. Branch history includes source commits; the Vercel artifact contains only built output under `client/dist` (plus platform configuration/routing), not the admin app, server source, tests or docs. A client preview can still make requests to an API at runtime, so choose an isolated staging API before testing documentation behavior.

## 7. Validation plan for the approved future work

1. Confirm live `origin/main` and candidate remote refs; record exact base SHA and confirm whether the local ahead contact-style commit is in scope.
2. Produce a path and dependency manifest from the actual import graph. Include all `client/src` modules/assets required by routes, data, styles and dynamic imports; include `client/index.html`, Vite/PostCSS/Tailwind config, client package manifest/lockfile (confirm which lockfile is authoritative), `client/vercel.json`, sitemap/prerender scripts and client tests.
3. Review the clean baseline diff and check no admin/backend-only work or unintended files entered it. Preserve all approved client behavior and existing URLs.
4. Use a fresh dependency install in the isolated worktree. Run `npm test` in `client/`, then `npm run build`. Do not install packages in the original checkout. Ensure test dependencies such as `esbuild` resolve from a clean install.
5. Record pre-build and post-build SHA-256 hashes of `client/public/sitemap.xml` and `client/public/robots.txt`; compare the sitemap URL set/count and robots bytes to the Phase 0 baselines. Treat any unexpected difference as a stop.
6. Inspect all generated documents: 44 sitemap URLs, 66 noindex service routes, and noindex `404.html`; check metadata, body/H1, JSON-LD duplication, and redirect source/destination rules. Confirm no admin routes/data are generated.
7. Run local direct-route/refresh and hydration checks with browser console capture. Validate the client preview against a staging API only if the owner supplies/approves one.
8. Configure Vercel with root `client`, the client build command and `dist` output; ensure this is a Preview deployment only. Test HTTP status behavior, especially genuine unknown-route 404 and both 301 redirects, on the Vercel preview before acceptance.

## 8. Risks and safeguards

- **Incomplete dependency closure:** SSG depends on prior catalog and business/SEO/legal/resource/blog changes. Mitigation: import-graph manifest, clean install/build/test in the candidate worktree, no SSG-only cherry-pick.
- **Mixed ownership within files:** existing modified files combine batches/features. Mitigation: include the complete approved current client state as a reviewed prerequisite commit; do not use broad `git add` or automated partial staging in the original tree.
- **Unrelated local HEAD commit:** local `main` has a contact styling commit not in the local remote tracking ref. Mitigation: verify the remote and explicitly decide whether this change belongs in the preview.
- **Remote uncertainty:** no successful live remote query. Mitigation: do not create a branch from a stale tracking ref or push until live refs are confirmed.
- **Runtime API coupling:** public documents require a configured API and compatible CORS. Mitigation: staging API only; never use production/client-owned records for preview validation without explicit authorization.
- **Sitemap build side effect:** build regenerates tracked sitemap. Mitigation: isolated worktree and before/after hash plus URL-set comparison.
- **Vercel route semantics:** static file serving, clean URLs, redirects and HTTP 404 behavior require preview verification. Mitigation: do not declare acceptance based solely on Vite local preview.
- **Artifact/repository confusion:** Vercel Git branch may hold more paths than the static artifact. Mitigation: configure project root to `client/` and inspect deployment output/settings; source inclusion is not the same as serving/deploying admin/server files.
- **Untracked docs and build output:** preserve docs as owner work; keep ignored `dist` generated from candidate source. Never clean the original checkout to obtain a clean build.

## 9. Owner decisions required

1. Approve the isolated worktree strategy and proposed branch name/path.
2. Approve which public-client prerequisite batches are in the preview baseline; the existing project direction implies the current approved client state, but mixed working-tree diffs do not provide a reliable historical boundary.
3. Decide whether the local ahead contact-submit styling commit is intended in the preview after remote ancestry is verified.
4. Provide/approve a non-production API endpoint and safe test data if public-document runtime behavior must be tested in preview. Otherwise limit preview acceptance to static output and safe client states.
5. Approve creation of the branch/commits and later Preview deployment. Neither action was taken here.

## Conclusion

A Vercel preview is feasible without framework migration, and a client-rooted deployment can exclude the admin and server artifacts. It is **not safe to isolate only Phase 1B** from the present uncommitted work. The recommended path is an approved, complete public-client snapshot in a separate worktree, with its prerequisite baseline and SSG changes reviewed as separate commits. The original checkout remains the source of truth and must stay untouched until the owner approves those Git actions.

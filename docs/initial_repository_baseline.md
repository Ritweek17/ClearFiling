# ClearFiling Initial Repository Baseline

Inspection date: 2026-11-14  
Scope: read-only repository baseline; no source, indexing, deployment, or Git history changes were made. This report is newly created.

## Repository state

- Branch: `main`, one commit ahead of `origin/main`.
- Git reports 66 changed paths: 32 modified tracked files and 34 untracked paths. Existing changes were preserved. No reset, stash, commit, push, merge, or deploy was performed.
- The root package is a small npm workspace-style launcher. The runnable application packages are `client/` (public React/Vite website), `admin/` (React/Vite document admin), and `server/` (Express/Mongoose API).
- Main client flow: `client/src/main.jsx` mounts `App`; `App.jsx` configures React Router 6 routes and lazy-loaded pages; `MainLayout` hosts shared navigation/footer. Shared UI, feature, contact, SEO, layout, config, data, hooks, services, utilities, and styles live under `client/src/`.
- Server flow: `server/server.js` starts the Express application in `server/app.js`; routes, controllers, middleware, Mongo models/config, storage/activity services, and utilities are separated into their respective directories.
- Admin flow: `admin/src/App.jsx` uses React Router for login, dashboard, documents, categories, and activity-log views; API clients and auth context are separate modules.

## Catalogue and SEO baseline

- `SERVICES.length`: **91**. Registry entries: **91**, with no slug mismatch between registry and service data.
- Reconciliation: **89 canonical service/sub-service records** + **2 legacy redirect entries** (`udyam-registration`, `import-export-code`) = 91 current objects. The prior “92” count includes one removed duplicate Digital Signature record, consolidated under the canonical `digital-signature` record and cross-listed in Digital Solutions.
- Canonical records: **32 top-level** and **57 with a `parentServiceSlug`**. The registry does not declare a formal wave field.
- Historical sign-off reports identify **20 Wave 1** and **25 Wave 2** reviewed services. The current Wave 1 test suite verifies 20 services; all 25 Wave 2 slugs remain in the service data/registry and are noindex. Current repository data does not independently tag records by wave.
- Service indexability: **23 indexable**, **66 noindex**, **2 redirect entries**. Of the 23 indexable service pages, 3 are flagship corporate services and 20 are loans.
- Sitemap: **44 URLs**: 6 core pages, 23 service pages, 6 resource guides, 6 blog posts, and 3 legal pages. The production sitemap file matches the generator output; the build regenerated it with 44 URLs and left no diff.
- Redirects: **2 permanent Vercel rules** (both service aliases listed above); the React service page also resolves registry redirect targets with client navigation.
- Category hubs: **0 dedicated category landing routes/pages**. The services page has nine category filters: Business Formation, Business Registrations, Trademark & Intellectual Property, GST & Indirect Tax, Income Tax Services, Corporate Compliance, International Business Services, Digital Solutions, and Loan Services.
- `robots.txt` allows all paths and references the production sitemap. Service-level noindex is added dynamically by `SEOHead`; the 66 noindex service records are excluded from the sitemap.
- `SEOHead` manages title, description, canonical, robots, Open Graph, and Twitter tags on route changes. `JsonLd` injects JSON-LD in the document head. `SchemaHelpers.js` builds Service and FAQ schemas; `config/seo.js` supplies WebSite, Organization/LegalService, office, ContactPage, and breadcrumb schemas.

### All current service slugs, grouped by catalogue category

- Business Formation (8): `private-limited-company`, `llp-registration`, `opc-registration`, `partnership-firm`, `public-limited-company`, `producer-company`, `section-8-organization`, `trust-registration`.
- Business Registrations (13): `msme-registration`, `startup-india-registration`, `iec-registration`, `trade-license`, `shop-establishment`, `digital-signature`, `iso-certification`, `professional-tax-registration`, `fssai-registration`, `udyam-registration`, `import-export-code`, `barcode-registration`, `bis-certification`.
- Trademark & Intellectual Property (10): `trademark-registration`, `trademark-renewal`, `trademark-objection`, `trademark-opposition`, `trademark-hearing`, `trademark-rectification`, `copyright-registration`, `patent-registration`, `industrial-design-registration`, `trademark-assignment`.
- GST & Indirect Tax (10): `gst-registration`, `gst-return-filing`, `gst-annual-return`, `gst-notice-reply`, `gst-amendment`, `gst-revocation`, `gst-cancellation`, `gst-lut`, `gst-foreign-business`, `virtual-office-gst`.
- Income Tax Services (9): `income-tax-filing`, `business-itr`, `company-itr`, `llp-itr`, `ngo-tax-filing`, `tds-return`, `tan-registration`, `income-tax-notice`, `revised-return`.
- Corporate Compliance (12): `annual-compliance`, `llp-compliance`, `opc-compliance`, `din-kyc`, `director-change`, `registered-office-change`, `share-transfer`, `moa-amendment`, `aoa-amendment`, `authorized-capital-increase`, `dormant-company-filing`, `company-closure`.
- International Business Services (6): `uae-company-setup`, `usa-company-registration`, `uk-company-registration`, `singapore-business-setup`, `overseas-trademark`, `international-advisory`.
- Digital Solutions (3): `website-development`, `ecommerce-website-development`, `custom-web-applications`.
- Loan Services (20): `personal-loan`, `home-loan`, `business-loan`, `msme-loan`, `startup-loan`, `working-capital-loan`, `education-loan`, `vehicle-loan`, `car-loan`, `bike-loan`, `gold-loan`, `loan-against-property`, `machinery-loan`, `equipment-finance`, `project-loan`, `cash-credit`, `overdraft-facility`, `professional-loan`, `commercial-vehicle-loan`, `construction-loan`.

## Forms, documents, and integrations

- The contact page has a validated inquiry form and sends via the EmailJS browser SDK (`client/src/services/emailService.js`), using client environment configuration. Service-detail pages also have inquiry forms. The Express API is not the contact-form transport.
- The public Documentation section fetches published categories/documents from the Express API through `usePublicDocumentation`, `documentationController`, and `publicApi`. It supports search, category filtering, pagination, preview, and download.
- The admin UI manages document/category records and uploads. The Express API uses MongoDB/Mongoose and Cloudinary-backed storage, with auth, role controls, upload validation, rate limiting, and CSRF/CORS middleware. Public documentation endpoints expose published material.
- Vercel website config includes SPA rewrites, security headers, and two 301 service redirects. Admin Vercel config additionally sets noindex response headers. Server deployment is separately configured through environment variables.

## Tests and build checks run for this baseline

- Client: **33/33 pass**, 14 suites.
- Admin: **5/5 pass**.
- Server: **27 pass, 59 fail of 86**. Most failed tests cannot start the helper MongoDB process: test setup times out waiting for `mongod`; direct connection attempt reports `EPERM 127.0.0.1:29999`. This is an environment limitation observed during this run, so server behavior is not fully verified here.
- Client production build: **succeeds**; generator reports 44 sitemap URLs. Vite warns that the main JS chunk is 703.36 kB, above its 500 kB warning threshold.
- Admin production build: **succeeds**.
- Root has no test or build script. Client package exposes `dev`, `generate:sitemap`, `build`, `test`, `lint`, `preview`; admin exposes `dev`, `build`, `preview`, `test`; server exposes `start`, `dev`, `test`, `seed:admin`.

## Historical reports checked

Found outside the repository under the supplied Antigravity report directory:

- `phase_3_wave2_implementation_report.md`
- `consolidated_wave1_wave2_signoff_report.md`

Both document the 91-record catalogue, 20/25 Wave 1/Wave 2 counts, 44 sitemap URLs, Wave 2 noindex, and prior test/build success. These are historical assertions; the current checks above supersede them for present runtime state. `production_readiness_audit.md` and `complete_seo_roadmap_status_report.md` were not present under those exact names. Related documents `phase_7a_production_readiness_audit.md`, `phase_7c_production_verification.md`, and `phase_9_final_production_verification.md` are present, but are not substitutes for the specifically named files.

Repository documentation includes `PROJECT_RULES.md`, `UI_SPECIFICATION.md`, and nine admin-phase reports under `docs/admin/`. The root rules/spec files describe an earlier green theme and earlier folder layout and conflict with the current blue-and-white brand and actual structure; treat them as stale until reviewed.

## Current issues to consider

1. Server test suite currently depends on an ephemeral MongoDB process that cannot start in this execution environment; arrange an approved/local MongoDB test environment and rerun before release.
2. The client build emits a large-main-chunk warning (703.36 kB); review code splitting as a production performance task.
3. There are no dedicated category landing pages despite nine service categories.
4. Page-specific SEO metadata is managed client-side in a Vite SPA. Verify rendered indexing behavior in production before treating metadata as equivalent to server-rendered HTML.
5. Root project rules/specification documentation is stale relative to the current architecture and brand.

## Suggested implementation order (for approval)

1. Preserve/review the existing working-tree changes and identify ownership before editing shared files.
2. Restore a working isolated MongoDB test environment and baseline the full server suite.
3. Address critical production configuration/security/readiness gaps from the existing admin release audit.
4. Make targeted SEO/indexing corrections only after confirming current production behavior; retain Wave 2 noindex and current URLs unless separately authorized.
5. Assess client bundle splitting and category landing-page opportunities without changing brand design unnecessarily.
6. Update stale repository docs and rerun the affected unit/integration/build checks.

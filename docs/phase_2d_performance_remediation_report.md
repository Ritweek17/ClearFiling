# Phase 2D — Performance Remediation Report

**Date:** 2026-11-15\
**Repository:** `/private/tmp/clearfiling-phase1j-integration`\
**Branch:** `seo/phase-2d-qa-remediation`\
**HEAD:** `93cd463a19942399ba39563b7c42a0c5f0d702b5` (unchanged; no commit created)

## Summary

The Phase 2B loan editorial map was included in the initial shared JavaScript because `client/src/data/services.js` statically imported it and overlaid its full content onto the catalogue. The map is now loaded with the already lazy `ServiceDetail` route. A lightweight index retains the fields needed by shared service search, cards, and route SEO; the Featured Services panel requests FAQ data only after a loan service is selected.

The generated HTML for all 20 loan pages is unchanged: SHA-256 of each server-rendered React root matched the pre-change root hash. Streaming prerendering still completes the route's lazy imports before output, and local browser checks verified a directly loaded loan page, client navigation to another loan page, and no console errors or warnings.

The split reduces the main entry by **34.11 kB minified / 8.88 kB gzip** from Phase 2B. The full loan content is emitted as an asynchronous chunk. The improvement is measurable but modest: the main entry remains above Vite's 500 kB warning threshold and is still slightly larger than the Phase 0 baseline. No Core Web Vitals improvement is claimed.

## Initial repository state and preservation

Before branching, the repository matched the expected Phase 2C state:

- Branch: `seo/phase-2b-loan-services-content`
- HEAD: `93cd463a19942399ba39563b7c42a0c5f0d702b5`
- Five modified tracked files:
  - `client/src/components/features/FeaturedServices.jsx`
  - `client/src/data/services.js`
  - `client/src/pages/ServiceDetail.jsx`
  - `client/src/pages/Services.jsx`
  - `client/tests/serviceRegistry.test.js`
- Eight untracked files:
  - `client/src/data/loanServiceContent.js`
  - `client/tests/loanServicesContent.test.js`
  - `docs/phase_1m1_seo_metadata_investigation.md`
  - `docs/phase_2a_loan_services_content_plan.md`
  - `docs/phase_2a_loan_services_seo_audit.md`
  - `docs/phase_2b_implementation_report.md`
  - `docs/phase_2c_issue_tracker.md`
  - `docs/phase_2c_seo_qa_report.md`

The requested branch `seo/phase-2d-qa-remediation` was created from that state. Existing changes and reports were carried forward. Nothing was staged, committed, pushed, merged or deployed.

## Technical approach and files

| File | Phase 2D change | Reason |
|---|---|---|
| `client/src/data/loanServiceIndex.js` | Added a lightweight 20-route index containing the existing metadata, H1, card descriptions, null benefit/timeline settings and related-link data. FAQ text and educational sections are not included. | Keep shared cards, search, and static route metadata available without importing long editorial content into the application entry. |
| `client/src/data/services.js` | Changed the catalogue overlay to consume the lightweight index instead of importing the full editorial map. | Remove the full map from common `SERVICES` dependencies used by the homepage and route SEO resolver. |
| `client/src/pages/ServiceDetail.jsx` | The lazy service-detail route imports and merges the existing full loan content map for the matching loan slug. | Keep direct-route, SSR, metadata, section, FAQ, schema and related-link output intact while deferring that module. |
| `client/src/components/features/FeaturedServices.jsx` | Loads loan FAQ data asynchronously only when a Loan Services item is selected; handles a failed import without an unhandled rejection. | Preserve the featured loan schema behavior without eagerly importing FAQ text into the shared entry. |
| `client/tests/loanServicesContent.test.js` | Added consistency assertions between the lightweight index and the existing approved loan content, including that the index excludes FAQs and educational sections. | Prevent the shared summary fields from drifting from route content. |
| `client/tests/loanContentCodeSplit.test.js` | Added a built-output regression test that ensures the initial entry excludes loan editorial/FAQ text and a deferred JavaScript asset contains it. | Ensure the bundling boundary is retained. |

The Phase 2B full content file `client/src/data/loanServiceContent.js` was not edited. No loan copy, CTA, schema implementation, URLs, routes, canonical, robots, sitemap, redirects, or indexability decisions were changed. P2C-01 and P2C-02 remain open.

## Bundle measurements

Vite's production-build output (minified bytes and gzip bytes):

| Build | Main entry minified | Main entry gzip | Comparison |
|---|---:|---:|---|
| Phase 0 baseline | 703.66 kB | 164.08 kB | Baseline |
| Phase 2B | 755.86 kB | 176.68 kB | +52.20 kB / +12.60 kB gzip vs Phase 0 |
| Phase 2D | 721.75 kB | 167.80 kB | -34.11 kB / -8.88 kB gzip vs Phase 2B |

Phase 2D's main entry is **4.5% smaller minified / 5.0% smaller gzip** than Phase 2B. It remains **18.09 kB minified / 3.72 kB gzip** above Phase 0. Vite continues to emit its `Some chunks are larger than 500 kB after minification` warning.

The content now appears in a separate generated asset: `loanServiceContent-MONecmIo.js`, **51.56 kB minified / 12.62 kB gzip**. The initial `index-*.js` entry contains neither `Personal borrowing and intended use` nor the shared loan FAQ question. Other substantial chunks remain: React 142.19 kB, Framer Motion 114.46 kB, ResourceDetail 36.88 kB, Contact 36.37 kB, and ServiceDetail 36.13 kB minified.

This is a meaningful initial-entry reduction for visitors who do not open a loan service, but a visitor entering a loan URL still needs the deferred content chunk to render/hydrate that route. The overall main entry remains large, so further performance work may be warranted. No Lighthouse, field Web Vitals, or other lab/field performance measurement was run.

## Prerendering, route and hydration verification

- React 18 server rendering uses `renderToPipeableStream`; its `onAllReady` callback waits for nested lazy route modules before writing markup. The existing prerender script consumes this shared route tree and emits one complete static file per route.
- The build generated **110 route documents** (44 sitemap routes + 66 noindex service routes) and a separate noindex `404.html`; recursive output inspection found 111 HTML files total.
- All **20** loan routes retained exact byte-for-byte React root markup relative to the saved pre-change build hashes.
- All 20 retained their title, description, H1, canonical, educational sections and visible FAQs. Each has one FAQPage JSON-LD object whose four questions/answers exactly match the visible open FAQ disclosures; Service and BreadcrumbList schemas remain present.
- The 23 indexable service and 66 noindex service counts are unchanged. All 66 generated noindex documents remain `noindex, follow`, with no canonical tag.
- A local Vite preview was opened in a browser on loopback. The Personal Loan route hydrated with its title/H1 and complete content; clicking its Gold Loan related-service link performed client-side navigation and rendered the Gold Loan title/H1. Browser console error and warning logs were empty. This was local-only; no production or preview deployment was contacted.
- The browser check did not select a loan inside the homepage Featured Services panel. The summary index and dynamic import path were verified by regression tests/build, but the panel's post-selection FAQ-schema update was not browser-exercised. If that deferred chunk fails, the panel remains usable but its FAQ schema is omitted for that selection.
- Direct route generation and client navigation were checked. A full browser pass across all 20 routes, form submission, mobile-device testing and deployment HTTP acceptance were not performed.

## SEO and link regression

| Check | Result |
|---|---|
| Loan routes | 20, all rendered and unchanged |
| Indexable services | 23 |
| Noindex service routes | 66 |
| Sitemap | 44 URLs |
| Sitemap SHA-256 | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` — Phase 0 match |
| Robots SHA-256 | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` — Phase 0 match |
| Canonical origin | `https://www.clearfiling.co.in` — retained for all indexable loan pages |
| New contextual links | 53 service links + 16 resource links; all destinations exist and render; zero broken links |
| Redirects | Both existing 301 entries remain unchanged in `client/vercel.json` and redirect tests pass |

## Test and build results

- `npm run build --prefix client` — **passed**. Vite compiled 1,965 modules; sitemap generation reported 44 URLs; prerender generated 110 routes and `404.html`; static validation verified 110 route files and JSON-LD on 70 routes. The chunk warning remains as noted above.
- `npm test --prefix client` — **passed: 49 tests, 20 suites; 0 failed, 0 skipped**.
- `git diff --check` — passed.
- Regression checks confirmed all 20 loan roots were unchanged, all 20 FAQ schemas matched visible FAQs, all 53 + 16 links resolved, indexability counts and sitemap/robots hashes matched, and no editorial content remained in the initial entry.

## Remaining limitations and owner decisions

- P2C-01 is still unresolved: all 20 pages retain the “experienced loan advisors and financial experts” CTA. This phase did not change it.
- P2C-02 is still unresolved: the shared generic Service `Offer` representation was not changed.
- P2C-04 vehicle/commercial-vehicle scope and P2C-05 repeated FAQs remain editorial issues; the longest description is P2C-06. Required questions are in `docs/phase_2d_pending_owner_decisions.md`.
- The Vite warning remains; Phase 2D did not attempt to restructure unrelated React, animation or page chunks.
- The featured-loan FAQ import path is selected by the UI only after the visitor selects a loan service. Service-detail routes directly import the same deferred content module. No form was submitted and no external integration was called.
- No live deployment, production-domain request, or update to `clearfiling.co.in` was performed.

## Working-tree status

At completion, the branch is `seo/phase-2d-qa-remediation` at HEAD `93cd463a19942399ba39563b7c42a0c5f0d702b5`. There are five modified tracked files and twelve untracked files, with no staged changes. This includes the carried-forward Phase 2B work and prior reports plus Phase 2D changes and reports. The working tree is intentionally not clean; nothing was discarded or committed.

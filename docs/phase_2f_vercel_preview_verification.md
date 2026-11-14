# ClearFiling SEO — Phase 2F Vercel Preview Verification

**Date:** 2026-11-15\
**Preview:** https://clear-filing.vercel.app/\
**Production:** `https://www.clearfiling.co.in/` (not accessed)\
**Outcome:** **PREVIEW NOT VERIFIED — ACTION REQUIRED**

## Safety and candidate identity

The isolated integration repository was used: `/private/tmp/clearfiling-phase1j-integration`. Its branch is `seo/phase-2e-final-acceptance` at the expected HEAD `93cd463a19942399ba39563b7c42a0c5f0d702b5`.

The working tree was intentionally dirty before this phase. At inspection it had five modified tracked files and 15 untracked paths, with no staged changes. The Phase 2E source changes are not committed in HEAD. They were preserved. This report is an additional untracked file; source files and Git state were not otherwise changed. No commit, push, PR, merge or deployment was attempted.

The preview URL opened in the browser and rendered the ClearFiling homepage. A deployment commit SHA/build ID could not be obtained from the available browser view. The web fetch tool could not access the host, and shell `curl` could not resolve the hostname (`Could not resolve host: clear-filing.vercel.app`). The browser path was sufficient to compare visible page content, but not to inspect HTTP headers or raw initial response HTML.

## Deployment freshness check — failed

The deployed homepage's Business Loan card showed:

> Secure capital for corporate expansion, technology upgrades, working capital, or inventory purchase. Assistance with business loan applications and documentation. 7 - 14 Business Days.

The current Phase 2E source at `client/src/data/loanServiceIndex.js` instead specifies:

> Businesses considering external finance should identify the planned use, review affordability, and compare complete written lender terms before applying.

The current entry also has `processingTime: null`. The deployed copy therefore differs materially from the Phase 2E lender-neutral content and retains a processing-time claim absent from the Phase 2E source. This establishes that the preview does not represent the current Phase 2E working tree. The Vercel deployment's exact source commit remains unknown.

Per the Phase 2F stop condition, verification stopped at this freshness gate. A new Preview deployment built from the Phase 2E changes is required before acceptance testing. Those changes are currently uncommitted, and this phase did not authorize committing, pushing or deploying them.

## Verification results

| Check | Result |
|---|---|
| Preview homepage | Browser opened and rendered; HTTP status not captured |
| Preview source commit/build identity | Unknown; no deployment metadata available |
| Phase 2E content match | **Fail** — Business Loan copy/timeline mismatch above |
| 20 loan routes and HTTP 200 statuses | Not run; stopped because preview is outdated |
| robots.txt and sitemap.xml HTTP statuses/content | Not run |
| Both 301 redirects and final destinations | Not run |
| Unknown-route genuine 404 | Not run |
| Initial HTML title, description, canonical, robots and JSON-LD on 20 routes | Not run |
| Sitemap URL count, canonical origin, exclusions and robots baseline | Not run |
| Representative loan-route browser smoke tests | Not run; only the homepage was opened for the freshness comparison |
| Console, network requests, assets, navigation and mobile layout | Not inspected after the stale-content gate |

The homepage's Documentation panel displayed “Unable to Load Documents.” The request and cause were not inspected. No HTTP status is inferred from the successful browser render. No production URL or production service was accessed.

## Performance and limitations

The local Phase 2E report records a **722.39 kB minified / 167.94 kB gzip** main entry and the existing Vite advisory for chunks over 500 kB. Deployed bundle size and runtime performance were not measured. No Core Web Vitals claim is made.

## Required next action

Publish a fresh Vercel Preview from the current Phase 2E source, then rerun the HTTP, initial-HTML, sitemap/robots and browser acceptance checks. The Phase 2E working tree has intentional uncommitted changes; publishing them requires a separately authorized safe path. No deployment action was taken in Phase 2F.

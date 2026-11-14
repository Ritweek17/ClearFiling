# Phase 1H — Public Website Validation Report

**Validation target:** `/private/tmp/clearfiling-phase1g-preview`  
**Date:** 2026-11-14  
**Result:** Production build and all client tests passed. Static SEO output and source hashes matched expectations. Local HTTP status testing was blocked by a sandbox `EPERM`; Vercel preview acceptance remains outstanding.

## Candidate state

- Branch: `seo/phase-1b-vercel-preview`.
- HEAD: `f15258bbb8269703f9ce47dae424ef7c944deb6a`.
- Existing commit history (unchanged):
  1. `009ae6ebd2f09901e730b9b9c3fa06a75c096856` — `feat(client): finalize public website and content updates`
  2. `4725cfcf6263a299b9d8cad02da45437937ec51d` — `feat(seo): add static prerendering for public routes`
  3. `f15258bbb8269703f9ce47dae424ef7c944deb6a` — `test(client): add website and SEO validation coverage`
- Before validation, `git status` was clean with no staged or uncommitted tracked changes. Final status is also clean.
- The commits’ changed-path inventory contains no `admin/`, `server/`, `.env`, `dist/`, or `node_modules/` paths. The repository tree inherits existing `server/` files from the base commit, but these three commits did not change them. `client/.env.example` is present as an inherited tracked template from the base; it was not read or modified by these commits. No real `.env` or credential content was read or exposed.
- `npm ci` created ignored `client/node_modules/` only in the isolated candidate. The build created ignored `client/dist/`; neither is committed.
- The original checkout was not modified for validation. This report was created in the requested original-repository documentation location.

## Build

Command: `cd /private/tmp/clearfiling-phase1g-preview/client && npm run build`

**Passed.** The sitemap generator reported 44 URLs. Vite transformed 1,963 modules and completed the production build. Static generation reported 110 routes (44 indexable and 66 noindex) plus one noindex 404 document. It reported 70 route documents with JSON-LD and verified all 110 route files.

Vite emitted the existing large-chunk warning: the main JavaScript chunk is 704.05 kB minified, above the 500 kB warning threshold. The build still succeeded.

## Client tests

Command: `cd /private/tmp/clearfiling-phase1g-preview/client && npm test`

**Passed: 46 tests, 0 failed, across 18 suites.** This run occurred after the successful build. It covered centralization, public documentation, service registry, route output, SEO metadata, 404 document, and redirect configuration assertions.

## Generated SEO output

The build generator and output checks reported:

| Check | Result |
|---|---:|
| Sitemap URLs | 44 |
| Indexable service URLs in sitemap | 23 |
| Canonical noindex service routes | 66 |
| Generated route documents | 110 |
| HTML files including `404.html` | 111 |
| JSON-LD scripts across route documents | 210 |

Every generated route was checked against `resolveRouteSeo` for title, description, canonical and robots behavior. The output checks also verified one each of Open Graph and Twitter title/description metadata, at least one H1, meaningful body content, noindex exclusion from the sitemap, and no duplicate JSON-LD IDs or identical JSON-LD payloads on a route. No output-check errors were found.

`404.html` exists, contains `noindex, follow` and an H1, has no canonical, and contains no module script. This verifies the generated file contents only; it does not establish the HTTP status served for an unknown path.

Both Vercel 301 rules remain configured and are covered by client assertions:

- `/services/udyam-registration` → `/services/msme-registration` (301)
- `/services/import-export-code` → `/services/iec-registration` (301)

The redirect configuration was verified; actual HTTP redirect responses were not observed in this local run.

## Local HTTP limitation

Attempted `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Vite preview could not bind and returned:

```text
Error: listen EPERM: operation not permitted 127.0.0.1:4173
```

Therefore direct-route HTTP status, unknown-route HTTP 404, and HTTP 301 responses remain unverified locally. A Vercel Preview deployment must verify these behaviors before acceptance. No production or preview deployment was attempted.

## Sitemap and robots hashes

After build-time sitemap generation, both files match the Phase 0 references exactly:

| File | Phase 0 SHA-256 | Candidate after build | Result |
|---|---|---|---|
| `client/public/sitemap.xml` | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` | Match |
| `client/public/robots.txt` | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` | Match |

## Final verification and remaining blockers

- All three commit SHAs remain unchanged; no amend or additional commit was made.
- The candidate working tree is clean after build and tests.
- Commit diffs contain no admin/backend changes, generated artifacts, or environment-file changes. The static client artifact is under `client/dist`; the Git base has existing server files, but the three reviewed commits contain no server paths.
- No push, merge, or deployment occurred. Live remote availability remains unresolved from Phase 1G.
- Local validation supports proceeding to Vercel Preview testing, subject to the outstanding HTTP checks. Specifically, confirm both 301 status/destinations and a genuine HTTP 404 for an unknown path, plus direct nested-route access and refresh. Do not treat the generated `404.html` alone as proof of an HTTP 404.

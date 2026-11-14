# Phase 1C — Vercel Preview Acceptance Report

**Status:** Blocked pending an authorized Vercel preview URL. No preview deployment was created and no remote route was tested.

## Deployment preflight

- Current branch: `main`, one commit ahead of `origin/main`.
- The working tree contains many pre-existing modified and untracked paths across `client/`, `admin/`, `server/` and `docs/`. There were no staged changes when inspected. All were preserved.
- `client/vercel.json` currently sets `cleanUrls: true`, retains the security headers and both 301 rules, and no longer has the catch-all SPA rewrite.
- Client build command is `node scripts/generateSitemap.mjs && vite build && node scripts/prerender.mjs`.
- No `vercel` CLI is installed (`command -v vercel` returned no executable), no `client/.vercel` project link is present, and no Vercel deployment connector is available in this environment.
- No environment file or credential was read. No CLI installation or authentication bypass was attempted.

To continue, provide the authorized Vercel preview URL. If a preview has not yet been created, the repository needs an authenticated Vercel deployment context/project link with the public client configured to build from `client/` and serve `client/dist`. A preview-only deployment can then be initiated through the authorized Vercel workflow; production deployment is out of scope.

## Local source checks completed

These checks confirm current repository files only. They do not substitute for preview HTTP responses.

| Check | Result |
|---|---|
| Public sitemap URLs | 44 total, 44 unique |
| Redirect source URLs in sitemap | Neither source URL is present |
| `client/public/sitemap.xml` SHA-256 | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` — matches Phase 0 baseline |
| `client/public/robots.txt` SHA-256 | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` — matches Phase 0 baseline |
| robots directives | `User-agent: *`, `Allow: /`, sitemap points to `https://www.clearfiling.co.in/sitemap.xml` |
| Vercel redirect definitions | Both source/destination pairs remain configured with `statusCode: 301`; HTTP behavior not tested |
| Vercel `cleanUrls` / SPA fallback | `cleanUrls: true`; no catch-all rewrite present |

Phase 1B's local tests and build are historical context only. They do not establish Vercel CDN status codes, filesystem precedence, redirect chains or deployed HTML.

## Preview test status

No deployment URL was available. All requested remote tests are therefore **NOT RUN**, with no HTTP status claimed:

| Test group | Required result | Result |
|---|---|---|
| Homepage and core routes | Direct access and refresh return route-specific initial HTML | Not run — no preview URL |
| Indexable services | Correct initial title, description, canonical, social tags, H1/body and applicable JSON-LD | Not run — no preview URL |
| Noindex services | `noindex, follow`, existing canonical behavior, route-specific content and absent from sitemap | Not run — no preview URL |
| Resources, blog and legal routes | Direct access, refresh and route-specific initial HTML | Not run — no preview URL |
| Udyam redirect | HTTP 301 to `/services/msme-registration`, no loop or extra chain | Not run — configuration only inspected |
| Import/export code redirect | HTTP 301 to `/services/iec-registration`, no loop or extra chain | Not run — configuration only inspected |
| Unknown URL | HTTP 404, expected noindex content, absent from sitemap | Not run — no preview URL |
| Initial HTML SEO | Uniqueness and route correctness from raw HTTP response | Not run — no preview URL |
| Browser behavior | Navigation, nested route, refresh, query filters, form validation, metadata updates, console/hydration | Not run against Vercel — no preview URL |
| All 110 route paths | Direct request/refresh coverage where practical | Not run against Vercel — no preview URL |

## Final verdict

**Phase 1C is not accepted yet.** The local sitemap/robots hashes and Vercel configuration match the Phase 1B intent, but this is not evidence that Vercel serves the generated files, redirects or `404.html` as intended. The required next input is an authorized Vercel preview URL. No source/configuration changes, deployments, commits, pushes or merges were made in this phase; this report is the only file created.

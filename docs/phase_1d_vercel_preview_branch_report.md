# Phase 1D — Isolated Vercel Preview Branch Report

**Outcome:** Stopped before branch creation, staging, commit or push. The Phase 1B changes cannot be separated safely from earlier uncommitted work using the current repository state.

## Original repository state

- Branch: `main`.
- `main` is one commit ahead of `origin/main`; current HEAD is `b33945f` (`refactor: improve contact form submit button styling and layout structure`).
- Working tree: 47 modified tracked paths and 132 untracked paths; 0 staged paths.
- Existing work spans the public client, admin, backend, tests and documentation. It was not switched, staged, restored, committed, pushed or otherwise changed in this phase.
- No environment file or credential was read.

## Phase 1B candidate manifest

This is an identification manifest only. **Nothing below was staged.** Candidate files are based on `docs/seo_prerendering_implementation_report.md` and current source. A clean commit containing only these candidate changes cannot be formed from the current `HEAD` without bringing in earlier work.

| Candidate path | Phase 1B purpose | Current separation concern |
|---|---|---|
| `client/index.html` | SEO and React root insertion markers | Entire file is modified; prior static SEO fallback work is also absent from `HEAD`. |
| `client/package.json` | Add prerender generation to production build | Existing worktree diff also adds sitemap/test scripts, and build invokes another untracked script. |
| `client/src/App.jsx` | Keep BrowserRouter while delegating to shared routes | Replaces the route wrapper in the worktree; must be paired with the new shared route tree. |
| `client/src/AppRoutes.jsx` (untracked) | Shared React Router route definitions | New SSG file, but downstream routes and data dependencies contain earlier uncommitted work. |
| `client/src/entry-server.jsx` (untracked) | StaticRouter React 18 server renderer | New SSG file. |
| `client/src/main.jsx` | Hydrate generated HTML using `hydrateRoot` | Modified tracked file. |
| `client/src/utils/routeSeo.js` (untracked) | Resolve route metadata from current data/configuration | Imports uncommitted business, SEO, service registry, and legal/resource/blog modules. |
| `client/src/components/seo/Breadcrumbs.jsx` | Router-derived breadcrumb URL for SSR/hydration | Mixed with existing SEO component changes. |
| `client/src/components/seo/JsonLd.jsx` | Render deterministic JSON-LD during SSR/hydration | Mixed with existing SEO component changes. |
| `client/src/pages/Services.jsx` | Hydration-safe initial query filter state | Diff also contains earlier registry-driven filtering and catalogue behavior. |
| `client/vite.config.js` | Route-specific SEO slot transform | Diff includes prior SEO fallback plugin work. |
| `client/scripts/prerender.mjs` (untracked) | Generate 110 route documents and `404.html` | Requires the untracked sitemap generator and service registry. |
| `client/vercel.json` | `cleanUrls` and removal of catch-all SPA rewrite | Current diff also introduces the two 301 redirect definitions that were already uncommitted before Phase 1B; those must be retained. |
| `client/tests/brandSeo.test.js` (untracked) | Update static/JSON-LD assertions for SSR | The whole file is untracked and includes earlier SEO/business tests; there is no tracked base version to stage a Phase 1B-only hunk from. |
| `client/tests/prerenderOutput.test.js` (untracked) | Validate generated routes, indexability, redirects and 404 artifact | New SSG test. |
| `docs/seo_prerendering_implementation_report.md` (untracked) | Phase 1B implementation evidence | Relevant report; docs directory as a whole is untracked, so only this exact path could be considered. |

### Generated output

The local build emits 110 route HTML documents plus `client/dist/404.html`. Build output is generated under the ignored `client/dist/` directory and is not in the current Git file inventory. It was not staged.

## Blocking dependencies and mixed ownership

The new SSG files cannot be committed as a self-contained Phase 1B change against current `HEAD`:

- `client/src/data/serviceRegistry.js` and `client/scripts/generateSitemap.mjs` are untracked and absent from `HEAD`; the SSG metadata resolver and build pipeline import/call them.
- `client/src/data/services.js` is modified by roughly 2,970 additions and 575 removals and imports the untracked service registry. It contains earlier catalogue/service work; including it wholesale would bring unrelated approved service-content changes into this Phase 1B commit.
- `client/src/pages/ServiceDetail.jsx` has roughly 267 additions and 49 removals from earlier service/legal review work and supplies the rendered detail pages used by SSG.
- `client/src/config/seo.js`, `client/src/config/business.js`, and legal/resource/blog data are modified by prior centralization batches and are imported by the new route metadata resolver and sitemap generator.
- The worktree's `client/vercel.json` contains both redirects, while `HEAD` does not. These redirect edits predate Phase 1B and are needed for the requested behavior, so a file-level stage would mix earlier routing work with Phase 1B's clean URL/fallback change.
- The `client/tests/` directory is wholly untracked and contains tests from earlier batches as well as Phase 1B assertions. Git has no committed base file from which to stage only the Phase 1B hunks of `brandSeo.test.js`.

The Phase 0/Phase 1B working-tree snapshot is not represented by a commit or separate worktree. Consequently, the current diffs do not reliably identify which parts of these shared files predate Phase 1B. Selectively staging the full files would risk including prior legal, business, service catalogue, SEO centralization, and public-document work. Staging only apparent Phase 1B edits would leave required imports/dependencies absent from the preview branch. This meets the instruction's stop condition: safe separation is not established.

## Branch, staging, commit and push

| Item | Result |
|---|---|
| Requested branch | `seo/phase-1b-vercel-preview` — **not created** |
| Staged file manifest | Empty; no files staged |
| Unrelated files excluded | All unrelated admin/backend work and prior business, legal, service catalogue, document integration, and other SEO changes remain untouched and unstaged |
| Build/tests in Phase 1D | Not run; stopped before validation because the isolated commit cannot be assembled safely. Phase 1B's reported 46/46 tests and build are historical, not a Phase 1D run. |
| Sitemap SHA-256 | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` — matches the Phase 0 baseline |
| robots.txt SHA-256 | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` — matches the Phase 0 baseline |
| Commit | None |
| Push / remote branch confirmation | Not attempted; no isolated branch or commit exists to push |
| Vercel preview | None created or claimed |

## Recommended next step

Establish a committed base that includes the already-approved prerequisite work (service registry/catalogue, business and SEO centralization, sitemap generator, and the required client test/data dependencies), or provide a clean Phase 1B snapshot/worktree created from that base. Then the SSG-only diff can be staged, rebuilt, tested, committed, and pushed without bundling unrelated files. The current branch remains `main`; the sole change made in this phase is this report.

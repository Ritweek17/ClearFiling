# Phase 1G — Public Website Commit Report

**Outcome:** Three local review commits were created in an isolated local clone on branch `seo/phase-1b-vercel-preview`. No push or deployment occurred. Validation stopped at the first failing test run as instructed; the production build and further acceptance checks were not run.

## Base and remote verification

- Configured origin: `https://github.com/Ritweek17/ClearFiling.git` (credentials, if any, were not displayed).
- A live `git ls-remote --heads origin main` attempt returned exit code 128. The live remote SHA and current remote ancestry remain unverified.
- Selected local base SHA: `b33945f5ee4f6691d54c5e90576960d3381cc96b`. This is the observed local `main` HEAD, not a guessed remote SHA. Its parent is the local `origin/main` tracking SHA `bd7cea621979b590885b1ff123fe575fa7dcd3c8`.
- The selected base includes the existing contact-button styling commit (`b33945f`), which the request authorized for inclusion. Whether that commit is on live GitHub `main` remains unknown.

## Branch and isolation

- Proposed preview branch: `seo/phase-1b-vercel-preview`.
- Candidate path: `/private/tmp/clearfiling-phase1g-preview`.
- A `git worktree add` attempt could not write the original checkout's Git ref metadata and created no branch/worktree. The worktree was not retried. A fresh local clone was created instead and the approved client snapshot was assembled there.
- The original checkout remains on `main`. Its 47 modified tracked files and 37 collapsed untracked status entries remain present; no admin/backend files were staged or committed from that checkout. This report is the only new file in the original checkout.
- Candidate branch history is local only. It has no configured/pushed preview branch on GitHub.

## Commits

| Commit | SHA | Purpose |
|---|---|---|
| `feat(client): finalize public website and content updates` | `009ae6ebd2f09901e730b9b9c3fa06a75c096856` | Public site/content/business/legal/SEO prerequisites, public document frontend integration, service registry/catalogue, sitemap generator and selected review reports. |
| `feat(seo): add static prerendering for public routes` | `4725cfcf6263a299b9d8cad02da45437937ec51d` | Shared route tree, server renderer, route SEO resolver, prerender script, hydration, route metadata insertion and Vercel static routing. |
| `test(client): add website and SEO validation coverage` | `f15258bbb8269703f9ce47dae424ef7c944deb6a` | Client tests and the `npm test` script. |

Each commit is a child of the previous one. `client/package.json`, `client/src/pages/Services.jsx`, and `client/vercel.json` appear in two sequential commits because the baseline changes and SSG integration are distinct. `client/package.json` also appears in commit 3 to add only the test script.

### Commit 1 paths

The explicit 47-path manifest was:

```text
client/package.json
client/scripts/generateSitemap.mjs
client/src/components/common/CTAButtons.jsx
client/src/components/common/FloatingCTAs.jsx
client/src/components/common/Footer.jsx
client/src/components/common/Logo.jsx
client/src/components/contact/ContactHero.jsx
client/src/components/features/AboutSection.jsx
client/src/components/features/CTASection.jsx
client/src/components/features/DocumentationSection.jsx
client/src/components/features/FeaturedServices.jsx
client/src/components/features/Hero.jsx
client/src/components/features/TrustSection.jsx
client/src/components/features/WhyChooseSection.jsx
client/src/components/seo/SEOHead.jsx
client/src/components/seo/SchemaHelpers.js
client/src/config/business.js
client/src/config/contact.js
client/src/config/seo.js
client/src/data/blogContent.js
client/src/data/companyInfo.js
client/src/data/consultants.js
client/src/data/faqContact.js
client/src/data/footerConfig.js
client/src/data/legalContent.js
client/src/data/officeLocations.js
client/src/data/resourcesContent.js
client/src/data/serviceRegistry.js
client/src/data/services.js
client/src/hooks/documentationController.js
client/src/hooks/usePublicDocumentation.js
client/src/layouts/LegalPageLayout.jsx
client/src/layouts/ResourcePageLayout.jsx
client/src/pages/About.jsx
client/src/pages/BlogPost.jsx
client/src/pages/Contact.jsx
client/src/pages/Home.jsx
client/src/pages/ServiceDetail.jsx
client/src/pages/Services.jsx
client/src/services/publicApi.js
client/src/utils/documentFileUtils.js
client/vercel.json
docs/phase_1d_vercel_preview_branch_report.md
docs/seo_execution_baseline.md
docs/seo_prerendering_evaluation.md
docs/seo_prerendering_implementation_report.md
docs/seo_prerendering_preview_acceptance_report.md
```

The base commit already contains `client/src/pages/Contact.jsx` styling. The baseline Vercel config keeps the existing 301 redirects and SPA rewrite; SSG routing changes are in commit 2.

### Commit 2 paths

```text
client/index.html
client/package.json
client/scripts/prerender.mjs
client/src/App.jsx
client/src/AppRoutes.jsx
client/src/components/seo/Breadcrumbs.jsx
client/src/components/seo/JsonLd.jsx
client/src/entry-server.jsx
client/src/main.jsx
client/src/pages/Services.jsx
client/src/utils/routeSeo.js
client/vercel.json
client/vite.config.js
```

### Commit 3 paths

```text
client/package.json
client/tests/brandSeo.test.js
client/tests/companyProfileCentralization.test.js
client/tests/contactOfficeCentralization.test.js
client/tests/documentationSection.test.js
client/tests/legalContentCentralization.test.js
client/tests/prerenderOutput.test.js
client/tests/publicDocumentation.test.js
client/tests/seoCentralization.test.js
client/tests/serviceRegistry.test.js
client/tests/wave1Content.test.js
```

## Excluded paths and review notes

- Entire `admin/` and `server/` trees, including their tests, were excluded from the candidate commits.
- The modified `client/.env.example` was excluded. No real `.env` was read or copied. No credentials were exposed.
- Generated `client/dist/` and `node_modules/` were not committed. `npm ci` created an ignored `client/node_modules/` only inside the isolated candidate clone.
- Admin/backend environment/configuration changes and unrelated root-level changes remain only in the original checkout.
- The Phase 1E and Phase 1F planning reports, business-centralization reports, and unrelated docs were not copied into the candidate branch. The five listed SEO reports were included in commit 1.
- The final candidate `git status` showed a clean branch after the three commits; ignored installed dependencies are not tracked. The final branch history was reviewed and contains the three commits above, based on the selected local HEAD.
- Review confirmed the candidate commit path manifests contain no admin/server paths, `.env` paths, `dist/`, or `node_modules/`. Existing 301 redirect destinations remain `/services/msme-registration` and `/services/iec-registration`; the SSG commit removes the catch-all rewrite and adds `cleanUrls: true`.
- Prior Phase 1B reports state 44 sitemap URLs, 23 indexable service pages, 66 noindex service pages, and 110 generated route documents plus `404.html`. Those counts were **not revalidated in this phase** because validation stopped before build. The 44 URL baseline and two redirect definitions are retained in the committed source configuration, but final output verification is outstanding.
- The staged baseline had pre-existing trailing whitespace in source/docs files; no formatter or cleanup was run. It did not cause the test failures.

## Dependency installation and validation

- `cd /private/tmp/clearfiling-phase1g-preview/client && npm ci` — succeeded; added 142 packages from the existing lockfile. npm reported install scripts for `esbuild` and `fsevents` were not covered by its allow-scripts setting. No package was added to the manifest or lockfile.
- `npm test` — **failed: 42 passed, 4 failed** (46 tests, 18 suites). All four failures occurred before any assertion because expected generated files were absent:
  - `tests/brandSeo.test.js:70` — `ENOENT` opening `/private/tmp/clearfiling-phase1g-preview/client/dist/index.html`.
  - `tests/prerenderOutput.test.js:24` — `ENOENT` opening `client/dist/index.html`.
  - `tests/prerenderOutput.test.js:64` — `ENOENT` opening `client/dist/404.html`.
  - `tests/prerenderOutput.test.js:80` — `ENOENT` opening `client/dist/services.html`.
- `npm run build` — **not run** after the test failure, in accordance with the stop-on-failure requirement.
- Generated route metadata/content, HTTP route behavior, sitemap/robots hash comparisons, service URL/indexability counts, hydration, redirects, and exclusion of emitted admin/backend artifacts were therefore **not verified in this phase**. Historical Phase 1B test/build claims are not substituted for current verification.
- Phase 0 reference hashes: sitemap `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`; robots `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b`. No post-build comparison exists because no build ran.

## Push and deployment

- Push status: **not pushed**; live remote unavailable.
- Preview deployment: **not created**.
- Production deployment, merge, and push to `main`: **not performed**.
- Remaining blocker: resolve the test/build ordering or test fixture prerequisite for generated `client/dist` files, then obtain owner authorization to continue validation. Remote access must also be restored before any push or Vercel preview branch verification.

## Stop status

The local review branch and three commits are prepared, but Phase 1G is **not validated or ready for Vercel preview**. Work stopped after the reported failing test run; no build or follow-on test was attempted.

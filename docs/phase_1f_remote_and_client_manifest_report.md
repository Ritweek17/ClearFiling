# Phase 1F — Remote Verification and Public-Client Manifest

**Inspection timestamp:** 2026-11-14 16:05 UTC (system clock).  
**Result:** Remote verification is incomplete because `git ls-remote` could not reach the configured remote. The local repository and client dependency manifest were inspected read-only. No Git operation that changes repository state, dependency install, source/configuration modification, or deployment was performed. This report is the only addition.

## 1. Remote and branch verification

- Configured remote: `origin`, sanitized URL `https://github.com/Ritweek17/ClearFiling.git`. No embedded credentials were displayed.
- Live-ref command: `git ls-remote --heads origin main`; exit code 128. The remote was unavailable or authentication/network access failed; the exact cause is not determinable from the safe output. **Live `origin/main` SHA is unverified.** No retry or authentication bypass was attempted.
- Current branch: `main`.
- Local `HEAD`: `b33945f5ee4f6691d54c5e90576960d3381cc96b`.
- Local `origin/main` tracking ref: `bd7cea621979b590885b1ff123fe575fa7dcd3c8`.
- `origin/main` tracking ref is an ancestor of `HEAD`; local divergence is zero commits behind and one commit ahead. This describes local refs only, not current server state.
- Ahead commit: `b33945f5ee4f6691d54c5e90576960d3381cc96b`, parent `bd7cea621979b590885b1ff123fe575fa7dcd3c8`, subject `refactor: improve contact form submit button styling and layout structure`. It changes only `client/src/pages/Contact.jsx` (10 insertions, 3 deletions). It is absent from the local `origin/main` tracking ref by ancestry; whether it is present in live remote `main` cannot be verified. Do not assume this styling change belongs in the preview.
- Other local branch observed: `preview/contact-enhancements` at `932190229b8332545ec1f1e66640bb704549f824`, tracking the corresponding local remote-tracking ref. It is not the current branch or an approved Phase 1B base.
- **Recommended base SHA: none yet.** The local tracking SHA `bd7cea621979b590885b1ff123fe575fa7dcd3c8` is a candidate only, not a recommendation, until live remote verification and scope decisions are resolved.

## 2. Corrected Git inventory

Raw `git ls-files --others --exclude-standard` is the source of truth. At inspection time, before adding this Phase 1F report:

| State / area | File count |
|---|---:|
| Modified tracked files | 47 |
| Staged tracked files | 0 |
| Untracked files under `admin/` | 42 |
| Untracked files under `client/` | 20 |
| Untracked files under `server/` | 43 |
| Untracked files under `docs/` | 29 |
| Other untracked files | 0 |
| **Total untracked files** | **134** |

Git presents these 134 untracked files as 37 top-level untracked entries because directories are collapsed in ordinary `git status` output. The 29 docs include the Phase 1E report. The Phase 1E report's own “before adding this report” count of 133 is consistent with 28 docs at that earlier moment; adding the Phase 1E report made 134. Its category arithmetic was inaccurate: the actual current split is admin 42, client 20, server 43, docs 29. After this Phase 1F report is created, the expected raw untracked total is 135, including 30 docs. Existing tracked changes remain 47; staged count remains 0.

The 47 modified tracked files are 43 under `client/` and 4 under `server/`. The complete list is already recorded in Phase 1E, Section 3. No tracked deletion or rename was shown.

## 3. Public-client manifest and classification

### A. Required public-client baseline

For a preview of the **current complete public client**, include all current client runtime source, route dependencies, content/data, styles, assets, public files, and build configuration below. This intentionally favors a complete snapshot over a fragile narrow cherry-pick. Most pre-existing tracked files in this list are unchanged in the current working tree; include them from the selected base or snapshot as necessary, and include their current working versions when modified.

**Build/package/public files:**

```text
client/index.html
client/package.json
client/package-lock.json
client/postcss.config.js
client/tailwind.config.js
client/vite.config.js
client/vercel.json
client/public/favicon.svg
client/public/robots.txt
client/public/sitemap.xml
```

**Application, components, hooks, layouts, pages, services and utilities:**

```text
client/src/App.jsx
client/src/main.jsx
client/src/components/common/CTAButtons.jsx
client/src/components/common/ErrorBoundary.jsx
client/src/components/common/FloatingCTAs.jsx
client/src/components/common/Footer.jsx
client/src/components/common/GoogleAnalyticsTracker.jsx
client/src/components/common/Logo.jsx
client/src/components/common/MobileDrawer.jsx
client/src/components/common/MobileMenu.jsx
client/src/components/common/NavLink.jsx
client/src/components/common/Navbar.jsx
client/src/components/common/RouteLoadingFallback.jsx
client/src/components/common/ScrollToTop.jsx
client/src/components/contact/ContactHero.jsx
client/src/components/contact/ContactInfoCards.jsx
client/src/components/contact/OfficeLocations.jsx
client/src/components/features/AboutSection.jsx
client/src/components/features/CTASection.jsx
client/src/components/features/DocumentationSection.jsx
client/src/components/features/FAQSection.jsx
client/src/components/features/FeaturedServices.jsx
client/src/components/features/Hero.jsx
client/src/components/features/HeroIllustration.jsx
client/src/components/features/HowWeWorkSection.jsx
client/src/components/features/IndustriesSection.jsx
client/src/components/features/ProcessSteps.jsx
client/src/components/features/SecurityStrip.jsx
client/src/components/features/StatsStrip.jsx
client/src/components/features/TestimonialsSection.jsx
client/src/components/features/TopClientsSection.jsx
client/src/components/features/TrustFeatureCard.jsx
client/src/components/features/TrustSection.jsx
client/src/components/features/WhyChooseSection.jsx
client/src/components/seo/Breadcrumbs.jsx
client/src/components/seo/JsonLd.jsx
client/src/components/seo/SEOHead.jsx
client/src/components/seo/SchemaHelpers.js
client/src/components/ui/Badge.jsx
client/src/components/ui/Button.jsx
client/src/components/ui/Card.jsx
client/src/components/ui/Container.jsx
client/src/components/ui/Divider.jsx
client/src/components/ui/Flex.jsx
client/src/components/ui/Grid.jsx
client/src/components/ui/Input.jsx
client/src/components/ui/MaxWidthContainer.jsx
client/src/components/ui/PageContainer.jsx
client/src/components/ui/SectionContainer.jsx
client/src/components/ui/SectionHeading.jsx
client/src/components/ui/SectionWrapper.jsx
client/src/components/ui/Select.jsx
client/src/components/ui/Spacer.jsx
client/src/components/ui/Stack.jsx
client/src/components/ui/Textarea.jsx
client/src/config/business.js
client/src/config/contact.js
client/src/config/seo.js
client/src/constants/animations.js
client/src/constants/colors.js
client/src/constants/spacing.js
client/src/constants/theme.js
client/src/constants/typography.js
client/src/data/blogContent.js
client/src/data/companyInfo.js
client/src/data/consultants.js
client/src/data/contactDetails.js
client/src/data/faqContact.js
client/src/data/footerConfig.js
client/src/data/indianLocations.js
client/src/data/legalContent.js
client/src/data/officeLocations.js
client/src/data/resourcesContent.js
client/src/data/services.js
client/src/data/topClients.js
client/src/layouts/Layout.jsx
client/src/layouts/LegalPageLayout.jsx
client/src/layouts/MainLayout.jsx
client/src/layouts/ResourcePageLayout.jsx
client/src/pages/About.jsx
client/src/pages/BlogPost.jsx
client/src/pages/Contact.jsx
client/src/pages/Disclaimer.jsx
client/src/pages/Home.jsx
client/src/pages/NotFound.jsx
client/src/pages/PrivacyPolicy.jsx
client/src/pages/ResourceDetail.jsx
client/src/pages/ServiceDetail.jsx
client/src/pages/Services.jsx
client/src/pages/Terms.jsx
client/src/services/emailService.js
client/src/styles/index.css
client/src/utils/scroll.js
```

These paths cover the route-rendered page tree, including service catalogue, company/office/SEO content and current public-document UI. The static client package must bring the lockfile and the actual scripts/configuration with it. The preview is a static client project rooted at `client/`, not a deployment of the whole monorepo.

### B. Required public-client prerequisite work, with mixed-purpose warnings

These paths are required for the current client output, business/SEO baseline, sitemap decisions or public-document integration. Their current uncommitted versions contain work from more than one approved phase in places; include only after owner scope approval, but do not omit dependencies merely to make the SSG diff appear smaller.

```text
client/src/data/serviceRegistry.js
client/src/hooks/documentationController.js
client/src/hooks/usePublicDocumentation.js
client/src/services/publicApi.js
client/src/utils/documentFileUtils.js
client/src/config/business.js
client/src/config/contact.js
client/src/config/seo.js
client/src/data/companyInfo.js
client/src/data/footerConfig.js
client/src/data/legalContent.js
client/src/data/officeLocations.js
client/src/data/services.js
client/src/data/resourcesContent.js
client/src/data/blogContent.js
client/src/components/seo/SchemaHelpers.js
client/src/components/seo/SEOHead.jsx
client/src/components/seo/JsonLd.jsx
client/src/components/seo/Breadcrumbs.jsx
client/src/components/features/DocumentationSection.jsx
client/src/pages/ServiceDetail.jsx
client/src/pages/Services.jsx
client/src/pages/Home.jsx
client/src/pages/Contact.jsx
client/src/components/common/Footer.jsx
client/src/components/contact/ContactHero.jsx
client/src/components/contact/ContactInfoCards.jsx
client/src/components/contact/OfficeLocations.jsx
```

`client/.env.example` is an optional setup aid, not required to compile. It may be included for operator documentation after review; its contents are not evaluated here and are not a substitute for preview-specific runtime configuration.

### C. Phase 1B SSG-specific paths

The following untracked/new paths and modified integration files form the Phase 1B generation/hydration/routing layer. Modified paths can contain earlier work in the same diff, as detailed in Section 4.

```text
client/src/AppRoutes.jsx
client/src/entry-server.jsx
client/src/utils/routeSeo.js
client/scripts/prerender.mjs
client/scripts/generateSitemap.mjs
client/src/App.jsx
client/src/main.jsx
client/index.html
client/vite.config.js
client/package.json
client/vercel.json
client/src/components/seo/Breadcrumbs.jsx
client/src/components/seo/JsonLd.jsx
client/src/pages/Services.jsx
client/tests/prerenderOutput.test.js
```

`generateSitemap.mjs` is also a prerequisite for the current sitemap workflow, not exclusively an SSG feature. Client tests include earlier centralization coverage as well as SSG assertions and should be treated as required validation inputs, not deployed runtime files.

### D. Client tests and their required dependencies

Include these test files in a reproducible client baseline; they are not shipped in `client/dist`:

```text
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

Declared package dependencies include React, React DOM, React Router, Vite, the React Vite plugin, and current runtime/UI libraries. Test source imports Node's built-in test/assert/fs/path/url modules, React/React DOM server, React Router server, and `esbuild` for JSX fixture bundles. `esbuild` is not declared directly in `client/package.json`; it is present transitively through Vite's toolchain in this lockfile. For a clean test install, verify that the locked graph makes it resolvable; if not, stop for an approved dependency decision rather than installing or editing in this phase.

### E. Other candidate classifications

- **Admin-only (42 untracked):** every path under `admin/` shown by `git ls-files --others --exclude-standard`; includes its package, app source, tests, assets/configuration and `admin/vercel.json`. None is imported by the client build. Exclude from a Vercel project rooted at `client/`; a separate admin deployment would be a separate scope.
- **Backend/API-only (43 untracked, plus 4 modified tracked paths):** every untracked path under `server/` shown by raw inventory (`app.js`, config, controllers, middleware, models, routes, scripts, services, tests, utilities) and modified tracked `server/.env.example`, `server/package-lock.json`, `server/package.json`, `server/server.js`. These are not static client build inputs. The public client calls API endpoints through `client/src/services/publicApi.js`, so runtime documentation testing needs a separately approved non-production API; that runtime dependency does not imply the server files belong in the static artifact.
- **Documentation/report (29 untracked at inspection):** all files below `docs/`, including Phase 1E and the earlier SEO/business/admin/server reports. They are review/provenance material, not client build inputs. The Phase 1F report itself raises the count to 30 after creation.
- **Generated/ignored:** `client/dist/**` (including generated route HTML/assets and `404.html`) is generated by the client build and ignored. `node_modules/**` is dependency output. Neither belongs in the source manifest or should be copied from the original checkout.
- **Optional/unrelated client change:** `client/src/pages/Contact.jsx` is the committed ahead-commit styling change. It is a functional public page dependency in a full current client snapshot, but it is not a prerequisite to SSG. Its scope inclusion requires owner decision. `client/.env.example` is optional setup documentation as noted above.

The exact admin/backend/doc filename inventory is preserved in the Phase 1E report. This Phase 1F classification is path-prefix exhaustive for those non-client categories and does not assert that their work is disposable.

## 4. Mixed-purpose files and no-partial-staging warning

These files have multiple project-phase responsibilities in their current diffs. A full-file inclusion may combine centralization, service catalogue, public-document, SSG, or contact changes. No partial staging or hunk selection was attempted.

| Path | Mixed responsibilities / risk |
|---|---|
| `client/index.html` | Static SEO fallback and build-time SEO/SSG insertion points. |
| `client/package.json` | Sitemap script, test script and SSG build sequencing. Its lockfile is separate and currently matches the declared root dependency ranges. |
| `client/src/App.jsx`, `client/src/main.jsx` | Existing SPA routing/bootstrap plus shared SSR routes and hydration changes. |
| `client/src/AppRoutes.jsx` | New shared route tree; imports existing route pages and components that include prior content/business changes. |
| `client/src/data/services.js`, `client/src/data/serviceRegistry.js`, `client/src/pages/Services.jsx`, `client/src/pages/ServiceDetail.jsx` | Service catalogue/content/legal review, indexability/redirect policy, route rendering, and SSG coverage. |
| `client/src/config/business.js`, `contact.js`, `seo.js`; `client/src/data/companyInfo.js`, `officeLocations.js`, `footerConfig.js`, `legalContent.js` | Approved business centralization and route/schema metadata dependencies. |
| `client/src/data/resourcesContent.js`, `blogContent.js` | Existing public content and route metadata/sitemap input. |
| `client/src/components/seo/SEOHead.jsx`, `JsonLd.jsx`, `SchemaHelpers.js`, `Breadcrumbs.jsx` | Prior SEO/schema centralization plus SSR/hydration determinism. |
| `client/vite.config.js` | Existing build configuration plus static SEO transformation / SSG integration. |
| `client/vercel.json` | Existing redirects/headers plus static file/clean URL behavior needed by SSG. |
| `client/src/components/features/DocumentationSection.jsx`, `Home.jsx`, documentation hook/API files | Homepage content plus public document integration; API URL is runtime configuration. |
| `client/src/pages/Contact.jsx`, contact components | Existing page/contact experience and the ahead-commit style adjustment; the commit cannot be identified by worktree diff because it is already in local HEAD. |
| `client/tests/brandSeo.test.js` and other `client/tests/*.test.js` | Tests from prior centralization plus SSG/public-document coverage; test files are untracked as a whole. |
| `client/scripts/generateSitemap.mjs` | Sitemap workflow dependency and SSG build prerequisite; not merely an SSG-only file. |

The ownership boundaries of these hunks cannot be reconstructed safely from current file state. The Phase 1E recommendation to assemble a reviewed full client snapshot and then separate prerequisite/SSG commits remains appropriate, but it must wait for remote and scope resolution.

## 5. Client lockfile check

- `client/package-lock.json` exists.
- Lockfile version: 3.
- Lock root package name/version match `client/package.json`.
- Root `dependencies` and `devDependencies` exactly match `client/package.json` when parsed and compared.
- No lockfile or package file was changed. This check validates manifest-root consistency; it does not constitute a clean install or dependency test.

## 6. Recommended base and unresolved decisions

**No exact preview base SHA is recommended yet.** The only locally visible base candidate is `origin/main` tracking SHA `bd7cea621979b590885b1ff123fe575fa7dcd3c8`, but live `origin/main` could not be fetched/queried. Before choosing it:

1. Restore authorized remote access and verify live `main` SHA/ancestry.
2. Confirm whether local `HEAD`'s contact-button styling commit should be part of the preview. It is not needed for SSG, and its live remote status is unknown.
3. Approve the complete public-client prerequisite scope. The current working tree mixes approved SEO/business centralization, service catalogue, public-document, contact/UI and SSG changes; a clean base cannot be inferred from filenames alone.
4. Confirm whether the owner wants full current `client/` behavior or a narrower public preview. If testing public documents, approve a non-production API target and test data.
5. Once approved, prepare the exact candidate worktree and commits in a later phase; no Git action is authorized by this read-only report.

## Conclusion

The Phase 1E file-count discrepancy is reconciled: 133 untracked files existed before its report, 134 before this report, and 135 are expected after this report. Current categories before Phase 1F creation total 134 (admin 42, client 20, server 43, docs 29). The client lockfile matches the package manifest at its root. However, because live remote `main` is unverified and the desired inclusion of the local ahead commit and mixed-purpose client changes is unresolved, there is not yet a sufficiently clear base SHA or owner-approved manifest for branch/worktree creation.

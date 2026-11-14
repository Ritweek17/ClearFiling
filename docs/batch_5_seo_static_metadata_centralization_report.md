# Batch 5 — SEO and Static Metadata Centralization

## Summary

Business identity and office-city strings in `config/seo.js` now derive from `business.js`; office opening-hours schema wording derives from `contact.js`. Organization and office schema relationships, identifiers, types, canonical URLs, page-specific descriptions, and indexability behavior remain unchanged.

Static SEO fallback tags are now emitted at build/dev HTML transformation time by a small Vite `transformIndexHtml` plugin using the existing `SEO_BASE`, `PAGE_SEO`, and `BUSINESS` exports. The generated production `dist/index.html` contains the static fallback metadata. No extra framework or dependency was added.

## Files inspected

- `client/src/config/business.js`, `contact.js`, `seo.js`
- `client/src/data/officeLocations.js`, `serviceRegistry.js`, `services.js`
- `client/src/components/seo/SEOHead.jsx`, `JsonLd.jsx`, `SchemaHelpers.js`
- `client/index.html`, `client/vite.config.js`, `client/package.json`
- `client/scripts/generateSitemap.mjs`, `client/public/sitemap.xml`, `client/public/robots.txt`
- `client/vercel.json` (SPA rewrite and existing service redirects)
- `client/tests/brandSeo.test.js`, `serviceRegistry.test.js`, `wave1Content.test.js`
- Other SEO/schema consumers including Home, Contact, ServiceDetail, About, Blog, Resources, and legal layouts
- Existing SEO, production-readiness, and repository baseline documentation

The requested `client/src/utils/SchemaHelpers.js` does not exist; the active helper is `client/src/components/seo/SchemaHelpers.js`.

## Files modified

- `client/src/config/contact.js`
- `client/src/config/seo.js`
- `client/src/components/seo/SchemaHelpers.js`
- `client/index.html`
- `client/vite.config.js`
- `client/tests/brandSeo.test.js`
- `client/tests/seoCentralization.test.js`
- `docs/batch_5_seo_static_metadata_centralization_report.md`

The build refreshed generated output under `client/dist/`. It also ran the existing sitemap-generation step; the resulting sitemap remained byte-identical.

## Configuration changes

- `HOME_DESCRIPTION` and `HOME_KEYWORDS` now interpolate the configured brand, alternate brand, and legal name while retaining the same text.
- The About metadata office list and Contact title city list now derive from `BUSINESS.physicalOfficeCities`, preserving the current wording and punctuation.
- Contact metadata brand keywords now derive from the configured brand fields. Page-specific titles, descriptions, canonical URLs, Open Graph images, and other social values remain the same.
- Added the existing schema-formatted hours string (`Mo-Su 09:00-21:00`) to `CONTACT.hours.schema`. Both active and compatibility LocalBusiness schema builders now consume it instead of duplicating the literal.
- Organization, LocalBusiness, ContactPage, Website, and Service schemas continue to use the configured business name, legal name, URLs, contact values, and office records. Existing types, `@id` values, parent links, and geo fields were preserved.
- `SEOHead.jsx` and `JsonLd.jsx` required no changes; route-level head updates and JSON-LD insertion/cleanup behavior remain as before.

## Static fallback decision

The Vite HTML transform hook provides a deterministic build-time path from the existing JavaScript config to static HTML without text replacement. The metadata tags were removed from the source `index.html` and are emitted by the Vite plugin in both Vite-served development HTML and the built production HTML. The existing Vercel rewrite serves the built SPA `index.html`; this is the configured deployment path.

The built title, SEO meta tags, and canonical link were captured before and after. After normalizing HTML entities and ordering, **all 13 SEO metadata/canonical values were identical**. The original static strings therefore remain present in the production HTML fallback.

## Indexability, robots, and sitemap

- Sitemap membership remains **44 unique URLs**.
- Service registry counts remain **23 indexable**, **66 noindex**, **2 redirects**, and **1 consolidated duplicate** within the existing 92-record accounting.
- The shared service route continues to set `noindex, follow` for non-indexable service pages and omits their canonical URL. Existing integration coverage still verifies this behavior.
- The registry does not contain a Wave 1/Wave 2 field. It cannot isolate the historically reported 25 Wave 2 slugs as a separate current group. All 66 current noindex records are still marked `noindex` in the registry and follow the shared `noindex, follow` route behavior; none enter the sitemap.
- `robots.txt` remains exactly:

  ```text
  User-agent: *
  Allow: /

  Sitemap: https://www.clearfiling.co.in/sitemap.xml
  ```

- No sitemap, route, redirect, canonical behavior, service slug, or indexing decision was changed.

## Verification

- `npm run build --prefix client` — **succeeded**. The existing build workflow reported 44 sitemap URLs. Vite retained its advisory for the 703.66 kB minified entry chunk.
- `npm test --prefix client` — **43 passed, 0 failed, 18 suites**.
- New SEO tests verify representative Home, Contact, About, and Service metadata; office schema output; Organization identifiers and relationships; canonical URLs; sitemap membership; robots directives; and current indexability counts.
- Existing tests continue to verify static metadata parity, hydrated `SEOHead` / `JsonLd`, and `noindex, follow` behavior for a Coming Soon service.
- Sitemap SHA-256 before build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`.
- Sitemap SHA-256 after build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` (44 URLs).
- Robots SHA-256 before and after: `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b`.

## Remaining SEO issues

- The Organization schema still publishes `foundingDate: 2020`; the company-history date remains unverified and was preserved.
- Existing SEO descriptions still contain unverified client-count and qualification claims; service SEO copy was not rewritten.
- Social profile URLs in `sameAs` and the Twitter handle remain existing hardcoded values. They were not changed because no owner-approved social-profile source of truth was established in this batch.
- Schema opening hours now have one source but remain unverified business information.
- Wave 2 membership is not represented in current service registry data, so those historically identified 25 services cannot be asserted individually from current source annotations.

No `.env` files or credentials were read. No Git operations, staging, commits, pushes, merges, pull requests, or deployments were performed.

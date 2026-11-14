# ClearFiling — Master SEO Optimization & Search Visibility Report

**Repository:** /Users/ritweek/Desktop/Clearfiling/ClearFiling  
**Configured production domain:** https://www.clearfiling.co.in/  
**Audit date:** 2026-11-14  
**Overall readiness:** **NEEDS ATTENTION** for organic growth readiness. Core metadata, registry, robots, sitemap, schema helpers and redirects exist and are covered by passing tests. The main remaining technical constraint is that route-specific content, metadata, JSON-LD and noindex directives are applied after JavaScript hydration. The production build also retains a 703.66 kB minified entry chunk warning. No URL, indexing, legal content or business claim was changed.

## 1. Executive summary

- **PASS:** Current public route inventory, SEO configuration, build-time static fallback metadata, Organization/office schemas, sitemap generation/exclusions, robots file, two service redirects and 92-record catalogue accounting were inspected. Client regression tests pass (43/43); production build succeeds.
- **NEEDS ATTENTION:** Only the root index document receives static metadata. Other routes rely on hydration for route content, canonicals, JSON-LD and noindex. Vercel SPA fallback rewrites every path to the root document; an HTTP 404 response for unknown URLs is not implemented in client code and was not externally verified.
- **NEEDS ATTENTION:** Of 23 currently indexable services, 20 loan pages have no custom meta title or description and no long description, eligibility, process or FAQ data. They use fallback metadata and a generic service layout. Current index decisions remain unchanged.
- **OWNER APPROVAL REQUIRED:** Any changes to indexability, category routes, URL normalization, prerendering, legal/tax copy, fees/timelines, credentials, local-business claims or category/location targeting.
- **IMPLEMENTED:** No source fixes were made because changes likely to improve crawlability would alter rendering/indexing behavior or require content/legal review. This report is the only intended file addition. Existing code was tested; sitemap integrity was checked after build.

## 2. Existing SEO implementation inventory

### Public routes

client/src/App.jsx declares /, /about, /contact, /services, /services/:slug, /privacy-policy, /terms, /disclaimer, /resources, /resources/:slug, /blog, /blog/:slug, and wildcard NotFound. About, Contact, Services, ServiceDetail, Legal, Resource, Blog and NotFound routes are lazy-loaded; Home is statically imported. The nine service categories are filter/data categories, not dedicated route hubs. No /services/:category route exists.

### Metadata, canonical behavior, and social metadata

- client/src/config/seo.js defines SEO_BASE and PAGE_SEO for Home, About, Contact, Services, Blog and Resources, plus Organization, WebSite, ContactPage and office schemas.
- client/src/components/seo/SEOHead.jsx updates title, description, keywords, canonical, Open Graph, Twitter Cards and robots in a React effect. It removes route canonicals for noindex service pages as configured.
- client/vite.config.js injects static root fallback title, description, keywords, author, canonical, Open Graph and Twitter metadata from existing config at build/dev transform time. This is deterministic but the same home fallback is served on every SPA route request.
- Service metadata is in client/src/data/services.js. ServiceDetail uses custom metaTitle/metaDescription when present and fallbacks otherwise.
- Live production response headers/HTML, Google-rendered HTML, canonical redirects and actual indexing state were not externally checked.

### Robots, sitemap, redirects and URL behavior

- client/public/robots.txt allows crawlers and points to https://www.clearfiling.co.in/sitemap.xml.
- client/scripts/generateSitemap.mjs generates core, legal, resource, blog and currently indexable service URLs; it excludes all 66 noindex services, 2 redirect slugs and the consolidated duplicate. Current output has 44 URLs.
- Registry and client/vercel.json agree on /services/udyam-registration → /services/msme-registration and /services/import-export-code → /services/iec-registration as 301 redirects. Redirect URLs are excluded from the sitemap.
- No explicit host-level trailing-slash or case-normalization policy appears in inspected Vercel configuration. Validate real behavior before changing it.
- client/src/pages/NotFound.jsx renders a client-side not-found page with noindex. Client code alone does not establish HTTP 404 status; this is a soft-404 risk, not a live HTTP finding.

### Structured data

Organization/LegalService and three AccountingService office entities derive from business/contact/office configuration. Home injects WebSite, Organization and office schemas after hydration; Contact and service pages inject route schemas after hydration. Tests cover connected IDs, legal name, offices, Service/BreadcrumbList/FAQ generation. Schemas were not submitted to external validators. Do not add ratings/reviews without eligible verified data.

### Internal links, errors, headings and images

- Service related links, redirects, registry accounting and a subset of blog/resource/footer links have automated checks. There was no crawl of every rendered page link.
- Source inspection shows page-level H1s on main route templates, but no automated heading-hierarchy audit covers all rendered states.
- No img elements were found in inspected React pages/components. Decorative SVGs are hidden from assistive technology where inspected. Office maps use lazy iframes with titles and placeholders.
- Loading fallback and error boundary components exist. Form/document states are implemented, but browser-based visual and keyboard acceptance was not performed.

## 3. Phase-by-phase audit findings

### Phase 1 — SEO baseline

- **PASS:** Routes, page metadata config, canonical handling, noindex-follow component logic, Open Graph/Twitter, schema helpers, sitemap/robots, redirects and internal-link test coverage exist.
- **NEEDS ATTENTION:** Route-specific content and metadata are client-rendered. Without JavaScript, routes return the home metadata fallback; route-prerendered HTML is not configured.
- **NEEDS ATTENTION:** Unknown URLs render the wildcard page in the client. Explicit HTTP 404 status is not established by SPA source. Treat as a deployment-level soft-404 risk until checked against HTTP responses.
- **NEEDS ATTENTION:** Trailing slash, uppercase path, query string, canonical, and redirect normalization are not comprehensively tested/configured. Do not add redirects until owner-approved policy and live behavior are known.
- **PASS with scope limit:** Current sitemap and tests cover 44 unique URLs and exclude noindex/redirect service paths.
- **BLOCKED:** Live broken-link crawl, real crawler rendering, production canonical/robots responses, mobile-browser testing and actual Core Web Vitals were not measured.

### Phase 2 — Search query and keyword mapping

Intent classifications below are based on existing service/category names and page purpose, not keyword-volume research. Capitalization variants should map to one page and be used naturally.

| Cluster | Primary/secondary queries | Long-tail/question examples | Intent | Existing destination and cannibalization guidance |
|---|---|---|---|---|
| Company formation | company registration in India; private limited company registration; LLP registration | how to register a private limited company in India; private limited vs LLP | Transactional/comparison | /services/private-limited-company is indexable; LLP is noindex. Keep distinct entity choices useful and differentiated. |
| GST | GST registration online; GST return filing; GST consultant | who needs GST registration; documents needed; how to file GST returns | Transactional/compliance | /services/gst-registration is indexable; filing pages noindex. Distinguish registration from ongoing filing. |
| Trademark/IP | trademark registration in India; objection reply; renewal | how to register; how to respond to an objection; renewal requirements | Transactional/legal service | Registration is indexable; later lifecycle services are noindex. Each needs distinct process and eligibility. |
| Income tax | income tax return filing; business ITR; company ITR | which ITR for a company/LLP; documents for ITR; reply to notice | Transactional/compliance | All noindex. Keep taxpayer types distinct only where useful. |
| Corporate compliance | annual compliance; LLP compliance; ROC/MCA compliance | annual filings for a company; company closure; director KYC | Transactional/retention | Current services noindex. One useful hub could connect distinct entity/event pages; verify statutory details. |
| Local intent | company registration in Deoria; GST consultant in Gorakhpur; business compliance Delhi | local registration help; office and online service availability | Local transactional | Use verified Contact/office information. Do not create city doorway pages or imply other offices. |
| Business registration | MSME/Udyam; FSSAI; IEC; trade license | documents for FSSAI; IEC application help | Transactional | Mostly noindex. Udyam/IEC legacy URLs redirect; use only destinations. |
| International business | UAE setup; US/UK/Singapore registration; overseas trademark | requirements to set up in UAE; cross-border setup advice | Commercial investigation/transactional | Noindex. Verify scope, licensing, country details and delivery before indexing. |
| Digital solutions | website development; ecommerce development; custom web apps | business website process; ecommerce store development | Commercial investigation | Noindex. Separate pages only if actual deliverables and examples are distinct. |
| Loan services | business loan; MSME loan; working capital; vehicle/equipment finance | documents for a business loan; funding application assistance | Commercial investigation/lead generation | 20 pages currently indexable but thin. Review parent/product query overlap and financial-service claims. |

No Search Console queries, search volumes, competitor data or rankings were accessed; these are relevance/intent mappings, not quantified demand.

### Phase 3 — Service page indexing strategy

Current registry: 91 entries = 89 canonical service pages + 2 redirects. The historical total of 92 includes one consolidated duplicate that is no longer a route. Counts are 23 indexable, 66 noindex, 2 redirects. The 44 sitemap URLs also include non-service content. The current registry does not tag Wave 1/Wave 2 membership, so the earlier Wave 2 subset cannot be independently isolated. No indexing change is recommended or made here.

The full route-by-route audit matrix is in Appendix A. It records each URL, current status, custom/fallback metadata, content field presence, search intent and a keep/review recommendation. Content completeness is based on source fields, not factual accuracy or rendered quality.

| Current status | Detailed fields | Partial | Brief | Recommendation |
|---|---:|---:|---:|---|
| Index (23) | 3 | 0 | 20 | Preserve current approved status. Improve loan metadata/content only in an approved batch; do not broaden indexing based on keywords alone. |
| Noindex (66) | 42 | 3 | 21 | Keep all noindex. Review detailed entries for uniqueness, current law, intent, internal links and claims; field presence is not sufficient to index. |
| Redirect (2) | 0 | 0 | 2 | Preserve 301 mappings and exclude from sitemap. |

### Phase 4 — Category landing page opportunities

The nine categories exist in data but have no dedicated routes. Proposed URLs match current CATEGORY_SLUG_MAP. Creating these changes routes/sitemap and requires owner approval. The following title/description pairs are neutral drafts for owner/editor review, not approved copy or new business claims.

| Proposed URL | Query cluster/intent | Independent value and content outline | Related services / schema | Recommendation |
|---|---|---|---|---|
| /services/business-formation | company registration, private limited vs LLP; transactional/comparison | Compare legal forms, eligibility, process and documents in a neutral guide | Private Limited, LLP, OPC, public limited, partnership, Section 8; BreadcrumbList | High-priority candidate after legal review; avoid duplicating service copy. |
| /services/business-registrations | MSME/Udyam, FSSAI, IEC, trade license; transactional | Explain registration types by business need and link distinct services | MSME, Startup India, IEC, trade license, shop establishment, DSC, FSSAI; BreadcrumbList | Candidate after checking breadth and redirect terminology. |
| /services/trademark-ip | trademark registration and lifecycle; transactional/legal | Explain registration, later-stage actions, IP type distinctions | Trademark lifecycle, copyright, patent, design; BreadcrumbList; verified FAQ only | Candidate; retain child noindex pending review. |
| /services/gst-indirect-tax | GST registration, returns, compliance; transactional | Distinguish registration, recurring returns and notices; cover scope/documents | GST registration, filing, annual return, notices, amendment, revocation, cancellation, LUT; BreadcrumbList | High-priority candidate after tax-content review. |
| /services/income-tax | ITR, business/company/LLP filings; transactional | Guide by taxpayer type, information needed, limits and related services | Individual/business/company/LLP ITR, NGO, TDS, TAN, notices, revised return; BreadcrumbList | Candidate; all children are currently noindex. Requires professional review. |
| /services/corporate-compliance | annual and ROC/MCA compliance; transactional/retention | Explain lifecycle by entity and event, link relevant filings | Annual/LLP/OPC compliance, DIN KYC, director/office changes, share/MOA/AOA, closure; BreadcrumbList | High-priority if it adds substantive navigation. |
| /services/international-business | overseas setup and trademark; commercial investigation | Explain country scope, process boundaries and external dependencies | UAE/US/UK/Singapore, overseas trademark, international advisory; BreadcrumbList | Defer until scope and country-specific content are verified. |
| /services/digital-solutions | websites, ecommerce, custom applications; commercial investigation | Describe separate deliverables and process only if offered; no invented portfolio | Website, ecommerce, custom applications, DSC cross-list; BreadcrumbList | Defer until distinct scope/examples are approved. |
| /services/loan-services | business/MSME/working capital loans; commercial investigation | Explain documentation/advisory role and lender dependency; no rates/approval promises | Loan services; BreadcrumbList, no Product/Offer/rates without approved data | Defer until service scope, permissions and claims are approved. |

| Proposed URL | Draft title | Draft description |
|---|---|---|
| /services/business-formation | Business Formation Services in India - ClearFiling | Compare business formation options, review eligibility and process information, and explore related registration services. |
| /services/business-registrations | Business Registration Services in India - ClearFiling | Explore business registration services, documents and process information for relevant registration types. |
| /services/trademark-ip | Trademark and Intellectual Property Services - ClearFiling | Explore trademark and intellectual property services, including registration and selected post-filing matters. |
| /services/gst-indirect-tax | GST and Indirect Tax Services - ClearFiling | Explore GST registration, return filing and related compliance services with information on relevant processes and documents. |
| /services/income-tax | Income Tax Filing and Related Services - ClearFiling | Explore income tax filing and related services for individuals and organizations, with service-specific information and next steps. |
| /services/corporate-compliance | Corporate Compliance Services in India - ClearFiling | Explore company and LLP compliance services, including annual obligations and selected corporate changes. |
| /services/international-business | International Business Services - ClearFiling | Review available international business and overseas trademark service information, subject to confirmed service scope. |
| /services/digital-solutions | Digital Solutions and Development Services - ClearFiling | Explore website, ecommerce and custom application development services and review their distinct scopes. |
| /services/loan-services | Loan Documentation and Advisory Services - ClearFiling | Explore loan-related documentation and advisory assistance. Funding terms and decisions depend on the relevant lender. |

### Phase 5 — Technical SEO and crawler accessibility

- **PASS:** Build-time root metadata derives from existing config; SEOHead updates route metadata; canonical and robots behavior have automated coverage.
- **NEEDS ATTENTION:** Static output is one SPA entry, not route-prerendered. Non-JavaScript crawlers receive repeated home fallback metadata and no route-specific content.
- **NEEDS ATTENTION:** noindex is set by a React effect. Crawlers that do not execute the app may not see noindex on excluded routes. Sitemap exclusion remains correct but does not replace page directives.
- **NEEDS ATTENTION:** SPA rewrite likely serves the entry document for unknown routes. Client-side NotFound text/noindex does not guarantee HTTP 404; verify against deployment.
- **PASS:** Noindex/redirect services are excluded from sitemap by generator/tests. Build generated 44 URLs; hash remained unchanged.
- **OWNER APPROVAL REQUIRED:** Evaluate route prerendering/SSG for 44 indexable URLs. Vite-compatible prerendering or server rendering adds build/artifact complexity but can make content, metadata, JSON-LD and robots available without hydration. Do not add a renderer/dependency until approved and tested.
- **OWNER APPROVAL REQUIRED:** Define host/slash/case/query normalization policy, then test live behavior and add only approved permanent redirects.
- **PASS with validation limit:** JSON-LD escaping and schema generation have tests. External Schema.org/Rich Results validation was not performed.

### Severity-ranked technical issues

| Severity | Finding and evidence | Impact | Status / action |
|---|---|---|---|
| High | Route content, per-route metadata, JSON-LD and noindex are hydration-only in the React SPA; Vite emits one static fallback document. | Crawlers without full JavaScript rendering can receive duplicated home metadata, miss page content and miss noindex directives. | Needs attention before relying on broad crawler coverage. Evaluate prerender/SSG; owner approval required because it changes build/routing output. |
| Medium | Vercel rewrites all paths to index.html and client NotFound cannot set HTTP status. | Unknown/removed paths may appear as soft 404s. Actual response code remains unverified. | Validate live HTTP behavior; approve server/edge 404 solution if needed. |
| Medium | 20 indexable loan pages lack custom title/description, long description, eligibility, process and FAQs. | Pages may offer limited distinct search value and compete across overlapping loan queries. | Review facts and content; preserve current index status until owner decision. |
| Medium | Main JavaScript entry is 703.66 kB minified (164.08 kB gzip) and exceeds Vite's 500 kB advisory. | Slower startup on constrained devices/networks may affect usability and performance metrics. | Analyze bundle and defer only measurable unnecessary cost; no change made. |
| Low | Trailing slash, uppercase path, query and host canonicalization lack comprehensive rules/tests. | URL variants may fragment signals if deployment serves them separately. | Measure production behavior, then apply only an approved canonical policy. |
| Low | No full rendered-site link/heading/accessibility crawl or Core Web Vitals field data was collected. | Some issues may remain undiscovered; current source/tests cannot establish user-facing outcomes. | Run authorized browser and field measurement as a follow-up. |

### Phase 6 — Content quality and internal linking

Three currently indexable flagship services have long descriptions, eligibility, process and FAQs. Twenty indexable loan pages lack those fields and custom title/description. Of 66 noindex records, 42 have those field groups, 3 have long descriptions but incomplete sections, and 21 have no long description. These flags do not prove accuracy, uniqueness, usefulness or current law.

- First priority: review currently indexed loan content and metadata. Keep current status unless an owner-approved decision changes it.
- Review detailed noindex records for uniqueness, legal/tax accuracy, current fees/timelines, internal links and clear service scope before asking for index approval.
- Do not index brief/partial services without decision-useful content. International, digital and loan claims need scope verification. Avoid location doorway pages.
- Breadcrumb and related-service components exist; exact contextual value and page-wide rendered links still need editorial review.
- Legal/tax/regulatory details and fee/timeline statements require qualified/current review. No new advice or claims were written.

### Phase 7 — Performance and user experience

Build output, not Core Web Vitals:

| Asset | Minified | Gzip | Finding |
|---|---:|---:|---|
| Main JS entry | 703.66 kB | 164.08 kB | Above Vite 500 kB warning threshold; analyze and reduce/defer demonstrably unnecessary code. |
| Framer Motion | 114.46 kB | 37.81 kB | Significant shared animation cost; assess actual route/viewport use before replacement. |
| React | 142.22 kB | 45.57 kB | Framework chunk. |
| Lucide | 29.31 kB | 5.81 kB | Separate shared icon chunk. |
| CSS | 60.89 kB | 9.96 kB | No build warning. |

Routes are lazy-loaded, and manualChunks separates React/router/Framer Motion/Lucide, but the entry remains large. No bundle refactor was made without bundle analysis and regression scope. No React UI img elements were found; office map iframes are lazy-loaded. Google Fonts are preconnected/preloaded; actual load timing was not measured. No LCP/INP/CLS lab or field numbers were collected. Mobile viewport, keyboard and screen-reader acceptance were not performed. Source has labels, aria-expanded controls, labeled forms/iframes and loading/error components, which is partial evidence only.

### Phase 8 — Search Console and organic growth

**BLOCKED:** No Search Console, Bing Webmaster Tools or Business Profile account was accessed. No sitemap submission, indexing request, external account change, form submission or production API request occurred. Connection/ownership status is unknown.

Owner checklist:

1. Verify the domain property in Search Console using owner-controlled verification.
2. Check live robots/canonical behavior, then submit https://www.clearfiling.co.in/sitemap.xml from the owner account.
3. Monitor Page Indexing and Crawl Stats for duplicate canonical, discovered-not-indexed and soft-404 issues.
4. Inspect representative pages in URL Inspection and request indexing only for approved, complete pages.
5. Track queries, impressions, clicks, position and CTR by page/service/location to refine keyword targets.
6. Monitor Search Appearance/Rich Results; only correct schema after verifying the facts.
7. Set up Bing Webmaster Tools and sitemap monitoring under owner access.
8. Check business profile eligibility and citations using only verified offices/contact information; do not create false city listings.
9. Pursue relevant professional/industry citations and editorial links; avoid spam/paid schemes.
10. Report monthly index coverage, organic traffic/query changes, organic leads, key-page performance and reviewed content.

## 4. Tests and build results

- npm test --prefix client — **PASS**, 43 passed, 18 suites, 0 failed/skipped.
- npm run build --prefix client — **PASS**, production Vite build completed. Existing warning: main minified JS entry is 703.66 kB, above the 500 kB advisory.
- Build ran the existing sitemap generation step and reported 44 URLs. Sitemap SHA-256 before/after was 8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367. Robots SHA-256 was c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b.
- No server/admin tests/builds were run. No production site, API, Google/Bing account, external crawler or Core Web Vitals service was contacted.

## 5. Changes made and not made

- **IMPLEMENTED:** This report, based on current source and executed client verification.
- **Not changed:** Source, service/legal copy, business claims, URLs/slugs, redirects, canonical rules, indexability, robots, sitemap membership, dependencies, deployment configuration, external accounts or deployment.
- No low-risk source change was identified that would not affect crawler/indexing behavior or require content/owner approval. Prerendering, category routes, loan content/metadata and URL normalization remain recommendations.

## 6. Owner approval required

1. Confirm qualified reviewers for date-sensitive tax/regulatory/fee/timeline, credential and marketing claims.
2. Decide whether to preserve, revise content for, or change the current 20 indexable loan pages. No status change is made here.
3. Approve whether to create category routes; approve content and index status before publishing.
4. Approve a prerender/SSG evaluation with build, routing and deployment acceptance criteria.
5. Approve URL normalization after production HTTP behavior is measured.
6. Confirm Search Console/Bing/Business Profile access and owner responsible for setup/monthly reporting.
7. Confirm social proof, service scope and local SEO wording before adding copy/schema.

## 7. Remaining work, prioritized

| Priority | Work | Gate/status |
|---|---|---|
| P1 | Make unique page content and robots/canonicals available reliably; evaluate prerendering and 404 response | Owner approval; build/deployment behavior change |
| P1 | Review content and metadata on 20 indexable loan pages | Owner approval for copy/claims; preserve index status until decision |
| P1 | Verify legal/tax/fee/timeline/professional claims on indexable pages | Owner/professional review |
| P2 | Review 42 detailed noindex pages, then partial/brief pages | Keep noindex until quality and approval; do not auto-index Wave 2 |
| P2 | Measure live canonical/slash/case/redirect/404 behavior and test approved rules | Requires authorized live/deployment access |
| P2 | Decide category pages based on independent user value | Owner approval; avoid doorway pages |
| P2 | Analyze entry bundle and defer/remove only demonstrably unnecessary cost | Requires measured regression verification |
| P3 | Configure Search Console/Bing, submit sitemap, monitor organic outcomes | Owner account actions; not performed |
| P3 | Consolidate duplicated sitemap origin/social settings after fact confirmation | Maintenance cleanup; current output matches |

## Final readiness assessment

**Core SEO configuration, service-registry controls, sitemap/robots outputs, redirects and client regression verification are in good order. The site is not fully ready for reliable organic discovery across all crawlers because route-specific SEO/content are client-rendered, the indexable loan set is thin, and live search-platform behavior was not verified.** Keep current URLs and indexing decisions. The next substantive decision is whether to approve route-prerendering evaluation and a content review of the 20 indexable loan pages. No ranking or indexing outcome is guaranteed.

## Appendix A — Per-service SEO and content audit matrix

This matrix covers all 91 registry entries (89 canonical routes plus 2 redirect records). The final consolidated duplicate is documented after the table. “Custom metadata” means custom title + description + keywords; “fallback” means title/description defaults with keywords present. Long/Elig/Proc/FAQ/Related indicate source-field presence, not quality. Intent is inherited from the category cluster in Phase 2.

| Service URL | Current status | Metadata | Long | Elig | Proc | FAQ | Related | Intent and recommendation |
|---|---|---|---|---|---|---|---|---|
| /services/private-limited-company | index | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Maintain current index status; review service accuracy and query distinction. |
| /services/llp-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/opc-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/partnership-firm | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/public-limited-company | noindex | Custom title/description/keywords | N | N | N | N | N | Formation/registration. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/producer-company | noindex | Custom title/description/keywords | N | N | N | N | N | Formation/registration. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/section-8-organization | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trust-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Formation/registration. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/msme-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/startup-india-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/iec-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trade-license | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/shop-establishment | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/digital-signature | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/iso-certification | noindex | Custom title/description/keywords | N | N | N | N | N | Registration transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/professional-tax-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/fssai-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Registration transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/udyam-registration | redirect | Custom title/description/keywords | N | N | N | N | N | Registration transaction. Legacy service query; preserve configured 301 to /services/msme-registration. |
| /services/import-export-code | redirect | Custom title/description/keywords | N | N | N | N | N | Registration transaction. Legacy service query; preserve configured 301 to /services/iec-registration. |
| /services/barcode-registration | noindex | Custom title/description/keywords | N | N | N | N | N | Registration transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/bis-certification | noindex | Custom title/description/keywords | N | N | N | N | N | Registration transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/trademark-registration | index | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Maintain current index status; review service accuracy and query distinction. |
| /services/trademark-renewal | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trademark-objection | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trademark-opposition | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trademark-hearing | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/trademark-rectification | noindex | Custom title/description/keywords | N | N | N | N | N | IP service/legal transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/copyright-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | IP service/legal transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/patent-registration | noindex | Custom title/description/keywords | N | N | N | N | N | IP service/legal transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/industrial-design-registration | noindex | Custom title/description/keywords | N | N | N | N | N | IP service/legal transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/trademark-assignment | noindex | Custom title/description/keywords | N | N | N | N | N | IP service/legal transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/gst-registration | index | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Maintain current index status; review service accuracy and query distinction. |
| /services/gst-return-filing | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-annual-return | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-notice-reply | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-amendment | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-revocation | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-cancellation | noindex | Custom title/description/keywords | N | N | N | N | N | Tax/compliance transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/gst-lut | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/gst-foreign-business | noindex | Custom title/description/keywords | N | N | N | N | N | Tax/compliance transaction. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/virtual-office-gst | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/income-tax-filing | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/business-itr | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/company-itr | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/llp-itr | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/ngo-tax-filing | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/tds-return | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/tan-registration | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/income-tax-notice | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/revised-return | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Tax/compliance transaction. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/annual-compliance | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/llp-compliance | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/opc-compliance | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/din-kyc | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/director-change | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/registered-office-change | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/share-transfer | noindex | Custom title/description/keywords | N | N | N | N | N | Corporate compliance/retention. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/moa-amendment | noindex | Custom title/description/keywords | N | N | N | N | N | Corporate compliance/retention. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/aoa-amendment | noindex | Custom title/description/keywords | N | N | N | N | N | Corporate compliance/retention. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/authorized-capital-increase | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/dormant-company-filing | noindex | Custom title/description/keywords | N | N | N | N | N | Corporate compliance/retention. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/company-closure | noindex | Custom title/description/keywords | Y | Y | Y | Y | Y | Corporate compliance/retention. Structurally detailed candidate for unique-content/legal review; keep noindex unless separately approved. |
| /services/uae-company-setup | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/usa-company-registration | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/uk-company-registration | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/singapore-business-setup | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/overseas-trademark | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/international-advisory | noindex | Custom title/description/keywords | N | N | N | N | N | International commercial investigation. Keep noindex; add useful, accurate, differentiated content before index review. |
| /services/website-development | noindex | Custom title/description/keywords | Y | N | N | N | N | Commercial investigation. Keep noindex; fill missing decision-useful sections and verify facts before owner review. |
| /services/ecommerce-website-development | noindex | Custom title/description/keywords | Y | N | N | N | N | Commercial investigation. Keep noindex; fill missing decision-useful sections and verify facts before owner review. |
| /services/custom-web-applications | noindex | Custom title/description/keywords | Y | N | N | N | N | Commercial investigation. Keep noindex; fill missing decision-useful sections and verify facts before owner review. |
| /services/personal-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/home-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/business-loan | index | Fallback title/description; keywords | N | N | N | N | Y | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/msme-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/startup-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/working-capital-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/education-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/vehicle-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/car-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/bike-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/gold-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/loan-against-property | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/machinery-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/equipment-finance | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/project-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/cash-credit | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/overdraft-facility | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/professional-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/commercial-vehicle-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |
| /services/construction-loan | index | Fallback title/description; keywords | N | N | N | N | N | Commercial investigation/lead generation. Keep current index status; improve substantive content and custom metadata before any further expansion. |

| Consolidated duplicate record: digital-signature | Merged; no separate route | N/A | N/A | N/A | N/A | N/A | N/A | Duplicate Class 3 DSC record consolidated into single canonical record with secondary category visibility in Digital Solutions. |


## Appendix B — Exact current service metadata and internal-link targets

Values below are rendered from the current service records and ServiceDetail fallback logic; title and description text is included for every catalogue route. Indexable routes use their existing canonicalSlug or canonical service URL. Noindex routes intentionally omit canonical. Redirect rows use the configured 301 destination; their source record metadata is not served as a page. Related links list configured service targets; the UI routes users to a detail page only when the target is indexable and otherwise links to /services. “None declared” means no relatedServices array.

| Service URL | Current title | Current description | Canonical / redirect behavior | Configured related-service targets |
|---|---|---|---|---|
| /services/private-limited-company | Private Limited Company Registration Online India / ClearFiling | Register a Private Limited Company online in India. MCA SPICe+ filing, DIN allotment, PAN, TAN, and 21-character CIN issuance with professional CA/CS guidance. | https://www.clearfiling.co.in/services/private-limited-company | LLP Registration (/services/llp-registration); GST Registration (/services/gst-registration); Annual Compliance (/services/annual-compliance) |
| /services/llp-registration | LLP Registration Online India / Limited Liability Partnership / ClearFiling | Incorporate a Limited Liability Partnership (LLP) online in India. MCA FiLLiP filing, Form 3 LLP agreement drafting, and LLPIN issuance with expert CA/CS guidance. | No canonical (noindex) | Private Limited Company (/services/private-limited-company); LLP Compliance (/services/llp-compliance); GST Registration (/services/gst-registration) |
| /services/opc-registration | One Person Company (OPC) Registration Online / ClearFiling | Register your One Person Company (OPC) online in India. Single founder setup, MCA SPICe+ filing, nominee consent, and 21-character CIN issuance with CA/CS support. | No canonical (noindex) | Private Limited Company (/services/private-limited-company); LLP Registration (/services/llp-registration); Annual Compliance (/services/annual-compliance) |
| /services/partnership-firm | Partnership Firm Registration & Deed Drafting / ClearFiling | Register a Partnership Firm under the Indian Partnership Act, 1932. Professional Partnership Deed drafting, PAN issuance, and Registrar of Firms (RoF) registration. | No canonical (noindex) | LLP Registration (/services/llp-registration); Private Limited Company (/services/private-limited-company); MSME Registration (/services/msme-registration) |
| /services/public-limited-company | Public Limited Company Registration Online India / ClearFiling | Establish your Public Limited Company with ClearFiling. Comprehensive registration support including DSC, DIN, MOA, and AOA drafting. | No canonical (noindex) | None declared |
| /services/producer-company | Producer Company Registration Online India / ClearFiling | Register a Producer Company to support agricultural cooperatives. 100% compliant CA advisory for farmer groups. | No canonical (noindex) | None declared |
| /services/section-8-organization | Section 8 Company Incorporation Online India / NGO Registration / ClearFiling | Incorporate a Section 8 Company online under Companies Act, 2013. Section 8(1) licence, dividend prohibition, 12AB/80G approvals, and CSR-1 registration. | No canonical (noindex) | Trust Registration (/services/trust-registration); NGO Tax Filing (/services/ngo-tax-filing); Private Limited Company (/services/private-limited-company); Annual Compliance (/services/annual-compliance) |
| /services/trust-registration | Trust Registration Online India / Charitable & Private Trust Deed / ClearFiling | Register a Private Trust under Indian Trusts Act, 1882 or Public Charitable Trust under state laws and Registration Act, 1908. Professional deed drafting & 12AB/80G filings. | No canonical (noindex) | Section 8 Company (/services/section-8-organization); NGO Tax Filing (/services/ngo-tax-filing); Partnership Firm (/services/partnership-firm); Income Tax Filing (/services/income-tax-filing) |
| /services/msme-registration | MSME Registration Online / Udyam Registration Certificate / ClearFiling | Get your MSME Udyam Registration Certificate online under the MSMED Act, 2006. Zero government fee, delayed payment protection, and 50% trademark fee concession. | No canonical (noindex) | Startup India Registration (/services/startup-india-registration); Trademark Registration (/services/trademark-registration); GST Registration (/services/gst-registration) |
| /services/startup-india-registration | Startup India Registration Online / DPIIT Certificate / ClearFiling | Apply for Startup India DPIIT recognition under G.S.R. 108(E). Fast-track patent rebates, self-compliance benefits, and Section 80-IAC tax holiday guidance. | No canonical (noindex) | Private Limited Company (/services/private-limited-company); MSME Registration (/services/msme-registration); Trademark Registration (/services/trademark-registration) |
| /services/iec-registration | IEC Code Online Registration / Import Export License / ClearFiling | Apply for Import Export Code (IEC) online via DGFT portal. 10-digit lifetime PAN-based code, ₹500 government fee, and mandatory annual April-June update advisory. | No canonical (noindex) | GST Registration (/services/gst-registration); Private Limited Company (/services/private-limited-company); MSME Registration (/services/msme-registration) |
| /services/trade-license | Municipal Trade License Online India / Health & Commercial Permit / ClearFiling | Obtain your Municipal Trade License online under state Municipal Corporation Acts. Complete guidance on validity, renewal, zoning, and health trade permits. | No canonical (noindex) | Shop & Establishment (/services/shop-establishment); FSSAI Registration (/services/fssai-registration); GST Registration (/services/gst-registration); Professional Tax Registration (/services/professional-tax-registration) |
| /services/shop-establishment | Shop and Establishment Registration Online India / State Labour Certificate / ClearFiling | Apply for Shop and Establishment Registration online across Indian states. State-specific compliance for filing deadlines, worker thresholds, and commercial address proof. | No canonical (noindex) | Trade License (/services/trade-license); Professional Tax Registration (/services/professional-tax-registration); GST Registration (/services/gst-registration); MSME Registration (/services/msme-registration) |
| /services/digital-signature | Class 3 Digital Signature Certificate (DSC) Online / ClearFiling | Get your Class 3 Digital Signature Certificate (DSC) online. USB crypto token, video verification, and mandatory compliance for MCA, ITR-6, and e-tenders. | No canonical (noindex) | Private Limited Company (/services/private-limited-company); Annual Compliance (/services/annual-compliance); GST Registration (/services/gst-registration) |
| /services/iso-certification | ISO 9001:2015 Quality Certification Online / ClearFiling | Get certified under ISO standards. Audit coordination and certification processing for ISO 9001, 14001, and 27001. | No canonical (noindex) | None declared |
| /services/professional-tax-registration | Professional Tax Registration Online (PTEC & PTRC) / ClearFiling | Register for Professional Tax online across Maharashtra, Karnataka, West Bengal, and other states. PTEC for businesses and PTRC for employer payroll compliance. | No canonical (noindex) | Shop & Establishment (/services/shop-establishment); Trade License (/services/trade-license); GST Registration (/services/gst-registration); TDS Return (/services/tds-return) |
| /services/fssai-registration | FSSAI Food License Online Registration / FoSCoS Portal / ClearFiling | Apply for FSSAI Food License & Registration online via FoSCoS. 3-tier turnover limits, perpetual validity, and manufacturer annual return (Form D-1) guidance. | No canonical (noindex) | Trademark Registration (/services/trademark-registration); GST Registration (/services/gst-registration); Private Limited Company (/services/private-limited-company) |
| /services/udyam-registration | Not served; redirect record | Not served; source route redirects. | 301 → /services/msme-registration | None declared |
| /services/import-export-code | Not served; redirect record | Not served; source route redirects. | 301 → /services/iec-registration | None declared |
| /services/barcode-registration | GS1 Barcode Registration Online India / ClearFiling | Acquire official GS1 product barcodes. Clear registration and pricing advisory. | No canonical (noindex) | None declared |
| /services/bis-certification | BIS ISI Certification Online India / CRS Registration / ClearFiling | Get BIS ISI and CRS certification for your products. Comprehensive laboratory testing support. | No canonical (noindex) | None declared |
| /services/trademark-registration | Trademark Registration Online India / Register Logo & Brand Name / ClearFiling | Register your trademark online under Trade Marks Act, 1999. Comprehensive trademark search, Form TM-A e-filing, 50% MSME fee rebate, and brand protection. | https://www.clearfiling.co.in/services/trademark-registration | Trademark Renewal (/services/trademark-renewal); Trademark Objection (/services/trademark-objection); MSME Registration (/services/msme-registration) |
| /services/trademark-renewal | Trademark Renewal Online India / Renew Brand TM / ClearFiling | Renew your trademark registration online via Form TM-R under Section 25. Standard 1-year filing window, late renewal within 6 months, and restoration guidance. | No canonical (noindex) | Trademark Registration (/services/trademark-registration); Trademark Objection (/services/trademark-objection); Annual Compliance (/services/annual-compliance) |
| /services/trademark-objection | Trademark Objection Reply Online / Section 9 & 11 Reply / ClearFiling | File a legal reply to trademark examination reports under Section 9 & 11. Strictly 30-day statutory deadline under Rule 33(4), evidence drafting, and attorney defense. | No canonical (noindex) | Trademark Registration (/services/trademark-registration); Trademark Renewal (/services/trademark-renewal); Startup India Registration (/services/startup-india-registration) |
| /services/trademark-opposition | Trademark Opposition Filing & Defense India / Form TM-O / ClearFiling | File or defend trademark opposition under Section 21 of Trade Marks Act, 1999. Form TM-O filing within 4-month window, counter-statements, Rule 45-47 evidence, and IP advocacy. | No canonical (noindex) | Trademark Registration (/services/trademark-registration); Trademark Hearing (/services/trademark-hearing); Trademark Objection (/services/trademark-objection); Copyright Registration (/services/copyright-registration) |
| /services/trademark-hearing | Trademark Hearing Representation Online India / IP Attorney Defense / ClearFiling | Expert legal representation for Trade Marks Registry hearings under Sections 18(4) & 21(5). Video conference show-cause defense, case synopsis, and Form TM-M adjournments. | No canonical (noindex) | Trademark Objection (/services/trademark-objection); Trademark Opposition (/services/trademark-opposition); Trademark Registration (/services/trademark-registration); Trademark Renewal (/services/trademark-renewal) |
| /services/trademark-rectification | Trademark Rectification Online India / Correct TM Register / ClearFiling | Correct details in the trademark database. Sincere filing of TM-O and TM-P forms. | No canonical (noindex) | None declared |
| /services/copyright-registration | Copyright Registration Online India / Software, Literary & Artistic Works / ClearFiling | Register copyright online in India under Copyright Act, 1957. Form XIV filing for software code, books, music, logos, and artwork with mandatory 30-day objection tracking. | No canonical (noindex) | Trademark Registration (/services/trademark-registration); Trademark Objection (/services/trademark-objection); Startup India Registration (/services/startup-india-registration); Digital Signature (/services/digital-signature) |
| /services/patent-registration | Patent Registration Online India / Patent Filing Process / ClearFiling | File your provisional or complete patent specification. Sincere patent drafting support from registered patent agents. | No canonical (noindex) | None declared |
| /services/industrial-design-registration | Industrial Design Registration Online India / ClearFiling | Protect product shapes and designs under the Designs Act. Register designs online. | No canonical (noindex) | None declared |
| /services/trademark-assignment | Trademark Assignment online India / Transfer TM Ownership / ClearFiling | Transfer your trademark rights legally. Professional deed drafting and registrar filing. | No canonical (noindex) | None declared |
| /services/gst-registration | GST Registration Online India / Apply for GSTIN / ClearFiling | Apply for GST registration online under CGST Act, 2017. 15-digit GSTIN issuance, Aadhaar authentication, turnover threshold audit, and zero government fee. | https://www.clearfiling.co.in/services/gst-registration | GST Return Filing (/services/gst-return-filing); GST Annual Return (/services/gst-annual-return); Private Limited Company (/services/private-limited-company) |
| /services/gst-return-filing | GST Return Filing Online India / GSTR-1 & GSTR-3B / ClearFiling | File GSTR-1 and GSTR-3B returns online under CGST Act. Monthly & QRMP filing, GSTR-2B ITC reconciliation, and second proviso 180-day rule compliance. | No canonical (noindex) | GST Registration (/services/gst-registration); GST Annual Return (/services/gst-annual-return); Annual Compliance (/services/annual-compliance) |
| /services/gst-annual-return | GSTR-9 Annual Return Filing & GSTR-9C Self-Certification / ClearFiling | File GSTR-9 annual return and self-certified GSTR-9C under Section 44 CGST Act. Turnover threshold audits, exemption criteria, and 3-way financial reconciliation. | No canonical (noindex) | GST Return Filing (/services/gst-return-filing); GST Registration (/services/gst-registration); Annual Compliance (/services/annual-compliance) |
| /services/gst-notice-reply | GST Notice Reply Online India / SCN DRC-01, ASMT-10, Section 74A Defense / ClearFiling | Draft and file legal replies to GST notices online. Section 61 ASMT-10, Section 73/74 demands (up to FY 23-24), Section 74A unified demands (FY 24-25+), and MOV-07 transit defense. | No canonical (noindex) | GST Registration (/services/gst-registration); GST Return Filing (/services/gst-return-filing); GST Revocation (/services/gst-revocation); GST Annual Return (/services/gst-annual-return) |
| /services/gst-amendment | GST Amendment Online India / Change Address, Directors & Name / ClearFiling | Update GST registration details online on Form GST REG-14 within 15 days under Rule 19. Change business address, add directors/partners, and update bank details with CA guidance. | No canonical (noindex) | GST Registration (/services/gst-registration); GST Notice Reply (/services/gst-notice-reply); Registered Office Change (/services/registered-office-change); Director Change (/services/director-change) |
| /services/gst-revocation | GST Revocation Online India / Revoke Cancelled GSTIN / ClearFiling | Restore cancelled GST registration on Form GST REG-21 within 90 days under Section 30. Clear overdue return backlogs, resolve officer notices, and unfreeze ITC. | No canonical (noindex) | GST Notice Reply (/services/gst-notice-reply); GST Return Filing (/services/gst-return-filing); GST Registration (/services/gst-registration); GST Amendment (/services/gst-amendment) |
| /services/gst-cancellation | Cancel GST Registration Online / Surrender GSTIN / ClearFiling | Surrender your GST registration online. Reconcile final liabilities and file clean surrenders. | No canonical (noindex) | None declared |
| /services/gst-lut | GST LUT Filing Online India / Form GST RFD-11 for Exporters / ClearFiling | File GST Letter of Undertaking (LUT) online on Form GST RFD-11 under Rule 96A. Export goods and services without IGST payment and preserve working capital. | No canonical (noindex) | IEC Registration (/services/iec-registration); GST Registration (/services/gst-registration); GST Return Filing (/services/gst-return-filing); Virtual Office + GST (/services/virtual-office-gst) |
| /services/gst-foreign-business | GST Registration for Foreign Entities India / ClearFiling | Compliance support for foreign corporate entities. Setup NRTP GST accounts legally. | No canonical (noindex) | None declared |
| /services/virtual-office-gst | Virtual Office for GST Registration India / Multi-State PPOB & APOB / ClearFiling | Get a compliant virtual commercial office for GST registration across India. Commercial lease, landlord NOC, electricity bill, and Rule 18 signage board for Amazon/Flipkart sellers. | No canonical (noindex) | GST Registration (/services/gst-registration); GST Amendment (/services/gst-amendment); GST LUT (/services/gst-lut); Trade License (/services/trade-license) |
| /services/income-tax-filing | Individual ITR Filing Online / File Income Tax Return / ClearFiling | File your individual income tax return (ITR-1 to ITR-4) online. New vs Old regime tax optimization, ₹75,000 standard deduction, and AIS/26AS reconciliation. | No canonical (noindex) | Business ITR (/services/business-itr); TDS Return (/services/tds-return); Digital Signature (/services/digital-signature) |
| /services/business-itr | Business Tax Return Filing Online / ITR-3, ITR-4 & ITR-6 / ClearFiling | File business ITR online under Income-tax framework. Section 58 presumptive limits for businesses (₹3 Cr) and specified professions (₹75 Lakhs), Section 63 audits, and corporate ITR-6. | No canonical (noindex) | Individual ITR (/services/income-tax-filing); TDS Return (/services/tds-return); Annual Compliance (/services/annual-compliance) |
| /services/company-itr | Company ITR-6 Filing Online India / Corporate Tax Returns / ClearFiling | File corporate income tax return (Form ITR-6) online under Income-tax framework. Mandatory Class 3 DSC, Section 115BAA rates, Section 63 audits, and balance sheet review. | No canonical (noindex) | Business ITR (/services/business-itr); Annual Compliance (/services/annual-compliance); TDS Return (/services/tds-return); Digital Signature (/services/digital-signature) |
| /services/llp-itr | LLP ITR Filing Online India / Form ITR-5 Filing Services / ClearFiling | File your LLP Income Tax Return (ITR-5) online with ClearFiling. Expert CA support for partner remuneration under Section 40(b), AMT, DSC verification, and tax audits. | No canonical (noindex) | LLP Registration (/services/llp-registration); LLP Compliance (/services/llp-compliance); Company ITR (/services/company-itr); Business ITR (/services/business-itr) |
| /services/ngo-tax-filing | NGO Tax Filing Online India / Form ITR-7 & Audit Form 10B/10BB / ClearFiling | File annual NGO tax return (Form ITR-7) online for Charitable Trusts and Section 8 Companies. Form 10B/10BB audit, 85% application compliance, and Form 9A/10 filing with CAs. | No canonical (noindex) | Section 8 Organization (/services/section-8-organization); Trust Registration (/services/trust-registration); Company ITR (/services/company-itr); Digital Signature (/services/digital-signature) |
| /services/tds-return | TDS Return Filing Online / Form 26Q, 24Q & TRACES Form 16 / ClearFiling | File quarterly TDS returns online. Salary Form 24Q (Form 138), non-salary Form 26Q (Form 140), TCS Form 27EQ (Form 143), and TRACES Form 16/16A issuance. | No canonical (noindex) | Business ITR (/services/business-itr); Individual ITR (/services/income-tax-filing); Annual Compliance (/services/annual-compliance) |
| /services/tan-registration | TAN Registration Online India / Form 49B Application / ClearFiling | Apply for Tax Deduction and Collection Account Number (TAN) online on Form 49B under Section 203A. Mandatory for TDS/TCS deductions, ₹65 statutory fee, and TRACES setup. | No canonical (noindex) | TDS Return (/services/tds-return); Individual ITR (/services/income-tax-filing); Company ITR (/services/company-itr) |
| /services/income-tax-notice | Income Tax Notice Reply Online / 143(1), 139(9) & 142(1) Notice Defense / ClearFiling | Draft and file legal replies to Income Tax notices under Section 143(1), 139(9), 142(1) & 148. Faceless assessment defense, bank reconciliations, and CA representation. | No canonical (noindex) | Individual ITR (/services/income-tax-filing); Business ITR (/services/business-itr); Revised Return (/services/revised-return); TDS Return (/services/tds-return) |
| /services/revised-return | Revised Return Filing Online India / Section 139(5) & Section 263(5) / ClearFiling | File a revised income tax return online under Section 139(5) (1961 Act) or Section 263(5) (2025 Act). Correct omissions and resolve AIS mismatches with zero separate filing fee. | No canonical (noindex) | Income Tax Filing (/services/income-tax-filing); Business ITR (/services/business-itr); Company ITR (/services/company-itr); Income Tax Notice (/services/income-tax-notice) |
| /services/annual-compliance | Company Annual Compliance Online / AOC-4 & MGT-7 Filing / ClearFiling | Manage Private Limited Company annual ROC compliance. Form AOC-4, MGT-7/7A, DIR-3 KYC (₹5,000 fee for late filing), and DPT-3 with experienced CS/CA support. | No canonical (noindex) | Private Limited Company (/services/private-limited-company); Business ITR (/services/business-itr); Digital Signature (/services/digital-signature) |
| /services/llp-compliance | LLP Annual Compliance Online / Form 8 & Form 11 Filing / ClearFiling | Manage your LLP annual compliance under the LLP Act, 2008. Form 11 filing (by 30 May), Form 8 solvency (by 30 October), rationalized graded fees, and audit exemption. | No canonical (noindex) | LLP Registration (/services/llp-registration); Annual Compliance (/services/annual-compliance); Business ITR (/services/business-itr) |
| /services/opc-compliance | One Person Company (OPC) Compliance Online / Annual RoC Filings / ClearFiling | Manage annual OPC compliance online under Companies Act, 2013. Form AOC-4 (due 27 Sept), Form MGT-7A (due 26 Nov), DIR-3 KYC, and AGM exemption advisory with CS guidance. | No canonical (noindex) | OPC Registration (/services/opc-registration); DIN KYC (/services/din-kyc); Company ITR (/services/company-itr); Annual Compliance (/services/annual-compliance) |
| /services/din-kyc | DIN KYC Filing Online India / DIR-3 KYC Web & Form / ClearFiling | Complete annual DIR-3 KYC online under Rule 12A on or before 30 September. Web OTP verification, e-Form filing with DSC, CA/CS certification, and DIN reactivation support. | No canonical (noindex) | Director Change (/services/director-change); Annual Compliance (/services/annual-compliance); OPC Compliance (/services/opc-compliance); Digital Signature (/services/digital-signature) |
| /services/director-change | Director Appointment & Resignation Online India / Form DIR-12 / ClearFiling | Appoint or remove company directors online under Companies Act, 2013. Form DIR-2 consent, DIR-8 disclosure, board resolutions, and Form DIR-12 filing within 30 days with CS guidance. | No canonical (noindex) | DIN KYC (/services/din-kyc); Annual Compliance (/services/annual-compliance); Registered Office Change (/services/registered-office-change); Digital Signature (/services/digital-signature) |
| /services/registered-office-change | Change Company Registered Office Online India / Form INC-22 / ClearFiling | Shift company registered office under Section 12 of Companies Act, 2013. Form INC-22 within 30 days, local city shifting, RoC-to-RoC, and inter-state relocation with CS guidance. | No canonical (noindex) | Director Change (/services/director-change); Annual Compliance (/services/annual-compliance); GST Amendment (/services/gst-amendment); Digital Signature (/services/digital-signature) |
| /services/share-transfer | Share Transfer in Private Limited Company / SH-4 Filing / ClearFiling | Transfer company shares legally. Professional SH-4 deed drafting and board resolutions support. | No canonical (noindex) | None declared |
| /services/moa-amendment | MOA Object Clause Amendment Online / MGT-14 Filing / ClearFiling | Amend your company Memorandum of Association objects clause. Complete board resolution drafting support. | No canonical (noindex) | None declared |
| /services/aoa-amendment | AOA Articles of Association Amendment Online / ClearFiling | Amend company Articles of Association. Professional corporate drafting and ROC filings. | No canonical (noindex) | None declared |
| /services/authorized-capital-increase | Authorized Capital Increase Online India / Form SH-7 / ClearFiling | Increase authorized share capital under Section 61 & 64 of Companies Act, 2013. Alter MOA Clause V, draft EGM resolutions, compute stamp duty, and file Form SH-7 within 30 days. | No canonical (noindex) | Director Change (/services/director-change); Annual Compliance (/services/annual-compliance); Private Limited Company (/services/private-limited-company); Digital Signature (/services/digital-signature) |
| /services/dormant-company-filing | Apply for Dormant Company Status Online / MSC-1 Filing / ClearFiling | Pause compliance operations for inactive companies. Secure dormant status from ROC. | No canonical (noindex) | None declared |
| /services/company-closure | Company Closure Online India / Fast-Track Strike Off (Form STK-2) / ClearFiling | Close your defunct company online under Section 248(2) of Companies Act, 2013. Form STK-2 filing with C-PACE, CA-certified STK-8 accounts, and dissolution order with CS guidance. | No canonical (noindex) | Annual Compliance (/services/annual-compliance); Director Change (/services/director-change); Company ITR (/services/company-itr); Digital Signature (/services/digital-signature) |
| /services/uae-company-setup | UAE Company Setup / Dubai Free Zone Incorporation / ClearFiling | Expand business to Dubai. Setup UAE mainland or free zone entities. 100% remote process coordination. | No canonical (noindex) | None declared |
| /services/usa-company-registration | US LLC Registration Online India / USA Incorporation / ClearFiling | Setup Delaware LLC or C-Corp from India. Complete registration support including EIN and corporate bank accounts. | No canonical (noindex) | None declared |
| /services/uk-company-registration | UK LTD Company Registration Online India / ClearFiling | Register your UK Limited company. 100% remote process with Companies House. | No canonical (noindex) | None declared |
| /services/singapore-business-setup | Singapore Company Registration Online / ACRA Setup / ClearFiling | Incorporate in Singapore. Complete corporate secretarial and ACRA filing support. | No canonical (noindex) | None declared |
| /services/overseas-trademark | International Trademark Registration / US & EU Brand Protection / ClearFiling | Register your brand trademark globally. File via Madrid protocol with expert IP assistance. | No canonical (noindex) | None declared |
| /services/international-advisory | International Business Advisory & DTAA Structuring / ClearFiling | Strategic consultation on FEMA guidelines, DTAA tax planning, and overseas structuring by senior CAs. | No canonical (noindex) | None declared |
| /services/website-development | Corporate Website Development Services India / ClearFiling | Get a custom, premium corporate website designed by ClearFiling. Full SEO optimization, responsive layout, and modern designs for businesses. | No canonical (noindex) | None declared |
| /services/ecommerce-website-development | E-Commerce Online Store Development India / ClearFiling | Build a secure, fast, and feature-rich e-commerce store with ClearFiling. Integrated payment gateways, product catalogs, and custom shopping carts. | No canonical (noindex) | None declared |
| /services/custom-web-applications | Custom Web Application & SaaS Development India / ClearFiling | Custom web application development services. Build secure SaaS portals, ERP, CRM, and automation tools with ClearFiling. | No canonical (noindex) | None declared |
| /services/personal-loan | Personal Loan / ClearFiling | Explore personal financing options for personal, medical, or urgent needs. Guidance with applications and documentation. | https://www.clearfiling.co.in/services/personal-loan | None declared |
| /services/home-loan | Home Loan / ClearFiling | Long-term housing finance solutions to help you purchase your dream home, construct a new house, or renovate an existing property. | https://www.clearfiling.co.in/services/home-loan | None declared |
| /services/business-loan | Business Loan / ClearFiling | Secure capital for corporate expansion, technology upgrades, working capital, or inventory purchase. Assistance with business loan applications and documentation. | https://www.clearfiling.co.in/services/business-loan | MSME Registration (/services/msme-registration); Private Limited Company (/services/private-limited-company) |
| /services/msme-loan | MSME Loan / ClearFiling | Avail government-backed schemes like CGTMSE, PMEGP, or Mudra loans. Explore financing options for eligible MSMEs. | https://www.clearfiling.co.in/services/msme-loan | None declared |
| /services/startup-loan | Startup Loan / ClearFiling | Access seed capital and specialized funding programs designed to help early-stage startups establish operations and scale. | https://www.clearfiling.co.in/services/startup-loan | None declared |
| /services/working-capital-loan | Working Capital Loan / ClearFiling | Ensure smooth operational flow. Short-term funds to finance raw materials, inventory, payroll, and other daily running costs. | https://www.clearfiling.co.in/services/working-capital-loan | None declared |
| /services/education-loan | Education Loan / ClearFiling | Finance your higher education in India or abroad. Covers tuition fees, exam fees, travel, and accommodation. | https://www.clearfiling.co.in/services/education-loan | None declared |
| /services/vehicle-loan | Vehicle Loan / ClearFiling | Structured vehicle and fleet financing solutions for corporate transportation fleets, business utility vehicles, and mixed-vehicle assets. | https://www.clearfiling.co.in/services/vehicle-loan | None declared |
| /services/car-loan | Car Loan / ClearFiling | Drive home your preferred car. Finance packages covering new launches, hatchbacks, sedans, and SUVs. | https://www.clearfiling.co.in/services/car-loan | None declared |
| /services/bike-loan | Bike Loan / ClearFiling | Assistance with two-wheeler loan applications for sports bikes, commuter motorcycles, and electric scooters. | https://www.clearfiling.co.in/services/bike-loan | None declared |
| /services/gold-loan | Gold Loan / ClearFiling | Instant liquidity against gold jewelry. Guidance on gold loan applications and lender terms. | https://www.clearfiling.co.in/services/gold-loan | None declared |
| /services/loan-against-property | Loan Against Property / ClearFiling | Leverage the value of your commercial or residential property to raise high-value long-term funds. Explore loan-against-property financing options. | https://www.clearfiling.co.in/services/loan-against-property | None declared |
| /services/machinery-loan | Machinery Loan / ClearFiling | Acquire new or imported manufacturing machines to scale production. Asset-based mortgage structure. | https://www.clearfiling.co.in/services/machinery-loan | None declared |
| /services/equipment-finance | Equipment Finance / ClearFiling | Flexible funding options for medical equipment, IT hardware, office assets, or specialized lab tools. | https://www.clearfiling.co.in/services/equipment-finance | None declared |
| /services/project-loan | Project Loan / ClearFiling | Fund greenfield or brownfield infrastructure projects, commercial real estate, or industrial expansions. | https://www.clearfiling.co.in/services/project-loan | None declared |
| /services/cash-credit | Cash Credit / ClearFiling | Secure a revolving cash credit line based on inventory stocks and book debt receivables. | https://www.clearfiling.co.in/services/cash-credit | None declared |
| /services/overdraft-facility | Overdraft Facility / ClearFiling | Set up an overdraft limit against bank fixed deposits, mutual funds, or business credit history. | https://www.clearfiling.co.in/services/overdraft-facility | None declared |
| /services/professional-loan | Professional Loan / ClearFiling | Customized credit lines designed for doctors, chartered accountants, company secretaries, architects, and consulting professionals. | https://www.clearfiling.co.in/services/professional-loan | None declared |
| /services/commercial-vehicle-loan | Commercial Vehicle Loan / ClearFiling | Finance commercial transit fleets. Tailored credit for logistics companies, operators, and fleet managers. | https://www.clearfiling.co.in/services/commercial-vehicle-loan | None declared |
| /services/construction-loan | Construction Loan / ClearFiling | Project-based credit facilities to finance real estate developers, contractors, and building construction costs. | https://www.clearfiling.co.in/services/construction-loan | None declared |

# Phase 2C — Independent SEO Quality Assurance

**Audit date:** 2026-11-15\
**Repository:** `/private/tmp/clearfiling-phase1j-integration`\
**Branch:** `seo/phase-2b-loan-services-content`\
**HEAD:** `93cd463a19942399ba39563b7c42a0c5f0d702b5`\
**Scope:** Read-only QA of the 20 indexable loan-service pages. No application source, tests, routes, metadata, schema, sitemap, robots or deployment configuration was edited. No commit, push, PR, merge or deployment was performed.

## Executive summary

The generated output independently verifies all 20 loan routes, each with a unique title, description and H1, the expected canonical URL, one copy of each checked metadata field, visible FAQ answers matching FAQPage JSON-LD, and Service/BreadcrumbList schema. All 53 related-service links and 16 related-resource links resolve to existing rendered internal destinations. Technical SEO counts, generated documents, sitemap and robots hashes match the Phase 0 baseline.

The content is materially differentiated: 60 educational sections are rendered, with no repeated section body and 58 unique section headings. The paired products in scope generally have distinct titles, H1s and educational outlines. A shared FAQ question remains repetitive across multiple pages. More significantly, a shared final CTA still claims that ClearFiling has “experienced loan advisors and financial experts” on all 20 pages, contradicting the lender-neutral disclaimer and the Phase 2B factual safeguards. This requires owner confirmation or approved neutral copy before Phase 2B content is accepted. The shared Service schema also emits a generic `Offer` with `priceCurrency` and `InStock` availability on all 20 loan pages; this is recorded as a separate schema decision.

**Acceptance recommendation:** Technical SEO acceptance passes. Content acceptance is **conditional / not yet complete** because the unverified loan-advisor CTA is present on all 20 routes. The generic Offer schema also needs a separate decision. No production or live-device acceptance was attempted.

## Repository state and validation

The expected branch and HEAD were present. Before report creation, the working tree contained the pre-existing Phase 2B work: five modified tracked paths and six untracked paths, including the loan content map, its test, and prior reports. Those changes were preserved. The test/build commands were run in the isolated integration repository only.

Commands executed:

- `npm test --prefix client` — **passed: 48 tests, 19 suites; 0 failed, 0 skipped**.
- `npm run build --prefix client` — **passed**; generated 110 route documents (44 sitemap routes plus 66 noindex routes) and a separate noindex `404.html`; build also reported 70 routes with JSON-LD and verified 110 route files.
- Independent generated-output check — **111 HTML files total** (110 route documents + `404.html`); 89 service documents (23 indexable + 66 noindex).
- `git diff --check` — run after report creation; result recorded in final status.

The build's sitemap-generation step rewrote the public sitemap to byte-identical output. No robots or deployment files changed.

## Routes and generated metadata

All routes below were read from `client/dist/services/<slug>.html`. Title and description lengths are character counts of the rendered text. Every row had one title, one description, one canonical, one Open Graph title/description and one Twitter title/description. The canonical is exactly `https://www.clearfiling.co.in` plus the route shown. Each route has one H1 matching the displayed H1 below, and no robots meta tag because these routes are indexable.

| Route | Generated title (length) | Generated description (length) | H1 |
|---|---|---|---|
| `/services/personal-loan` | Personal Loan Application Guide \| ClearFiling (45) | Understand personal loan application documents, costs to compare, and lender decision factors. ClearFiling is not a lender; terms and decisions vary by lender. (159) | Personal Loan Application Guide |
| `/services/home-loan` | Home Loan Application Guide and Documents \| ClearFiling (55) | Review home loan application topics for purchase, construction, or renovation and questions to compare with lenders. ClearFiling is not a lender. (145) | Home Loan Application Guide |
| `/services/business-loan` | Business Loan Application Guide for Companies \| ClearFiling (59) | Explore business loan purposes, application records, and lender questions for expansion or working capital. ClearFiling is not a lender. (136) | Business Loan Application Guide |
| `/services/msme-loan` | MSME Loan Schemes and Application Guide \| ClearFiling (53) | Learn how MSME finance options differ, what records to prepare, and what to verify in scheme terms. Availability and eligibility depend on current rules and lenders. (165) | MSME Loan and Scheme Application Guide |
| `/services/startup-loan` | Startup Loan and Funding Options Guide \| ClearFiling (52) | Compare debt and other funding paths for early-stage businesses, with records to prepare and questions for funders. ClearFiling is not a lender. (144) | Startup Loan and Funding Options |
| `/services/working-capital-loan` | Working Capital Finance Guide for Businesses \| ClearFiling (58) | Learn how working capital needs relate to inventory, receivables, and operating cycles, and what lenders may ask. Terms vary by lender. (135) | Working Capital Finance for Businesses |
| `/services/education-loan` | Education Loan Application Guide for Students \| ClearFiling (59) | Review education finance topics, possible application records, and questions for lenders for study in India or abroad. Terms vary by lender. (140) | Education Loan Application Guide |
| `/services/vehicle-loan` | Vehicle Finance Guide for Business Fleets \| ClearFiling (55) | Understand vehicle and fleet finance application topics, vehicle records, and lender questions. Product terms depend on the asset and lender. (141) | Vehicle and Fleet Finance Guide |
| `/services/car-loan` | Car Loan Guide for New and Used Cars \| ClearFiling (50) | Compare car finance questions for new or used vehicles, documents, security, and lender terms. ClearFiling is not a lender. (123) | Car Loan Application Guide |
| `/services/bike-loan` | Two-Wheeler Loan Guide for Bikes and Scooters \| ClearFiling (59) | Learn what to compare for motorcycle and scooter finance, including documents and lender-specific terms. Approval and funding depend on the lender. (147) | Two-Wheeler Loan Application Guide |
| `/services/gold-loan` | Gold Loan Guide: Documents and Terms to Compare \| ClearFiling (61) | Understand gold-backed borrowing, valuation and custody questions, documents, and lender terms before applying. ClearFiling is not a lender. (140) | Gold Loan Application Guide |
| `/services/loan-against-property` | Loan Against Property Guide: Documents and Lender Terms \| ClearFiling (69) | Explore property-backed borrowing questions, property records, valuation, security, and lender terms. Eligibility and loan terms vary by lender. (144) | Loan Against Property Application Guide |
| `/services/machinery-loan` | Machinery Finance Guide for Businesses \| ClearFiling (52) | Review machinery finance questions for new or imported equipment, supplier records, security, and lender terms. Availability varies by lender. (142) | Machinery Finance Application Guide |
| `/services/equipment-finance` | Equipment Finance Guide: Purchase and Lease Options \| ClearFiling (65) | Compare equipment purchase and lease questions, quotations, records, and tax points to check with advisers and lenders. Terms vary by provider. (143) | Equipment Finance Application Guide |
| `/services/project-loan` | Project Finance Guide: Documents and Lender Review \| ClearFiling (64) | Learn what project finance planning may involve, including feasibility records, permissions, equity, and lender review. Terms are project-specific. (147) | Project Finance Application Guide |
| `/services/cash-credit` | Cash Credit Facility Guide for Businesses \| ClearFiling (55) | Understand cash credit concepts, stock and receivable records, drawing limits, and lender-specific costs. ClearFiling is not a lender. (134) | Cash Credit Facility Application Guide |
| `/services/overdraft-facility` | Business Overdraft Facility Guide \| ClearFiling (47) | Review overdraft security, account activity, costs, and repayment questions before speaking with lenders. Facility terms and eligibility vary. (142) | Overdraft Facility Application Guide |
| `/services/professional-loan` | Professional Loan Guide for Practices and Consultants \| ClearFiling (67) | Explore professional-practice finance questions, qualification records, costs, and lender-specific security terms. ClearFiling is not a lender. (143) | Professional Practice Finance Guide |
| `/services/commercial-vehicle-loan` | Commercial Vehicle Finance Guide for Fleets \| ClearFiling (57) | Review commercial vehicle finance documents, fleet use, new or used assets, and lender terms. Approval, valuation, and repayment vary by lender. (144) | Commercial Vehicle Finance Guide |
| `/services/construction-loan` | Construction Finance Guide for Builders and Developers \| ClearFiling (68) | Learn what construction finance applications may involve, including plans, approvals, cost estimates, and lender disbursement conditions. (137) | Construction Finance Application Guide |

Titles are unique (45–69 characters). Descriptions are unique (123–165 characters) and route-relevant. The MSME description is the longest at 165 characters; this is a low-priority snippet-length review, not a technical failure. No keyword stuffing was observed in the titles/descriptions checked.

## Content quality and search intent

- All 20 registry loan routes are represented by the new content map; no corporate service was included.
- Generated pages each contain three educational sections (60 total), a general-information disclaimer, lender-neutral language, and page-specific H1 and metadata. Section headings are 58 unique values; two headings are reused on two pages each, but the section bodies remain different. There are no exact repeated educational-section bodies.
- Product differentiation is generally clear: car vs. two-wheeler focuses on asset type; business vs. MSME vs. startup distinguishes general business funding, scheme verification, and debt versus other funding; working capital vs. cash credit vs. overdraft has different operating-cycle/facility themes; machinery/equipment/project/construction discuss asset acquisition, purchase/lease, feasibility, and construction-stage records respectively; loan against property focuses on property, valuation and security.
- **Vehicle Loan vs. Commercial Vehicle Loan:** both use fleet language and lender-term comparison. The vehicle page is now positioned as a business fleet hub, while the commercial-vehicle page focuses more on fleet assets and security. The distinction is present but has residual keyword overlap; clarify the intended broader-vs-commercial scope in a future content pass.
- **FAQ repetition:** all pages have four visible questions and answers. The generic “Who decides whether an application is approved?” is used on 13 routes; “Which documents should I prepare?” is used on four. The remaining FAQ questions are product-oriented. These common FAQs are accurate and helpful as disclaimers, but repeating them on many pages lowers FAQ differentiation.
- No loan rate, numeric fee, loan amount, approval promise, disbursement-time promise, lender partnership, or specific government benefit claim was found in the new rendered educational sections/FAQ copy. Some copy discusses these subjects as items to verify with the lender or official source. The unverified advisor CTA described under issues is the exception to the claimed lender-neutral presentation.
- Tax/scheme questions refer visitors to qualified advisers/current official terms. The pages do not include primary source citations; this is a future editorial opportunity, especially for current scheme or tax topics, not a proven factual error in the checked copy.

## FAQ and structured data

For each of 20 routes, the initial HTML contains exactly three parseable JSON-LD scripts: `BreadcrumbList`, `Service`, and `FAQPage` (60 scripts total). No JSON-LD parse error or duplicate schema type was found. Each FAQPage contains four questions. All four `<details open>` disclosures and answer text are in the static HTML, and the visible question/answer strings match FAQPage JSON-LD exactly on all 20 pages. Native `<details>/<summary>` provides keyboard-operable disclosure behavior; summary elements have a visible focus-ring class.

**Separate schema issue:** every Service JSON-LD contains the existing generic `offers` object from `client/src/components/seo/SchemaHelpers.js`, including `priceCurrency` and `availability: https://schema.org/InStock`. The service pages do not provide a price, and ClearFiling is not a lender. This is pre-existing shared schema behavior, explicitly left unchanged; see `P2C-02` in the issue tracker.

## Internal links

Independently resolved all new map destinations against the service/resource registries and inspected the generated source-page HTML:

- 53 related-service links point to existing indexable service routes.
- 16 related-guide links point to existing resource slugs.
- Broken, missing-rendered, redirected-away or external destinations among these new links: **0**.
- Anchors are rendered with the related service/resource titles, so their text names the destination.

## Technical SEO regression

| Check | Independent result |
|---|---|
| Loan routes | 20, all in the authoritative loan content map and indexable service list |
| Indexable service routes | 23 |
| Noindex service routes | 66; every generated document has `noindex, follow` and no canonical link |
| Sitemap | 44 unique URLs; all 23 indexable service routes included; all 66 noindex service routes excluded |
| Generated HTML | 110 route documents plus `404.html` (111 HTML files total) |
| Loan metadata | Exactly one title, description, canonical, OG title/description and Twitter title/description per route; no robots tag on indexable loan routes |
| Canonical origin | `https://www.clearfiling.co.in` on all 20 loan routes |
| Sitemap SHA-256 | `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` — matches Phase 0 |
| Robots SHA-256 | `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b` — matches Phase 0 |
| Redirects | Vercel config retains `/services/udyam-registration` → `/services/msme-registration` (301) and `/services/import-export-code` → `/services/iec-registration` (301) |

This confirms generated files/configuration, not live HTTP redirect or deployment behavior. Wave 2/noindex pages and unknown-route status were not part of this loan-page output acceptance beyond confirming the 66 generated noindex documents and separate static 404 document.

## Performance review

The current Vite build emits the main entry as **755.86 kB minified / 176.68 kB gzip**, compared with the Phase 0 main entry at **703.66 kB / 164.08 kB gzip**: an increase of **52.20 kB minified / 12.60 kB gzip** (about 7.4% / 7.7%). Vite retains its warning for a chunk larger than 500 kB after minification.

The unique loan section text is present inside the built `index-*.js` entry bundle. The whole `LOAN_SERVICE_CONTENT` map is statically imported and applied in `client/src/data/services.js`, so the loan content is part of the shared entry rather than an isolated loan-route chunk. This is a material contributor to the bundle increase; this audit did not run a historical source-map/module-size comparison, so it does not attribute the entire increase to that file alone. Other large generated chunks are React (142.19 kB minified), Framer Motion (114.46 kB), ServiceDetail (36.03 kB), Contact (36.37 kB) and ResourceDetail (36.88 kB).

Recommendation: consider a later route-level split for loan editorial content while retaining only card/list fields in the common service catalogue. Because the app also statically renders and hydrates routes, the change must preserve SSG data availability, hydration output, featured-service cards and service-list behavior. No optimization can be called safe without testing those flows. No Lighthouse, Web Vitals, source-map analysis or field-performance measurement was performed.

## Mobile and accessibility source review

Source-level review only:

- Education sections use a single-column content flow with `px-4 md:px-8`, readable `text-sm md:text-base`, and list indentation; service cards use responsive grid breakpoints.
- Loan FAQs use native `<details open>` and `<summary>` with a focus-visible ring; answers use readable `text-sm` and line-height styling.
- Related service/resource navigation uses semantic `<nav>`, lists and descriptive title anchors.
- The final CTA uses `flex-col sm:flex-row`, full width on narrow screens and a constrained width at larger sizes, which reduces button-wrap pressure.
- A semantic H1 is present once on each generated loan page; page sections use H2 and nested card titles use H3. The generated H1 matches route metadata.
- No direct visual overflow test, browser keyboard test, screen-reader review, automated axe scan or real mobile-device testing was performed. Source classes suggest responsive behavior but do not establish a device-level pass.

## Issues and priorities

See [`docs/phase_2c_issue_tracker.md`](phase_2c_issue_tracker.md) for evidence and recommended actions.

- **High:** all 20 routes render an unverified claim that ClearFiling has experienced loan advisors/financial experts, plus “Consult compliance experts” CTA copy.
- **Medium:** the generic `Offer` schema on loan educational pages may misrepresent availability of a financial offer.
- **Medium:** loan editorial content is inside the initial shared JavaScript entry and the entry exceeds Vite's 500 kB advisory.
- **Low:** repeated generic FAQ questions and remaining vehicle/commercial-vehicle search-intent overlap.
- **Low:** the 165-character MSME description can be reviewed for snippet brevity.

## Checks not performed

- No Vercel preview or production URL was contacted; no live HTTP status, redirect, HTML, crawl or schema test was run.
- No production API, form submission, contact integration, upload or account flow was exercised.
- No mobile device, browser screenshot, accessibility automation or screen-reader run was performed.
- No Lighthouse, field Core Web Vitals, performance profile or source-map attribution was collected.
- No application changes were made to resolve findings.

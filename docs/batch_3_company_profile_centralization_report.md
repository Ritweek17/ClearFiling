# Batch 3 — Company Profile Centralization

## Summary

The existing `client/src/config/business.js` now owns the confirmed brand name, legal name, exact tagline, online service coverage, and derived physical office city list. `companyInfo.js` remains a compatibility adapter and exposes the profile values from `BUSINESS`; the existing office registry remains the detailed source for office data. The branded navbar wordmark, About content, footer labels, and homepage company headings now consume the canonical identity values.

Unverified company history, metrics, qualifications, testimonials, and marketing claims were left unchanged.

## Files inspected

- `client/src/config/business.js`
- `client/src/data/companyInfo.js`
- `client/src/data/footerConfig.js` (the actual module is under `data/`, not `config/`)
- `client/src/config/contact.js`
- `client/src/data/officeLocations.js`
- `client/src/components/common/Navbar.jsx`, `Logo.jsx`, `Footer.jsx`, `MobileDrawer.jsx`, `FloatingCTAs.jsx`, `CTAButtons.jsx`
- `client/src/pages/About.jsx`
- `client/src/components/features/AboutSection.jsx`, `Hero.jsx`, `TrustSection.jsx`, `WhyChooseSection.jsx`
- `client/src/config/seo.js` and relevant `COMPANY_INFO` / `BUSINESS` consumers
- `docs/business_information_centralization_plan.md`
- `docs/batch_1_legal_name_standardization_report.md`
- `docs/batch_2_contact_office_centralization_report.md`
- Existing client tests and build/sitemap scripts

## Files modified

- `client/src/config/business.js`
- `client/src/data/companyInfo.js`
- `client/src/components/common/Logo.jsx`
- `client/src/components/common/Footer.jsx`
- `client/src/components/common/FloatingCTAs.jsx`
- `client/src/components/common/CTAButtons.jsx`
- `client/src/pages/About.jsx`
- `client/src/components/features/AboutSection.jsx`
- `client/src/components/features/Hero.jsx`
- `client/src/components/features/TrustSection.jsx`
- `client/src/components/features/WhyChooseSection.jsx`
- `client/tests/companyProfileCentralization.test.js`
- `docs/batch_3_company_profile_centralization_report.md`

`Navbar.jsx` was inspected but did not need changes; it renders the shared `Logo` component, which now reads the canonical brand wordmark. `footerConfig.js` already derived its public company fields from `BUSINESS`, so no adapter code change was needed there.

The production build refreshed generated output under `client/dist/`. Sitemap output was regenerated with identical content.

## Configuration changes

- Kept `ClearFiling` and `CLEARFILING AND COMPLIANCE LLP` as the exact confirmed brand and legal names.
- Changed the canonical tagline to the exact approved spelling and punctuation: `Integrity, sanctity, dedication`.
- Added `BUSINESS.serviceCoverage` with the confirmed value `Online services across India`.
- Added `BUSINESS.physicalOfficeCities`, derived from the existing `OFFICE_LOCATIONS` labels, producing `Delhi`, `Deoria`, and `Gorakhpur` without duplicating the office registry.
- Derived the existing confirmed office count and office-city string in `BUSINESS.stats` from that same list; their values remain `3` and `Delhi, Deoria, Gorakhpur`.
- Added `serviceCoverage` and `officeCities` to the existing `COMPANY_INFO` compatibility export. Existing contact, office, SEO, and other export shapes remain intact.
- Added canonical wordmark parts to `BUSINESS` so the navbar logo retains its current split-color presentation while deriving the displayed brand name from config.

## Consumers migrated

- `COMPANY_INFO` derives brand/name aliases, legal name, tagline, online coverage, and office cities from canonical configuration.
- The footer company adapter already sourced confirmed identity fields from `BUSINESS`; its rendered identity and tagline continue through that adapter.
- `Logo.jsx` now reads its accessible brand label, abbreviation, and styled wordmark from `BUSINESS`; `Navbar.jsx` consumes this component.
- About page and About section read the canonical brand, legal name, tagline, and office city data. The office sentence retains its prior display form (`New Delhi, Deoria, and Gorakhpur, Uttar Pradesh`) using the office registry.
- Homepage Hero, TrustSection, WhyChooseSection, Footer, FloatingCTAs, and CTAButtons derive brand references from existing config/compatibility exports without changing their visible wording.

## Unverified information requiring owner confirmation

The following content was preserved and was not represented as confirmed by this batch:

- Founding date/history (`2020`), experience figures, and timeline milestones.
- Client counts, filing counts, satisfaction rates, professional/team counts, service counts, and other statistics, including duplicate values in `BUSINESS.stats`, `COMPANY_INFO`, About, and homepage components.
- CA, CS, advocate, legal advisor, merchant banker, and cost accountant qualifications, registration, membership, supervision, or team-affiliation claims.
- Testimonials, client names, awards, certifications, affiliations, ratings, and success claims.
- Promises about speed, outcomes, free consultation, pricing, no delays, and nationwide service wording beyond the explicitly approved online coverage value.

These values remain in their prior locations and retain their previous display. Centralizing or changing them requires owner verification and a separately scoped batch.

## Verification

- Focused test: `node --test client/tests/companyProfileCentralization.test.js` — **2 passed, 0 failed**.
- Production build: `npm run build --prefix client` — **succeeded**. The sitemap generator reported **44 URLs**. Vite emitted its existing advisory that the main minified chunk exceeds 500 kB (703.48 kB).
- Full client suite: `npm test --prefix client` — **38 passed, 0 failed, 16 suites**.
- Regression assertions cover exact canonical identity/profile values, adapter parity, preserved navbar wordmark styling, footer identity, and rendered About content including unchanged unverified claims and office wording.
- Sitemap SHA-256 before build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`.
- Sitemap SHA-256 after build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`; URL count remains **44**.

No `.env` files or credentials were read. No Git operations, staging, commits, pushes, merges, pull requests, or deployments were performed.

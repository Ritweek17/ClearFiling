# Batch 4 — Legal Content and Business Fact Dependencies

## Summary

Repeated brand and website-domain values in the Privacy Policy, Terms & Conditions, and Disclaimer now derive from `BUSINESS.primaryBrandName` and `BUSINESS.websiteUrl`. The legal entity name, contact facts, and office address blocks were already derived from the approved business, contact, and office configuration; those dependencies were retained.

Only substitutions that produce identical server-rendered legal pages were made. No legal prose, policy meaning, clause, heading, or obligation was changed.

## Files inspected

- `client/src/data/legalContent.js`
- `client/src/config/business.js`
- `client/src/config/contact.js`
- `client/src/data/officeLocations.js`
- `client/src/layouts/LegalPageLayout.jsx`
- `client/src/pages/PrivacyPolicy.jsx`, `Terms.jsx`, and `Disclaimer.jsx`
- Existing legal content tests in `client/tests/brandSeo.test.js`
- All imports and consumers of `PRIVACY_POLICY`, `TERMS_CONDITIONS`, `DISCLAIMER`, and `LegalPageLayout`
- Existing client test conventions and build/sitemap scripts

The repository has three legal pages using the shared layout: Privacy Policy, Terms & Conditions, and Disclaimer.

## Files modified

- `client/src/data/legalContent.js`
- `client/tests/legalContentCentralization.test.js`
- `docs/batch_4_legal_content_centralization_report.md`

The production build refreshed generated output under `client/dist/`. `client/public/sitemap.xml` was regenerated with identical content.

## Business facts centralized

- Brand references in legal metadata and prose now use `BUSINESS.primaryBrandName` (`ClearFiling`).
- The display-only domain `clearfiling.co.in` is derived from `BUSINESS.websiteUrl` by parsing its hostname and removing the existing `www.` prefix. The rendered domain remains exactly `clearfiling.co.in`.
- The approved legal name remains sourced from `BUSINESS.legalName` (`CLEARFILING AND COMPLIANCE LLP`).
- Legal contact lines continue to derive from `CONTACT` and `OFFICE_LOCATIONS`: both email addresses, all three phone details, and the existing legal-formatted office addresses.
- No WhatsApp or other contact details were added to legal copy; none were present to centralize.

## Legal content deliberately left unchanged

- All policy paragraphs, clauses, headings, obligations, limitations, and disclaimers.
- Privacy, cookie, data-retention, confidentiality, refund, liability, and jurisdiction terms.
- Professional qualification and responsibility statements, processing/outcome wording, and all other legal/business assertions.
- Existing dates and page metadata (`lastUpdated`, `effectiveDate`, and badge/title values).
- Jurisdiction references to the courts in New Delhi, India. These are legal terms, not office-address fields, and were not substituted.
- The approved uppercase legal name and all legal contact/address display values.

These pages have not received legal review or approval as part of this technical centralization task.

## Before/after rendered text comparison

Before editing, server-rendered HTML for all three legal pages was captured. The same pages were rendered after the substitutions and compared with `diff -u`.

| Page | Before length | After length | Comparison |
|---|---:|---:|---|
| Privacy Policy | 12,825 characters | 12,825 characters | Byte-identical |
| Terms & Conditions | 12,582 characters | 12,582 characters | Byte-identical |
| Disclaimer | 10,025 characters | 10,025 characters | Byte-identical |

The comparison returned no differences. This confirms the business-fact substitutions did not alter the legal-page rendering.

## Verification

- Focused test: `node --test client/tests/legalContentCentralization.test.js` — **2 passed, 0 failed**.
- Production build: `npm run build --prefix client` — **succeeded**. Sitemap generation reported **44 URLs**. Vite emitted its existing advisory for the 703.48 kB minified main chunk.
- Full client suite: `npm test --prefix client` — **40 passed, 0 failed, 17 suites**.
- Regression checks verify canonical legal name, brand/domain derivation, contact and office dependencies, and SSR of all three legal pages with existing legal content.
- Sitemap SHA-256 before build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`.
- Sitemap SHA-256 after build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`; URL count remains **44**.

## Remaining manual/legal review items

- A qualified reviewer should independently review the existing policy wording and effective/update dates; this batch did not assess legal sufficiency.
- Owners should confirm the underlying contact details and office addresses, which remain unverified business information even though they now derive from canonical configuration.
- The website-domain display assumes the canonical website URL continues to use the current `www.` host while legal copy presents the bare domain.

No `.env` files or credentials were read. No Git operations, staging, commits, pushes, merges, pull requests, or deployments were performed.

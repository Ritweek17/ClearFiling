# Batch 2 — Contact and Office Information Centralization

## Summary

`client/src/config/contact.js` is now the source of truth for global phone numbers, WhatsApp, email, office hours, and existing response-time wording. `client/src/data/officeLocations.js` is the canonical office registry, retaining the stable IDs `delhi`, `deoria`, and `gorakhpur`. Existing adapters and public components consume those sources while retaining their prior export shapes and displayed values.

No business details were independently verified. All existing values remain subject to owner confirmation.

## Files inspected

- `client/src/config/contact.js`, `client/src/config/business.js`, `client/src/config/seo.js`
- `client/src/data/officeLocations.js`, `client/src/data/companyInfo.js`, `client/src/data/footerConfig.js`, `client/src/data/contactDetails.js`, `client/src/data/legalContent.js`, `client/src/data/faqContact.js`, `client/src/data/consultants.js`
- `client/src/pages/Contact.jsx`, `About.jsx`, `BlogPost.jsx`, `ServiceDetail.jsx`
- `client/src/layouts/ResourcePageLayout.jsx`
- `client/src/components/contact/ContactHero.jsx`, `OfficeLocations.jsx`, `ContactInfoCards.jsx`
- `client/src/components/common/Footer.jsx`
- `client/src/components/features/CTASection.jsx`, `FeaturedServices.jsx`
- `client/src/components/seo/SchemaHelpers.js`
- Existing client test conventions and sitemap generation/build scripts

## Files modified

- `client/src/config/contact.js`
- `client/src/data/officeLocations.js`
- `client/src/data/companyInfo.js`
- `client/src/data/footerConfig.js`
- `client/src/data/legalContent.js`
- `client/src/data/faqContact.js`
- `client/src/data/consultants.js`
- `client/src/config/seo.js`
- `client/src/components/seo/SchemaHelpers.js`
- `client/src/components/contact/ContactHero.jsx`
- `client/src/pages/Contact.jsx`
- `client/src/pages/About.jsx`
- `client/src/pages/BlogPost.jsx`
- `client/src/pages/ServiceDetail.jsx`
- `client/src/layouts/ResourcePageLayout.jsx`
- `client/src/components/features/CTASection.jsx`
- `client/src/components/features/FeaturedServices.jsx`
- `client/tests/contactOfficeCentralization.test.js`
- `docs/batch_2_contact_office_centralization_report.md`

The production build also refreshed generated files under `client/dist/`. The build regenerated `client/public/sitemap.xml`, but its content hash remained unchanged.

## Configuration and migration

### Canonical global contact data

`contact.js` remains the canonical config and preserves its existing exports. It supplies existing values for the mobile, Deoria landline, Gorakhpur phone, WhatsApp number/message, primary and secondary email, office hours, response SLAs, and display wording used by current public copy.

Compatibility adapters in `companyInfo.js` and `footerConfig.js` derive their existing contact fields from `CONTACT`. `contactDetails.js` and the Contact hero already consumed the canonical config; the response badge and response-time wording now use its configured values as well.

### Canonical office registry

`officeLocations.js` retains all three stable IDs, existing structured address fields, landmarks, coordinates, schema fields, map values, and office-specific contact associations. Office phone and email details now derive from `CONTACT`.

The registry also holds the pre-existing formatted address variants needed by the company-information adapter, footer, and legal pages. These variants intentionally preserve each section's previous punctuation, line breaks, and address wording. `companyInfo.js`, `footerConfig.js`, contact/legal content, office cards, SEO configuration, and structured-data helpers consume the registry. Existing adapter shapes and component behavior remain compatible.

## Values preserved

- Phone displays and `tel:` targets: `+91 9250201718`, `05568-450351`, and `+91 9336379826`.
- WhatsApp number, default message, and existing CTA-specific messages.
- Emails: `clearfiling@zohomail.in` and `support.clearfiling@gmail.com`.
- Office hours and response-time wording, including the existing Contact FAQ, Contact hero, CTA, and SEO phrasing.
- Office IDs, labels, addresses and their formatted variants, landmarks, coordinates, office/schema fields, and `null` map URLs.
- The existing special footer behavior where only the Gorakhpur office entry carries a separate phone field.

No service descriptions, routes, slugs, redirects, indexing settings, canonical rules, or sitemap URLs were changed.

## Remaining references and duplication

- Global contact literals now reside in `client/src/config/contact.js`; address and office-detail literals reside in `client/src/data/officeLocations.js`.
- The office registry retains multiple existing address formats because the previously displayed Contact/company, footer, legal, and structured-data formats differ. Adapters select these configured variants rather than hardcoding them independently.
- `OfficeLocations.jsx` constructs `mailto:` links from the configured office email values; it contains no email addresses.
- `blogContent.js` contains an unrelated claim that Udyam registration can be done “in under 30 minutes”; it is not a response-time or contact detail and was left unchanged.
- Search of `client/src` found no remaining hardcoded global phone numbers, emails, response-SLA claims, or repeated office address blocks outside the canonical configuration files (excluding unrelated service/blog content).

## Owner confirmation still required

The following values were centralized without treating them as verified:

- Each phone number, WhatsApp number, email address, office hour, and stated response time.
- All street addresses, office labels, headquarters/branch designation, office contact associations, coordinates, and landmarks.
- Existing nationwide service-availability and response promises elsewhere on the site remain business claims and were not independently validated in this batch.

No details were corrected, inferred, or removed. The owner should confirm these values before relying on them as current public business information.

## Verification

- Focused test: `node --test client/tests/contactOfficeCentralization.test.js` — 3 passed, 0 failed.
- Production build: `npm run build --prefix client` — succeeded. Sitemap generator reported 44 URLs. Vite emitted the existing large-chunk warning for the 703 kB main bundle.
- Complete client suite: `npm test --prefix client` — 36 passed, 0 failed, 15 suites.
- The added tests verify exact contact values, stable office IDs, adapter output, and server-rendered contact cards, office cards, and footer details.
- Sitemap SHA-256 before build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367`.
- Sitemap SHA-256 after build: `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` (44 `<loc>` URLs). The generated sitemap content is unchanged.

No `.env` files or credentials were read. No Git commands, staging, commits, pushes, merges, PRs, or deployments were performed.

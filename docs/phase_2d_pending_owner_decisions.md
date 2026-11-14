# Phase 2D — Pending Owner Decisions

This checklist carries forward unresolved content and schema items from Phase 2C. Phase 2D made no changes to these items.

## P2C-01 — Loan advisor and financial-expert CTA

**Current rendered statement on all 20 loan pages:**

> “Discuss your financing requirements with our experienced loan advisors and financial experts.”

The shared CTA also labels the action “Consult compliance experts.” The same pages state that ClearFiling is not a lender and that lenders determine eligibility, terms and credit decisions.

**Owner confirmation needed:**

1. Does ClearFiling currently provide loan-related advisory/application assistance on these pages, or are these pages intended to be educational only?
2. If the service is provided, what exact scope can be claimed (for example, document guidance, application support, or another activity)? Do not imply lending, lender affiliation, or guaranteed outcomes unless separately confirmed and supportable.
3. Are “experienced loan advisors” and “financial experts” accurate descriptions of the people providing this service? If so, confirm the credentials/experience that may be stated publicly.
4. Should “Consult compliance experts” remain on loan pages, or should the CTA use an owner-approved neutral question/inquiry label?

**Until decided:** Do not add credentials or other business capabilities. Treat this as a high-priority content acceptance blocker for the 20-page implementation.

## P2C-02 — Generic `Offer` in Service structured data

The shared Service schema currently emits an `offers` object with `priceCurrency` and `availability: https://schema.org/InStock` on loan education pages, with no price. The code is shared with non-loan service schemas.

**Business/schema decision needed:**

1. Does the `Offer` describe a service ClearFiling itself sells, or could it be interpreted as availability of a loan/financial offer from a lender?
2. Is `InStock` factually meaningful for these informational routes?
3. Should loan educational routes have a different schema representation from fee-bearing compliance services? If so, what exact schema should represent the page and the actual ClearFiling service?
4. Confirm the intended answer with the business owner and schema/SEO reviewer before changing shared `SchemaHelpers.js` behavior.

**Until decided:** The generic Offer remains unchanged; no price, lender or credit terms should be inferred.

## P2C-04 — Vehicle Loan vs. Commercial Vehicle Loan scope

Both pages use fleet language, and the vehicle-loan page is positioned as a business fleet hub. Their educational sections differ but share some lender-term and fleet framing.

**Owner/editorial decision needed:**

1. Should `/services/vehicle-loan` be a broad overview of vehicle finance, or specifically a business fleet guide?
2. Which audience and asset types are intended for `/services/commercial-vehicle-loan`?
3. Confirm the distinction before rewriting titles, headings or body copy. Keep the current routes and indexability unchanged absent a separate SEO decision.

## Other Phase 2C follow-ups

- **P2C-05 — Repeated FAQs (Low):** the same approval-decision question appears on 13 loan pages; the same documents question appears on four. Decide whether to keep the repeated lender-neutral guidance or replace some questions with route-specific questions. Recheck rendered visibility and FAQPage parity after any copy change.
- **P2C-06 — MSME description length (Low):** the `/services/msme-loan` meta description is 165 characters. Decide whether a shorter version is desirable; this is optional because search snippets are not fixed-length and no technical defect was found.
- **P2C-03 — Initial bundle:** Phase 2D moved long editorial text and FAQs out of the initial shared entry. The chunk-size warning remains, so any additional optimization should be separately measured and should preserve SSR/hydration.
- **Responsive/accessibility acceptance:** Phase 2C reviewed source classes and native FAQ semantics, but did not run mobile-device, screen-reader, axe or visual overflow testing. These are test/QA follow-ups rather than business-owner decisions.
- **Live deployment acceptance:** No Vercel deployment or HTTP test was performed in Phase 2D. Do not treat local browser behavior as deployed-route acceptance.

## Phase 2D non-changes

Phase 2D did not alter the CTA, generic Offer schema, FAQ wording, metadata copy, educational text, service slugs, redirects, canonicals, robots, sitemap or production configuration. No owner confirmation is implied by the performance split.

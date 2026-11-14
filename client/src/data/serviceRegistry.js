/**
 * serviceRegistry.js
 * Centralized service registry for ClearFiling.
 * Single source of truth for service slugs, category mappings, indexability,
 * hierarchy, and redirect routing.
 *
 * Audit Reconciliation (Original 92 Catalogue Records):
 * - 89 Canonical Service Pages (23 indexable, 66 noindex Coming Soon)
 * - 2 Redirected Services (udyam-registration -> msme-registration, import-export-code -> iec-registration)
 * - 1 Merged Duplicate (digital-signature duplicate object removed from Digital Solutions and merged into Business Registrations)
 * Total Accounted Records: 89 + 2 + 1 = 92
 */

export const CATEGORY_SLUG_MAP = {
  'Business Formation': 'business-formation',
  'Business Registrations': 'business-registrations',
  'Trademark & Intellectual Property': 'trademark-ip',
  'GST & Indirect Tax': 'gst-indirect-tax',
  'Income Tax Services': 'income-tax',
  'Corporate Compliance': 'corporate-compliance',
  'International Business Services': 'international-business',
  'Digital Solutions': 'digital-solutions',
  'Loan Services': 'loan-services',
};

export const SLUG_TO_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([cat, slug]) => [slug, cat])
);

/**
 * 23 currently indexable service slugs (Phase 2B baseline):
 * - 3 Flagship corporate services
 * - 20 Active loan services
 */
export const INDEXABLE_SERVICE_SLUGS = [
  // Flagship Corporate Services
  'private-limited-company',
  'gst-registration',
  'trademark-registration',
  // Active Loan Services
  'personal-loan',
  'home-loan',
  'business-loan',
  'msme-loan',
  'startup-loan',
  'working-capital-loan',
  'education-loan',
  'vehicle-loan',
  'car-loan',
  'bike-loan',
  'gold-loan',
  'loan-against-property',
  'machinery-loan',
  'equipment-finance',
  'project-loan',
  'cash-credit',
  'overdraft-facility',
  'professional-loan',
  'commercial-vehicle-loan',
  'construction-loan',
];

/**
 * Permanent redirect mappings (Client Decisions CD-2 and CD-3)
 */
export const REDIRECT_SERVICE_MAP = {
  'udyam-registration': '/services/msme-registration',
  'import-export-code': '/services/iec-registration',
};

/**
 * Information on consolidated duplicate records removed from the catalogue array
 */
export const CONSOLIDATED_DUPLICATES = [
  {
    slug: 'digital-signature',
    originalCategory: 'Digital Solutions',
    primaryCategory: 'Business Registrations',
    action: 'MERGED',
    reason: 'Duplicate Class 3 DSC record consolidated into single canonical record with secondary category visibility in Digital Solutions.',
  },
];

/**
 * Full catalogue registry entries
 */
export const SERVICE_REGISTRY = [
  // ── Business Formation (8 Services) ──────────────────────────
  {
    slug: 'private-limited-company',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'llp-registration',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'private-limited-company',
    redirectTo: null,
  },
  {
    slug: 'opc-registration',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'private-limited-company',
    redirectTo: null,
  },
  {
    slug: 'partnership-firm',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'public-limited-company',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'private-limited-company',
    redirectTo: null,
  },
  {
    slug: 'producer-company',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'section-8-organization',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'trust-registration',
    categorySlug: 'business-formation',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'section-8-organization',
    redirectTo: null,
  },

  // ── Business Registrations (13 Records: 11 Canonical + 2 Redirects) ───
  {
    slug: 'msme-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'startup-india-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'iec-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'trade-license',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'shop-establishment',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'digital-signature',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: ['digital-solutions'],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'iso-certification',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'professional-tax-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'fssai-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'udyam-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'redirect',
    pageRole: 'redirect',
    parentServiceSlug: null,
    redirectTo: '/services/msme-registration',
  },
  {
    slug: 'import-export-code',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'redirect',
    pageRole: 'redirect',
    parentServiceSlug: null,
    redirectTo: '/services/iec-registration',
  },
  {
    slug: 'barcode-registration',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'bis-certification',
    categorySlug: 'business-registrations',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },

  // ── Trademark & Intellectual Property (10 Services) ──────────
  {
    slug: 'trademark-registration',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'trademark-renewal',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'trademark-objection',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'trademark-opposition',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'trademark-hearing',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'trademark-rectification',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'copyright-registration',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'patent-registration',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'industrial-design-registration',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'trademark-assignment',
    categorySlug: 'trademark-ip',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },

  // ── GST & Indirect Tax (10 Services) ─────────────────────────
  {
    slug: 'gst-registration',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'gst-return-filing',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-annual-return',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-notice-reply',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-amendment',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-revocation',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-cancellation',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-lut',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'gst-foreign-business',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: ['international-business'],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },
  {
    slug: 'virtual-office-gst',
    categorySlug: 'gst-indirect-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'gst-registration',
    redirectTo: null,
  },

  // ── Income Tax Services (9 Services) ─────────────────────────
  {
    slug: 'income-tax-filing',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'business-itr',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },
  {
    slug: 'company-itr',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },
  {
    slug: 'llp-itr',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },
  {
    slug: 'ngo-tax-filing',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },
  {
    slug: 'tds-return',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'tan-registration',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'tds-return',
    redirectTo: null,
  },
  {
    slug: 'income-tax-notice',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },
  {
    slug: 'revised-return',
    categorySlug: 'income-tax',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'income-tax-filing',
    redirectTo: null,
  },

  // ── Corporate Compliance (12 Services) ────────────────────────
  {
    slug: 'annual-compliance',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'llp-compliance',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'opc-compliance',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'din-kyc',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'director-change',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'registered-office-change',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'share-transfer',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'moa-amendment',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'aoa-amendment',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'authorized-capital-increase',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'dormant-company-filing',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },
  {
    slug: 'company-closure',
    categorySlug: 'corporate-compliance',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'annual-compliance',
    redirectTo: null,
  },

  // ── International Business Services (6 Services) ─────────────
  {
    slug: 'uae-company-setup',
    categorySlug: 'international-business',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'international-advisory',
    redirectTo: null,
  },
  {
    slug: 'usa-company-registration',
    categorySlug: 'international-business',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'international-advisory',
    redirectTo: null,
  },
  {
    slug: 'uk-company-registration',
    categorySlug: 'international-business',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'international-advisory',
    redirectTo: null,
  },
  {
    slug: 'singapore-business-setup',
    categorySlug: 'international-business',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'international-advisory',
    redirectTo: null,
  },
  {
    slug: 'overseas-trademark',
    categorySlug: 'international-business',
    secondaryCategorySlugs: ['trademark-ip'],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'trademark-registration',
    redirectTo: null,
  },
  {
    slug: 'international-advisory',
    categorySlug: 'international-business',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },

  // ── Digital Solutions (3 Canonical Services) ─────────────────
  // Note: digital-signature duplicate removed; primary category is Business Registrations
  // with secondaryCategorySlugs: ['digital-solutions'].
  {
    slug: 'website-development',
    categorySlug: 'digital-solutions',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'ecommerce-website-development',
    categorySlug: 'digital-solutions',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'website-development',
    redirectTo: null,
  },
  {
    slug: 'custom-web-applications',
    categorySlug: 'digital-solutions',
    secondaryCategorySlugs: [],
    indexStatus: 'noindex',
    pageRole: 'service',
    parentServiceSlug: 'website-development',
    redirectTo: null,
  },

  // ── Loan Services (20 Services, all indexable) ────────────────
  {
    slug: 'personal-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'home-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'business-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'msme-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'startup-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'working-capital-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'education-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'vehicle-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'hub',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'car-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'vehicle-loan',
    redirectTo: null,
  },
  {
    slug: 'bike-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'vehicle-loan',
    redirectTo: null,
  },
  {
    slug: 'gold-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'loan-against-property',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: null,
    redirectTo: null,
  },
  {
    slug: 'machinery-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'equipment-finance',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'project-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'cash-credit',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'working-capital-loan',
    redirectTo: null,
  },
  {
    slug: 'overdraft-facility',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'working-capital-loan',
    redirectTo: null,
  },
  {
    slug: 'professional-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'business-loan',
    redirectTo: null,
  },
  {
    slug: 'commercial-vehicle-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'vehicle-loan',
    redirectTo: null,
  },
  {
    slug: 'construction-loan',
    categorySlug: 'loan-services',
    secondaryCategorySlugs: [],
    indexStatus: 'index',
    pageRole: 'service',
    parentServiceSlug: 'home-loan',
    redirectTo: null,
  },
];

/**
 * Registry Lookup Map by slug
 */
export const SERVICE_REGISTRY_MAP = new Map(
  SERVICE_REGISTRY.map((entry) => [entry.slug, entry])
);

/**
 * Derived Slugs
 */
export const NOINDEX_SERVICE_SLUGS = SERVICE_REGISTRY
  .filter((entry) => entry.indexStatus === 'noindex')
  .map((entry) => entry.slug);

export const REDIRECTED_SERVICE_SLUGS = Object.keys(REDIRECT_SERVICE_MAP);

export const CANONICAL_SERVICE_SLUGS = SERVICE_REGISTRY
  .filter((entry) => entry.indexStatus !== 'redirect')
  .map((entry) => entry.slug);

/**
 * Audit Counts
 */
export const ACCOUNTED_CATALOGUE_TOTAL = 92;
export const CANONICAL_SERVICES_COUNT = CANONICAL_SERVICE_SLUGS.length; // 89
export const INDEXABLE_SERVICES_COUNT = INDEXABLE_SERVICE_SLUGS.length; // 23
export const NOINDEX_SERVICES_COUNT = NOINDEX_SERVICE_SLUGS.length;     // 66
export const REDIRECTED_SERVICES_COUNT = REDIRECTED_SERVICE_SLUGS.length; // 2
export const CONSOLIDATED_DUPLICATE_COUNT = CONSOLIDATED_DUPLICATES.length; // 1

/**
 * Selectors & Helper functions
 */
export const getRegistryEntry = (slug) => {
  if (!slug) return null;
  return SERVICE_REGISTRY_MAP.get(slug) || null;
};

export const isServiceIndexable = (slug) => {
  if (!slug) return false;
  return INDEXABLE_SERVICE_SLUGS.includes(slug);
};

export const getRedirectTarget = (slug) => {
  if (!slug) return null;
  return REDIRECT_SERVICE_MAP[slug] || null;
};

export const isRedirectedService = (slug) => {
  return Boolean(REDIRECT_SERVICE_MAP[slug]);
};

export default {
  CATEGORY_SLUG_MAP,
  SLUG_TO_CATEGORY_MAP,
  INDEXABLE_SERVICE_SLUGS,
  NOINDEX_SERVICE_SLUGS,
  REDIRECT_SERVICE_MAP,
  CONSOLIDATED_DUPLICATES,
  SERVICE_REGISTRY,
  SERVICE_REGISTRY_MAP,
  CANONICAL_SERVICE_SLUGS,
  ACCOUNTED_CATALOGUE_TOTAL,
  CANONICAL_SERVICES_COUNT,
  INDEXABLE_SERVICES_COUNT,
  NOINDEX_SERVICES_COUNT,
  REDIRECTED_SERVICES_COUNT,
  CONSOLIDATED_DUPLICATE_COUNT,
  getRegistryEntry,
  isServiceIndexable,
  getRedirectTarget,
  isRedirectedService,
};


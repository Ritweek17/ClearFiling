/**
 * seo.js — SEO configuration for every page on the website.
 * Includes meta tags, Open Graph, Twitter Cards, and JSON-LD schema templates.
 * Update page-level SEO by adding entries to PAGES.
 */

import BUSINESS from './business.js';
import CONTACT from './contact.js';
import OFFICE_LOCATIONS from '../data/officeLocations.js';

export const ORGANIZATION_ID = `${BUSINESS.websiteUrl}#organization`;
export const WEBSITE_ID = `${BUSINESS.websiteUrl}#website`;

export const HOME_TITLE = `${BUSINESS.primaryBrandName} (${BUSINESS.alternateBrandName}) | Business Registration, GST & Tax Compliance India`;
export const HOME_DESCRIPTION =
  `${BUSINESS.primaryBrandName} (also known as ${BUSINESS.alternateBrandName}) provides corporate compliance, company registration, GST filing, income tax, and trademark services across India.`;
export const HOME_KEYWORDS =
  `${BUSINESS.primaryBrandName}, ${BUSINESS.alternateBrandName}, ${BUSINESS.legalName}, company registration India, GST filing, ITR filing, trademark registration, business compliance India`;

const officeCityNames = BUSINESS.physicalOfficeCities;
const officeCitiesOxford = `${officeCityNames.slice(0, -1).join(', ')}, and ${officeCityNames[officeCityNames.length - 1]}`;
const officeCitiesAmpersand = `${officeCityNames.slice(0, -1).join(', ')} & ${officeCityNames[officeCityNames.length - 1]}`;

// ── Base site-level config ───────────────────────────────────────────────────
export const SEO_BASE = {
  siteName: BUSINESS.primaryBrandName,
  siteUrl: BUSINESS.websiteUrl,
  defaultTitle: HOME_TITLE,
  defaultDescription: HOME_DESCRIPTION,
  defaultKeywords: HOME_KEYWORDS,
  locale: 'en_IN',
  twitterHandle: '@clearfilingllp',
  ogImage: `${BUSINESS.url}/og-image.jpg`,
};

// ── Page-level SEO ───────────────────────────────────────────────────────────
export const PAGE_SEO = {
  home: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonical: BUSINESS.websiteUrl,
    keywords: HOME_KEYWORDS,
  },
  about: {
    title: `About ${BUSINESS.primaryBrandName} (${BUSINESS.alternateBrandName}) | Trusted CA, CS & Legal Advisory Firm Since 2020`,
    description: `${BUSINESS.legalName} (${BUSINESS.primaryBrandName} / ${BUSINESS.alternateBrandName}) is a corporate advisory firm with offices in ${officeCitiesOxford}. Expert CAs, CSs, and legal advisors serving 10,000+ clients.`,
    canonical: `${BUSINESS.url}/about`,
  },
  contact: {
    title: `Contact ${BUSINESS.primaryBrandName} (${BUSINESS.alternateBrandName}) | ${officeCitiesAmpersand}`,
    description: `Get in touch with ${BUSINESS.primaryBrandName} (${BUSINESS.alternateBrandName}) compliance experts. Call ${CONTACT.mobile.display}, WhatsApp, or email ${CONTACT.email.display} / ${CONTACT.email2.display}. Free consultation, ${CONTACT.hours.faqShort}.`,
    canonical: `${BUSINESS.url}/contact`,
    keywords: `contact CA firm Delhi, compliance advisor contact, company registration help, GST expert contact, ${BUSINESS.primaryBrandName}, ${BUSINESS.alternateBrandName}`,
    ogImage: `${BUSINESS.url}/og-contact.jpg`,
  },
  services: {
    title: `Business Registration & Compliance Services India | ${BUSINESS.primaryBrandName}`,
    description: 'Explore 60+ professional compliance services including company registration, GST, trademark, income tax, annual returns, MSME, IEC, FSSAI and more.',
    canonical: `${BUSINESS.url}/services`,
  },
  blog: {
    title: `Compliance Blog & Business Guides | ${BUSINESS.primaryBrandName}`,
    description: `Expert articles on company registration, GST, trademark, income tax, and business compliance in India — written by CAs and CSs at ${BUSINESS.primaryBrandName}.`,
    canonical: `${BUSINESS.url}/blog`,
  },
  resources: {
    title: `Business Resource Guides | ${BUSINESS.primaryBrandName} Knowledge Centre`,
    description: 'Free guides on company registration, GST, trademark, annual compliance, and startup recognition for Indian businesses.',
    canonical: `${BUSINESS.url}/resources`,
  },
};

// ── JSON-LD Schema Generators ─────────────────────────────────────────────────

/**
 * WebSite schema — used on homepage
 */
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: BUSINESS.websiteUrl,
  name: BUSINESS.primaryBrandName,
  alternateName: BUSINESS.alternateBrandName,
  publisher: {
    '@id': ORGANIZATION_ID,
  },
});

/**
 * Organization schema — single canonical brand entity
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LegalService'],
  '@id': ORGANIZATION_ID,
  name: BUSINESS.primaryBrandName,
  legalName: BUSINESS.legalName,
  alternateName: BUSINESS.alternateBrandName,
  url: BUSINESS.websiteUrl,
  logo: BUSINESS.logoUrl,
  description: BUSINESS.description,
  foundingDate: String(BUSINESS.established),
  telephone: CONTACT.mobile.display,
  email: CONTACT.email.display,
  address: OFFICE_LOCATIONS.map((office) => ({
    '@type': 'PostalAddress',
    streetAddress: office.schema.streetAddress,
    addressLocality: office.schema.addressLocality,
    ...(office.schema.addressRegion ? { addressRegion: office.schema.addressRegion } : {}),
    postalCode: office.schema.postalCode,
    addressCountry: office.countryCode,
  })),
  sameAs: [
    'https://www.facebook.com/share/1BZxGC9K7z/?mibextid=wwXIfr',
    'https://www.instagram.com/clearfilingllp',
  ],
  areaServed: BUSINESS.areaServed,
  priceRange: BUSINESS.priceRange,
});

/**
 * LocalBusiness schema — for all three offices linked to main Organization
 */
export const getLocalBusinessSchema = () =>
  OFFICE_LOCATIONS.map((office) => ({
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${BUSINESS.websiteUrl}#office-${office.id}`,
    name: `${BUSINESS.primaryBrandName} — ${office.city}`,
    alternateName: BUSINESS.alternateBrandName,
    url: BUSINESS.websiteUrl,
    telephone: office.phone,
    email: office.email,
    openingHours: CONTACT.hours.schema,
    parentOrganization: {
      '@id': ORGANIZATION_ID,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.schema.streetAddress,
      addressLocality: office.schema.addressLocality,
      ...(office.schema.addressRegion ? { addressRegion: office.schema.addressRegion } : {}),
      postalCode: office.schema.postalCode,
      addressCountry: office.countryCode,
    },
    ...(office.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: office.geo.lat,
            longitude: office.geo.lng,
          },
        }
      : {}),
  }));

/**
 * ContactPage schema
 */
export const getContactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Contact ${BUSINESS.primaryBrandName}`,
  url: `${BUSINESS.url}/contact`,
  description: PAGE_SEO.contact.description,
  mainEntity: getOrganizationSchema(),
});

/**
 * BreadcrumbList schema generator
 */
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.websiteUrl },
    ...items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: item.name,
      item: `${BUSINESS.url}${item.path}`,
    })),
  ],
});

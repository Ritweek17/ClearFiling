/**
 * seo.js — SEO configuration for every page on the website.
 * Includes meta tags, Open Graph, Twitter Cards, and JSON-LD schema templates.
 * Update page-level SEO by adding entries to PAGES.
 */

import BUSINESS from './business.js';
import CONTACT from './contact.js';

// ── Base site-level config ───────────────────────────────────────────────────
export const SEO_BASE = {
  siteName: BUSINESS.legalName,
  siteUrl: BUSINESS.url,
  defaultTitle: `${BUSINESS.name} | CA, Legal & Corporate Compliance Services`,
  defaultDescription: BUSINESS.description,
  locale: 'en_IN',
  twitterHandle: '@clearfilingllp',
  ogImage: `${BUSINESS.url}/og-image.jpg`,
};

// ── Page-level SEO ───────────────────────────────────────────────────────────
export const PAGE_SEO = {
  home: {
    title: `${BUSINESS.name} | Company Registration, GST, Trademark & Compliance Services`,
    description: 'Expert CA, legal, and compliance services across India. Company registration, GST, trademark, income tax, annual ROC compliance. Free consultation available.',
    canonical: BUSINESS.url,
    keywords: 'company registration India, GST registration, trademark registration, CA firm Delhi, compliance services',
  },
  about: {
    title: `About Clear Filing | Trusted CA, CS & Legal Advisory Firm Since 2020`,
    description: 'Clear Filing & Compliance LLP is a premium corporate advisory firm with offices in Delhi and Deoria. Expert CAs, CSs, and legal advisors serving 10,000+ clients.',
    canonical: `${BUSINESS.url}/about`,
  },
  contact: {
    title: `Contact Clear Filing | CA, CS & Compliance Advisory — Delhi & Deoria`,
    description: 'Get in touch with Clear Filing's compliance experts. Call +91 9250201718, WhatsApp, or email clearfilling@zohomail.in. Free consultation, 9 AM – 9 PM, 7 days.',
    canonical: `${BUSINESS.url}/contact`,
    keywords: 'contact CA firm Delhi, compliance advisor contact, company registration help, GST expert contact',
    ogImage: `${BUSINESS.url}/og-contact.jpg`,
  },
  services: {
    title: `Business Registration & Compliance Services India | Clear Filing`,
    description: 'Explore 60+ professional compliance services including company registration, GST, trademark, income tax, annual returns, MSME, IEC, FSSAI and more.',
    canonical: `${BUSINESS.url}/services`,
  },
  blog: {
    title: `Compliance Blog & Business Guides | Clear Filing`,
    description: 'Expert articles on company registration, GST, trademark, income tax, and business compliance in India — written by CAs and CSs at Clear Filing.',
    canonical: `${BUSINESS.url}/blog`,
  },
  resources: {
    title: `Business Resource Guides | Clear Filing Knowledge Centre`,
    description: 'Free guides on company registration, GST, trademark, annual compliance, and startup recognition for Indian businesses.',
    canonical: `${BUSINESS.url}/resources`,
  },
};

// ── JSON-LD Schema Generators ─────────────────────────────────────────────────

/**
 * Organization schema — used on every page
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: BUSINESS.legalName,
  alternateName: BUSINESS.name,
  url: BUSINESS.url,
  logo: BUSINESS.logoUrl,
  description: BUSINESS.description,
  foundingDate: String(BUSINESS.established),
  telephone: CONTACT.mobile.display,
  email: CONTACT.email.display,
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'E-20, Lajpat Nagar III',
      addressLocality: 'New Delhi',
      postalCode: '110024',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road',
      addressLocality: 'Deoria',
      addressRegion: 'Uttar Pradesh',
      postalCode: '274001',
      addressCountry: 'IN',
    },
  ],
  sameAs: [
    'https://www.facebook.com/share/1BZxGC9K7z/?mibextid=wwXIfr',
    'https://www.instagram.com/clearfilingllp',
  ],
  areaServed: BUSINESS.areaServed,
  priceRange: BUSINESS.priceRange,
});

/**
 * LocalBusiness schema — for both offices
 */
export const getLocalBusinessSchema = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: BUSINESS.legalName,
    url: BUSINESS.url,
    telephone: CONTACT.mobile.display,
    email: CONTACT.email.display,
    openingHours: 'Mo-Su 09:00-21:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E-20, Lajpat Nagar III',
      addressLocality: 'New Delhi',
      postalCode: '110024',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 28.5659, longitude: 77.2433 },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: `${BUSINESS.legalName} — Deoria`,
    url: BUSINESS.url,
    telephone: CONTACT.landline.display,
    openingHours: 'Mo-Su 09:00-21:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road',
      addressLocality: 'Deoria',
      addressRegion: 'Uttar Pradesh',
      postalCode: '274001',
      addressCountry: 'IN',
    },
  },
];

/**
 * ContactPage schema
 */
export const getContactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Contact ${BUSINESS.name}`,
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
    { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.url },
    ...items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: item.name,
      item: `${BUSINESS.url}${item.path}`,
    })),
  ],
});

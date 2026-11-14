/**
 * footerConfig.js
 * Centralized configuration for the Footer component.
 * All footer data is stored here. Footer.jsx renders only from this config.
 * Update this file to change any footer content, links, or contact info.
 */

import BUSINESS from '../config/business.js';
import CONTACT from '../config/contact.js';
import OFFICE_LOCATIONS from './officeLocations.js';

// ─── COMPANY ──────────────────────────────────────────────────────────────────
export const FOOTER_COMPANY = {
  brandName: BUSINESS.primaryBrandName,
  alternateBrandName: BUSINESS.alternateBrandName,
  legalName: BUSINESS.legalName,
  tagline: BUSINESS.tagline,
  established: BUSINESS.established,
  description: BUSINESS.description,
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export const FOOTER_CONTACT = {
  mobile: CONTACT.mobile,
  landline: CONTACT.landline,
  gorakhpur: CONTACT.gorakhpur,
  email: CONTACT.email,
  emails: [CONTACT.email, CONTACT.email2],
  whatsapp: {
    href: CONTACT.whatsapp.href,
    display: 'WhatsApp Inquiry',
  },
  hours: { display: CONTACT.hours.display, note: CONTACT.hours.note },
};

// ─── OFFICES ──────────────────────────────────────────────────────────────────
export const FOOTER_OFFICES = OFFICE_LOCATIONS.map((office) => ({
  id: office.id,
  label: office.label,
  ...(office.footerPhone ? { phone: office.footerPhone } : {}),
  lines: office.companyLines,
  mapsUrl: office.mapsUrl,
}));

// ─── SOCIAL ───────────────────────────────────────────────────────────────────
// Only include verified social accounts. Hidden if href is null.
export const FOOTER_SOCIAL = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1BZxGC9K7z/?mibextid=wwXIfr',
    icon: 'Facebook',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/clearfilingllp',
    icon: 'Instagram',
  },
  // LinkedIn and X hidden until official pages are created
  // { id: 'linkedin', label: 'LinkedIn', href: null, icon: 'Linkedin' },
  // { id: 'twitter',  label: 'Twitter / X', href: null, icon: 'Twitter' },
];

// ─── QUICK LINKS ──────────────────────────────────────────────────────────────
// All internal React Router <Link> paths. section: true enables smooth scroll on home page.
export const FOOTER_QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Documentation', to: '/', section: 'documentation' },
  { label: 'Why Choose Us', to: '/', section: 'why-choose' },
  { label: 'Testimonials', to: '/', section: 'testimonials' },
  { label: 'FAQ', to: '/', section: 'faq' },
  { label: 'Contact Us', to: '/contact' },
];

export const FOOTER_LOANS = [
  { label: 'Personal Loan',             slug: 'personal-loan' },
  { label: 'Home Loan',                 slug: 'home-loan' },
  { label: 'Business Loan',             slug: 'business-loan' },
  { label: 'MSME Loan',                 slug: 'msme-loan' },
  { label: 'Working Capital Loan',      slug: 'working-capital-loan' },
  { label: 'Startup Loan',              slug: 'startup-loan' },
  { label: 'Education Loan',            slug: 'education-loan' },
  { label: 'Vehicle Loan',              slug: 'vehicle-loan' },
  { label: 'Loan Against Property',     slug: 'loan-against-property' },
  { label: 'View All Loan Services',    to: '/services?category=Loan%20Services' },
];

// ─── POPULAR SERVICES ─────────────────────────────────────────────────────────
// slug: string  → links to /services/:slug (dynamic page, active)
// slug: null    → links to /services (services listing page)
export const FOOTER_SERVICES = [
  { label: 'Private Limited Company',  slug: 'private-limited-company' },
  { label: 'LLP Registration',          slug: 'llp-registration' },
  { label: 'One Person Company',        slug: 'opc-registration' },
  { label: 'GST Registration',          slug: 'gst-registration' },
  { label: 'Trademark Registration',    slug: 'trademark-registration' },
  { label: 'MSME Registration',         slug: 'msme-registration' },
  { label: 'IEC Registration',          slug: 'iec-registration' },
  { label: 'FSSAI Registration',        slug: 'fssai-registration' },
  { label: 'Income Tax Filing',         slug: 'income-tax-filing' },
  { label: 'Annual Compliance',         slug: 'annual-compliance' },
  { label: 'Business Advisory',         slug: null },
  { label: 'Digital Signature',         slug: 'digital-signature' },
];

// ─── RESOURCES ────────────────────────────────────────────────────────────────
// to: string  → future page route (prepared but not live yet, renders as styled span)
// to: null    → no page yet, also renders as styled span
export const FOOTER_RESOURCES = [
  { label: 'Company Registration Guide', to: '/resources/company-registration' },
  { label: 'GST Guide',                  to: '/resources/gst-guide' },
  { label: 'Trademark Guide',            to: '/resources/trademark-guide' },
  { label: 'Compliance Guide',           to: '/resources/compliance-guide' },
  { label: 'Startup Guide',             to: '/resources/startup-guide' },
  { label: 'Business Resources',         to: '/resources' },
  { label: 'Blog & Updates',            to: '/blog' },
];

// ─── LEGAL LINKS ──────────────────────────────────────────────────────────────
export const FOOTER_LEGAL = [
  { label: 'Privacy Policy',      to: '/privacy-policy' },
  { label: 'Terms & Conditions',  to: '/terms' },
  { label: 'Disclaimer',          to: '/disclaimer' },
];

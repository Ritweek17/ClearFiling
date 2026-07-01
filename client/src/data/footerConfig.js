/**
 * footerConfig.js
 * Centralized configuration for the Footer component.
 * All footer data is stored here. Footer.jsx renders only from this config.
 * Update this file to change any footer content, links, or contact info.
 */

// ─── COMPANY ──────────────────────────────────────────────────────────────────
export const FOOTER_COMPANY = {
  brandName: 'ClearFiling',
  legalName: 'ClearFiling & Compliance LLP',
  tagline: 'Integrity • Sincerity • Dedication',
  established: 2020,
  description:
    'Clear Filing is a modern corporate advisory and compliance firm helping startups, MSMEs and enterprises with company registration, taxation, legal compliance and business advisory services across India.',
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export const FOOTER_CONTACT = {
  mobile: { display: '+91 9250201718', href: 'tel:+919250201718' },
  landline: { display: '05568-450351', href: 'tel:05568450351' },
  email: { display: 'clearfilling@zohomail.in', href: 'mailto:clearfilling@zohomail.in' },
  whatsapp: {
    href: 'https://wa.me/919250201718?text=Hi%20ClearFiling%2C%20I%20need%20compliance%20assistance%20for%20my%20business.',
    display: 'WhatsApp Inquiry',
  },
  hours: { display: '9:00 AM – 9:00 PM', note: 'Open 7 Days a Week' },
};

// ─── OFFICES ──────────────────────────────────────────────────────────────────
export const FOOTER_OFFICES = [
  {
    id: 'delhi',
    label: 'Delhi Office',
    lines: ['E-20, Lajpat Nagar III,', 'New Delhi – 110024, India'],
    // Future: mapsUrl: 'https://maps.google.com/?q=...'
    mapsUrl: null,
  },
  {
    id: 'deoria',
    label: 'Deoria Office',
    lines: [
      'Asha Complex, 30 Feet Road,',
      'Near Nahar, Bhikhampur Road,',
      'Deoria, Uttar Pradesh – 274001',
    ],
    mapsUrl: null,
  },
];

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
  { label: 'Why Choose Us', to: '/', section: 'why-choose' },
  { label: 'Testimonials', to: '/', section: 'testimonials' },
  { label: 'FAQ', to: '/', section: 'faq' },
  { label: 'Contact Us', to: '/contact' },
];

// ─── POPULAR SERVICES ─────────────────────────────────────────────────────────
// slug: string  → links to /services/:slug (dynamic page, active)
// slug: null    → links to /services (services listing page)
export const FOOTER_SERVICES = [
  { label: 'Private Limited Company',  slug: 'private-limited-company' },
  { label: 'LLP Registration',          slug: null },
  { label: 'One Person Company',        slug: null },
  { label: 'GST Registration',          slug: 'gst-registration' },
  { label: 'Trademark Registration',    slug: 'trademark-registration' },
  { label: 'MSME Registration',         slug: null },
  { label: 'IEC Registration',          slug: null },
  { label: 'FSSAI Registration',        slug: null },
  { label: 'Income Tax Filing',         slug: null },
  { label: 'Annual Compliance',         slug: null },
  { label: 'Business Advisory',         slug: null },
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

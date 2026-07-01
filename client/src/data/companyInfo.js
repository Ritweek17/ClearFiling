/**
 * companyInfo.js
 * Single source of truth for all ClearFiling company information.
 * Used across the website for SEO schema, contact sections, header, and footer.
 */
export const COMPANY_INFO = {
  brandName: 'ClearFiling',
  legalName: 'ClearFiling & Compliance LLP',
  tagline: 'Integrity • Sincerity • Dedication',
  shortDescription:
    'Clear Filing is a modern corporate advisory and compliance firm helping startups, MSMEs and enterprises with company registration, taxation, legal compliance and business advisory services across India.',
  established: 2020,
  experience: '6+ Years',
  clientsServed: '10,000+',
  professionals: 5,
  experts: ['CA', 'CS', 'Legal Advisors', 'Merchant Bankers', 'Cost Accountants'],

  contact: {
    mobile: { display: '+91 9250201718', href: 'tel:+919250201718' },
    landline: { display: '05568-450351', href: 'tel:05568450351' },
    email: { display: 'clearfilling@zohomail.in', href: 'mailto:clearfilling@zohomail.in' },
    whatsappNumber: '919250201718',
    whatsappHref: 'https://wa.me/919250201718',
    hours: '9:00 AM – 9:00 PM, Open 7 Days',
  },

  offices: [
    {
      id: 'delhi',
      city: 'New Delhi',
      label: 'Delhi Office',
      address: 'E-20, Lajpat Nagar III, New Delhi – 110024, India',
      lines: ['E-20, Lajpat Nagar III,', 'New Delhi – 110024, India'],
      mapsUrl: null,
    },
    {
      id: 'deoria',
      city: 'Deoria',
      label: 'Deoria Office',
      address: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road, Deoria, Uttar Pradesh – 274001',
      lines: [
        'Asha Complex, 30 Feet Road,',
        'Near Nahar, Bhikhampur Road,',
        'Deoria, Uttar Pradesh – 274001',
      ],
      mapsUrl: null,
    },
  ],

  social: {
    facebook: 'https://www.facebook.com/share/1BZxGC9K7z/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/clearfilingllp',
    linkedin: null,   // Not available yet
    twitter: null,    // Not available yet
  },

  seo: {
    siteUrl: 'https://clearfiling.in',
    organizationType: 'ProfessionalService',
    legalType: 'LLP',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Bank Transfer, UPI',
    areaServed: 'India',
  },
};

export default COMPANY_INFO;

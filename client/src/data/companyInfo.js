/**
 * companyInfo.js
 * Single source of truth for all ClearFiling company information.
 * Used across the website for SEO schema, contact sections, header, and footer.
 */
import BUSINESS from '../config/business.js';
import CONTACT from '../config/contact.js';
import OFFICE_LOCATIONS from './officeLocations.js';

const COMPANY_CONTACT = {
  mobile: CONTACT.mobile,
  landline: CONTACT.landline,
  gorakhpur: CONTACT.gorakhpur,
  email: CONTACT.email,
  emails: [CONTACT.email, CONTACT.email2],
  whatsappNumber: CONTACT.whatsapp.number,
  whatsappHref: `https://wa.me/${CONTACT.whatsapp.number}`,
  hours: CONTACT.hours.companyInfoDisplay,
  responseSLA: {
    whatsapp: CONTACT.whatsappSLA,
    other: CONTACT.otherSLA,
  },
};

const COMPANY_OFFICES = OFFICE_LOCATIONS.map((office) => ({
  id: office.id,
  city: office.city,
  label: office.label,
  phone: office.phone,
  phoneHref: office.phoneHref,
  address: office.companyAddress,
  lines: office.companyLines,
  mapsUrl: office.mapsUrl,
}));

export const COMPANY_INFO = {
  brandName: BUSINESS.primaryBrandName,
  alternateBrandName: BUSINESS.alternateBrandName,
  name: BUSINESS.primaryBrandName,
  legalName: BUSINESS.legalName,
  tagline: BUSINESS.tagline,
  shortDescription: BUSINESS.description,
  serviceCoverage: BUSINESS.serviceCoverage,
  officeCities: BUSINESS.physicalOfficeCities,
  established: BUSINESS.established,
  experience: '6+ Years',
  clientsServed: '10,000+',
  filingsCompleted: '10,000+',
  clientSatisfaction: '99.4%',
  professionals: 5,
  qualifiedProfessionals: 5,
  servicesCount: '60+',
  experts: ['CA', 'CS', 'Legal Advisors', 'Merchant Bankers', 'Cost Accountants'],

  contact: COMPANY_CONTACT,

  offices: COMPANY_OFFICES,

  social: {
    facebook: 'https://www.facebook.com/share/1BZxGC9K7z/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/clearfilingllp',
    linkedin: null,   // Not available yet
    twitter: null,    // Not available yet
  },

  seo: {
    siteUrl: BUSINESS.websiteUrl,
    organizationType: 'LegalService',
    legalType: 'LLP',
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: 'Bank Transfer, UPI',
    areaServed: BUSINESS.areaServed,
  },
};

export default COMPANY_INFO;

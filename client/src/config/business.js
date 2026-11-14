/**
 * business.js — Single source of truth for all company information.
 * ALL components read from here. Never hardcode business info in components.
 * To update any business detail in the future: edit ONLY this file.
 */

import OFFICE_LOCATIONS from '../data/officeLocations.js';

const BRAND_WORDMARK = ['Clear', 'Filing'];
const BRAND_NAME = BRAND_WORDMARK.join('');
const PHYSICAL_OFFICE_CITIES = OFFICE_LOCATIONS.map((office) => office.label.replace(/ Office$/, ''));

const BUSINESS = {
  // Brand
  primaryBrandName: BRAND_NAME,
  brandWordmark: BRAND_WORDMARK,
  alternateBrandName: 'Clear Filing',
  name: BRAND_NAME,
  alternateName: 'Clear Filing',
  legalName: 'CLEARFILING AND COMPLIANCE LLP',
  tagline: 'Integrity, sanctity, dedication',
  abbreviation: 'CF',
  serviceCoverage: 'Online services across India',
  physicalOfficeCities: PHYSICAL_OFFICE_CITIES,
  established: 2020,
  description:
    'ClearFiling (also known as Clear Filing) is a modern corporate advisory and compliance firm helping startups, MSMEs and enterprises with company registration, taxation, legal compliance, and business advisory services across India.',

  // Metrics (update as firm grows)
  stats: {
    clientsServed: '10,000+',
    filingsCompleted: '10,000+',
    clientSatisfaction: '99.4%',
    qualifiedProfessionals: 5,
    professionals: 5,
    yearsExperience: '6+',
    officesCount: PHYSICAL_OFFICE_CITIES.length,
    officesLocations: PHYSICAL_OFFICE_CITIES.join(', '),
    servicesCount: '60+',
  },

  // SEO / Schema
  websiteUrl: 'https://www.clearfiling.co.in/',
  url: 'https://www.clearfiling.co.in',
  logoUrl: 'https://www.clearfiling.co.in/favicon.svg', // vector favicon
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Bank Transfer, UPI, Cheque',
  areaServed: 'India',
  serviceArea: 'IN',
};

export default BUSINESS;

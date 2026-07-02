/**
 * business.js — Single source of truth for all company information.
 * ALL components read from here. Never hardcode business info in components.
 * To update any business detail in the future: edit ONLY this file.
 */

const BUSINESS = {
  // Brand
  name: 'Clear Filing',
  legalName: 'Clear Filing & Compliance LLP',
  tagline: 'Integrity • Sanctity • Dedication',
  abbreviation: 'CF',
  established: 2020,
  description:
    'Clear Filing is a modern corporate advisory and compliance firm helping startups, MSMEs and enterprises with company registration, taxation, legal compliance, and business advisory services across India.',

  // Metrics (update as firm grows)
  stats: {
    clientsServed: '10,000+',
    yearsExperience: '6+',
    professionals: 5,
    officesCount: 3,
  },

  // SEO / Schema
  url: 'https://clearfiling.in',
  logoUrl: 'https://clearfiling.in/logo.png', // update when available
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Bank Transfer, UPI, Cheque',
  areaServed: 'India',
  serviceArea: 'IN',
};

export default BUSINESS;

/**
 * SchemaHelpers.js
 * Generates valid JSON-LD schema objects to inject into documents.
 */
import BUSINESS from '../../config/business.js';
import { ORGANIZATION_ID } from '../../config/seo.js';
import OFFICE_LOCATIONS from '../../data/officeLocations.js';
import CONTACT from '../../config/contact.js';

/**
 * Generates an FAQPage schema.
 * @param {Array} faqs - Array of objects with question and answer properties.
 */
export const generateFAQSchema = (faqs = []) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q || faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a || faq.answer
      }
    }))
  };
};

/**
 * Generates a Service schema.
 * @param {Object} service - Service config item.
 */
export const generateServiceSchema = (service) => {
  if (!service) return null;
  const hq = OFFICE_LOCATIONS[0];
  const serviceUrl = service.slug
    ? `${BUSINESS.url}/services/${service.slug}`
    : `${BUSINESS.url}/services`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    'name': service.title,
    'url': serviceUrl,
    'serviceType': service.title,
    'provider': {
      '@type': 'LegalService',
      '@id': ORGANIZATION_ID,
      'name': BUSINESS.primaryBrandName,
      'legalName': BUSINESS.legalName,
      'alternateName': BUSINESS.alternateBrandName,
      'url': BUSINESS.websiteUrl,
      'image': BUSINESS.logoUrl,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': hq.schema.streetAddress,
        'addressLocality': hq.schema.addressLocality,
        'addressRegion': hq.state,
        'postalCode': hq.schema.postalCode,
        'addressCountry': hq.countryCode
      }
    },
    'description': service.shortDescription || service.description,
    'areaServed': BUSINESS.serviceArea,
    'offers': {
      '@type': 'Offer',
      'priceCurrency': BUSINESS.currenciesAccepted,
      'availability': 'https://schema.org/InStock',
      'url': serviceUrl
    }
  };
};

/**
 * Generates a LocalBusiness schema for ClearFiling.
 * @param {Object} companyInfo - Company info details from companyInfo.js.
 */
export const generateLocalBusinessSchema = (companyInfo) => {
  if (!companyInfo) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': ORGANIZATION_ID,
    'name': companyInfo.brandName || companyInfo.name || BUSINESS.primaryBrandName,
    'legalName': companyInfo.legalName || BUSINESS.legalName,
    'alternateName': companyInfo.alternateBrandName || BUSINESS.alternateBrandName,
    'logo': BUSINESS.logoUrl,
    'telephone': companyInfo.contact.mobile?.display || CONTACT.mobile.display,
    'email': companyInfo.contact.email?.display || CONTACT.email.display,
    'url': BUSINESS.websiteUrl,
    'address': companyInfo.offices.map(office => ({
      '@type': 'PostalAddress',
      'addressLocality': office.city,
      'addressCountry': 'IN',
      'streetAddress': office.address
    })),
    'openingHours': CONTACT.hours.schema,
    'priceRange': BUSINESS.priceRange
  };
};

export default {
  generateFAQSchema,
  generateServiceSchema,
  generateLocalBusinessSchema
};

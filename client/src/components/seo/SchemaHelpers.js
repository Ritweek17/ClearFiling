/**
 * SchemaHelpers.js
 * Generates valid JSON-LD schema objects to inject into documents.
 */

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

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': service.title,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Clear Filing & Compliance LLP',
      'image': 'https://www.clearfiling.co.in/favicon.svg',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'E-20, Lajpat Nagar III',
        'addressLocality': 'New Delhi',
        'addressRegion': 'Delhi',
        'postalCode': '110024',
        'addressCountry': 'IN'
      }
    },
    'description': service.shortDescription || service.description,
    'areaServed': 'IN',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': 'Contact for Quote',
      'availability': 'https://schema.org/InStock'
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
    'name': companyInfo.name,
    'alternateName': companyInfo.brandName,
    'logo': 'https://www.clearfiling.co.in/favicon.svg',
    'telephone': companyInfo.contact.mobile?.display || '+91 9250201718',
    'email': companyInfo.contact.email?.display || 'clearfiling@zohomail.in',
    'url': 'https://www.clearfiling.co.in',
    'address': companyInfo.offices.map(office => ({
      '@type': 'PostalAddress',
      'addressLocality': office.city,
      'addressCountry': 'IN',
      'streetAddress': office.address
    })),
    'openingHours': 'Mo-Su 09:00-21:00',
    'priceRange': '₹₹'
  };
};

export default {
  generateFAQSchema,
  generateServiceSchema,
  generateLocalBusinessSchema
};

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
      'image': 'https://clearfiling.in/assets/logo.png',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Connaught Place',
        'addressLocality': 'New Delhi',
        'addressRegion': 'Delhi',
        'postalCode': '110001',
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
    'logo': 'https://clearfiling.in/assets/logo.png',
    'telephone': `+91-${companyInfo.contact.phone}`,
    'email': companyInfo.contact.email,
    'url': 'https://clearfiling.in',
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

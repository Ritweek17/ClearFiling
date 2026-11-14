import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import BUSINESS from '../src/config/business.js';
import CONTACT from '../src/config/contact.js';
import OFFICE_LOCATIONS from '../src/data/officeLocations.js';
import { COMPANY_INFO } from '../src/data/companyInfo.js';
import {
  PAGE_SEO,
  SEO_BASE,
  ORGANIZATION_ID,
  WEBSITE_ID,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getContactPageSchema,
} from '../src/config/seo.js';
import { generateLocalBusinessSchema, generateServiceSchema } from '../src/components/seo/SchemaHelpers.js';
import { SERVICES } from '../src/data/services.js';
import {
  INDEXABLE_SERVICES_COUNT,
  NOINDEX_SERVICES_COUNT,
  REDIRECTED_SERVICES_COUNT,
  INDEXABLE_SERVICE_SLUGS,
  NOINDEX_SERVICE_SLUGS,
  SERVICE_REGISTRY_MAP,
  isServiceIndexable,
} from '../src/data/serviceRegistry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, '..');

describe('SEO metadata and structured data centralization', () => {
  it('keeps representative page metadata, canonical URLs, and page copy unchanged', () => {
    assert.equal(SEO_BASE.siteName, BUSINESS.primaryBrandName);
    assert.equal(SEO_BASE.siteUrl, BUSINESS.websiteUrl);
    assert.equal(PAGE_SEO.home.title, 'ClearFiling (Clear Filing) | Business Registration, GST & Tax Compliance India');
    assert.equal(PAGE_SEO.home.description, 'ClearFiling (also known as Clear Filing) provides corporate compliance, company registration, GST filing, income tax, and trademark services across India.');
    assert.equal(PAGE_SEO.home.canonical, BUSINESS.websiteUrl);
    assert.equal(PAGE_SEO.about.canonical, `${BUSINESS.url}/about`);
    assert.equal(PAGE_SEO.contact.canonical, `${BUSINESS.url}/contact`);
    assert.equal(PAGE_SEO.contact.description, `Get in touch with ClearFiling (Clear Filing) compliance experts. Call ${CONTACT.mobile.display}, WhatsApp, or email ${CONTACT.email.display} / ${CONTACT.email2.display}. Free consultation, ${CONTACT.hours.faqShort}.`);
    assert.equal(PAGE_SEO.services.canonical, `${BUSINESS.url}/services`);
    assert.equal(PAGE_SEO.services.description, 'Explore 60+ professional compliance services including company registration, GST, trademark, income tax, annual returns, MSME, IEC, FSSAI and more.');
  });

  it('uses canonical business, contact, and office data in organization and office schemas', () => {
    const organization = getOrganizationSchema();
    assert.deepEqual(organization['@type'], ['Organization', 'LegalService']);
    assert.equal(organization['@id'], ORGANIZATION_ID);
    assert.equal(organization['@id'], `${BUSINESS.websiteUrl}#organization`);
    assert.equal(organization.name, 'ClearFiling');
    assert.equal(organization.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(organization.telephone, CONTACT.mobile.display);
    assert.equal(organization.email, CONTACT.email.display);
    assert.equal(organization.address.length, OFFICE_LOCATIONS.length);
    assert.equal(organization.description, BUSINESS.description);

    const offices = getLocalBusinessSchema();
    assert.equal(offices.length, 3);
    offices.forEach((schema, index) => {
      const office = OFFICE_LOCATIONS[index];
      assert.equal(schema['@type'], 'AccountingService');
      assert.equal(schema['@id'], `${BUSINESS.websiteUrl}#office-${office.id}`);
      assert.deepEqual(schema.parentOrganization, { '@id': ORGANIZATION_ID });
      assert.equal(schema.name, `${BUSINESS.primaryBrandName} — ${office.city}`);
      assert.equal(schema.telephone, office.phone);
      assert.equal(schema.email, office.email);
      assert.equal(schema.openingHours, CONTACT.hours.schema);
      assert.equal(schema.address.streetAddress, office.schema.streetAddress);
      assert.equal(schema.address.postalCode, office.schema.postalCode);
      assert.deepEqual(schema.geo, {
        '@type': 'GeoCoordinates',
        latitude: office.geo.lat,
        longitude: office.geo.lng,
      });
      assert.equal('aggregateRating' in schema, false);
      assert.equal('review' in schema, false);
    });

    const contactPage = getContactPageSchema();
    assert.equal(contactPage['@type'], 'ContactPage');
    assert.equal(contactPage.url, PAGE_SEO.contact.canonical);
    assert.equal(contactPage.mainEntity['@id'], ORGANIZATION_ID);

    const compatibilitySchema = generateLocalBusinessSchema(COMPANY_INFO);
    assert.equal(compatibilitySchema.name, BUSINESS.primaryBrandName);
    assert.equal(compatibilitySchema.legalName, BUSINESS.legalName);
    assert.equal(compatibilitySchema.telephone, CONTACT.mobile.display);
    assert.equal(compatibilitySchema.email, CONTACT.email.display);
    assert.equal(compatibilitySchema.openingHours, CONTACT.hours.schema);

    const service = SERVICES.find(({ slug }) => slug === INDEXABLE_SERVICE_SLUGS[0]);
    const serviceSchema = generateServiceSchema(service);
    assert.equal(serviceSchema['@id'], `${BUSINESS.url}/services/${service.slug}#service`);
    assert.equal(serviceSchema.provider.name, BUSINESS.primaryBrandName);
    assert.equal(serviceSchema.provider.legalName, BUSINESS.legalName);
  });

  it('preserves sitemap membership, robots directives, and all current indexability counts', () => {
    const sitemap = readFileSync(path.join(clientRoot, 'public/sitemap.xml'), 'utf8');
    const robots = readFileSync(path.join(clientRoot, 'public/robots.txt'), 'utf8');
    const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) => url);

    assert.equal(sitemapUrls.length, 44);
    assert.equal(new Set(sitemapUrls).size, 44);
    assert.equal(robots, 'User-agent: *\nAllow: /\n\nSitemap: https://www.clearfiling.co.in/sitemap.xml\n');
    assert.equal(INDEXABLE_SERVICES_COUNT, 23);
    assert.equal(NOINDEX_SERVICES_COUNT, 66);
    assert.equal(REDIRECTED_SERVICES_COUNT, 2);
    assert.equal(INDEXABLE_SERVICE_SLUGS.length, 23);
    assert.equal(NOINDEX_SERVICE_SLUGS.length, 66);
    assert.equal(WEBSITE_ID, `${BUSINESS.websiteUrl}#website`);

    for (const slug of INDEXABLE_SERVICE_SLUGS) {
      assert.ok(isServiceIndexable(slug));
      assert.ok(sitemapUrls.includes(`${BUSINESS.url}/services/${slug}`));
    }
    for (const slug of NOINDEX_SERVICE_SLUGS) {
      const entry = SERVICE_REGISTRY_MAP.get(slug);
      assert.equal(entry.indexStatus, 'noindex');
      assert.equal(isServiceIndexable(slug), false);
      assert.ok(!sitemapUrls.includes(`${BUSINESS.url}/services/${slug}`));
    }
  });
});

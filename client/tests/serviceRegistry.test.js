import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { Routes, Route } from 'react-router-dom';

import {
  ACCOUNTED_CATALOGUE_TOTAL,
  CANONICAL_SERVICES_COUNT,
  INDEXABLE_SERVICES_COUNT,
  NOINDEX_SERVICES_COUNT,
  REDIRECTED_SERVICES_COUNT,
  CONSOLIDATED_DUPLICATE_COUNT,
  INDEXABLE_SERVICE_SLUGS,
  NOINDEX_SERVICE_SLUGS,
  REDIRECT_SERVICE_MAP,
  REDIRECTED_SERVICE_SLUGS,
  CANONICAL_SERVICE_SLUGS,
  CONSOLIDATED_DUPLICATES,
  SERVICE_REGISTRY,
  SERVICE_REGISTRY_MAP,
  isServiceIndexable,
  getRedirectTarget,
  isRedirectedService,
} from '../src/data/serviceRegistry.js';

import {
  SERVICES,
  ACTIVE_SERVICE_SLUGS,
  CATEGORY_SERVICES_MAP,
} from '../src/data/services.js';

import { RESOURCES } from '../src/data/resourcesContent.js';
import { BLOG_POSTS } from '../src/data/blogContent.js';
import { FOOTER_SERVICES, FOOTER_LOANS } from '../src/data/footerConfig.js';
import { generateServiceSchema, generateFAQSchema } from '../src/components/seo/SchemaHelpers.js';
import { ORGANIZATION_ID, getBreadcrumbSchema } from '../src/config/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');

describe('Task A: Centralized Service Registry & Catalogue Accounting', () => {
  it('accounts for all 92 original catalogue records with exact counts', () => {
    assert.equal(ACCOUNTED_CATALOGUE_TOTAL, 92);
    assert.equal(CANONICAL_SERVICES_COUNT, 89);
    assert.equal(INDEXABLE_SERVICES_COUNT, 23);
    assert.equal(NOINDEX_SERVICES_COUNT, 66);
    assert.equal(REDIRECTED_SERVICES_COUNT, 2);
    assert.equal(CONSOLIDATED_DUPLICATE_COUNT, 1);

    // Sum validation: 89 canonical + 2 redirects + 1 merged duplicate = 92
    assert.equal(
      CANONICAL_SERVICES_COUNT + REDIRECTED_SERVICES_COUNT + CONSOLIDATED_DUPLICATE_COUNT,
      92
    );

    // Canonical + redirects in registry = 91
    assert.equal(SERVICE_REGISTRY.length, 91);
    assert.equal(SERVICE_REGISTRY_MAP.size, 91);
    assert.equal(SERVICES.length, 91);
  });

  it('validates schema structure and role integrity for every registry entry', () => {
    const validStatuses = new Set(['index', 'noindex', 'redirect']);
    const validRoles = new Set(['service', 'hub', 'redirect']);

    for (const entry of SERVICE_REGISTRY) {
      assert.ok(entry.slug, `Entry missing slug: ${JSON.stringify(entry)}`);
      assert.ok(entry.categorySlug, `Entry ${entry.slug} missing categorySlug`);
      assert.ok(validStatuses.has(entry.indexStatus), `Invalid indexStatus on ${entry.slug}: ${entry.indexStatus}`);
      assert.ok(validRoles.has(entry.pageRole), `Invalid pageRole on ${entry.slug}: ${entry.pageRole}`);
      assert.ok(Array.isArray(entry.secondaryCategorySlugs), `Invalid secondaryCategorySlugs on ${entry.slug}`);

      if (entry.indexStatus === 'redirect') {
        assert.ok(entry.redirectTo, `Redirect entry ${entry.slug} missing redirectTo`);
        assert.equal(entry.pageRole, 'redirect');
      } else {
        assert.equal(entry.redirectTo, null);
      }
    }
  });

  it('verifies ACTIVE_SERVICE_SLUGS exports identical 23 slugs matching INDEXABLE_SERVICE_SLUGS', () => {
    assert.equal(ACTIVE_SERVICE_SLUGS.length, 23);
    assert.deepEqual([...ACTIVE_SERVICE_SLUGS], [...INDEXABLE_SERVICE_SLUGS]);
    for (const slug of INDEXABLE_SERVICE_SLUGS) {
      assert.equal(isServiceIndexable(slug), true);
    }
    for (const slug of NOINDEX_SERVICE_SLUGS) {
      assert.equal(isServiceIndexable(slug), false);
    }
  });
});

describe('Task B: Locked Decisions & Consolidations (CD-1 through CD-4)', () => {
  it('CD-1: Digital Signature deduplicated, enriched, and cross-listed in Digital Solutions', () => {
    // Only one digital-signature object in SERVICES
    const dscMatches = SERVICES.filter((s) => s.slug === 'digital-signature');
    assert.equal(dscMatches.length, 1);
    const dsc = dscMatches[0];

    assert.equal(dsc.category, 'Business Registrations');
    assert.deepEqual(dsc.secondaryCategories, ['Digital Solutions']);
    assert.equal(dsc.featured, true);
    assert.equal(dsc.subtitle, 'Certificate (DSC)');
    assert.match(dsc.description, /Class 3/);
    assert.ok(Array.isArray(dsc.benefits) && dsc.benefits.length > 0);

    // Cross-listed in CATEGORY_SERVICES_MAP under Digital Solutions
    const digitalSolutionsServices = CATEGORY_SERVICES_MAP['Digital Solutions'] || [];
    const hasDscInDigitalSolutions = digitalSolutionsServices.some((s) => s.id === 'digital-signature' || s.title.includes('Digital Signature'));
    assert.ok(hasDscInDigitalSolutions, 'Digital Signature must appear in Digital Solutions services map');

    // Consolidated duplicate record tracked in registry
    assert.equal(CONSOLIDATED_DUPLICATES.length, 1);
    assert.equal(CONSOLIDATED_DUPLICATES[0].slug, 'digital-signature');
    assert.equal(CONSOLIDATED_DUPLICATES[0].originalCategory, 'Digital Solutions');
    assert.equal(CONSOLIDATED_DUPLICATES[0].primaryCategory, 'Business Registrations');
  });

  it('CD-2 & CD-3: MSME and IEC redirects configured in registry and vercel.json', () => {
    // Registry mappings
    assert.equal(getRedirectTarget('udyam-registration'), '/services/msme-registration');
    assert.equal(getRedirectTarget('import-export-code'), '/services/iec-registration');
    assert.equal(isRedirectedService('udyam-registration'), true);
    assert.equal(isRedirectedService('import-export-code'), true);
    assert.equal(isRedirectedService('msme-registration'), false);

    // Vercel 301 redirects
    const vercelConfig = JSON.parse(readFileSync(path.join(clientRoot, 'vercel.json'), 'utf8'));
    assert.ok(Array.isArray(vercelConfig.redirects), 'vercel.json must have redirects array');

    const udyamRedirect = vercelConfig.redirects.find((r) => r.source === '/services/udyam-registration');
    assert.ok(udyamRedirect, 'Missing udyam-registration redirect in vercel.json');
    assert.equal(udyamRedirect.destination, '/services/msme-registration');
    assert.equal(udyamRedirect.statusCode, 301);

    const iecRedirect = vercelConfig.redirects.find((r) => r.source === '/services/import-export-code');
    assert.ok(iecRedirect, 'Missing import-export-code redirect in vercel.json');
    assert.equal(iecRedirect.destination, '/services/iec-registration');
    assert.equal(iecRedirect.statusCode, 301);
  });

  it('CD-4: Vehicle Loan serves general use and remains distinct from commercial vehicle finance', () => {
    const vehicleLoan = SERVICES.find((s) => s.slug === 'vehicle-loan');
    assert.ok(vehicleLoan);
    assert.match(vehicleLoan.description, /personal|general vehicle/i);
    assert.ok(!vehicleLoan.keywords.includes('car finance'));
    assert.ok(!vehicleLoan.keywords.includes('commercial vehicle'));

    const commercialVehicleLoan = SERVICES.find((s) => s.slug === 'commercial-vehicle-loan');
    assert.ok(commercialVehicleLoan);
    assert.match(commercialVehicleLoan.description, /business|commercial/i);

    // Separate loan services remain distinct
    assert.ok(SERVICES.some((s) => s.slug === 'car-loan'));
    assert.ok(SERVICES.some((s) => s.slug === 'bike-loan'));
    assert.ok(SERVICES.some((s) => s.slug === 'commercial-vehicle-loan'));

    // Machinery loan keyword stripped
    const machineryLoan = SERVICES.find((s) => s.slug === 'machinery-loan');
    assert.ok(machineryLoan);
    assert.ok(!machineryLoan.keywords.includes('equipment loan'));

    // Custom Web Applications keyword stripped
    const customWeb = SERVICES.find((s) => s.slug === 'custom-web-applications');
    assert.ok(customWeb);
    assert.ok(!customWeb.keywords.includes('website development'));
  });
});

describe('Task C & D: ServiceDetail SSR & Indexability Controls', () => {
  it('renders indexable Loan Service with lender-neutral educational notice (CD-5)', async () => {
    const outFile = path.join(__dirname, `.tmp-svc-loan-${Date.now()}.mjs`);
    const entryFile = path.join(__dirname, `.tmp-svc-loan-entry-${Date.now()}.js`);

    try {
      writeFileSync(
        entryFile,
        `
        import React from 'react';
        export { default as ServiceDetail } from '../src/pages/ServiceDetail.jsx';
      `,
        'utf8'
      );

      await esbuild.build({
        entryPoints: [entryFile],
        bundle: true,
        format: 'esm',
        platform: 'node',
        jsx: 'automatic',
        packages: 'external',
        outfile: outFile,
        define: {
          'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://api.clearfiling.co.in'),
          'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify('service_test'),
          'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify('template_test'),
          'import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID': JSON.stringify('autoreply_test'),
          'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify('public_key_test'),
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      });

      const mod = await import(pathToFileURL(outFile).href);

      // Render home-loan (Loan Services category)
      const loanHtml = renderToStaticMarkup(
        React.createElement(
          StaticRouter,
          { location: '/services/home-loan' },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/services/:slug',
              element: React.createElement(mod.ServiceDetail),
            })
          )
        )
      );

      // Loan pages provide neutral education and do not claim advisory or lending capabilities.
      assert.match(loanHtml, /General information only/);
      assert.match(loanHtml, /ClearFiling is not a lender/);
      assert.match(loanHtml, /<h2[^>]*>Questions about this guide<\/h2>/);
      assert.doesNotMatch(loanHtml, /Financial Documentation &amp; Advisory Support|End-to-End Application Assistance|Request Free Consultation/);
      assert.doesNotMatch(loanHtml, /CA &amp; CS Verified Approval/);

      // Render private-limited-company (Corporate Services category)
      const corpHtml = renderToStaticMarkup(
        React.createElement(
          StaticRouter,
          { location: '/services/private-limited-company' },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/services/:slug',
              element: React.createElement(mod.ServiceDetail),
            })
          )
        )
      );

      // Non-loan keeps CA & CS Verified Approval
      assert.match(corpHtml, /CA &amp; CS Verified Approval|CA & CS Verified Approval/);
      assert.doesNotMatch(corpHtml, /Financial Documentation &amp; Advisory Support/);
    } finally {
      rmSync(outFile, { force: true });
      rmSync(entryFile, { force: true });
    }
  });

  it('renders Coming Soon service with inline inquiry form, noindex, and zero canonical tag', async () => {
    const outFile = path.join(__dirname, `.tmp-svc-cs-${Date.now()}.mjs`);
    const entryFile = path.join(__dirname, `.tmp-svc-cs-entry-${Date.now()}.js`);

    // Minimal DOM simulator for SEOHead effects
    const headChildren = [];
    const makeEl = (tagName) => {
      const attrs = {};
      const el = {
        tagName: tagName.toUpperCase(),
        parentNode: null,
        setAttribute(k, v) {
          attrs[k] = String(v);
        },
        getAttribute(k) {
          return attrs[k] ?? null;
        },
        remove() {
          const idx = headChildren.indexOf(el);
          if (idx !== -1) headChildren.splice(idx, 1);
          el.parentNode = null;
        },
      };
      return el;
    };

    const mockDocument = {
      title: '',
      head: {
        appendChild(el) {
          el.parentNode = mockDocument.head;
          headChildren.push(el);
        },
        removeChild(el) {
          el.remove();
        },
      },
      createElement: makeEl,
      querySelectorAll(selector) {
        return headChildren.filter((el) => {
          let m = selector.match(/^meta\[([a-z-]+)="([^"]+)"\]$/i);
          if (m) return el.tagName === 'META' && el.getAttribute(m[1]) === m[2];
          m = selector.match(/^link\[rel="([^"]+)"\]$/i);
          if (m) return el.tagName === 'LINK' && el.getAttribute('rel') === m[1];
          return false;
        });
      },
    };

    const prevDocument = globalThis.document;
    globalThis.document = mockDocument;
    const effects = [];
    globalThis.__SEO_USE_EFFECT__ = (fn) => effects.push(fn);

    try {
      writeFileSync(
        entryFile,
        `
        import React from 'react';
        export { default as ServiceDetail } from '../src/pages/ServiceDetail.jsx';
      `,
        'utf8'
      );

      await esbuild.build({
        entryPoints: [entryFile],
        bundle: true,
        format: 'esm',
        platform: 'node',
        jsx: 'automatic',
        packages: 'external',
        outfile: outFile,
        plugins: [
          {
            name: 'seo-effect-spy',
            setup(build) {
              const target = /components[\\/]seo[\\/](SEOHead|JsonLd)\.jsx$/;
              build.onLoad({ filter: target }, (args) => {
                const src = readFileSync(args.path, 'utf8').replace(
                  /import\s*\{\s*useEffect\s*\}\s*from\s*['"]react['"];?/,
                  'const useEffect = (...a) => globalThis.__SEO_USE_EFFECT__(...a);'
                );
                return { contents: src, loader: 'jsx' };
              });
            },
          },
        ],
        define: {
          'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://api.clearfiling.co.in'),
          'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify('service_test'),
          'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify('template_test'),
          'import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID': JSON.stringify('autoreply_test'),
          'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify('public_key_test'),
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      });

      const mod = await import(pathToFileURL(outFile).href);

      // Render public-limited-company (a genuine Coming Soon service without longDescription)
      const csHtml = renderToStaticMarkup(
        React.createElement(
          StaticRouter,
          { location: '/services/public-limited-company' },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/services/:slug',
              element: React.createElement(mod.ServiceDetail),
            })
          )
        )
      );

      // Trigger hydrated SEO effects
      for (const fn of effects) fn();

      // UI: Renders genuine service title, category, and inquiry form
      assert.match(csHtml, /Public Limited Company/);
      assert.match(csHtml, /Business Formation/);
      assert.match(csHtml, /lead-consultation-form/);
      assert.match(csHtml, /Request Expert Consultation/);
      assert.match(csHtml, /\+91 9250201718/);

      // SEOHead effects: robots is noindex, follow; canonical tag is completely omitted
      const robotsMeta = mockDocument.querySelectorAll('meta[name="robots"]');
      assert.equal(robotsMeta.length, 1);
      assert.equal(robotsMeta[0].getAttribute('content'), 'noindex, follow');

      const canonicalLinks = mockDocument.querySelectorAll('link[rel="canonical"]');
      assert.equal(canonicalLinks.length, 0, 'Coming Soon routes must omit <link rel="canonical">');

      // Zero JSON-LD script injected on Coming Soon
      const scripts = headChildren.filter((el) => el.tagName === 'SCRIPT');
      assert.equal(scripts.length, 0, 'Coming Soon routes must not inject Service/FAQ schema');
    } finally {
      globalThis.document = prevDocument;
      delete globalThis.__SEO_USE_EFFECT__;
      rmSync(outFile, { force: true });
      rmSync(entryFile, { force: true });
    }
  });
});

describe('Task E: Sitemap Foundation & Generation Integrity', () => {
  it('generates valid sitemap.xml containing exactly 44 indexable URLs', () => {
    const sitemapContent = readFileSync(path.join(clientRoot, 'public/sitemap.xml'), 'utf8');

    const locs = Array.from(sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
    assert.equal(locs.length, 44, `Sitemap must contain exactly 44 URLs, found ${locs.length}`);

    // Verify presence of all 23 active services
    for (const slug of INDEXABLE_SERVICE_SLUGS) {
      const url = `https://www.clearfiling.co.in/services/${slug}`;
      assert.ok(locs.includes(url), `Sitemap missing active service: ${url}`);
    }

    // Verify all 66 noindex services are EXCLUDED
    for (const slug of NOINDEX_SERVICE_SLUGS) {
      const url = `https://www.clearfiling.co.in/services/${slug}`;
      assert.ok(!locs.includes(url), `Sitemap improperly includes noindex service: ${url}`);
    }

    // Verify redirected services are EXCLUDED
    for (const slug of REDIRECTED_SERVICE_SLUGS) {
      const url = `https://www.clearfiling.co.in/services/${slug}`;
      assert.ok(!locs.includes(url), `Sitemap improperly includes redirected service: ${url}`);
    }

    // Verify resources (6) and blogs (6) and legal (3) and core (6)
    assert.ok(locs.includes('https://www.clearfiling.co.in/'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/about'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/services'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/contact'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/resources'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/blog'));

    for (const res of RESOURCES) {
      assert.ok(locs.includes(`https://www.clearfiling.co.in/resources/${res.slug}`));
    }
    for (const post of BLOG_POSTS) {
      assert.ok(locs.includes(`https://www.clearfiling.co.in/blog/${post.slug}`));
    }
    assert.ok(locs.includes('https://www.clearfiling.co.in/privacy-policy'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/terms'));
    assert.ok(locs.includes('https://www.clearfiling.co.in/disclaimer'));
  });
});

describe('Section 4 Technical Checks & Schema Integrity', () => {
  it('generates valid Service and BreadcrumbList schemas with stable @id and valid Offer', () => {
    const svc = SERVICES.find((s) => s.slug === 'private-limited-company');
    const schema = generateServiceSchema(svc);

    assert.equal(schema['@type'], 'Service');
    assert.equal(schema['@id'], 'https://www.clearfiling.co.in/services/private-limited-company#service');
    assert.equal(schema.url, 'https://www.clearfiling.co.in/services/private-limited-company');
    assert.equal(schema.name, 'Private Limited Company');
    assert.equal(schema.provider['@id'], ORGANIZATION_ID);
    assert.equal(schema.provider.legalName, 'CLEARFILING AND COMPLIANCE LLP');

    // Valid Offer without "Contact for Quote" string
    assert.equal(schema.offers['@type'], 'Offer');
    assert.equal(schema.offers.priceCurrency, 'INR');
    assert.equal(schema.offers.availability, 'https://schema.org/InStock');
    assert.equal(schema.offers.url, 'https://www.clearfiling.co.in/services/private-limited-company');
    assert.equal(schema.offers.price, undefined, 'Invalid "Contact for Quote" string price must be removed');

    // Breadcrumb schema
    const breadcrumb = getBreadcrumbSchema([
      { name: 'Services', path: '/services' },
      { name: svc.title, path: `/services/${svc.slug}` },
    ]);
    assert.equal(breadcrumb['@type'], 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 3);
    assert.equal(breadcrumb.itemListElement[0].name, 'Home');
    assert.equal(breadcrumb.itemListElement[1].name, 'Services');
    assert.equal(breadcrumb.itemListElement[2].name, 'Private Limited Company');
  });

  it('verifies zero broken internal links across blogContent, resourcesContent, and footerConfig', () => {
    // 1. blogContent relatedPosts
    for (const post of BLOG_POSTS) {
      for (const relSlug of post.relatedPosts || []) {
        const target = BLOG_POSTS.find((p) => p.slug === relSlug);
        assert.ok(target, `Broken blog relatedPost slug "${relSlug}" in post "${post.slug}"`);
      }
    }

    // 2. resourcesContent relatedServices
    for (const res of RESOURCES) {
      for (const s of res.relatedServices || []) {
        assert.ok(s.slug, `Resource "${res.slug}" has empty service slug for "${s.title}"`);
        const found = SERVICES.some((srv) => srv.slug === s.slug);
        assert.ok(found, `Unknown service slug "${s.slug}" in resource "${res.slug}"`);
      }
    }

    // 3. footerConfig FOOTER_SERVICES & FOOTER_LOANS
    for (const item of FOOTER_SERVICES) {
      if (item.slug) {
        const found = SERVICES.some((s) => s.slug === item.slug);
        assert.ok(found, `Unknown service slug "${item.slug}" in footerConfig`);
      }
    }
    for (const item of FOOTER_LOANS) {
      if (item.slug) {
        assert.ok(isServiceIndexable(item.slug), `Footer loan slug "${item.slug}" must be indexable`);
      }
    }
  });
});

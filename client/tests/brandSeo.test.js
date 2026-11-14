import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';

import BUSINESS from '../src/config/business.js';
import { COMPANY_INFO } from '../src/data/companyInfo.js';
import { FOOTER_COMPANY } from '../src/data/footerConfig.js';
import { PRIVACY_POLICY, TERMS_CONDITIONS, DISCLAIMER } from '../src/data/legalContent.js';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  HOME_KEYWORDS,
  SEO_BASE,
  PAGE_SEO,
  getWebsiteSchema,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getContactPageSchema,
} from '../src/config/seo.js';
import {
  generateServiceSchema,
  generateLocalBusinessSchema,
} from '../src/components/seo/SchemaHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');

const decodeEntities = (str) => str.replace(/&amp;/g, '&');

describe('Brand identity centralization & legal name hygiene', () => {
  it('enforces immutable brand and registered legal names across all config modules', () => {
    assert.equal(BUSINESS.primaryBrandName, 'ClearFiling');
    assert.equal(BUSINESS.alternateBrandName, 'Clear Filing');
    assert.equal(BUSINESS.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(BUSINESS.websiteUrl, 'https://www.clearfiling.co.in/');

    assert.equal(COMPANY_INFO.brandName, 'ClearFiling');
    assert.equal(COMPANY_INFO.alternateBrandName, 'Clear Filing');
    assert.equal(COMPANY_INFO.name, 'ClearFiling');
    assert.equal(COMPANY_INFO.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(COMPANY_INFO.seo.siteUrl, 'https://www.clearfiling.co.in/');

    assert.equal(FOOTER_COMPANY.brandName, 'ClearFiling');
    assert.equal(FOOTER_COMPANY.alternateBrandName, 'Clear Filing');
    assert.equal(FOOTER_COMPANY.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.match(HOME_KEYWORDS, /CLEARFILING AND COMPLIANCE LLP/);
    assert.match(PAGE_SEO.about.description, /CLEARFILING AND COMPLIANCE LLP/);
  });

  it('keeps LegalPageLayout content free of "& Compliance LLP" typos', () => {
    const rawLegal = readFileSync(path.join(clientRoot, 'src/data/legalContent.js'), 'utf8');
    assert.doesNotMatch(rawLegal, /& Compliance LLP/);
    assert.match(rawLegal, /BUSINESS\.legalName/);
    assert.doesNotMatch(rawLegal, /ClearFiling and Compliance LLP/i);

    const renderedLegalData = JSON.stringify([PRIVACY_POLICY, TERMS_CONDITIONS, DISCLAIMER]);
    assert.match(renderedLegalData, /CLEARFILING AND COMPLIANCE LLP/);
    assert.doesNotMatch(renderedLegalData, /ClearFiling and Compliance LLP/);
  });
});

describe('Static HTML & hydrated SEO parity', () => {
  it('injects SEO_BASE values into the built static HTML from the Vite config', () => {
    const sourceHtml = readFileSync(path.join(clientRoot, 'index.html'), 'utf8');
    assert.match(sourceHtml, /<!--clearfiling-seo:start--><!--clearfiling-seo:end-->/);
    assert.doesNotMatch(sourceHtml, /<title>|<meta\s+(?:name|property)="(?:description|keywords|author|og:|twitter:)|<link\s+rel="canonical"/i);

    const filePath = path.join(clientRoot, 'dist/index.html');
    const html = readFileSync(filePath, 'utf8');

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(titleMatch, `Missing <title> in ${filePath}`);
    assert.equal(decodeEntities(titleMatch[1]), PAGE_SEO.home.title);

    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    assert.ok(descMatch, `Missing meta description in ${filePath}`);
    assert.equal(decodeEntities(descMatch[1]), PAGE_SEO.home.description);

    const authorMatch = html.match(/<meta\s+name="author"\s+content="([^"]+)"/i);
    assert.ok(authorMatch, `Missing meta author in ${filePath}`);
    assert.equal(authorMatch[1], BUSINESS.legalName);

    const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i);
    assert.ok(keywordsMatch, `Missing meta keywords in ${filePath}`);
    assert.equal(decodeEntities(keywordsMatch[1]), SEO_BASE.defaultKeywords);

    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    assert.ok(canonicalMatch, `Missing canonical in ${filePath}`);
    assert.equal(canonicalMatch[1], PAGE_SEO.home.canonical);
    assert.equal(canonicalMatch[1], 'https://www.clearfiling.co.in/');

    const ogSiteNameMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i);
    assert.ok(ogSiteNameMatch, `Missing og:site_name in ${filePath}`);
    assert.equal(ogSiteNameMatch[1], SEO_BASE.siteName);
    assert.equal(ogSiteNameMatch[1], 'ClearFiling');

    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    assert.ok(ogTitleMatch, `Missing og:title in ${filePath}`);
    assert.equal(decodeEntities(ogTitleMatch[1]), PAGE_SEO.home.title);

    const twitterTitleMatch = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i);
    assert.ok(twitterTitleMatch, `Missing twitter:title in ${filePath}`);
    assert.equal(decodeEntities(twitterTitleMatch[1]), PAGE_SEO.home.title);
  });
});

describe('Structured data JSON-LD schemas', () => {
  it('defines connected WebSite and single Organization / LegalService entities plus 3 linked offices', () => {
    const website = getWebsiteSchema();
    assert.equal(website['@type'], 'WebSite');
    assert.equal(website['@id'], WEBSITE_ID);
    assert.equal(website.url, 'https://www.clearfiling.co.in/');
    assert.equal(website.name, 'ClearFiling');
    assert.equal(website.alternateName, 'Clear Filing');
    assert.deepEqual(website.publisher, { '@id': ORGANIZATION_ID });

    const org = getOrganizationSchema();
    assert.deepEqual(org['@type'], ['Organization', 'LegalService']);
    assert.equal(org['@id'], ORGANIZATION_ID);
    assert.equal(org.name, 'ClearFiling');
    assert.equal(org.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(org.alternateName, 'Clear Filing');
    assert.equal(org.url, 'https://www.clearfiling.co.in/');
    assert.equal(org.address.length, 3);

    const offices = getLocalBusinessSchema();
    assert.equal(offices.length, 3);
    assert.deepEqual(
      offices.map((o) => o['@id']),
      [
        'https://www.clearfiling.co.in/#office-delhi',
        'https://www.clearfiling.co.in/#office-deoria',
        'https://www.clearfiling.co.in/#office-gorakhpur',
      ]
    );
    for (const office of offices) {
      assert.deepEqual(office.parentOrganization, { '@id': ORGANIZATION_ID });
      assert.equal(office.alternateName, 'Clear Filing');
      assert.ok(office.geo?.latitude && office.geo?.longitude);
    }

    const contactSchema = getContactPageSchema();
    assert.equal(contactSchema['@type'], 'ContactPage');
    assert.equal(contactSchema.mainEntity['@id'], ORGANIZATION_ID);
    assert.equal(contactSchema.mainEntity.legalName, 'CLEARFILING AND COMPLIANCE LLP');

    const svcSchema = generateServiceSchema({
      title: 'GST Registration',
      shortDescription: 'GST filing and registration',
    });
    assert.equal(svcSchema.provider['@id'], ORGANIZATION_ID);
    assert.equal(svcSchema.provider.name, 'ClearFiling');
    assert.equal(svcSchema.provider.legalName, 'CLEARFILING AND COMPLIANCE LLP');

    const legacyLb = generateLocalBusinessSchema(COMPANY_INFO);
    assert.equal(legacyLb['@id'], ORGANIZATION_ID);
    assert.equal(legacyLb.name, 'ClearFiling');
    assert.equal(legacyLb.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(legacyLb.alternateName, 'Clear Filing');
  });
});

describe('SSR component rendering & microdata de-duplication', () => {
  it('renders Home, Footer, AboutSection, and Logo cleanly with preserved visuals and single Organization entity', async () => {
    const outFile = path.join(__dirname, `.tmp-seo-ssr-${Date.now()}.mjs`);
    const entrySource = `
      export { default as Home } from '../src/pages/Home.jsx';
      export { default as Footer } from '../src/components/common/Footer.jsx';
      export { default as Logo } from '../src/components/common/Logo.jsx';
    `;
    const entryFile = path.join(__dirname, `.tmp-seo-entry-${Date.now()}.js`);
    const { writeFileSync } = await import('node:fs');

    try {
      writeFileSync(entryFile, entrySource, 'utf8');
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
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      });

      const mod = await import(pathToFileURL(outFile).href);

      // 1. Visual Logo preservation
      const logoHtml = renderToStaticMarkup(
        React.createElement(StaticRouter, { location: '/' }, React.createElement(mod.Logo))
      );
      assert.match(logoHtml, />CF</);
      assert.match(logoHtml, />Clear<span class="text-brand-primary">Filing<\/span>/);

      // 2. Footer has zero duplicate Organization Microdata and shows exact legal name
      const footerHtml = renderToStaticMarkup(
        React.createElement(StaticRouter, { location: '/' }, React.createElement(mod.Footer))
      );
      assert.doesNotMatch(footerHtml, /schema\.org\/Organization/);
      assert.doesNotMatch(footerHtml, /schema\.org\/WPFooter/);
      assert.doesNotMatch(footerHtml, /&amp; Compliance LLP/);
      assert.match(footerHtml, /CLEARFILING AND COMPLIANCE LLP/);

      // 3. Home SSR renders preserved copy without raw '**ClearFiling**'
      const homeHtml = renderToStaticMarkup(
        React.createElement(StaticRouter, { location: '/' }, React.createElement(mod.Home))
      );
      assert.doesNotMatch(homeHtml, /\*\*ClearFiling\*\*/);
      assert.match(homeHtml, /CLEARFILING AND COMPLIANCE LLP/);
      assert.match(homeHtml, /ClearFiling \(also known as Clear Filing\)/);
      assert.doesNotMatch(homeHtml, /schema\.org\/Organization/);
    } finally {
      rmSync(outFile, { force: true });
      rmSync(entryFile, { force: true });
    }
  });

  it('reconciles Home SEO metadata during hydration and renders JSON-LD once in React markup', async () => {
    const outFile = path.join(__dirname, `.tmp-seo-hydrate-${Date.now()}.mjs`);
    const entryFile = path.join(__dirname, `.tmp-seo-hydrate-entry-${Date.now()}.js`);
    const { writeFileSync } = await import('node:fs');

    // Minimal <head> DOM simulator to verify SEOHead + JsonLd side effects
    const headChildren = [];
    const makeEl = (tagName) => {
      const attrs = {};
      const dataset = {};
      const el = {
        tagName: tagName.toUpperCase(),
        dataset,
        textContent: '',
        parentNode: null,
        setAttribute(k, v) {
          attrs[k] = String(v);
        },
        getAttribute(k) {
          return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
        },
        remove() {
          const idx = headChildren.indexOf(el);
          if (idx !== -1) headChildren.splice(idx, 1);
          el.parentNode = null;
        },
      };
      return el;
    };

    const matchSelector = (el, selector) => {
      let m = selector.match(/^meta\[([a-z-]+)="([^"]+)"\]$/i);
      if (m) return el.tagName === 'META' && el.getAttribute(m[1]) === m[2];
      m = selector.match(/^link\[rel="([^"]+)"\]$/i);
      if (m) return el.tagName === 'LINK' && el.getAttribute('rel') === m[1];
      return false;
    };

    const head = {
      appendChild(el) {
        el.parentNode = head;
        headChildren.push(el);
      },
      removeChild(el) {
        el.remove();
      },
    };

    const effects = [];

    const mockDocument = {
      title: 'ClearFiling (Clear Filing) | Business Registration, GST & Tax Compliance India',
      head,
      createElement: makeEl,
      querySelectorAll(selector) {
        return headChildren.filter((el) => matchSelector(el, selector));
      },
    };

    // Pre-populate static index.html canonical/meta tags before hydration
    const initMeta = (attr, key, val) => {
      const m = makeEl('meta');
      m.setAttribute(attr, key);
      m.setAttribute('content', val);
      head.appendChild(m);
    };
    initMeta('name', 'description', PAGE_SEO.home.description);
    initMeta('property', 'og:site_name', 'ClearFiling');
    initMeta('property', 'og:title', PAGE_SEO.home.title);
    initMeta('name', 'twitter:title', PAGE_SEO.home.title);
    const canonLink = makeEl('link');
    canonLink.setAttribute('rel', 'canonical');
    canonLink.setAttribute('href', 'https://www.clearfiling.co.in/');
    head.appendChild(canonLink);

    const prevDocument = globalThis.document;
    globalThis.document = mockDocument;
    globalThis.__SEO_USE_EFFECT__ = (fn) => {
      effects.push(fn);
    };

    try {
      const entrySource = `
        import React from 'react';
        export { default as Home } from '../src/pages/Home.jsx';
      `;
      writeFileSync(entryFile, entrySource, 'utf8');

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
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      });

      const mod = await import(pathToFileURL(outFile).href);
      const homeMarkup = renderToStaticMarkup(
        React.createElement(StaticRouter, { location: '/' }, React.createElement(mod.Home))
      );

      for (const fn of effects) {
        const cleanup = fn();
      }

      // Assert hydrated <head> matches initial static HTML identically
      assert.equal(mockDocument.title, 'ClearFiling (Clear Filing) | Business Registration, GST & Tax Compliance India');
      assert.equal(mockDocument.querySelectorAll('meta[property="og:site_name"]')[0].getAttribute('content'), 'ClearFiling');
      assert.equal(mockDocument.querySelectorAll('meta[property="og:title"]')[0].getAttribute('content'), PAGE_SEO.home.title);
      assert.equal(mockDocument.querySelectorAll('meta[name="twitter:title"]')[0].getAttribute('content'), PAGE_SEO.home.title);
      assert.equal(mockDocument.querySelectorAll('meta[name="description"]')[0].getAttribute('content'), PAGE_SEO.home.description);
      assert.equal(mockDocument.querySelectorAll('link[rel="canonical"]')[0].getAttribute('href'), 'https://www.clearfiling.co.in/');

      const jsonLdScripts = [...homeMarkup.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
        .map((match) => ({
          id: match[0].match(/\bid="([^"]+)"/)?.[1],
          textContent: match[1],
        }));
      assert.equal(jsonLdScripts.length, 5);
      assert.equal(new Set(jsonLdScripts.map((script) => script.id)).size, jsonLdScripts.length);

      const nodes = jsonLdScripts.flatMap((s) => {
        const parsed = JSON.parse(s.textContent.replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
        return Array.isArray(parsed) ? parsed : [parsed];
      });
      const websites = nodes.filter((n) => n['@type'] === 'WebSite');
      const orgs = nodes.filter(
        (n) => (Array.isArray(n['@type']) && n['@type'].includes('Organization')) || n['@type'] === 'Organization' || n['@type'] === 'LegalService'
      );
      const offices = nodes.filter((n) => n['@type'] === 'AccountingService');
      const services = nodes.filter((n) => n['@type'] === 'Service');
      const faqs = nodes.filter((n) => n['@type'] === 'FAQPage');

      assert.equal(websites.length, 1);
      assert.equal(websites[0]['@id'], 'https://www.clearfiling.co.in/#website');
      assert.equal(websites[0].name, 'ClearFiling');
      assert.equal(websites[0].alternateName, 'Clear Filing');

      assert.equal(orgs.length, 1);
      assert.equal(orgs[0]['@id'], 'https://www.clearfiling.co.in/#organization');
      assert.equal(orgs[0].name, 'ClearFiling');
      assert.equal(orgs[0].legalName, 'CLEARFILING AND COMPLIANCE LLP');
      assert.equal(orgs[0].alternateName, 'Clear Filing');

      assert.equal(offices.length, 3);
      assert.equal(services.length, 1);
      assert.equal(services[0].provider['@id'], 'https://www.clearfiling.co.in/#organization');
      assert.equal(services[0].provider.legalName, 'CLEARFILING AND COMPLIANCE LLP');
      assert.equal(faqs.length, 1);

      assert.equal(headChildren.filter((el) => el.tagName === 'SCRIPT').length, 0);
    } finally {
      globalThis.document = prevDocument;
      delete globalThis.__SEO_USE_EFFECT__;
      rmSync(outFile, { force: true });
      rmSync(entryFile, { force: true });
    }
  });
});

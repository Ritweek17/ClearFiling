import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import esbuild from 'esbuild';
import { INDEXABLE_SERVICE_SLUGS, SERVICE_REGISTRY, isServiceIndexable } from '../src/data/serviceRegistry.js';
import { SERVICES } from '../src/data/services.js';
import { LOAN_SERVICE_CONTENT, LOAN_CONTENT_SLUGS } from '../src/data/loanServiceContent.js';
import { LOAN_SERVICE_INDEX } from '../src/data/loanServiceIndex.js';
import { RESOURCES } from '../src/data/resourcesContent.js';
import { resolveRouteSeo } from '../src/utils/routeSeo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORPORATE_SLUGS = new Set(['private-limited-company', 'gst-registration', 'trademark-registration']);
const escapeHtml = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('Phase 2B loan service SEO content', () => {
  it('defines unique metadata and educational content for exactly the 20 indexable loan routes', () => {
    assert.equal(LOAN_CONTENT_SLUGS.length, 20);
    assert.equal(new Set(LOAN_CONTENT_SLUGS).size, 20);
    assert.equal(LOAN_CONTENT_SLUGS.filter((slug) => CORPORATE_SLUGS.has(slug)).length, 0);

    const titles = new Set();
    const descriptions = new Set();
    const faqQuestions = new Set();
    for (const slug of LOAN_CONTENT_SLUGS) {
      const service = SERVICES.find((item) => item.slug === slug);
      const registryEntry = SERVICE_REGISTRY.find((item) => item.slug === slug);
      const content = LOAN_SERVICE_CONTENT[slug];
      const index = LOAN_SERVICE_INDEX[slug];
      const seo = resolveRouteSeo(`/services/${slug}`);

      assert.ok(service, `${slug} exists in the service catalogue`);
      assert.equal(service.category, 'Loan Services', `${slug} is a loan service`);
      assert.ok(INDEXABLE_SERVICE_SLUGS.includes(slug), `${slug} remains in the indexable slug list`);
      assert.equal(registryEntry?.indexStatus, 'index', `${slug} remains indexable in the registry`);
      assert.equal(isServiceIndexable(slug), true, `${slug} remains indexable at runtime`);
      assert.equal(seo.noindex, false, `${slug} has no noindex directive`);
      assert.equal(seo.canonical, `https://www.clearfiling.co.in/services/${slug}`);
      assert.equal(seo.title, content.metaTitle);
      assert.equal(seo.description, content.metaDescription);
      for (const field of ['metaTitle', 'metaDescription', 'heroTitle', 'shortDescription', 'description', 'benefits', 'processingTime', 'relatedServices', 'relatedResources']) {
        assert.deepEqual(index[field], content[field], `${slug} lightweight ${field} matches route content`);
      }
      assert.equal(index.faqReference, null, `${slug} does not include FAQ text in shared index`);
      assert.equal(index.educationalSections, undefined, `${slug} does not include editorial sections in shared index`);
      assert.ok(content.metaTitle.length > 20 && content.metaTitle.length < 75, `${slug} title length`);
      assert.ok(content.metaDescription.length > 80 && content.metaDescription.length < 200, `${slug} description length`);
      assert.ok(content.metaDescription.length <= 160, `${slug} description stays concise`);
      assert.ok(!titles.has(content.metaTitle), `${slug} title is unique`);
      assert.ok(!descriptions.has(content.metaDescription), `${slug} description is unique`);
      titles.add(content.metaTitle);
      descriptions.add(content.metaDescription);
      assert.ok(content.heroTitle, `${slug} has a specific H1`);
      assert.ok(content.educationalSections.length >= 3, `${slug} has page-specific educational sections`);
      assert.ok(content.faqReference.length >= 4, `${slug} has expanded FAQs`);
      for (const faq of content.faqReference) {
        assert.ok(!faqQuestions.has(faq.q), `${slug} FAQ question is distinct: ${faq.q}`);
        faqQuestions.add(faq.q);
      }
      assert.equal(content.processingTime, null, `${slug} does not publish unsupported turnaround claims`);
      assert.equal(content.benefits, null, `${slug} does not publish unsupported financial-product benefits`);

      const text = [
        content.metaTitle,
        content.metaDescription,
        content.shortDescription,
        content.description,
        content.heroTitle,
        ...content.educationalSections.flatMap((part) => [part.title, part.body, ...(part.points || [])]),
        ...content.faqReference.flatMap((item) => [item.q, item.a]),
      ].join(' ');
      assert.doesNotMatch(text, /(?:guarantee(?:d|s)?\s+(?:loan\s+)?approval|approval\s+(?:within|in)\s+\d|disburs\w*\s+(?:within|in)\s+\d|up\s+to\s+\d+(?:\.\d+)?\s?%|(?:interest\s+)?rates?\s+(?:of|from|starting\s+at)\s*(?:₹|INR|\d)|(?:Section\s+\d|CGTMSE|PMEGP|Mudra|80C|80E))/i, `${slug} contains a restricted factual claim`);

      for (const related of content.relatedServices || []) {
        assert.ok(isServiceIndexable(related.id), `${slug} links to indexable service ${related.id}`);
        assert.ok(SERVICES.some((item) => item.slug === related.id), `${related.id} has a real service route`);
      }
      for (const related of content.relatedResources || []) {
        assert.ok(RESOURCES.some((item) => item.slug === related.slug), `${related.slug} has a real resource route`);
      }
    }
    assert.equal(titles.size, 20);
    assert.equal(descriptions.size, 20);
    assert.equal(faqQuestions.size, 80);
  });

  it('distinguishes general vehicle intent from commercial vehicle operations', () => {
    const vehicle = LOAN_SERVICE_CONTENT['vehicle-loan'];
    const commercial = LOAN_SERVICE_CONTENT['commercial-vehicle-loan'];
    assert.match(vehicle.metaTitle, /Personal and General Use/);
    assert.match(vehicle.metaDescription, /personal and general vehicle finance/i);
    assert.match(vehicle.heroTitle, /Personal and General Use/);
    assert.ok(vehicle.relatedServices.some((item) => item.id === 'car-loan'));
    assert.ok(vehicle.relatedServices.some((item) => item.id === 'bike-loan'));

    assert.match(commercial.metaTitle, /Commercial Vehicle Finance for Business Use/);
    assert.match(commercial.metaDescription, /business operations/i);
    assert.match(commercial.heroTitle, /Business Operations/);
    assert.ok(commercial.educationalSections.some((item) => /business operations/i.test(item.title)));
    assert.ok(commercial.faqReference.some((item) => /business use/i.test(item.q)));
  });

  it('renders page-specific H1s, lender-neutral copy, contextual links, and matching visible FAQ JSON-LD', async () => {
    const outFile = path.join(__dirname, `.tmp-loan-content-${Date.now()}.mjs`);
    const entryFile = path.join(__dirname, `.tmp-loan-content-entry-${Date.now()}.js`);

    try {
      writeFileSync(entryFile, "import React from 'react';\nexport { default as ServiceDetail } from '../src/pages/ServiceDetail.jsx';\n", 'utf8');
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
      const { ServiceDetail } = await import(pathToFileURL(outFile).href);

      for (const slug of LOAN_CONTENT_SLUGS) {
        const content = LOAN_SERVICE_CONTENT[slug];
        const html = renderToStaticMarkup(
          React.createElement(
            StaticRouter,
            { location: `/services/${slug}` },
            React.createElement(
              Routes,
              null,
              React.createElement(Route, { path: '/services/:slug', element: React.createElement(ServiceDetail) })
            )
          )
        );

        assert.match(html, new RegExp(`<h1[^>]*>${escapeHtml(content.heroTitle)}</h1>`), `${slug} H1`);
        assert.match(html, /General information only/);
        assert.match(html, /ClearFiling is not a lender/);
        assert.doesNotMatch(html, /Request Free Consultation|No upfront fees|Free consultation call|Estimated Timeline|Timeline:/, `${slug} unsupported promise`);
        for (const section of content.educationalSections) {
          assert.ok(html.includes(section.title), `${slug} visible section ${section.title}`);
          assert.ok(html.includes(section.body), `${slug} visible section body ${section.title}`);
        }
        for (const faq of content.faqReference) {
          assert.ok(html.includes(faq.q), `${slug} visible FAQ question`);
          assert.ok(html.includes(faq.a), `${slug} visible FAQ answer`);
        }

        const faqScripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]))
          .filter((schema) => schema['@type'] === 'FAQPage');
        assert.equal(faqScripts.length, 1, `${slug} FAQPage schema count`);
        assert.deepEqual(
          faqScripts[0].mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })),
          content.faqReference.map(({ q, a }) => ({ q, a })),
          `${slug} FAQ schema matches visible FAQ copy`
        );

        const serviceSchemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]))
          .filter((schema) => schema['@type'] === 'Service');
        assert.equal(serviceSchemas.length, 1, `${slug} Service schema count`);
        assert.equal(serviceSchemas[0].offers.availability, 'https://schema.org/InStock', `${slug} retains approved Offer availability`);
        assert.ok(serviceSchemas[0].offers.priceCurrency, `${slug} retains approved Offer currency`);

        for (const related of content.relatedServices || []) {
          assert.ok(html.includes(`href="/services/${related.id}"`), `${slug} service link ${related.id}`);
        }
        for (const related of content.relatedResources || []) {
          assert.ok(html.includes(`href="/resources/${related.slug}"`), `${slug} resource link ${related.slug}`);
        }
      }
    } finally {
      rmSync(outFile, { force: true });
      rmSync(entryFile, { force: true });
    }
  });
});

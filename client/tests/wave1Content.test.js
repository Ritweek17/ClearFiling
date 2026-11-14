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

import { SERVICES, ICON_MAP } from '../src/data/services.js';
import { isServiceIndexable, getRegistryEntry } from '../src/data/serviceRegistry.js';
import { generateServiceSchema, generateFAQSchema } from '../src/components/seo/SchemaHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WAVE_1_SLUGS = [
  'private-limited-company', 'llp-registration', 'opc-registration', 'partnership-firm',
  'msme-registration', 'startup-india-registration', 'iec-registration', 'digital-signature', 'fssai-registration',
  'trademark-registration', 'trademark-renewal', 'trademark-objection',
  'gst-registration', 'gst-return-filing', 'gst-annual-return',
  'income-tax-filing', 'business-itr', 'tds-return',
  'annual-compliance', 'llp-compliance'
];

describe('Wave 1 Content Verification Suite', () => {
  it('verifies all 20 Wave 1 services are present in SERVICES catalogue', () => {
    assert.equal(SERVICES.length, 91, 'Total catalogue services must remain 91');
    WAVE_1_SLUGS.forEach(slug => {
      const s = SERVICES.find(x => x.slug === slug);
      assert.ok(s, `Missing service ${slug} in SERVICES`);
      assert.equal(s.slug, slug);
      assert.ok(s.title, `Missing title in ${slug}`);
      assert.ok(s.shortDescription, `Missing shortDescription in ${slug}`);
      assert.ok(s.description, `Missing description in ${slug}`);
      assert.ok(s.longDescription, `Missing longDescription in ${slug}`);
      assert.ok(s.metaTitle, `Missing metaTitle in ${slug}`);
      assert.ok(s.metaDescription, `Missing metaDescription in ${slug}`);
      assert.ok(Array.isArray(s.keywords) && s.keywords.length >= 5, `Insufficient keywords in ${slug}`);
      assert.ok(ICON_MAP[s.iconName], `Invalid iconName ${s.iconName} in ${slug}`);
      assert.ok(s.processingTime, `Missing processingTime in ${slug}`);
      assert.ok(s.heroTitle, `Missing heroTitle in ${slug}`);
      assert.ok(s.heroDescription, `Missing heroDescription in ${slug}`);
      assert.ok(s.ctaTitle, `Missing ctaTitle in ${slug}`);
      assert.ok(s.ctaDescription, `Missing ctaDescription in ${slug}`);
      assert.ok(Array.isArray(s.requiredDocuments) && s.requiredDocuments.length >= 4, `Insufficient requiredDocuments in ${slug}`);
      assert.ok(Array.isArray(s.benefits) && s.benefits.length >= 4, `Insufficient benefits in ${slug}`);
      assert.ok(Array.isArray(s.eligibility) && s.eligibility.length >= 4, `Insufficient eligibility in ${slug}`);
      assert.ok(Array.isArray(s.process) && s.process.length >= 4, `Insufficient process steps in ${slug}`);
      assert.ok(Array.isArray(s.faqs) && s.faqs.length >= 4, `Insufficient faqs in ${slug}`);
      assert.ok(Array.isArray(s.relatedServices) && s.relatedServices.length >= 3, `Insufficient relatedServices in ${slug}`);
    });
  });

  it('audits and confirms absence of forbidden, misleading, or guaranteed claims', () => {
    const forbiddenPatterns = [
      /guaranteed approval/i,
      /prevents notices/i,
      /prevents tax notices/i,
      /same-day approval/i,
      /complete itc realization without disallowances/i,
      /100% compliance guarantee/i
    ];

    WAVE_1_SLUGS.forEach(slug => {
      const s = SERVICES.find(x => x.slug === slug);
      const textBlob = JSON.stringify(s);
      forbiddenPatterns.forEach(pattern => {
        assert.ok(!pattern.test(textBlob), `Forbidden pattern ${pattern} found in ${slug}`);
      });
    });
  });

  it('verifies statutory accuracy across all specific subject-matter areas', () => {
    // 1. Startup India
    const startup = SERVICES.find(s => s.slug === 'startup-india-registration');
    assert.ok(startup.longDescription.includes('G.S.R. 108(E)'), 'Startup India must cite G.S.R. 108(E)');
    assert.ok(startup.longDescription.includes('200 Crore'), 'Startup India must cite 200 Crore limit');
    assert.ok(startup.longDescription.includes('DeepTech'), 'Startup India must include DeepTech');
    assert.ok(startup.longDescription.includes('300 Crore'), 'Startup India must cite 300 Crore DeepTech limit');
    assert.ok(startup.longDescription.includes('Section 80-IAC'), 'Startup India must distinguish Section 80-IAC');

    // 1B. MSME Revised Thresholds (S.O. 1364(E) effective 1 April 2025)
    const msme = SERVICES.find(s => s.slug === 'msme-registration');
    assert.ok(msme.longDescription.includes('S.O. 1364(E)'), 'MSME must cite Notification S.O. 1364(E)');
    assert.ok(msme.longDescription.includes('2.5 Crore'), 'MSME must cite ₹2.5 Crore Micro investment limit');
    assert.ok(msme.longDescription.includes('10 Crore'), 'MSME must cite ₹10 Crore Micro turnover limit');
    assert.ok(msme.longDescription.includes('25 Crore'), 'MSME must cite ₹25 Crore Small investment limit');
    assert.ok(msme.longDescription.includes('100 Crore'), 'MSME must cite ₹100 Crore Small turnover limit');
    assert.ok(msme.longDescription.includes('125 Crore'), 'MSME must cite ₹125 Crore Medium investment limit');
    assert.ok(msme.longDescription.includes('500 Crore'), 'MSME must cite ₹500 Crore Medium turnover limit');

    // 2. Income Tax Transition & Limits
    const indItr = SERVICES.find(s => s.slug === 'income-tax-filing');
    assert.ok(indItr.longDescription.includes('Income-tax Act, 1961'), 'ITR must cite 1961 Act');
    assert.ok(indItr.longDescription.includes('Income-tax Act, 2025'), 'ITR must cite 2025 Act');
    assert.ok(indItr.longDescription.includes('75,000'), 'ITR must cite 75,000 standard deduction');

    const bizItr = SERVICES.find(s => s.slug === 'business-itr');
    assert.ok(bizItr.longDescription.includes('3 Crore'), 'Business ITR must cite ₹3 Crore 44AD limit');
    assert.ok(bizItr.longDescription.includes('75 Lakhs'), 'Business ITR must cite ₹75 Lakhs 44ADA limit');

    // 3. TDS Form Mapping
    const tds = SERVICES.find(s => s.slug === 'tds-return');
    assert.ok(tds.longDescription.includes('Form 138'), 'TDS must cite Form 138 for 24Q');
    assert.ok(tds.longDescription.includes('Form 140'), 'TDS must cite Form 140 for 26Q');
    assert.ok(tds.longDescription.includes('Form 143'), 'TDS must cite Form 143 for 27EQ');
    assert.ok(tds.longDescription.includes('Form 144'), 'TDS must cite Form 144 for 27Q');
    assert.ok(tds.longDescription.includes('Form 139 is Form 26B'), 'TDS must clarify Form 139 is Form 26B');
    assert.ok(tds.longDescription.includes('200 per day'), 'TDS must cite Section 234E ₹200/day');

    // 4. FSSAI
    const fssai = SERVICES.find(s => s.slug === 'fssai-registration');
    assert.ok(fssai.longDescription.includes('1.5 Crore'), 'FSSAI must cite ₹1.5 Crore threshold');
    assert.ok(fssai.longDescription.includes('50 Crore'), 'FSSAI must cite ₹50 Crore threshold');
    assert.ok(fssai.longDescription.includes('perpetual validity'), 'FSSAI must cite perpetual validity');
    assert.ok(fssai.longDescription.includes('Form D-1'), 'FSSAI must cite Form D-1');

    // 5. Trademark Objection & Renewal
    const tmObj = SERVICES.find(s => s.slug === 'trademark-objection');
    assert.ok(tmObj.longDescription.includes('Rule 33(4)'), 'Trademark Objection must cite Rule 33(4)');
    assert.ok(tmObj.longDescription.includes('Rule 109'), 'Trademark Objection must cite Rule 109');
    assert.ok(tmObj.longDescription.includes('discretionary'), 'Trademark Objection must state extension is discretionary');

    const tmRen = SERVICES.find(s => s.slug === 'trademark-renewal');
    assert.ok(tmRen.longDescription.includes('one year'), 'Trademark Renewal must cite 1-year window');
    assert.ok(tmRen.longDescription.includes('Form TM-R'), 'Trademark Renewal must cite Form TM-R');

    // 6. GST
    const gstRet = SERVICES.find(s => s.slug === 'gst-return-filing');
    assert.ok(gstRet.longDescription.includes('second proviso to Section 16(2)'), 'GST Return must cite second proviso to Section 16(2)');
    assert.ok(gstRet.longDescription.includes('180 days'), 'GST Return must cite 180 days');

    const gstAnn = SERVICES.find(s => s.slug === 'gst-annual-return');
    assert.ok(gstAnn.longDescription.includes('2 Crore'), 'GST Annual Return must cite ₹2 Crore threshold');
    assert.ok(gstAnn.longDescription.includes('5 Crore'), 'GST Annual Return must cite ₹5 Crore threshold');
    assert.ok(gstAnn.longDescription.includes('self-certified'), 'GST Annual Return must cite self-certified GSTR-9C');

    // 7. MCA & LLP Fees
    const annComp = SERVICES.find(s => s.slug === 'annual-compliance');
    assert.ok(annComp.longDescription.includes('100 per day'), 'Company Annual Compliance must cite ₹100/day');
    assert.ok(annComp.longDescription.includes('AOC-4'), 'Company Annual Compliance must cite AOC-4');
    assert.ok(annComp.longDescription.includes('MGT-7'), 'Company Annual Compliance must cite MGT-7');

    const llpComp = SERVICES.find(s => s.slug === 'llp-compliance');
    assert.ok(llpComp.longDescription.includes('G.S.R. 173(E)'), 'LLP Compliance must cite G.S.R. 173(E)');
    assert.ok(llpComp.longDescription.includes('graded'), 'LLP Compliance must cite graded fees');
  });

  it('validates schema generation for all 20 Wave 1 services', () => {
    WAVE_1_SLUGS.forEach(slug => {
      const s = SERVICES.find(x => x.slug === slug);
      const svcSchema = generateServiceSchema(s);
      assert.equal(svcSchema['@type'], 'Service');
      assert.ok(svcSchema.name);
      assert.ok(svcSchema.description);

      const faqSchema = generateFAQSchema(s.faqs);
      assert.equal(faqSchema['@type'], 'FAQPage');
      assert.ok(Array.isArray(faqSchema.mainEntity));
      assert.ok(faqSchema.mainEntity.length >= 4);
    });
  });

  it('renders all 20 Wave 1 service pages cleanly in SSR without runtime errors', async () => {
    const outFile = path.join(__dirname, `.tmp-svc-wave1-${Date.now()}.mjs`);
    const entryFile = path.join(__dirname, `.tmp-svc-wave1-entry-${Date.now()}.js`);

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
      const { ServiceDetail } = mod;

      WAVE_1_SLUGS.forEach(slug => {
        const s = SERVICES.find(x => x.slug === slug);
        const isIndexable = isServiceIndexable(slug);

        const html = renderToStaticMarkup(
          React.createElement(
            StaticRouter,
            { location: `/services/${slug}` },
            React.createElement(
              Routes,
              null,
              React.createElement(Route, { path: 'services/:slug', element: React.createElement(ServiceDetail) })
            )
          )
        );

        assert.ok(html.length > 500, `HTML output too short for ${slug}`);

        // All 20 Wave 1 service pages render full service content
        assert.ok(html.includes(s.title), `HTML missing title for ${slug}`);
        assert.ok(html.includes('Overview of ' + s.title), `HTML missing Overview for ${slug}`);
        assert.ok(html.includes('Frequently Asked Questions'), `HTML missing FAQs for ${slug}`);
        assert.ok(html.includes('lead-consultation-form'), `HTML missing lead-consultation-form for ${slug}`);
        assert.ok(html.includes('Get Free Expert Advice'), `HTML missing Get Free Expert Advice heading for ${slug}`);
      });
    } finally {
      try {
        rmSync(entryFile, { force: true });
        rmSync(outFile, { force: true });
      } catch (e) {}
    }
  });
});

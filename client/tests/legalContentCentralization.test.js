import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';

import BUSINESS from '../src/config/business.js';
import CONTACT from '../src/config/contact.js';
import OFFICE_LOCATIONS from '../src/data/officeLocations.js';
import { PRIVACY_POLICY, TERMS_CONDITIONS, DISCLAIMER } from '../src/data/legalContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('legal content business fact centralization', () => {
  it('derives repeated brand, legal name, domain, contact, and office facts from canonical configuration', () => {
    const websiteDomain = new URL(BUSINESS.websiteUrl).hostname.replace(/^www\./, '');
    assert.equal(BUSINESS.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(BUSINESS.primaryBrandName, 'ClearFiling');
    assert.equal(websiteDomain, 'clearfiling.co.in');

    assert.equal(
      PRIVACY_POLICY.intro,
      `${BUSINESS.legalName} ("${BUSINESS.primaryBrandName}", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website ${websiteDomain} or engage with our services. Please read this policy carefully. By using this website, you agree to the terms described herein.`
    );
    assert.deepEqual(PRIVACY_POLICY.sections.find(({ heading }) => heading === 'Contact Us').content[1], [
      `Email: ${CONTACT.email.display} / ${CONTACT.email2.display}`,
      `Phone: ${CONTACT.mobile.display} | Landline: ${CONTACT.landline.display} | Gorakhpur: ${CONTACT.gorakhpur.display}`,
      ...OFFICE_LOCATIONS.map((office) => `${office.label.replace(' Office', '')} Office: ${office.legalAddress}`),
    ]);

    const legalSource = readFileSync(path.resolve(__dirname, '../src/data/legalContent.js'), 'utf8');
    assert.doesNotMatch(legalSource, /ClearFiling|clearfiling\.co\.in|CLEARFILING AND COMPLIANCE LLP/);
    for (const contactLiteral of [CONTACT.email.display, CONTACT.email2.display, CONTACT.mobile.display, CONTACT.landline.display, CONTACT.gorakhpur.display]) {
      assert.ok(!legalSource.includes(contactLiteral), `Unexpected hardcoded legal contact value: ${contactLiteral}`);
    }
    for (const office of OFFICE_LOCATIONS) {
      assert.ok(!legalSource.includes(office.legalAddress), `Unexpected hardcoded legal office address: ${office.legalAddress}`);
    }
  });

  it('renders Privacy, Terms, and Disclaimer pages with the exact established legal copy', async () => {
    const entryFile = path.join(__dirname, `.tmp-legal-centralization-entry-${Date.now()}.js`);
    const outFile = path.join(__dirname, `.tmp-legal-centralization-${Date.now()}.mjs`);

    try {
      writeFileSync(entryFile, `
        export { default as Privacy } from '../src/pages/PrivacyPolicy.jsx';
        export { default as Terms } from '../src/pages/Terms.jsx';
        export { default as Disclaimer } from '../src/pages/Disclaimer.jsx';
      `, 'utf8');
      await esbuild.build({
        entryPoints: [entryFile], bundle: true, format: 'esm', platform: 'node',
        jsx: 'automatic', packages: 'external', outfile: outFile,
      });
      const mod = await import(pathToFileURL(outFile).href);
      const render = (Component, location) => renderToStaticMarkup(
        React.createElement(StaticRouter, { location }, React.createElement(Component))
      );
      const privacyHtml = render(mod.Privacy, '/privacy-policy');
      const termsHtml = render(mod.Terms, '/terms');
      const disclaimerHtml = render(mod.Disclaimer, '/disclaimer');

      assert.ok(privacyHtml.includes('CLEARFILING AND COMPLIANCE LLP (&quot;ClearFiling&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)'));
      assert.ok(privacyHtml.includes('Email: clearfiling@zohomail.in / support.clearfiling@gmail.com'));
      assert.ok(privacyHtml.includes('Delhi Office: E-20, Lajpat Nagar III, New Delhi – 110024'));
      assert.ok(privacyHtml.includes('We retain your personal information for as long as necessary'));
      assert.ok(termsHtml.includes('Fees once paid for professional services rendered are non-refundable unless the service has not been initiated.'));
      assert.ok(termsHtml.includes('subject to the exclusive jurisdiction of the courts in New Delhi, India.'));
      assert.ok(termsHtml.includes('CLEARFILING AND COMPLIANCE LLP provides professional advisory and facilitation services'));
      assert.ok(disclaimerHtml.includes('does not constitute formal legal, tax, or financial advice.'));
      assert.ok(disclaimerHtml.includes('We do not guarantee specific approval outcomes.'));
      assert.ok(disclaimerHtml.includes('subject to the jurisdiction of courts in New Delhi, India.'));
    } finally {
      rmSync(entryFile, { force: true });
      rmSync(outFile, { force: true });
    }
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';

import BUSINESS from '../src/config/business.js';
import OFFICE_LOCATIONS from '../src/data/officeLocations.js';
import { COMPANY_INFO } from '../src/data/companyInfo.js';
import { FOOTER_COMPANY } from '../src/data/footerConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('canonical company profile configuration', () => {
  it('contains the confirmed company identity and derives compatibility exports', () => {
    assert.equal(BUSINESS.primaryBrandName, 'ClearFiling');
    assert.equal(BUSINESS.legalName, 'CLEARFILING AND COMPLIANCE LLP');
    assert.equal(BUSINESS.tagline, 'Integrity, sanctity, dedication');
    assert.equal(BUSINESS.serviceCoverage, 'Online services across India');
    assert.deepEqual(BUSINESS.physicalOfficeCities, ['Delhi', 'Deoria', 'Gorakhpur']);
    assert.deepEqual(BUSINESS.physicalOfficeCities, OFFICE_LOCATIONS.map((office) => office.label.replace(/ Office$/, '')));
    assert.equal(BUSINESS.stats.officesCount, 3);
    assert.equal(BUSINESS.stats.officesLocations, 'Delhi, Deoria, Gorakhpur');

    assert.equal(COMPANY_INFO.brandName, BUSINESS.primaryBrandName);
    assert.equal(COMPANY_INFO.name, BUSINESS.primaryBrandName);
    assert.equal(COMPANY_INFO.legalName, BUSINESS.legalName);
    assert.equal(COMPANY_INFO.tagline, BUSINESS.tagline);
    assert.equal(COMPANY_INFO.serviceCoverage, BUSINESS.serviceCoverage);
    assert.deepEqual(COMPANY_INFO.officeCities, BUSINESS.physicalOfficeCities);

    assert.equal(FOOTER_COMPANY.brandName, BUSINESS.primaryBrandName);
    assert.equal(FOOTER_COMPANY.legalName, BUSINESS.legalName);
    assert.equal(FOOTER_COMPANY.tagline, BUSINESS.tagline);
  });

  it('renders the established wordmark, footer identity, and About copy from canonical profile values', async () => {
    const entryFile = path.join(__dirname, `.tmp-company-profile-entry-${Date.now()}.js`);
    const outFile = path.join(__dirname, `.tmp-company-profile-${Date.now()}.mjs`);

    try {
      writeFileSync(entryFile, `
        export { default as Logo } from '../src/components/common/Logo.jsx';
        export { default as Footer } from '../src/components/common/Footer.jsx';
        export { default as AboutSection } from '../src/components/features/AboutSection.jsx';
        export { default as About } from '../src/pages/About.jsx';
      `, 'utf8');
      await esbuild.build({
        entryPoints: [entryFile], bundle: true, format: 'esm', platform: 'node',
        jsx: 'automatic', packages: 'external', outfile: outFile,
      });
      const mod = await import(pathToFileURL(outFile).href);
      const render = (Component, location = '/') => renderToStaticMarkup(
        React.createElement(StaticRouter, { location }, React.createElement(Component))
      );

      const logoHtml = render(mod.Logo);
      const footerHtml = render(mod.Footer);
      const aboutSectionHtml = render(mod.AboutSection);
      const aboutPageHtml = render(mod.About, '/about');

      assert.match(logoHtml, /aria-label="ClearFiling Home"/);
      assert.match(logoHtml, /Clear<span class="text-brand-primary">Filing<\/span>/);
      assert.ok(footerHtml.includes('Integrity, sanctity, dedication'));
      assert.ok(footerHtml.includes('CLEARFILING AND COMPLIANCE LLP'));
      assert.ok(aboutSectionHtml.includes('ClearFiling (also known as Clear Filing), operated by CLEARFILING AND COMPLIANCE LLP'));
      assert.ok(aboutPageHtml.includes('Integrity, sanctity, dedication'));
      assert.ok(aboutPageHtml.includes('Since 2020, ClearFiling (Clear Filing) — operated by CLEARFILING AND COMPLIANCE LLP — has helped over 10,000 clients across India'));
      assert.ok(aboutPageHtml.includes('offices in New Delhi, Deoria, and Gorakhpur, Uttar Pradesh'));
      assert.ok(aboutPageHtml.includes('Crossed the 5,000 satisfied client milestone'));
    } finally {
      rmSync(entryFile, { force: true });
      rmSync(outFile, { force: true });
    }
  });
});

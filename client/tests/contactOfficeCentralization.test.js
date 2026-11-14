import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';

import CONTACT from '../src/config/contact.js';
import OFFICE_LOCATIONS from '../src/data/officeLocations.js';
import { COMPANY_INFO } from '../src/data/companyInfo.js';
import { FOOTER_CONTACT, FOOTER_OFFICES } from '../src/data/footerConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('contact and office information centralization', () => {
  it('preserves existing global contact values through compatibility adapters', () => {
    assert.deepEqual(CONTACT.mobile, {
      display: '+91 9250201718', href: 'tel:+919250201718', raw: '9250201718',
    });
    assert.deepEqual(CONTACT.landline, {
      display: '05568-450351', href: 'tel:05568450351', raw: '05568450351',
    });
    assert.deepEqual(CONTACT.gorakhpur, {
      display: '+91 9336379826', href: 'tel:+919336379826', raw: '9336379826',
    });
    assert.equal(CONTACT.email.display, 'clearfiling@zohomail.in');
    assert.equal(CONTACT.email2.display, 'support.clearfiling@gmail.com');
    assert.equal(CONTACT.hours.display, '9:00 AM – 9:00 PM');
    assert.equal(CONTACT.hours.note, 'Open 7 Days a Week');
    assert.equal(CONTACT.whatsapp.href, 'https://wa.me/919250201718?text=Hi%20ClearFiling%2C%20I%20need%20compliance%20assistance%20for%20my%20business.');

    assert.deepEqual(COMPANY_INFO.contact.mobile, CONTACT.mobile);
    assert.equal(COMPANY_INFO.contact.hours, '9:00 AM – 9:00 PM, Open 7 Days');
    assert.deepEqual(FOOTER_CONTACT.mobile, CONTACT.mobile);
    assert.equal(FOOTER_CONTACT.whatsapp.href, CONTACT.whatsapp.href);
  });

  it('preserves stable office records and exposes contact data from the canonical contact config', () => {
    assert.deepEqual(OFFICE_LOCATIONS.map(({ id }) => id), ['delhi', 'deoria', 'gorakhpur']);
    assert.deepEqual(OFFICE_LOCATIONS.map(({ phone, phoneHref, email, emails }) => ({ phone, phoneHref, email, emails })), [
      {
        phone: CONTACT.mobile.display, phoneHref: CONTACT.mobile.href,
        email: CONTACT.email.display, emails: [CONTACT.email.display, CONTACT.email2.display],
      },
      {
        phone: CONTACT.landline.display, phoneHref: CONTACT.landline.href,
        email: CONTACT.email.display, emails: [CONTACT.email.display, CONTACT.email2.display],
      },
      {
        phone: CONTACT.gorakhpur.display, phoneHref: CONTACT.gorakhpur.href,
        email: CONTACT.email.display, emails: [CONTACT.email.display, CONTACT.email2.display],
      },
    ]);
    assert.deepEqual(COMPANY_INFO.offices.map(({ id, address, lines }) => ({ id, address, lines })), [
      { id: 'delhi', address: 'E-20, Lajpat Nagar III, New Delhi – 110024, India', lines: ['E-20, Lajpat Nagar III,', 'New Delhi – 110024, India'] },
      { id: 'deoria', address: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road, Deoria, Uttar Pradesh – 274001', lines: ['Asha Complex, 30 Feet Road,', 'Near Nahar, Bhikhampur Road,', 'Deoria, Uttar Pradesh – 274001'] },
      { id: 'gorakhpur', address: '100D, Surajkund Colony, Gorakhpur, Uttar Pradesh – 273015', lines: ['100D, Surajkund Colony,', 'Gorakhpur, Uttar Pradesh – 273015'] },
    ]);
    assert.deepEqual(FOOTER_OFFICES.map(({ id, label, lines, phone }) => ({ id, label, lines, phone })), [
      { id: 'delhi', label: 'Delhi Office', lines: ['E-20, Lajpat Nagar III,', 'New Delhi – 110024, India'], phone: undefined },
      { id: 'deoria', label: 'Deoria Office', lines: ['Asha Complex, 30 Feet Road,', 'Near Nahar, Bhikhampur Road,', 'Deoria, Uttar Pradesh – 274001'], phone: undefined },
      { id: 'gorakhpur', label: 'Gorakhpur Office', lines: ['100D, Surajkund Colony,', 'Gorakhpur, Uttar Pradesh – 273015'], phone: '+91 9336379826' },
    ]);
  });

  it('renders the existing contact and office details in the public components', async () => {
    const entryFile = path.join(__dirname, `.tmp-contact-office-entry-${Date.now()}.js`);
    const outFile = path.join(__dirname, `.tmp-contact-office-${Date.now()}.mjs`);

    try {
      writeFileSync(entryFile, `
        export { default as ContactInfoCards } from '../src/components/contact/ContactInfoCards.jsx';
        export { default as OfficeLocations } from '../src/components/contact/OfficeLocations.jsx';
        export { default as Footer } from '../src/components/common/Footer.jsx';
      `, 'utf8');
      await esbuild.build({
        entryPoints: [entryFile], bundle: true, format: 'esm', platform: 'node',
        jsx: 'automatic', packages: 'external', outfile: outFile,
      });
      const mod = await import(pathToFileURL(outFile).href);
      const render = (Component) => renderToStaticMarkup(
        React.createElement(StaticRouter, { location: '/' }, React.createElement(Component))
      );
      const contactHtml = render(mod.ContactInfoCards);
      const officeHtml = render(mod.OfficeLocations);
      const footerHtml = render(mod.Footer);

      for (const value of ['+91 9250201718', '05568-450351', 'clearfiling@zohomail.in', 'support.clearfiling@gmail.com', '9:00 AM – 9:00 PM']) {
        assert.ok(contactHtml.includes(value), `Contact card omitted ${value}`);
      }
      for (const value of ['E-20, Lajpat Nagar III', 'New Delhi – 110024', 'Asha Complex, 30 Feet Road', 'Near Nahar, Bhikhampur Road', '100D, Surajkund Colony', '+91 9336379826']) {
        assert.ok(officeHtml.includes(value), `Office component omitted ${value}`);
      }
      for (const value of ['E-20, Lajpat Nagar III,', 'Deoria, Uttar Pradesh – 274001', 'Gorakhpur, Uttar Pradesh – 273015']) {
        assert.ok(footerHtml.includes(value), `Footer omitted ${value}`);
      }
    } finally {
      rmSync(entryFile, { force: true });
      rmSync(outFile, { force: true });
    }
  });
});

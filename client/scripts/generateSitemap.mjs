/**
 * generateSitemap.mjs
 * Build-time sitemap generator for ClearFiling.
 * Outputs client/public/sitemap.xml from authoritative data sources:
 * - INDEXABLE_SERVICE_SLUGS (23 active indexable services)
 * - RESOURCES (6 published resource guides)
 * - BLOG_POSTS (6 published blog articles)
 * - Core pages (Home, About, Services, Contact, Resources, Blog)
 * - Legal pages (Privacy Policy, Terms, Disclaimer)
 *
 * Excludes:
 * - 66 noindex Coming Soon services
 * - 2 redirected service slugs (udyam-registration, import-export-code)
 * - Duplicate consolidated digital-signature
 * - Unbuilt category hubs
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { INDEXABLE_SERVICE_SLUGS } from '../src/data/serviceRegistry.js';
import { RESOURCES } from '../src/data/resourcesContent.js';
import { BLOG_POSTS } from '../src/data/blogContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

const BASE_URL = 'https://www.clearfiling.co.in';

const CORE_PAGES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/resources', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
];

const CORPORATE_SERVICES = [
  'private-limited-company',
  'gst-registration',
  'trademark-registration',
];

const LEGAL_PAGES = [
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.5' },
];

export const generateSitemapXml = () => {
  const activeCorporate = INDEXABLE_SERVICE_SLUGS.filter((slug) => CORPORATE_SERVICES.includes(slug));
  const activeLoans = INDEXABLE_SERVICE_SLUGS.filter((slug) => !CORPORATE_SERVICES.includes(slug));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <!-- Home Page -->',
    '  <url>',
    `    <loc>${BASE_URL}/</loc>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '',
    '  <!-- Core Pages -->',
    ...CORE_PAGES.slice(1).flatMap((p) => [
      '  <url>',
      `    <loc>${BASE_URL}${p.path}</loc>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '  </url>',
    ]),
    '',
    '  <!-- Active Corporate Service Pages -->',
    ...activeCorporate.flatMap((slug) => [
      '  <url>',
      `    <loc>${BASE_URL}/services/${slug}</loc>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
    ]),
    '',
    '  <!-- Active Loan Services -->',
    ...activeLoans.flatMap((slug) => [
      '  <url>',
      `    <loc>${BASE_URL}/services/${slug}</loc>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
    ]),
    '',
    '  <!-- Resource Guides -->',
    ...RESOURCES.flatMap((res) => [
      '  <url>',
      `    <loc>${BASE_URL}/resources/${res.slug}</loc>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>',
    ]),
    '',
    '  <!-- Blog Articles -->',
    ...BLOG_POSTS.flatMap((post) => [
      '  <url>',
      `    <loc>${BASE_URL}/blog/${post.slug}</loc>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>',
    ]),
    '',
    '  <!-- Legal Pages -->',
    ...LEGAL_PAGES.flatMap((p) => [
      '  <url>',
      `    <loc>${BASE_URL}${p.path}</loc>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '  </url>',
    ]),
    '</urlset>',
    '',
  ];

  return lines.join('\n');
};

const xml = generateSitemapXml();
writeFileSync(outputPath, xml, 'utf8');

const urlCount = (xml.match(/<loc>/g) || []).length;
console.log(`[Sitemap] Generated ${outputPath} with ${urlCount} URLs.`);


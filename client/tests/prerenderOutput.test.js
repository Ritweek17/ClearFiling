import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICE_REGISTRY, REDIRECT_SERVICE_MAP } from '../src/data/serviceRegistry.js';
import { resolveRouteSeo } from '../src/utils/routeSeo.js';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(clientRoot, 'dist');
const origin = 'https://www.clearfiling.co.in';
const sitemap = fs.readFileSync(path.join(clientRoot, 'public/sitemap.xml'), 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1], origin).pathname.replace(/\/$/, '') || '/');
const noindexRoutes = SERVICE_REGISTRY
  .filter((service) => service.indexStatus === 'noindex' && !service.redirectTo)
  .map((service) => `/services/${service.slug}`);
const allRoutes = [...sitemapRoutes, ...noindexRoutes];

const documentPath = (route) => path.join(distRoot, route === '/' ? 'index.html' : `${route.slice(1)}.html`);
const matches = (html, expression) => [...html.matchAll(expression)];
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

test('static output covers every sitemap URL and canonical noindex service route', () => {
  assert.equal(sitemapRoutes.length, 44);
  assert.equal(noindexRoutes.length, 66);
  assert.equal(allRoutes.length, 110);
  assert.equal(new Set(allRoutes).size, 110);

  for (const route of allRoutes) {
    const html = fs.readFileSync(documentPath(route), 'utf8');
    const seo = resolveRouteSeo(route);
    assert.equal(matches(html, /<title>/g).length, 1, `${route} title`);
    assert.equal(matches(html, /<meta name="description"/g).length, 1, `${route} description`);
    assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || ''), seo.title, `${route} resolved title`);
    assert.equal(decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || ''), seo.description, `${route} resolved description`);
    assert.equal(matches(html, /<meta property="og:title"/g).length, 1, `${route} Open Graph title`);
    assert.equal(matches(html, /<meta property="og:description"/g).length, 1, `${route} Open Graph description`);
    assert.equal(matches(html, /<meta name="twitter:title"/g).length, 1, `${route} Twitter title`);
    assert.equal(matches(html, /<meta name="twitter:description"/g).length, 1, `${route} Twitter description`);
    assert.equal(matches(html, /<h1(?:\s|>)/g).length >= 1, true, `${route} visible H1`);
    assert.equal(html.includes('id="root"><!--clearfiling-app:start--><'), true, `${route} server-rendered content`);

    const isNoindex = noindexRoutes.includes(route);
    assert.equal(matches(html, /<meta name="robots"/g).length, isNoindex ? 1 : 0, `${route} robots`);
    if (isNoindex) {
      assert.match(html, /<meta name="robots" content="noindex, follow">/);
      assert.doesNotMatch(html, /<link rel="canonical"/);
      assert.equal(sitemapRoutes.includes(route), false);
    } else {
      assert.equal(matches(html, /<link rel="canonical"/g).length, 1, `${route} canonical`);
      assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], seo.canonical, `${route} canonical target`);
    }

    assert.equal(matches(html, /<meta property="og:url"/g).length, seo.canonical ? 1 : 0, `${route} Open Graph URL`);

    const schemaIds = matches(html, /<script\b[^>]*type="application\/ld\+json"[^>]*>/g)
      .map(([script]) => script.match(/\bid="([^"]+)"/)?.[1])
      .filter(Boolean);
    assert.equal(new Set(schemaIds).size, schemaIds.length, `${route} JSON-LD ids`);
  }
});

test('noindex 404 is separate and both legacy service redirects remain configured', () => {
  const notFound = fs.readFileSync(path.join(distRoot, '404.html'), 'utf8');
  assert.match(notFound, /<meta name="robots" content="noindex, follow">/);
  assert.match(notFound, /<h1/);
  assert.doesNotMatch(notFound, /<link rel="canonical"/);
  assert.equal(matches(notFound, /<script type="module"/g).length, 0);

  const vercel = JSON.parse(fs.readFileSync(path.join(clientRoot, 'vercel.json'), 'utf8'));
  assert.equal(vercel.cleanUrls, true);
  assert.equal((vercel.rewrites || []).some((rewrite) => rewrite.source === '/(.*)' && rewrite.destination === '/index.html'), false);
  const redirects = vercel.redirects || [];
  for (const [slug, destination] of Object.entries(REDIRECT_SERVICE_MAP)) {
    assert.ok(redirects.some((redirect) => redirect.source === `/services/${slug}` && redirect.destination === destination && redirect.statusCode === 301), `${slug} 301`);
  }
});

test('services listing begins with a hydration-stable filter state and applies URL category after hydration', () => {
  const source = fs.readFileSync(path.join(clientRoot, 'src/pages/Services.jsx'), 'utf8');
  const rendered = fs.readFileSync(documentPath('/services'), 'utf8');
  assert.match(source, /useState\('All'\)/);
  assert.match(source, /const cat = searchParams\.get\('category'\)/);
  assert.match(source, /setActiveCategory\(cat\)/);
  assert.match(rendered, /<button[^>]*bg-brand-primary[^>]*>All<\/button>/);
});

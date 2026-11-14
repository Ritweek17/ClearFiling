import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { SERVICE_REGISTRY, REDIRECT_SERVICE_MAP, CONSOLIDATED_DUPLICATES } from '../src/data/serviceRegistry.js';
import { renderRouteSeoTags } from '../src/utils/routeSeo.js';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(clientRoot, 'dist');
const sitemapPath = path.join(clientRoot, 'public', 'sitemap.xml');
const clearfilingOrigin = 'https://www.clearfiling.co.in';

const sitemapXml = await fs.readFile(sitemapPath, 'utf8');
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1], clearfilingOrigin).pathname.replace(/\/$/, '') || '/');
if (sitemapPaths.length !== 44 || new Set(sitemapPaths).size !== 44) {
  throw new Error(`Expected 44 unique sitemap URLs, found ${sitemapPaths.length}.`);
}

const indexableServiceCount = sitemapPaths.filter((route) => route.startsWith('/services/')).length;
const noindexServiceSlugs = SERVICE_REGISTRY
  .filter((service) => service.indexStatus === 'noindex' && !service.redirectTo)
  .map((service) => service.slug);
if (indexableServiceCount !== 23 || noindexServiceSlugs.length !== 66) {
  throw new Error(`Service routing changed: expected 23 indexable and 66 noindex, found ${indexableServiceCount} and ${noindexServiceSlugs.length}.`);
}

const redirectPaths = Object.keys(REDIRECT_SERVICE_MAP).map((slug) => `/services/${slug}`);
const routes = [...sitemapPaths, ...noindexServiceSlugs.map((slug) => `/services/${slug}`)];
if (routes.length !== 110 || new Set(routes).size !== 110) {
  throw new Error(`Expected 110 unique static route documents, found ${routes.length}.`);
}
for (const pathName of redirectPaths) {
  if (routes.includes(pathName)) throw new Error(`A redirect source was included as a page: ${pathName}`);
}
for (const duplicate of CONSOLIDATED_DUPLICATES) {
  const duplicatePath = `/services/${duplicate.slug}`;
  if (!routes.includes(duplicatePath)) throw new Error(`The merged canonical service route is missing: ${duplicatePath}`);
}

let template = await fs.readFile(path.join(outputRoot, 'index.html'), 'utf8');
if (!template.includes('<!--clearfiling-seo:start-->') || !template.includes('<!--clearfiling-app:start-->')) {
  throw new Error('Built HTML is missing the SEO markers or React root placeholder.');
}

const server = await createServer({
  configFile: path.join(clientRoot, 'vite.config.js'),
  root: clientRoot,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { render, renderNotFound } = await server.ssrLoadModule('/src/entry-server.jsx');
  const replaceHead = (html, route) => html.replace(
    /<!--clearfiling-seo:start-->[\s\S]*?<!--clearfiling-seo:end-->/,
    `<!--clearfiling-seo:start-->\n    ${renderRouteSeoTags(route)}\n    <!--clearfiling-seo:end-->`,
  );
  const replaceRoot = (html, markup) => html.replace(
    /<!--clearfiling-app:start-->[\s\S]*?<!--clearfiling-app:end-->/,
    `<!--clearfiling-app:start-->${markup}<!--clearfiling-app:end-->`,
  );

  const checks = [];
  for (const route of routes) {
    const markup = await render(route);
    let html = replaceRoot(replaceHead(template, route), markup);
    const titleCount = (html.match(/<title>/g) || []).length;
    const descriptionCount = (html.match(/<meta name="description"/g) || []).length;
    const h1Count = (markup.match(/<h1(?:\s|>)/g) || []).length;
    const ldScripts = [...markup.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>/g)];
    const ldIds = ldScripts.map((match) => match[0].match(/\bid="([^"]+)"/)?.[1]).filter(Boolean);
    const pathIsNoindex = route.startsWith('/services/') && !sitemapPaths.includes(route);
    const robotsCount = (html.match(/<meta name="robots"/g) || []).length;
    const hasCanonical = /<link rel="canonical"/.test(html);
    const hasMeaningfulContent = markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().length > 200;
    if (titleCount !== 1 || descriptionCount !== 1 || h1Count < 1 || !hasMeaningfulContent) {
      throw new Error(`Metadata/content validation failed for ${route}: title=${titleCount}, description=${descriptionCount}, h1=${h1Count}, content=${hasMeaningfulContent}`);
    }
    if (robotsCount !== (pathIsNoindex ? 1 : 0)) throw new Error(`Unexpected robots directive count for ${route}: ${robotsCount}`);
    if (pathIsNoindex && /<meta name="robots" content="noindex, follow">/.test(html) !== true) {
      throw new Error(`Noindex route is missing noindex, follow: ${route}`);
    }
    if (pathIsNoindex && hasCanonical) throw new Error(`Noindex service unexpectedly received a canonical URL: ${route}`);
    if (ldIds.length !== new Set(ldIds).size) throw new Error(`Duplicate JSON-LD script ids for ${route}`);
    if (route.startsWith('/services/') && !pathIsNoindex && !hasCanonical) throw new Error(`Indexable service is missing canonical URL: ${route}`);
    if (pathIsNoindex) {
      const slug = route.split('/').at(-1);
      if (sitemapPaths.includes(`/services/${slug}`)) throw new Error(`Noindex route leaked into sitemap: ${route}`);
    }

    const relativeFile = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    const destination = path.join(outputRoot, relativeFile);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, html);
    checks.push({ route, noindex: pathIsNoindex, schemas: ldScripts.length });
  }

  const notFoundMarkup = renderNotFound();
  let notFoundHtml = replaceRoot(replaceHead(template, '/__clearfiling_404__'), notFoundMarkup);
  notFoundHtml = notFoundHtml
    .replace(/\s*<script\s+type="module"[^>]*><\/script>/g, '')
    .replace(/\s*<link\s+rel="modulepreload"[^>]*>/g, '');
  if (!/<meta name="robots" content="noindex, follow">/.test(notFoundHtml) || !/<h1/.test(notFoundMarkup)) {
    throw new Error('Generated 404 document is missing noindex or page content.');
  }
  await fs.writeFile(path.join(outputRoot, '404.html'), notFoundHtml);

  const verifyFiles = await Promise.all(routes.map(async (route) => {
    const relativeFile = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    await fs.access(path.join(outputRoot, relativeFile));
  }));
  console.log(`Static generation complete: ${checks.length} routes (${checks.filter((item) => !item.noindex).length} indexable, ${checks.filter((item) => item.noindex).length} noindex) and 1 noindex 404 document.`);
  console.log(`Routes with JSON-LD: ${checks.filter((item) => item.schemas > 0).length}; route files verified: ${verifyFiles.length}.`);
} finally {
  await server.close();
}

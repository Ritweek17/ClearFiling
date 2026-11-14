# Phase 1A — Technical SEO Prerendering Evaluation

**Repository:** `/Users/ritweek/Desktop/Clearfiling/ClearFiling`  
**Evaluation date:** 2026-11-14  
**Mode:** Read-only evaluation. No code, config, dependency, route, redirect, sitemap or indexing changes were made. No build or sitemap generator was run for this phase.

## Recommendation

**Recommend a Vite-native, build-time static prerender pipeline that uses React 18 server rendering with a shared route tree and preserves React Router 6 on the client.** It should emit static HTML for the 44 URLs currently in the sitemap plus the 66 canonical noindex service routes, while leaving the sitemap at 44 URLs. A generated `404.html` and a filesystem-first Vercel deployment without the catch-all SPA rewrite are needed if unknown direct requests are to return HTTP 404 while existing generated routes remain directly addressable.

This is safe to implement without migrating frameworks, provided it is delivered as a gated change with route-by-route hydration, metadata, noindex, redirect, and Vercel preview tests. It is **not** safe as a one-line plugin change: the current app uses `BrowserRouter` inside `App`, `createRoot`, `useEffect`-based SEO components, lazy routes, and a breadcrumb URL that reads `window.location`. Each needs a specific compatibility treatment. No implementation has started; owner approval is required before changing these files.

## 1. Current architecture findings

### App and route structure

- `client/src/App.jsx` owns `BrowserRouter`, `Routes`, the shared layout, and the wildcard NotFound route. Home is imported eagerly; About, Contact, Services, ServiceDetail, legal pages, resources, blog and NotFound use `React.lazy`.
- `client/src/main.jsx` mounts with `ReactDOM.createRoot`. React’s documented prerender/hydration path requires `hydrateRoot` for existing React-generated HTML; using `createRoot` would discard and rebuild the prerendered markup. [React `hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot), [React `createRoot`](https://react.dev/reference/react-dom/client/createRoot)
- `client/src/layouts/MainLayout.jsx` renders shared navigation, page outlet, floating CTAs and footer. This shell is part of each route’s HTML and must render consistently on server and client.
- Route content is mostly build-time data in `services.js`, `resourcesContent.js`, `blogContent.js`, and `legalContent.js`. The Home page also includes `DocumentationSection`, whose public-document data loads through client-side effects. A build render will not run effects or fetch that API; the initial HTML can contain the existing skeleton/empty state, while the client continues to load public documents after hydration. Do not make the build depend on the production API or credentials.

### Metadata and structured data

- `client/src/config/seo.js` and service/resource/blog/legal records contain the current metadata values. `client/src/components/seo/SEOHead.jsx` and `JsonLd.jsx` return `null` and install head data with effects, so those tags do not exist in server-rendered HTML today.
- `client/vite.config.js` injects a single home fallback into `index.html`; it does not produce per-route HTML.
- `JsonLd.jsx` currently appends a new script in an effect without reconciling a server-rendered script. Static schema output would therefore need stable script IDs or explicit reuse/removal to avoid duplicate JSON-LD after hydration.
- `Breadcrumbs.jsx` reads `window.location.pathname` during render to build the last breadcrumb item’s microdata URL. Server output would use an empty path and client output a route path, which risks a hydration mismatch and wrong breadcrumb URL. It should instead use the router location or an explicit route path shared on both renders.
- Existing schemas include WebSite, Organization/LegalService, office AccountingService, ContactPage, Service, BreadcrumbList, and FAQPage generators. There is no BlogPosting generator in current source; this proposal preserves existing schema behavior and does not add new schema types or unverified facts.

### Build and deployment

- Client build is `node scripts/generateSitemap.mjs && vite build`; it writes `client/public/sitemap.xml` before Vite builds. This phase did not run that command. Any later implementation must capture and compare sitemap output before/after and preserve the current 44 URLs.
- `client/vercel.json` retains two 301 service redirects and a catch-all rewrite of every request to `/index.html`. That rewrite supports the current SPA but sends unknown routes to the client app rather than letting the static host serve a 404 response.
- Vercel documentation describes static-site SSG as multiple generated HTML files and says an emitted `404.html` is served with 404 status when no static route matches. It also documents filesystem precedence and the SPA rewrite pattern. Removing the catch-all rewrite is therefore a deployment behavior change that must be tested on a Vercel preview, not inferred from local Vite preview. [Vercel custom 404](https://vercel.com/kb/guide/custom-404-page), [Vercel rewrites](https://vercel.com/docs/routing/rewrites), [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json)
- The public website and admin are separate Vite applications and deployments. The prerender route manifest must be built only from public client routes; do not import admin app routes or server/API modules into the static page output.

### Exact route population to render

The current sitemap has 44 URLs: homepage, five core sections, 23 indexable service routes, six resource routes, six blog routes and three legal routes. To provide initial HTML with the current noindex directive on direct visits as well, the static route set should additionally include all 66 noindex canonical service routes. That yields **110 HTML page routes** in the build output: 44 indexable sitemap URLs + 66 noindex service URLs. The noindex routes remain out of the sitemap.

The two legacy source paths remain Vercel 301 redirects and must not be emitted as pages. The consolidated duplicate remains without a route. Category hubs do not exist and are out of scope. A separate `404.html` is a response artifact, not an indexable route. Do not generate admin pages, API paths, private configuration or secret values.

## 2. Approaches evaluated

| Approach | Compatibility | Maintenance | Build complexity | Runtime and deployment behavior | Metadata/noindex accuracy | Assessment |
|---|---|---|---|---|---|---|
| **Vite-native custom SSG using React 18 SSR** | High in principle: uses current Vite, React and React Router; requires a shared route tree that can run under BrowserRouter in the browser and StaticRouter in the build renderer. | Medium: route/SEO resolution must stay shared and tests must guard parity. No new framework/plugin. | Medium: add an SSR entry/render script, static route manifest, per-route head/schema serialization, output writer and build checks. Lazy route components need an SSR-safe strategy. | Emits ordinary static HTML per route for Vercel; browser keeps client navigation after hydration. Known files can be served directly; 404 handling requires generated 404 output and changing the catch-all rewrite. | High if all routes are generated from current canonical metadata and service registry, and server markup includes schemas and robots before hydration. | **Recommended.** Lowest dependency/framework disruption while satisfying content + metadata requirements. Needs a focused implementation spike for lazy routes and hydration. |
| **Generic Vite prerender plugin (`vite-prerender-plugin`)** | Vite-compatible and framework-neutral; plugin calls a user-supplied `prerender()` function. It does not itself understand React Router or produce correct route metadata/content without that renderer. | Medium: maintain both plugin configuration and custom renderer. Additional dependency provides some output plumbing but little route-specific logic. | Medium/high: same SSR route/head work as custom SSG, plus plugin setup and dependency review. | Static output can work on Vercel; still requires file layout and 404/rewrite strategy. | Potentially high only if the custom prerender function correctly handles each route and schema. | Viable alternative if the plugin’s output behavior proves useful in a spike, but not necessary for this repository. Its own README says the project supplies its renderer. [Project README](https://github.com/preactjs/vite-prerender-plugin) |
| **`@prerenderer/rollup-plugin` with Puppeteer renderer** | Can visit routes in a browser and capture post-hydration output, reducing the need to refactor BrowserRouter. The project repository currently labels the Rollup/Vite plugin experimental. | Lower confidence: browser automation, Puppeteer/Chromium and route readiness signals become part of build maintenance. | High: additional browser binary/dependency and CI provisioning, deterministic network/API blocking, wait conditions and timeouts. | Generates snapshots after browser execution; can be made static for Vercel. If static snapshots are incomplete, stale or a fallback is saved, routes silently degrade. | Can capture hydrated head/schema if it waits correctly. Noindex is only as reliable as route readiness and route list. API-backed Home documents introduce timing variability. | Not recommended as the default because it adds a browser build dependency and is marked experimental. [Plugin README](https://github.com/Tofandel/prerenderer/blob/dev/packages/rollup-plugin/README.md) |
| **Vike (formerly vite-plugin-ssr) SSG integration** | Supports Vite and provides React examples, but introduces Vike’s page lifecycle/routing integration alongside or instead of current React Router routing. | Good framework-level tooling, but adds a second application convention and migration surface to this codebase. | High relative to a fixed 110-route static export. | Strong SSG/SSR capabilities; deployment can be static for SSG. Would require route ownership and fallback strategy changes. | Strong once integrated with Vike’s route/page metadata system. | Technically capable, but more framework integration than needed now. Consider only if future SSR/dynamic page needs justify it. [Vike existing-app guide](https://vike.dev/add-ssr-to-vite-app), [Vike prerendering](https://vike.dev/pre-rendering) |
| **Vite transformIndexHtml or hand-written metadata-only page shells** | Very compatible with existing Vite plugin. | Easy to maintain only for head tags. | Low. | Still serves empty SPA root content for direct routes unless page markup is rendered separately. | Could set metadata but does not satisfy route-specific initial page content or hydration requirements. | **Reject as incomplete.** It would repeat the existing fallback approach and fail the task’s main content requirement. |
| **Runtime Express SSR / React Router framework migration** | Requires app server/deployment changes; existing production arrangement is static Vercel frontend plus separate API. | Highest operational burden for this static content set. | High. | Dynamic SSR can handle arbitrary routes/HTTP statuses but requires a runtime function/server and server observability. | Strong when carefully implemented. | Not recommended for the current goal; static page data and finite URLs do not justify a new runtime or framework migration. |

Vite’s official guide describes build-time prerendering as using the same SSR logic for routes/data known ahead of time. It provides a React SSR example and advises that its low-level SSR APIs are aimed at framework/library authors, while noting applications can use them directly. This project has a finite known route set, so a constrained build-time renderer is suitable. [Vite SSR and prerendering guide](https://vite.dev/guide/ssr)

## 3. Recommended solution details

### Static output target

Generate one HTML document for each current page route:

- 44 current sitemap URLs: route-specific title, description, canonical, robots (indexable), Open Graph/Twitter tags, rendered page body and current applicable JSON-LD.
- 66 noindex service routes: current title/description, `noindex, follow`, current noindex canonical behavior (currently no service canonical on these routes), social metadata and rendered page body. Keep all 66 out of sitemap.
- Two redirects: remain Vercel 301 rules; no static source pages.
- Unknown path: a separate 404 document/status, noindex, not added to sitemap.

Public docs loaded through effects can remain a client-loaded panel during this phase; the rest of the page must have meaningful initial HTML. If owner later requires the document inventory itself in HTML, that is a separate data availability decision. Do not call the API at build time or include private documents/credentials.

### Preserve React Router and client behavior

Extract the route tree from the BrowserRouter wrapper so the exact same route definitions can be rendered under BrowserRouter for the client and StaticRouter for prerendering. The server renderer must resolve the same pathname and render the same page components/layout. Keep client navigation, forms, query handling and UI behavior in the browser. The client entry must hydrate existing root markup with `hydrateRoot`; React documents that hydration requires the initial client tree to match the server output. [React hydration requirements](https://react.dev/reference/react-dom/client/hydrateRoot)

React 18’s `renderToString` emits Suspense fallbacks when a component suspends (including `React.lazy`) rather than waiting for the content. Use an SSR entry that eagerly resolves route modules or a stream renderer that waits for `onAllReady` before writing static output, and add assertions that no route-loading fallback remains in any final page. [React `renderToString` Suspense behavior](https://react.dev/reference/react-dom/server/renderToString)

### Route-specific head and schema

Create a pure per-route resolver using current data sources, not a second set of editorial values. It should resolve route title/description/canonical/robots/social tags and schemas for:

- PAGE_SEO core pages;
- service detail records and indexability registry;
- resource records;
- blog records;
- legal page content/layout;
- unknown routes.

Render these tags into each generated document’s `<head>` at build time. Adapt SEOHead so hydration reuses/updates the existing tags rather than leaving duplicates. Adapt JsonLd so it can render or reconcile stable schema scripts. Do not duplicate the Organization entity or invent BlogPosting schema as part of this change. Breadcrumb page URLs must derive from router location/data, not a `window` read during render.

## 4. Expected files likely to change in a later approved implementation

| File/path | Expected purpose |
|---|---|
| `client/src/App.jsx` or new `client/src/routes.jsx` | Separate reusable route elements from BrowserRouter wrapper and make them renderable under StaticRouter. |
| `client/src/main.jsx` | Hydrate prerendered markup with `hydrateRoot`; provide a deliberate client-only fallback only if needed. |
| New `client/src/entry-server.jsx` or equivalent | Render the shared route tree for an explicit URL using React 18 server rendering and StaticRouter. |
| New route metadata resolver under `client/src/config/` or `client/src/utils/` | Resolve current metadata/schema from SEO_BASE, PAGE_SEO, registries and content data in a pure, testable function. |
| `client/src/components/seo/SEOHead.jsx` | Reuse existing static tags during hydration and retain current client navigation updates. |
| `client/src/components/seo/JsonLd.jsx` and `SchemaHelpers.js` | Emit/reconcile deterministic static JSON-LD without duplicate scripts. |
| `client/src/components/seo/Breadcrumbs.jsx` | Derive the page URL from router location/explicit props for server/client parity. |
| `client/scripts/` | Add route manifest/prerender writer; include 44 sitemap URLs and 66 noindex routes without writing or changing sitemap membership. |
| `client/package.json` | Add build step after Vite client/server outputs; no dependency is required for the recommended custom pipeline. Existing sitemap step must retain byte-identical behavior. |
| `client/index.html` | Add an exact root render placeholder if the chosen renderer injects React output into the shell. Preserve Vite asset and current fallback tags without duplicates. |
| `client/vercel.json` | Preserve security headers and two 301s; likely remove or narrow the catch-all rewrite so static files resolve and unknown paths use `404.html`. Exact rule must be proven in preview. |
| `client/tests/` | Add route output, metadata, schema, noindex, hydration, sitemap and generated-file integrity coverage. |

No admin or server file should need to change for a static public renderer. If implementation reveals otherwise, stop and re-evaluate scope.

## 5. Implementation sequence for a later approved phase

1. Capture baseline hashes and URL list for sitemap/robots; inspect current Vercel route precedence and keep the two redirects unchanged.
2. Build a route manifest from explicit core/legal routes, current canonical service registry, resource slugs and blog slugs. Assert 44 current indexable URLs and add 66 noindex service routes separately. Assert no admin/API path, redirect slug or consolidated duplicate is emitted.
3. Extract a shared React Router route tree. Add a StaticRouter-based server renderer while retaining BrowserRouter in client startup.
4. Prove server-safe rendering for all route families. Resolve lazy modules before render; ensure no `window`/`document` access occurs during render. Correct the Breadcrumbs `window.location` mismatch.
5. Add pure route metadata/schema resolution. Ensure static and hydrated output have one title/canonical/robots set and one each of the applicable schemas.
6. Render and write one initial HTML document per path, plus a noindex 404 document. Preserve existing noindex canonical behavior and indexable canonical URLs.
7. Switch client mount to hydration. Confirm client UI state, forms, links, filters, query strings and client-side navigation still work after hydration.
8. Adjust Vercel filesystem routing only after local output validation. Keep 301 rules; confirm known static routes are served before fallback and unknown routes get HTTP 404.
9. Build in a disposable/controlled working tree or retain a pre-build sitemap hash. Verify build output has 110 route HTML files plus 404; compare sitemap and robots byte hashes; do not commit generated output unless tracked workflow requires it.
10. Test locally and on a Vercel preview deployment. Do not deploy production in this phase.

## 6. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Hydration mismatch | Server/client markup must match; page may flash or React may discard static HTML. | Share route tree/data, use `hydrateRoot`, fix Breadcrumbs pathname dependence, inspect console and test every route family. Do not suppress warnings broadly. |
| Lazy route renders only fallback | React 18 `renderToString` does not wait for `React.lazy` boundaries. | Eagerly resolve SSR page modules or use stream rendering and wait for all-ready; assert page H1/body exists and loading fallback is absent. |
| Duplicate head/schema tags | Current components mutate head after hydration and JSON-LD appends scripts. | Use stable meta/canonical keys and JSON-LD script IDs/reuse; test one title, canonical, robots directive and expected schema identities after hydration. |
| Noindex leakage or accidental indexing | The set includes 66 current noindex routes that are intentionally absent from sitemap. | Generate noindex routes from `NOINDEX_SERVICE_SLUGS`, assert `noindex, follow` in static HTML and exclude from 44 sitemap URLs; compare all slugs in tests. |
| Redirect/fallback precedence | Existing 301 rules and catch-all rewrite can conflict with files or unknown-route response. | Preserve redirects; test status/Location for both, direct static page status, missing URL 404 and no chains on Vercel preview. |
| Trailing slash / case behavior | Static file layouts may cause redirects/canonical drift. | Keep current URL strings; inspect Vercel behavior before choosing output filename shape; test with and without slash and case variants. Do not add normalization policy in the renderer. |
| Build pulls runtime data/secrets | Public docs or environment may be fetched during rendering. | Render only local approved content; do not run effects or production API requests at build time; scan generated HTML for private/admin/API artifacts. |
| Build output drift | Sitemap generation is a write step in the existing build command. | Capture hash/list before and after; require exact 44-URL equality; do not refresh lastmod values artificially. |
| 404 UI differs on client-side navigation | A static 404 status only occurs on direct document requests. | Keep React wildcard route for client navigation; verify its visible noindex UI. Serve a static 404 response for direct unknown paths. |

## 7. Testing and acceptance criteria

### Generated document checks

- Every one of the 44 current sitemap URLs maps to exactly one generated document with the expected title, description, canonical, indexable robots behavior, Open Graph/Twitter tags, visible route H1/body and current relevant JSON-LD.
- All 66 canonical noindex service URLs map to generated HTML with exactly `noindex, follow`, preserve existing no-canonical behavior, have their visible service body/Coming Soon state and remain excluded from sitemap.
- Two old service URLs are absent as page files and return 301 to the existing destination, preserving query strings only as current behavior supports.
- One title, one canonical where applicable, at most one robots meta and no duplicate JSON-LD identities exist before and after hydration.
- Each generated route has the appropriate client bundle and hydration succeeds without console hydration errors; React links, navigation, query parameters, form display and route refresh continue to work.
- 404 document returns HTTP 404 on Vercel preview, carries noindex, is not in sitemap, and does not expose internal paths.
- Admin route strings, credentials, environment content and private API details do not appear in generated public HTML or route manifest.
- Sitemap count, order/membership, bytes/hash and robots directives remain unchanged unless an explicitly approved separate change authorizes otherwise.

### Route and deployment checks

Test direct request and refresh for `/`, `/about`, `/contact`, `/services`, representative indexable services, representative detailed/brief noindex services, all legal/resource/blog route families, both redirects, an unknown route and an unknown service slug. Include slash/no-slash and uppercase probes as observations only; do not change normalization. Validate locally and on a Vercel preview deployment because local Vite preview does not emulate Vercel’s routing/status behavior.

## 8. Deployment considerations

- Keep static output under the existing client output directory and keep `admin/` as a separate application. Vercel serves static files from the deployment output; its static SSG guidance supports route-specific HTML and a generated `404.html`. [Vercel SSG/custom 404 guidance](https://vercel.com/kb/guide/custom-404-page), [static file routing configuration](https://vercel.com/docs/project-configuration/vercel-json)
- The catch-all `/index.html` rewrite is currently required for ungenerated SPA routes. Once every supported public route has a static file, it should be removed or constrained; otherwise an unmatched URL still falls back to the app shell. Removing it is acceptable only after Vercel preview proves direct route files, SPA navigation and refresh all work.
- Vite’s build-time SEO fallback should remain deterministic for the root. It must not run in addition to route-specific generated head tags in a way that creates duplicates.
- Keep redirect definitions ahead of any routing fallback and verify 301 statuses. No production deployment is recommended until preview acceptance passes.
- Static HTML is generated only from public client code/data and canonical metadata. It does not execute admin/server code or expose server environment values.

## 9. Decisions requiring owner approval

1. Approve the Vite-native custom SSG direction and the expected route-set size of 110 page documents plus a 404 artifact.
2. Approve a later implementation to change client startup from createRoot to hydrateRoot and refactor the route wrapper while retaining React Router and React 18.
3. Approve a Vercel preview-only configuration change to remove/narrow the catch-all rewrite after static-route generation is proven. Preserve both 301 redirects.
4. Confirm that the public-document panel may remain client-loaded in initial HTML while the rest of the homepage is prerendered; no build-time API call is proposed.
5. Confirm that metadata/schema values remain the current approved values; this work will not revise the legal name, addresses, claims or content.

## Final recommendation

**Proceed with a controlled implementation of Vite-native static prerendering after owner approval. It can preserve React 18, Vite, React Router, the current design, client-side navigation, all service URLs, both redirects and all indexing decisions.** The primary risks are route-tree/hydration parity and Vercel 404/filesystem routing, not framework incompatibility. Do not install a framework or introduce an SSR runtime for this fixed set of public routes. Approval is required before implementation.

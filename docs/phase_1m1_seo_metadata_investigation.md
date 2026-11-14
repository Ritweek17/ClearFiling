# Phase 1M.1 — SEO Metadata Investigation

**Repository:** `/private/tmp/clearfiling-phase1j-integration`\
**Branch:** `seo/phase-1b-vercel-preview-live-main`\
**Expected/current HEAD:** `5b34493d2da31d05afa57d470e11b957bb11c8dd`\
**Preview URL:** `https://clear-filing.vercel.app/`\
**Investigation:** Read-only source and local generated-output inspection. The preview could not be independently reached from this environment.

## Executive finding

The source configuration and the locally generated HTML agree on the three service classifications in question. MSME Registration and IEC Registration are canonical service routes intentionally set to `noindex, follow`, with no canonical link and no sitemap entry. GST Registration is indexable, is included in the sitemap, and receives the production-domain canonical URL. Its lack of an explicit robots meta tag is expected: the generator emits a robots tag for noindex pages and omits it for indexable pages.

The correct Private Limited Company path is `/services/private-limited-company`; its local generated title, description, canonical, H1 and structured data are present. The owner-reported preview observations match these local expectations, including canonicals on the production domain. They remain **owner-reported rather than independently verified live responses**: DNS/network access to the preview failed, and no Vercel deployment metadata was accessible to establish which commit the preview serves. Do not treat Phase 1M.1 as preview acceptance.

## Checkout and evidence limits

Before creating this report, the candidate checkout was on the expected branch and commit with a clean working tree. No Vercel-specific connector or deployment metadata was available. Attempts to retrieve the preview through the browser and HTTP tools failed (DNS resolution failure / request timeout). Consequently, the actual preview response HTML, response headers, live Vercel deployment SHA, and live HTTP status codes were not inspected in this phase.

The preview outcomes listed in the request are treated below as observations supplied by the owner. Local source and generated output are independently checked; they cannot prove what the deployed preview currently serves.

## Phase 0 baseline expectations

The Phase 0 baseline (`docs/seo_execution_baseline.md`, especially sections “Indexing and catalogue reconciliation” and “Sitemap contents”) records:

- 91 service catalogue and registry entries: 89 canonical routes plus two redirect records; a historical consolidated duplicate reconciles the earlier 92-record inventory.
- 23 indexable service routes, 66 canonical noindex service routes, and two legacy 301 redirect sources.
- The 23 indexable service list explicitly includes `private-limited-company` and `gst-registration`; it does not include `msme-registration` or `iec-registration`.
- The 44-URL sitemap comprises 23 indexable service URLs and 21 other public URLs. It excludes all 66 noindex routes and both redirect sources.
- The two redirects are `/services/udyam-registration` → `/services/msme-registration` and `/services/import-export-code` → `/services/iec-registration`.
- The canonical site origin in the baseline is `https://www.clearfiling.co.in`.

The baseline predates static generation and notes route-specific metadata was hydration-dependent at that time. For current output, Phase 1B’s implementation report and the generated files in this candidate were inspected instead.

## Source-to-output tracing

| Concern | Source of truth / implementation | Behavior checked |
|---|---|---|
| Service classification and redirects | `client/src/data/serviceRegistry.js` | `INDEXABLE_SERVICE_SLUGS`, registry `indexStatus`, and `REDIRECT_SERVICE_MAP` drive service classification and route accounting. |
| Service title and description | `client/src/data/services.js` | Service `metaTitle` and `metaDescription` values are consumed by the route SEO resolver. |
| Route metadata resolution | `client/src/utils/routeSeo.js` | Resolves each pathname to title, description, canonical, social metadata, and noindex state. Indexable services get `service.canonicalSlug` or `BUSINESS.url + route`; non-indexable services get no canonical and `noindex, follow`. |
| Static head output | `client/src/utils/routeSeo.js` `renderRouteSeoTags()` | Emits one title and description, optional canonical, optional robots tag, Open Graph and Twitter title/description/card metadata, plus author/site metadata. |
| Static route generation | `client/scripts/prerender.mjs` | Reads the 44-route sitemap, checks 23 indexable and 66 noindex counts, renders the sitemap routes plus noindex service routes, excludes redirect sources, and validates metadata/content/schema IDs before writing files. |
| Hydrated metadata | `client/src/components/seo/SEOHead.jsx` | Updates metadata during client navigation; sets `noindex, follow` for noindex routes and removes robots metadata for indexable routes. It also manages canonical tags without duplicates. |
| JSON-LD | `client/src/components/seo/JsonLd.jsx` and page schema helpers/components | JSON-LD is emitted as React markup during server render with stable script IDs, allowing it in initial HTML and hydration. The four tested service documents contain three JSON-LD scripts each; script IDs were unique in the generator checks. |
| Sitemap | `client/scripts/generateSitemap.mjs`, `client/public/sitemap.xml` | Uses the indexable slug list and published resource/blog data. The local sitemap has 44 URLs and includes all 23 intended indexable service URLs. |
| Vercel redirects | `client/vercel.json` | Both 301 source/destination pairs are still configured. This source check does not establish live redirect behavior. |

The canonical origin is drawn from `client/src/config/business.js` (`BUSINESS.url` is `https://www.clearfiling.co.in`). The observed production-domain canonical on preview pages is therefore expected and does not itself imply that the production domain has been deployed or connected to the preview.

## Routes inspected: source and generated HTML

The following local static documents were inspected under `client/dist/`. Source values were also resolved through `resolveRouteSeo()` and compared with each document.

| Route | Baseline/source classification | Local generated title and description | Canonical / robots in local HTML | H1 / structured data | Owner-reported preview result |
|---|---|---|---|---|---|
| `/services/msme-registration` | Noindex canonical service; not in sitemap; not a redirect source | Title: `MSME Registration Online | Udyam Registration Certificate | ClearFiling`. Description matches the service record. | No canonical; `noindex, follow` | Reported `noindex, follow`; reported absent from 44-URL sitemap. Consistent with source. |
| `/services/iec-registration` | Noindex canonical service; not in sitemap; not a redirect source | Title: `IEC Code Online Registration | Import Export License | ClearFiling`. Description matches the service record. | No canonical; `noindex, follow` | Reported `noindex, follow`; reported absent from 44-URL sitemap. Consistent with source. |
| `/services/gst-registration` | Indexable service; in sitemap | Title: `GST Registration Online India | Apply for GSTIN | ClearFiling`. Description matches the service record. | `https://www.clearfiling.co.in/services/gst-registration`; no robots meta tag | Reported no explicit robots meta. This is expected for an indexable route under the current generator. |
| `/services/private-limited-company` | Indexable service; in sitemap | Title: `Private Limited Company Registration Online India | ClearFiling`. Description matches the service record. | `https://www.clearfiling.co.in/services/private-limited-company`; no robots meta tag | Exact preview result not supplied; live result could not be checked. |

All four generated documents have a meaningful route-specific H1 and three JSON-LD script elements with unique IDs. The H1s are respectively “MSME (Udyam) Registration Online”, “Import Export Code (IEC) Registration”, “GST Registration Online India”, and “Private Limited Company Registration”. The resolved source metadata and generated `<title>`, description, canonical and robots values matched for these routes.

**Redirect routes** are not page routes in the registry: `client/src/data/serviceRegistry.js` maps `/services/udyam-registration` to `/services/msme-registration` and `/services/import-export-code` to `/services/iec-registration`; `client/vercel.json` sets status 301 for each. The redirect sources are absent from the generated route set and sitemap. The owner reports both returned 301 on preview, but this investigation did not independently test those HTTP responses.

## Catalogue and sitemap reconciliation

The local source/generated-output audit found:

- Sitemap: **44 URLs**.
- Indexable service registry entries: **23**; all 23 corresponding `/services/<slug>` paths occur in the sitemap.
- Noindex canonical service registry entries: **66**; none occur in the sitemap.
- Generated noindex service documents: all 66 exist locally with `noindex, follow` and no canonical link.
- Redirect sources: two; excluded from the generated page set and sitemap.
- Sitemap discrepancies: no missing indexable service routes and no unexpected service URLs.

This matches the Phase 0 counts and Phase 1B generator’s explicit count checks. The Phase 0 sitemap and robots SHA-256 baselines were recorded as `8a126668197c764b1f829803e4e7bec75e1a4abe04ee917b7e77d718dffc8367` and `c1c4da67a1e140b485f35b9618795fe322ef5f7bc9d54d6fd4528d55170c2c2b`. Phase 1B and Phase 1C reports record these hashes unchanged after local generation. They were not recomputed in this metadata investigation; no sitemap or robots file was changed.

## Preview commit identity and owner observations

**Preview deployment commit: unverified.** No Vercel deployment metadata was accessible, and the preview hostname could not be reached from this environment. The candidate is at `5b34493d2da31d05afa57d470e11b957bb11c8dd`, but that does not prove that the URL is serving that commit. The Phase 1L report records the GitHub push workflow as blocked; no deployed SHA should be inferred from the candidate branch or URL.

The reported preview findings are internally consistent with the inspected source and generated files:

- Production-host canonicals on indexable routes are configured behavior.
- MSME and IEC noindex directives and sitemap exclusion are intended behavior.
- GST’s absent robots meta is intended behavior; omission means the page has no explicit robots directive, while its registry status and sitemap membership make it an indexable page under this project’s policy.
- `/services/private-limited-company` is the correct route; there is no basis here to use a different path.
- Homepage, robots/sitemap responses, redirects, and unknown-URL HTTP statuses remain owner-reported and not independently confirmed in this turn.

## Confirmed issues vs. unverified assumptions

### Confirmed from local source/output

- No classification mismatch was found for MSME Registration, IEC Registration, or GST Registration.
- No mismatch was found between local route SEO resolution and generated HTML for the four inspected service routes.
- The local 23/66 counts and 44-URL sitemap reconcile with Phase 0; the 66 noindex pages have the required directive and no canonical.
- The correct Private Limited Company route is `/services/private-limited-company` and its local generated metadata is correct relative to its service record.

### Not independently verified

- Which commit the deployed preview serves.
- Live preview initial HTML, metadata cardinality, JSON-LD, or route-specific body content.
- Live 200/301/404 response codes and redirect chains. These were reported by the owner but not tested from this environment.
- Whether Vercel’s deployment artifact contains the same generated documents as the candidate’s local `client/dist`.

## Recommended next steps (no changes made)

1. Restore preview URL reachability or provide an accessible deployment inspection path, then obtain the Vercel deployment’s source commit SHA from its deployment details.
2. Confirm that SHA equals the intended validated preview commit before treating the owner’s HTTP observations as evidence for this candidate.
3. Fetch raw initial HTML for the four routes above, plus representative resource, blog, legal, and core routes; compare title, description, robots, canonical, OG/Twitter tags, H1/body and JSON-LD against the local generated documents.
4. Recheck the full 44-URL sitemap and the two 301 responses plus unknown-route 404 against the accessible preview. Preserve the current indexability and canonical configuration unless a verified deployment mismatch is found.
5. Make no correction to MSME, IEC, or GST classification based on the reported observations; source and local output already agree with the Phase 0 baseline.

## Acceptance recommendation

**Source-level metadata investigation: pass. Preview metadata acceptance: pending.** The reported MSME, IEC, GST, sitemap and canonical observations are consistent with the intended baseline and local generated output. The Private Limited Company route is confirmed locally. Since the deployed commit and raw live responses could not be verified, do not mark the Vercel preview accepted or claim its metadata has been independently validated. No application files or deployment settings were changed.

## Final repository state

- Branch: `seo/phase-1b-vercel-preview-live-main`
- HEAD: `5b34493d2da31d05afa57d470e11b957bb11c8dd`
- Working tree before report creation: clean.
- This report is the only addition; no source, configuration, sitemap, robots, or application output files were modified by this investigation.

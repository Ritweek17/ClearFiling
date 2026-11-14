import BUSINESS from '../config/business.js';
import { PAGE_SEO, SEO_BASE } from '../config/seo.js';
import { SERVICES } from '../data/services.js';
import { isServiceIndexable } from '../data/serviceRegistry.js';
import { RESOURCES } from '../data/resourcesContent.js';
import { BLOG_POSTS } from '../data/blogContent.js';
import { PRIVACY_POLICY, TERMS_CONDITIONS, DISCLAIMER } from '../data/legalContent.js';

const legalPages = {
  '/privacy-policy': PRIVACY_POLICY,
  '/terms': TERMS_CONDITIONS,
  '/disclaimer': DISCLAIMER,
};

export function resolveRouteSeo(pathname) {
  const path = pathname.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  const page = (config, extra = {}) => ({
    title: config.title || SEO_BASE.defaultTitle,
    description: config.description || SEO_BASE.defaultDescription,
    canonical: config.canonical,
    keywords: config.keywords,
    ogType: config.ogType || 'website',
    ogImage: config.ogImage,
    noindex: Boolean(config.noindex),
    nofollow: Boolean(config.nofollow),
    ...extra,
  });

  if (path === '/') return page(PAGE_SEO.home);
  if (path === '/about') return page(PAGE_SEO.about);
  if (path === '/contact') return page(PAGE_SEO.contact);
  if (path === '/services') return page(PAGE_SEO.services);
  if (path === '/blog') return page(PAGE_SEO.blog);
  if (path === '/resources') return page(PAGE_SEO.resources);

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const slug = decodeURIComponent(serviceMatch[1]);
    const service = SERVICES.find((item) => item.slug === slug);
    if (!service) {
      return page({
        title: 'Service Not Found | ClearFiling',
        description: 'The requested service could not be found on ClearFiling.',
        noindex: true,
      });
    }

    const indexable = isServiceIndexable(service.slug);
    const comingSoon = !indexable && !service.longDescription;
    const description = comingSoon
      ? service.metaDescription || service.shortDescription || service.description || `ClearFiling provides professional ${service.title} advisory and documentation support across India.`
      : service.metaDescription || service.description || service.shortDescription;

    return page({
      title: comingSoon ? `${service.title} | ClearFiling` : service.metaTitle || `${service.title} | ClearFiling`,
      description,
      canonical: indexable ? service.canonicalSlug || `${BUSINESS.url}/services/${service.slug}` : undefined,
      keywords: comingSoon ? undefined : Array.isArray(service.keywords) ? service.keywords.join(', ') : service.keywords,
      noindex: !indexable,
    });
  }

  const resourceMatch = path.match(/^\/resources\/([^/]+)$/);
  if (resourceMatch) {
    const resource = RESOURCES.find((item) => item.slug === decodeURIComponent(resourceMatch[1]));
    return resource
      ? page({
          title: `${resource.title} | Business Guide | ClearFiling`,
          description: resource.intro,
          canonical: `${BUSINESS.url}/resources/${resource.slug}`,
          keywords: resource.tags ? resource.tags.join(', ') : undefined,
        })
      : page({ title: SEO_BASE.defaultTitle, description: SEO_BASE.defaultDescription, noindex: true });
  }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = BLOG_POSTS.find((item) => item.slug === decodeURIComponent(blogMatch[1]));
    return post
      ? page({
          title: `${post.title} | ClearFiling Blog`,
          description: post.excerpt || 'Read the full business compliance article on ClearFiling Blog.',
          canonical: `${BUSINESS.url}/blog/${post.slug}`,
          ogType: 'article',
        })
      : page({
          title: 'Article Not Found | ClearFiling',
          description: 'The requested blog article could not be found.',
          canonical: `${BUSINESS.url}/blog`,
          noindex: true,
        });
  }

  const legal = legalPages[path];
  if (legal) {
    return page({
      title: `${legal.title} | ${BUSINESS.legalName}`,
      description: legal.intro || `Review the official ${legal.title} for ${BUSINESS.legalName}.`,
      canonical: `${BUSINESS.url}${path}`,
    });
  }

  return page({
    title: '404: Page Not Found | ClearFiling',
    description: 'The page you are looking for does not exist on ClearFiling.',
    noindex: true,
  });
}

const escapeAttribute = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderRouteSeoTags(pathname) {
  const seo = resolveRouteSeo(pathname);
  const meta = (attrs) => `<meta ${Object.entries(attrs).map(([key, value]) => `${key}="${escapeAttribute(value)}"`).join(' ')}>`;
  const link = seo.canonical ? `<link rel="canonical" href="${escapeAttribute(seo.canonical)}">` : '';
  const tags = [
    `<title>${escapeAttribute(seo.title)}</title>`,
    meta({ name: 'description', content: seo.description }),
    seo.keywords ? meta({ name: 'keywords', content: seo.keywords }) : '',
    seo.noindex ? meta({ name: 'robots', content: seo.nofollow ? 'noindex, nofollow' : 'noindex, follow' }) : '',
    link,
    meta({ name: 'author', content: BUSINESS.legalName }),
    meta({ property: 'og:site_name', content: SEO_BASE.siteName }),
    meta({ property: 'og:type', content: seo.ogType }),
    meta({ property: 'og:title', content: seo.title }),
    meta({ property: 'og:description', content: seo.description }),
    seo.canonical ? meta({ property: 'og:url', content: seo.canonical }) : '',
    meta({ property: 'og:locale', content: SEO_BASE.locale }),
    seo.ogImage ? meta({ property: 'og:image', content: seo.ogImage }) : '',
    meta({ name: 'twitter:card', content: seo.ogImage ? 'summary_large_image' : 'summary' }),
    meta({ name: 'twitter:title', content: seo.title }),
    meta({ name: 'twitter:description', content: seo.description }),
    seo.ogImage ? meta({ name: 'twitter:image', content: seo.ogImage }) : '',
  ];
  return tags.filter(Boolean).join('\n    ');
}

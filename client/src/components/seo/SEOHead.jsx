import { useEffect } from 'react';

const DEFAULT_TITLE = 'ClearFiling | Premium Business Registration & Tax Compliance India';
const DEFAULT_DESCRIPTION = 'ClearFiling provides professional corporate compliance, tax filing, GST registration, company incorporation, and financial advisory services in India.';
const DEFAULT_CANONICAL = 'https://www.clearfiling.co.in/';
const DEFAULT_KEYWORDS = 'company registration, GST filing, ITR filing, trademark registration, business consultancy India, ClearFiling';
const DEFAULT_SITE_NAME = 'Clear Filing & Compliance LLP';
const DEFAULT_LOCALE = 'en_IN';

// Helper to set or update meta tag, cleaning up any duplicate tags
const setMeta = (attr, key, content) => {
  if (content === undefined || content === null || content === '') {
    removeMeta(attr, key);
    return;
  }
  const elements = document.querySelectorAll(`meta[${attr}="${key}"]`);
  if (elements.length > 0) {
    elements[0].setAttribute('content', content);
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  } else {
    const el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }
};

// Helper to safely remove meta tag(s)
const removeMeta = (attr, key) => {
  const elements = document.querySelectorAll(`meta[${attr}="${key}"]`);
  elements.forEach((el) => el.remove());
};

// Helper to set or update canonical link tag, cleaning up any duplicates
const setCanonical = (href) => {
  if (!href) {
    removeCanonical();
    return;
  }
  const links = document.querySelectorAll('link[rel="canonical"]');
  if (links.length > 0) {
    links[0].setAttribute('href', href);
    for (let i = 1; i < links.length; i++) {
      links[i].remove();
    }
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
};

// Helper to safely remove canonical link tag(s)
const removeCanonical = () => {
  const links = document.querySelectorAll('link[rel="canonical"]');
  links.forEach((link) => link.remove());
};

/**
 * SEOHead Component
 * Dynamically manages document.title, meta tags, Open Graph, Twitter cards,
 * and canonical link element in document.head across route transitions and unmounts
 * without third-party dependencies.
 */
const SEOHead = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  keywords,
  noindex = false,
}) => {
  useEffect(() => {
    const activeTitle = title || DEFAULT_TITLE;
    const activeDescription = description || DEFAULT_DESCRIPTION;

    // 1. Document title
    document.title = activeTitle;

    // 2. Standard Meta Tags
    setMeta('name', 'description', activeDescription);
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    } else {
      removeMeta('name', 'keywords');
    }

    // Robots indexing control
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      removeMeta('name', 'robots');
    }

    // 3. Canonical Link & og:url
    if (canonical) {
      setCanonical(canonical);
      setMeta('property', 'og:url', canonical);
    } else {
      removeCanonical();
      removeMeta('property', 'og:url');
    }

    // 4. Open Graph Metadata
    setMeta('property', 'og:title', activeTitle);
    setMeta('property', 'og:description', activeDescription);
    setMeta('property', 'og:type', ogType || 'website');
    setMeta('property', 'og:site_name', DEFAULT_SITE_NAME);
    setMeta('property', 'og:locale', DEFAULT_LOCALE);

    // 5. Open Graph Image & Twitter Card image
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
      setMeta('name', 'twitter:card', 'summary_large_image');
    } else {
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
      setMeta('name', 'twitter:card', 'summary');
    }

    // 6. Twitter Card Metadata
    setMeta('name', 'twitter:title', activeTitle);
    setMeta('name', 'twitter:description', activeDescription);

    // 7. Cleanup on unmount (restore baseline index.html metadata)
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('name', 'description', DEFAULT_DESCRIPTION);
      setCanonical(DEFAULT_CANONICAL);
      setMeta('name', 'keywords', DEFAULT_KEYWORDS);
      setMeta('property', 'og:title', DEFAULT_TITLE);
      setMeta('property', 'og:description', DEFAULT_DESCRIPTION);
      setMeta('property', 'og:url', DEFAULT_CANONICAL);
      setMeta('property', 'og:type', 'website');
      setMeta('property', 'og:site_name', DEFAULT_SITE_NAME);
      setMeta('property', 'og:locale', DEFAULT_LOCALE);
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
      setMeta('name', 'twitter:card', 'summary');
      setMeta('name', 'twitter:title', DEFAULT_TITLE);
      setMeta('name', 'twitter:description', DEFAULT_DESCRIPTION);
      removeMeta('name', 'robots');
    };
  }, [title, description, canonical, ogType, ogImage, keywords, noindex]);

  return null;
};

export default SEOHead;

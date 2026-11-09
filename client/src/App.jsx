import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';
import GoogleAnalyticsTracker from './components/common/GoogleAnalyticsTracker';
import RouteLoadingFallback from './components/common/RouteLoadingFallback';
import ErrorBoundary from './components/common/ErrorBoundary';

// Statically imported for immediate initial visit
import Home from './pages/Home';

// Lazy-loaded Secondary Company Pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));

// Lazy-loaded Legal Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// Lazy-loaded Resources
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const ResourcesListing = lazy(() =>
  import('./pages/ResourceDetail').then((module) => ({ default: module.ResourcesListing }))
);

// Lazy-loaded Blog
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogListing = lazy(() =>
  import('./pages/BlogPost').then((module) => ({ default: module.BlogListing }))
);

// Lazy-loaded Fallback
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <GoogleAnalyticsTracker />
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* ── Core Pages ── */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              {/* ── Services ── */}
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />

              {/* ── Legal ── */}
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="disclaimer" element={<Disclaimer />} />

              {/* ── Resources / Guides ── */}
              <Route path="resources" element={<ResourcesListing />} />
              <Route path="resources/:slug" element={<ResourceDetail />} />

              {/* ── Blog ── */}
              <Route path="blog" element={<BlogListing />} />
              <Route path="blog/:slug" element={<BlogPost />} />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;

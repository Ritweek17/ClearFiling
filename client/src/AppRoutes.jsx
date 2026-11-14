import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';
import GoogleAnalyticsTracker from './components/common/GoogleAnalyticsTracker';
import RouteLoadingFallback from './components/common/RouteLoadingFallback';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const ResourcesListing = lazy(() =>
  import('./pages/ResourceDetail').then((module) => ({ default: module.ResourcesListing }))
);
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogListing = lazy(() =>
  import('./pages/BlogPost').then((module) => ({ default: module.BlogListing }))
);
const NotFound = lazy(() => import('./pages/NotFound'));

/** Route definitions shared by BrowserRouter and StaticRouter. */
export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <GoogleAnalyticsTracker />
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="disclaimer" element={<Disclaimer />} />
              <Route path="resources" element={<ResourcesListing />} />
              <Route path="resources/:slug" element={<ResourceDetail />} />
              <Route path="blog" element={<BlogListing />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

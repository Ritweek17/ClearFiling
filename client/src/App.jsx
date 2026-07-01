import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';

// Company Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';

// Resources
import ResourceDetail, { ResourcesListing } from './pages/ResourceDetail';

// Blog
import BlogPost, { BlogListing } from './pages/BlogPost';

// Fallback
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
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
    </Router>
  );
};

export default App;

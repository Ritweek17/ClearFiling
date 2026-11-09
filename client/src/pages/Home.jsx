import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import SEOHead from '../components/seo/SEOHead';
import JsonLd from '../components/seo/JsonLd';
import { PAGE_SEO, getOrganizationSchema, getLocalBusinessSchema } from '../config/seo';

// Existing approved sections
import Hero from '../components/features/Hero';
import AboutSection from '../components/features/AboutSection';
import FeaturedServices from '../components/features/FeaturedServices';

// Phase 4 — New Home Page sections
import WhyChooseSection from '../components/features/WhyChooseSection';
import HowWeWorkSection from '../components/features/HowWeWorkSection';
import IndustriesSection from '../components/features/IndustriesSection';
import TestimonialsSection from '../components/features/TestimonialsSection';
import TopClientsSection from '../components/features/TopClientsSection';
import DocumentationSection from '../components/features/DocumentationSection';
import FAQSection from '../components/features/FAQSection';
import CTASection from '../components/features/CTASection';

const Home = () => {
  return (
    <PageContainer animate>
      {/* Route-level SEO & Structured Data */}
      <SEOHead
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        canonical={PAGE_SEO.home.canonical}
        keywords={PAGE_SEO.home.keywords}
      />
      <JsonLd schema={getOrganizationSchema()} />
      <JsonLd schema={getLocalBusinessSchema()} />

      {/* 1. Premium Hero Section */}
      <Hero />

      {/* 2. About Section */}
      <AboutSection />

      {/* 3. Featured Services with Search & Categories */}
      <FeaturedServices />

      {/* 4. Resources & Documentation */}
      <DocumentationSection />

      {/* 5. Why Choose ClearFiling — 8 premium cards */}
      <WhyChooseSection />

      {/* 6. How We Work — 6-step professional timeline */}
      <HowWeWorkSection />

      {/* 7. Industries We Serve — 12 sector cards */}
      <IndustriesSection />

      {/* 8. Client Testimonials */}
      <TestimonialsSection />

      {/* 9. Our Top Clients */}
      <TopClientsSection />

      {/* 10. Frequently Asked Questions — 15 items */}
      <FAQSection />

      {/* 11. Final CTA Section */}
      <CTASection />
    </PageContainer>
  );
};

export default Home;

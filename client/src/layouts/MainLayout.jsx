import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingCTAs from '../components/common/FloatingCTAs';

/**
 * MainLayout Component
 * Coordinates the application shell: Navbar, main content area, FloatingCTAs, and Footer.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-dark overflow-x-hidden selection:bg-brand-primary/10 selection:text-brand-primary">
      {/* 1. Dynamic Premium Navbar */}
      <Navbar />

      {/* 2. Main Page Viewport Container */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* 3. Floating Contact CTAs (all viewports) */}
      <FloatingCTAs />

      {/* 4. Premium Multi-column Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

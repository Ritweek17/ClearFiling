import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Basic Layout Placeholder
 * Will contain Navbar, Footer, and Floating Action Buttons in future milestones.
 */
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Placeholder */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Footer Placeholder */}
    </div>
  );
};

export default Layout;

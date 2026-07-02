import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import NavLink from './NavLink';
import CTAButtons from './CTAButtons';
import MobileMenu from './MobileMenu';
import MobileDrawer from './MobileDrawer';
import MaxWidthContainer from '../ui/MaxWidthContainer';

const NAV_LINKS = [
  { label: 'Home', targetId: 'home' },
  { label: 'About', targetId: 'about' },
  { label: 'Services', targetId: 'services' },
  { label: 'Documentation', targetId: 'documentation' },
  { label: 'Why Choose Us', targetId: 'why-choose' },
  { label: 'Testimonials', targetId: 'testimonials' },
  { label: 'FAQ', targetId: 'faq' },
  { label: 'Contact', targetId: 'contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  // Scroll detection to transition header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer or scroll position check to update active link
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScrollActive = () => {
      const scrollPosition = window.scrollY + 100; // offset header height + margin

      // At top
      if (window.scrollY < 50) {
        setActiveSection('home');
        return;
      }

      // Check current section heights
      for (const link of NAV_LINKS) {
        const section = document.getElementById(link.targetId);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.targetId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollActive);
    // Initial trigger
    handleScrollActive();
    return () => window.removeEventListener('scroll', handleScrollActive);
  }, [location.pathname]);

  // Handle hash scrolling on page load (if navigated from subpage)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      let scrollAttempts = 0;
      
      const scrollToSection = () => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } else if (scrollAttempts < 6) {
          scrollAttempts++;
          setTimeout(scrollToSection, 150);
        }
      };
      
      scrollToSection();
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full select-none
          ${isScrolled 
            ? 'glass-nav py-3' 
            : 'bg-transparent border-b border-transparent py-5'
          }
        `}
      >
        <MaxWidthContainer size="xl" className="flex items-center justify-between">
          {/* Logo element */}
          <Logo />

          {/* Desktop inline nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.targetId}
                label={link.label}
                targetId={link.targetId}
                isActive={activeSection === link.targetId}
              />
            ))}
          </nav>

          {/* Desktop action buttons */}
          <CTAButtons
            className="hidden lg:flex"
            showCall={true}
            buttonSize="sm"
          />

          {/* Mobile hamburger menu toggle */}
          <MobileMenu
            isOpen={isDrawerOpen}
            toggleOpen={() => setIsDrawerOpen(!isDrawerOpen)}
          />
        </MaxWidthContainer>
      </header>

      {/* Mobile navigation side drawer panel */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        navLinks={NAV_LINKS}
        activeSection={activeSection}
      />
    </>
  );
};

export default Navbar;

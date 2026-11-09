import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Logo from './Logo';
import NavLink from './NavLink';
import CTAButtons from './CTAButtons';
import MobileMenu from './MobileMenu';
import MobileDrawer from './MobileDrawer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import { smoothScrollTo } from '../../utils/scroll';

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
  const navigationType = useNavigationType();
  const lastHandledHashRef = useRef('');

  // Cached section bounds to avoid synchronous layout thrashing (offsetTop/offsetHeight) on every scroll event
  const sectionBoundsRef = useRef([]);

  // Consolidated & RAF-throttled scroll handler for header transition and active-section detection
  useEffect(() => {
    const isHome = location.pathname === '/';
    if (!isHome) {
      setActiveSection('');
    }

    // Safely measure and cache section positions on mount and layout changes
    const updateSectionBounds = () => {
      if (!isHome) return;
      const bounds = [];
      for (const link of NAV_LINKS) {
        const section = document.getElementById(link.targetId);
        if (section) {
          bounds.push({
            id: link.targetId,
            top: section.offsetTop,
            height: section.offsetHeight,
          });
        }
      }
      sectionBoundsRef.current = bounds;
    };

    // Initial measurement
    updateSectionBounds();

    let rafId = null;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          ticking = false;
          const scrollY = window.scrollY;

          // 1. Transition header background (consolidated from former standalone listener)
          const scrolled = scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

          // 2. Active section detection (homepage only)
          if (!isHome) return;

          if (scrollY < 50) {
            setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
            return;
          }

          // If bounds were not ready on mount, measure once
          if (sectionBoundsRef.current.length === 0) {
            updateSectionBounds();
          }

          const scrollPosition = scrollY + 100;
          for (const section of sectionBoundsRef.current) {
            if (scrollPosition >= section.top && scrollPosition < section.top + section.height) {
              setActiveSection((prev) => (prev !== section.id ? section.id : prev));
              return;
            }
          }
        });
      }
    };

    // Run once on mount to synchronize header state
    onScroll();

    // Listen to scroll with passive flag
    window.addEventListener('scroll', onScroll, { passive: true });
    // Update cached bounds when window resizes
    window.addEventListener('resize', updateSectionBounds, { passive: true });

    // Detect content-size changes to refresh section bounds
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && isHome) {
      resizeObserver = new ResizeObserver(() => {
        updateSectionBounds();
      });
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateSectionBounds);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [location.pathname]);

  // Handle cross-page hash navigation (navigated from another route with a hash target)
  useEffect(() => {
    // 1. If back/forward navigation (POP), preserve native browser scroll restoration
    if (navigationType === 'POP') {
      return;
    }

    if (!location.hash) {
      lastHandledHashRef.current = '';
      return;
    }

    const hashKey = `${location.pathname}${location.hash}`;
    // Execute exactly once per route+hash transition
    if (lastHandledHashRef.current === hashKey) {
      return;
    }

    const id = location.hash.replace('#', '');
    let rafId = null;
    let attempts = 0;

    const tryScrollToSection = () => {
      const element = document.getElementById(id);
      if (element) {
        lastHandledHashRef.current = hashKey;
        const headerOffset = 72;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        smoothScrollTo(offsetPosition);
      } else if (attempts < 10) {
        attempts++;
        rafId = requestAnimationFrame(tryScrollToSection);
      }
    };

    // Frame-aligned execution: allows destination route to paint at top: 0 first
    rafId = requestAnimationFrame(tryScrollToSection);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [location.pathname, location.hash, navigationType]);

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
        <MaxWidthContainer size="xl" className="flex items-center justify-between gap-6 xl:gap-8">
          {/* Logo element */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop inline nav links */}
          <nav className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 flex-1 max-w-4xl mx-auto px-2 xl:px-4">
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
          <div className="flex-shrink-0">
            <CTAButtons
              className="hidden lg:flex"
              showCall={true}
              buttonSize="sm"
            />
          </div>

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

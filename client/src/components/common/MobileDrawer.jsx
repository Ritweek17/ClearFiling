import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import Logo from './Logo';
import NavLink from './NavLink';
import CTAButtons from './CTAButtons';
import { COMPANY_INFO } from '../../data/companyInfo';

const MobileDrawer = ({
  isOpen,
  onClose,
  navLinks = [],
  activeSection = '',
}) => {
  const drawerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Focus trap, Escape key handling, and body scroll lock
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const focusTimer = setTimeout(() => {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusableElements = drawerRef.current.querySelectorAll(
            'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  const drawerVariants = {
    closed: {
      x: shouldReduceMotion ? 0 : '100%',
      opacity: shouldReduceMotion ? 0 : 1,
      transition: {
        type: 'tween',
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeIn',
      },
    },
    opened: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: 'easeOut',
      },
    },
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
    opened: {
      opacity: 0.4,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  // Stagger nav links animation
  const containerVariants = {
    closed: { opacity: 0 },
    opened: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
    },
  };

  const linkItemVariants = {
    closed: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    opened: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            variants={drawerVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <Logo onClick={onClose} />
              
              <button
                onClick={onClose}
                type="button"
                aria-label="Close menu"
                className="p-2 -mr-2 rounded-lg text-slate-500 hover:text-brand-dark hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <motion.nav
              variants={containerVariants}
              className="flex flex-col gap-1 py-8"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.targetId}
                  variants={linkItemVariants}
                >
                  <NavLink
                    label={link.label}
                    targetId={link.targetId}
                    isActive={activeSection === link.targetId}
                    onClick={onClose}
                    className="block py-3 text-base font-semibold border-b border-slate-50/50"
                  />
                </motion.div>
              ))}
            </motion.nav>

            {/* Contact details */}
            <div className="mt-auto pt-6 border-t border-slate-100 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Quick Contact
                </h4>
                
                <a
                  href={COMPANY_INFO.contact.mobile.href}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span>{COMPANY_INFO.contact.mobile.display}</span>
                </a>
                
                <a
                  href={COMPANY_INFO.contact.email.href}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-primary" />
                  <span>{COMPANY_INFO.contact.email.display}</span>
                </a>
 
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>{COMPANY_INFO.offices[0].address}</span>
                </div>
              </div>

              {/* Call-to-action buttons */}
              <CTAButtons
                buttonSize="md"
                showCall={true}
                onConsultationClick={onClose}
                className="flex-col w-full gap-3 pt-2"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavLink = ({
  label,
  targetId,       // e.g. 'about', 'services', 'testimonials'
  isActive = false,
  onClick,
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    const isHomePage = location.pathname === '/';
    
    if (targetId === 'home' && isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isHomePage) {
      const element = document.getElementById(targetId);
      if (element) {
        // Offset for sticky header (64px / 16rem)
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      // Navigate to homepage first with anchor parameter
      navigate(`/#${targetId}`);
    }
  };

  return (
    <a
      href={`/#${targetId}`}
      onClick={handleNavigation}
      aria-label={`Go to section ${label}`}
      className={`
        relative py-2 text-sm font-medium transition-colors duration-200 outline-none select-none cursor-pointer
        ${isActive ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-dark'}
        ${className}
      `}
    >
      <span>{label}</span>

      {/* Hover/Active Underline Animation */}
      {isActive && (
        <motion.span
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );
};

export default NavLink;

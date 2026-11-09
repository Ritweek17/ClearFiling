import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { smoothScrollTo } from '../../utils/scroll';

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
    
    if (targetId === 'home') {
      if (isHomePage) {
        smoothScrollTo(0);
      } else {
        navigate('/');
      }
      return;
    }

    if (isHomePage) {
      const element = document.getElementById(targetId);
      if (element) {
        // Offset for sticky header (60px header + 12px breathing margin)
        const headerOffset = 72;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        smoothScrollTo(offsetPosition);
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
        relative py-2 text-sm font-medium transition-colors duration-200 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded-md focus-visible:outline-none
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

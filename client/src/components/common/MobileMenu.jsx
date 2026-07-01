import React from 'react';
import { motion } from 'framer-motion';

const MobileMenu = ({ isOpen, toggleOpen, className = '' }) => {
  // Hamburger animation variants
  const lineVariants = {
    top: {
      closed: { rotate: 0, y: 0 },
      opened: { rotate: 45, y: 6 },
    },
    middle: {
      closed: { opacity: 1 },
      opened: { opacity: 0 },
    },
    bottom: {
      closed: { rotate: 0, y: 0 },
      opened: { rotate: -45, y: -6 },
    },
  };

  return (
    <button
      onClick={toggleOpen}
      type="button"
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
      aria-label={isOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
      className={`
        lg:hidden p-2 rounded-lg text-slate-600 hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 select-none
        ${className}
      `}
    >
      <div className="w-5 h-4 flex flex-col justify-between items-center relative">
        {/* Top line */}
        <motion.span
          variants={lineVariants.top}
          animate={isOpen ? 'opened' : 'closed'}
          transition={{ duration: 0.2 }}
          className="w-5 h-[2px] bg-current rounded-full origin-center"
        />
        
        {/* Middle line */}
        <motion.span
          variants={lineVariants.middle}
          animate={isOpen ? 'opened' : 'closed'}
          transition={{ duration: 0.15 }}
          className="w-5 h-[2px] bg-current rounded-full"
        />
        
        {/* Bottom line */}
        <motion.span
          variants={lineVariants.bottom}
          animate={isOpen ? 'opened' : 'closed'}
          transition={{ duration: 0.2 }}
          className="w-5 h-[2px] bg-current rounded-full origin-center"
        />
      </div>
    </button>
  );
};

export default MobileMenu;

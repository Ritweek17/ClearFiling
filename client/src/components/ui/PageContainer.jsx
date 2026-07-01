import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageContainer Component
 * Standard layout wrapper for all main page views.
 * Handles page entry animations (fade in) and ensures correct alignment
 * with the sticky footer/mobile bars.
 */
const PageContainer = ({
  children,
  className = '',
  animate = true,
  ...props
}) => {
  const baseClasses = 'flex-grow w-full flex flex-col pb-16 md:pb-0'; // space for sticky mobile bar

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default PageContainer;

import React from 'react';
import { motion } from 'framer-motion';
import MaxWidthContainer from './MaxWidthContainer';

/**
 * SectionContainer Component
 * Standardizes section spacing, themes, and scroll reveals across all pages.
 */
const SectionContainer = ({
  children,
  id,
  bgType = 'default', // default (bg-slate-50), white, dark (slate-900), primary (green-800)
  animate = true,
  className = '',
  containerSize = 'lg', // sm, md, lg, xl, full
  ...props
}) => {
  const bgStyles = {
    default: 'bg-brand-bg text-brand-dark',
    white: 'bg-white text-brand-dark',
    dark: 'bg-brand-dark text-slate-300 border-t border-slate-800',
    primary: 'bg-brand-primary text-white',
  };

  const basePadding = 'py-12 md:py-16 lg:py-24 relative overflow-hidden';
  const combinedClasses = `${basePadding} ${bgStyles[bgType]} ${className}`;

  const innerContent = (
    <MaxWidthContainer size={containerSize}>
      {children}
    </MaxWidthContainer>
  );

  if (animate) {
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={combinedClasses}
        {...props}
      >
        {innerContent}
      </motion.section>
    );
  }

  return (
    <section id={id} className={combinedClasses} {...props}>
      {innerContent}
    </section>
  );
};

export default SectionContainer;

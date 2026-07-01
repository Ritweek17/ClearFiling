import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default', // default (solid white), glass (glassmorphism)
  isHoverable = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-white border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
    glass: 'glass-card',
  };

  const hoverStyles = isHoverable
    ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-brand-primary/10 hover:-translate-y-1 cursor-pointer'
    : '';

  // Use framer motion if hoverable to ensure premium and quick spring transition
  if (isHoverable) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

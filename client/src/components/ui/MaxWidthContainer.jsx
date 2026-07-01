import React from 'react';

/**
 * MaxWidthContainer Component
 * Controls maximum width limits and horizontal gutters across the layout.
 */
const MaxWidthContainer = ({
  children,
  size = 'xl', // sm, md, lg, xl, full
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl', // 672px
    md: 'max-w-4xl', // 896px
    lg: 'max-w-6xl', // 1152px
    xl: 'max-w-7xl', // 1280px (Standard website bounds)
    full: 'max-w-full',
  };

  return (
    <Component
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default MaxWidthContainer;

import React from 'react';

/**
 * Spacer Component
 * Renders blank spacing blocks to maintain grid and flex separation without margin pollution.
 */
const Spacer = ({
  size = 4, // Tailwind spacing index (1, 2, 3, 4, 6, 8, 10, 12, 16, 20 etc)
  axis = 'vertical', // vertical, horizontal, both
  className = '',
  ...props
}) => {
  const isVertical = axis === 'vertical';
  const isHorizontal = axis === 'horizontal';

  // Compute spacing sizing style dynamically
  const sizeStyles = {
    // Vertical Spacer Sizes
    v: {
      1: 'h-1',
      2: 'h-2',
      3: 'h-3',
      4: 'h-4',
      5: 'h-5',
      6: 'h-6',
      8: 'h-8',
      10: 'h-10',
      12: 'h-12',
      16: 'h-16',
      20: 'h-20',
      24: 'h-24',
      32: 'h-32',
    },
    // Horizontal Spacer Sizes
    h: {
      1: 'w-1',
      2: 'w-2',
      3: 'w-3',
      4: 'w-4',
      5: 'w-5',
      6: 'w-6',
      8: 'w-8',
      10: 'w-10',
      12: 'w-12',
      16: 'w-16',
      20: 'w-20',
      24: 'w-24',
      32: 'w-32',
    }
  };

  const getSpacingClass = () => {
    if (isVertical) {
      return sizeStyles.v[size] || `h-${size}`;
    }
    if (isHorizontal) {
      return sizeStyles.h[size] || `w-${size}`;
    }
    return `${sizeStyles.v[size] || `h-${size}`} ${sizeStyles.h[size] || `w-${size}`}`;
  };

  const baseClasses = isVertical ? 'w-full' : isHorizontal ? 'h-full' : '';

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${getSpacingClass()} flex-shrink-0 ${className}`}
      {...props}
    />
  );
};

export default Spacer;

import React from 'react';

/**
 * Grid Component
 * A functional wrapper to build responsive Tailwind CSS grids without boilerplate classes.
 */
const Grid = ({
  children,
  cols = 1, // Can be a number (1-12) or an object: { base: 1, md: 2, lg: 3 }
  gap = 6,  // Tailwind gap scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12 etc.
  className = '',
  as: Component = 'div',
  ...props
}) => {
  // Convert numerical cols or object config into Tailwind classes
  const getColClasses = () => {
    if (typeof cols === 'number') {
      return `grid-cols-${cols}`;
    }
    
    const classes = [];
    if (cols.base) classes.push(`grid-cols-${cols.base}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  };

  const gapClass = `gap-${gap}`;

  return (
    <Component
      className={`grid ${getColClasses()} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Grid;

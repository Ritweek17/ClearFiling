import React from 'react';

/**
 * Flex Component
 * A functional wrapper to build flexbox structures easily with clean prop attributes.
 */
const Flex = ({
  children,
  direction = 'row', // 'row', 'col' or object: { base: 'col', md: 'row' }
  align = 'stretch', // start, end, center, baseline, stretch
  justify = 'start', // start, end, center, between, around, evenly
  gap = 0,           // gap scale (e.g. 0, 2, 4, 6)
  wrap = false,      // true, false, 'wrap-reverse'
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const getDirectionClasses = () => {
    if (typeof direction === 'string') {
      return `flex-${direction}`;
    }
    const classes = [];
    if (direction.base) classes.push(`flex-${direction.base}`);
    if (direction.sm) classes.push(`sm:flex-${direction.sm}`);
    if (direction.md) classes.push(`md:flex-${direction.md}`);
    if (direction.lg) classes.push(`lg:flex-${direction.lg}`);
    return classes.join(' ');
  };

  const alignStyles = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const justifyStyles = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapStyles = {
    true: 'flex-wrap',
    false: 'flex-nowrap',
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const gapClass = gap ? `gap-${gap}` : '';
  const alignClass = alignStyles[align] || '';
  const justifyClass = justifyStyles[justify] || '';
  const wrapClass = wrapStyles[String(wrap)] || '';

  return (
    <Component
      className={`flex ${getDirectionClasses()} ${alignClass} ${justifyClass} ${gapClass} ${wrapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Flex;

import React from 'react';

/**
 * Divider Component
 * Draws thin, consistent layout borders separating content panels.
 */
const Divider = ({
  orientation = 'horizontal', // horizontal, vertical
  className = '',
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`
        ${isHorizontal ? 'w-full h-[1px] bg-slate-200/60' : 'h-full w-[1px] bg-slate-200/60 self-stretch'}
        ${className}
      `}
      {...props}
    />
  );
};

export default Divider;

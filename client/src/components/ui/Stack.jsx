import React from 'react';
import Divider from './Divider';

/**
 * Stack Component
 * Organizes elements sequentially vertically or horizontally with unified gap control.
 * Can automatically inject dividers between stacked child items.
 */
const Stack = ({
  children,
  direction = 'col', // col, row
  gap = 4,           // spacing scale (1, 2, 3, 4, 5, 6, 8 etc)
  align = 'stretch', // stretch, center, start, end
  showDividers = false,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const directionClasses = {
    col: 'flex-col',
    row: 'flex-row',
  };

  const alignStyles = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
  };

  const gapClass = gap ? `gap-${gap}` : '';
  const directionClass = directionClasses[direction];
  const alignClass = alignStyles[align];

  // If dividers are requested, process children and insert Divider elements
  const renderChildren = () => {
    if (!showDividers) return children;

    const childArray = React.Children.toArray(children).filter(Boolean);
    return childArray.map((child, index) => {
      const isLast = index === childArray.length - 1;
      return (
        <React.Fragment key={index}>
          {child}
          {!isLast && (
            <Divider
              orientation={direction === 'col' ? 'horizontal' : 'vertical'}
              className="opacity-60"
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Component
      className={`flex ${directionClass} ${alignClass} ${gapClass} ${className}`}
      {...props}
    >
      {renderChildren()}
    </Component>
  );
};

export default Stack;

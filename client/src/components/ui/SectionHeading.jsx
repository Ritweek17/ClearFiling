import React from 'react';
import Badge from './Badge';

const SectionHeading = ({
  title,
  badge,
  description,
  align = 'center', // center, left
  className = '',
  ...props
}) => {
  const alignmentStyles = {
    center: 'text-center items-center',
    left: 'text-left items-start',
  };

  return (
    <div
      className={`flex flex-col max-w-3xl ${alignmentStyles[align]} ${className}`}
      {...props}
    >
      {badge && (
        <Badge variant="light" className="mb-3.5">
          {badge}
        </Badge>
      )}
      
      <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark leading-tight">
        {title}
      </h2>
      
      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-500 font-sans leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;

import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // primary, accent, dark, outline, light
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-brand-primary text-white',
    accent: 'bg-brand-accent text-white',
    dark: 'bg-brand-dark text-white',
    outline: 'border border-slate-200 text-slate-700 bg-transparent',
    light: 'bg-brand-primary/5 text-brand-primary border border-brand-primary/10',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, accent, text
  size = 'md',        // sm, md, lg
  isLoading = false,
  isDisabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon = null,
  iconPosition = 'left', // left, right
  ...props
}) => {
  // Styles based on variant
  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/95 focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200',
    accent: 'bg-brand-accent text-white hover:bg-brand-accent/90 focus:ring-2 focus:ring-brand-accent/30',
    text: 'text-brand-primary hover:text-brand-primary/80 px-0 py-0 bg-transparent hover:bg-transparent shadow-none inline-flex items-center gap-1.5 font-semibold group focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 focus-visible:rounded-md focus-visible:outline-none',
    outline: 'bg-transparent text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200',
    outlineDark: 'bg-transparent text-white border border-white/20 hover:bg-white/10 focus:ring-2 focus:ring-white/20',
  };

  // Styles based on size
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-5 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3.5 text-base font-semibold',
  };

  // Combined style string
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 outline-none select-none';
  const stateStyles = (isDisabled || isLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]';
  const shadowStyle = variant !== 'text' ? 'shadow-sm' : '';

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${stateStyles} ${shadowStyle} ${className}`;

  return (
    <motion.button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={buttonClasses}
      whileTap={!(isDisabled || isLoading) ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={`w-4 h-4 mr-2 transition-transform duration-200 ${variant === 'text' ? 'group-hover:translate-x-0.5' : ''}`} />
      )}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={`w-4 h-4 ml-2 transition-transform duration-200 ${variant === 'text' ? 'group-hover:translate-x-0.5' : ''}`} />
      )}
    </motion.button>
  );
};

export default Button;

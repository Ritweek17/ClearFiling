import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  secondary:
    'bg-slate-800 hover:bg-slate-900 text-white font-medium shadow-sm transition-all focus:ring-2 focus:ring-slate-700 focus:ring-offset-2',
  outline:
    'border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm transition-all focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
  dangerOutline:
    'border border-rose-300 hover:bg-rose-50 text-rose-700 font-medium transition-all focus:ring-2 focus:ring-rose-400 focus:ring-offset-2',
  ghost:
    'hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none select-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;


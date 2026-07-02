import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="ClearFiling Home"
      className={`flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 rounded-lg p-1 ${className}`}
    >
      {/* Icon Frame */}
      <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <span className="text-white font-black text-sm font-heading">CF</span>
      </div>

      {/* Typography */}
      <span className="font-heading font-bold text-xl tracking-tight text-brand-dark transition-colors duration-200">
        Clear<span className="text-brand-primary">Filing</span>
      </span>
    </Link>
  );
};

export default Logo;

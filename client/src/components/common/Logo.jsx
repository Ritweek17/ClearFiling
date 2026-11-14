import React from 'react';
import { Link } from 'react-router-dom';
import BUSINESS from '../../config/business.js';

const Logo = ({ className = '', onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${BUSINESS.primaryBrandName} Home`}
      className={`flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 rounded-lg p-1 ${className}`}
    >
      {/* Icon Frame */}
      <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <span className="text-white font-black text-sm font-heading">{BUSINESS.abbreviation}</span>
      </div>

      {/* Typography */}
      <span className="font-heading font-bold text-xl tracking-tight text-brand-dark transition-colors duration-200">
        {BUSINESS.brandWordmark[0]}<span className="text-brand-primary">{BUSINESS.brandWordmark[1]}</span>
      </span>
    </Link>
  );
};

export default Logo;

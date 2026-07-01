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
      <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 10z" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {/* Typography */}
      <span className="font-heading font-bold text-xl tracking-tight text-brand-dark transition-colors duration-200">
        Clear<span className="text-brand-primary">Filing</span>
      </span>
    </Link>
  );
};

export default Logo;

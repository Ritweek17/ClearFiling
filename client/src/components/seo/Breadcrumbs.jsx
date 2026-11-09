import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Renders SEO-friendly navigation paths with structural microdata schemas.
 */
const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center space-x-2 py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl w-fit text-xs font-medium text-slate-500 font-sans"
    >
      <ol 
        itemScope 
        itemType="https://schema.org/BreadcrumbList" 
        className="inline-flex items-center space-x-1.5 md:space-x-2.5"
      >
        {/* Home Item */}
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem" 
          className="inline-flex items-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-400 hover:text-brand-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            <span itemProp="name" className="sr-only">Home</span>
          </Link>
          <meta itemProp="item" content="https://www.clearfiling.co.in/" />
          <meta itemProp="position" content="1" />
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const position = index + 2;
          const isLast = index === items.length - 1;
          const cleanPath = typeof window !== 'undefined' ? window.location.pathname : '';
          const itemUrl = isLast 
            ? `https://www.clearfiling.co.in${cleanPath}` 
            : `https://www.clearfiling.co.in${item.to || ''}`;

          return (
            <li 
              key={index}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem" 
              className="inline-flex items-center"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 flex-shrink-0" />
              
              {isLast ? (
                <span 
                  itemProp="name" 
                  aria-current="page"
                  className="text-slate-800 font-semibold"
                >
                  {item.label}
                  <meta itemProp="item" content={itemUrl} />
                </span>
              ) : (
                <Link 
                  to={item.to || '#'} 
                  className="hover:text-brand-primary transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                  <meta itemProp="item" content={itemUrl} />
                </Link>
              )}
              
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

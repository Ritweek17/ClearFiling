import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * RouteLoadingFallback Component
 * Minimal, accessible loading fallback displayed during route-level lazy transitions.
 * Styled consistently with ClearFiling's design tokens.
 */
const RouteLoadingFallback = () => (
  <div
    className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-brand-primary"
    role="status"
    aria-label="Loading page"
  >
    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default RouteLoadingFallback;


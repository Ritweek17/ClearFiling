import React, { Component } from 'react';

/**
 * ErrorBoundary Component
 * Catches unhandled JavaScript and rendering errors in child components.
 * Prevents full-application crashes and presents a resilient, accessible fallback UI.
 * Never exposes stack traces, internal errors, or sensitive technical details.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in non-production environments for developer debugging
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ resetError: this.handleReset, reload: this.handleReload })
          : this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] w-full flex items-center justify-center px-4 py-16"
        >
          <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-sm space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <svg
                aria-hidden="true"
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-brand-secondary">
                Something Went Wrong
              </h2>
              <p className="text-sm text-slate-500 font-sans leading-relaxed">
                We encountered an unexpected error while loading this page. Please try refreshing or return to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-primary/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-all cursor-pointer shadow-sm"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 transition-all text-center"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


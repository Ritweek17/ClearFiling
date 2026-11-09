import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';

const NotFound = () => {
  return (
    <div className="py-24 sm:py-32 flex-grow flex items-center justify-center bg-brand-bg text-center">
      <SEOHead
        title="404: Page Not Found | ClearFiling"
        description="The page you are looking for does not exist on ClearFiling."
        noindex={true}
      />
      <MaxWidthContainer size="md" className="px-4 space-y-6">
        <div className="inline-flex">
          <Badge variant="light" className="bg-red-50 text-red-600 border-red-200/60 font-bold uppercase tracking-wider text-[11px] py-1 px-3.5">
            404 Error
          </Badge>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-500 font-sans text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or may have been moved. Return to the homepage or explore our services below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" className="font-bold flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary" className="font-bold flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Services</span>
            </Button>
          </Link>
        </div>
      </MaxWidthContainer>
    </div>
  );
};

export default NotFound;

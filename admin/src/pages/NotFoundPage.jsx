import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-base font-semibold text-slate-800 mt-1">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mt-1">
        The console route or document resource you requested does not exist.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;


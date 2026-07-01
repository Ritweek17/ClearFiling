/**
 * LegalPageLayout.jsx
 * Reusable layout for Privacy Policy, Terms & Conditions, Disclaimer.
 * All legal pages import this layout and pass their content sections.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Clock } from 'lucide-react';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import PageContainer from '../components/ui/PageContainer';
import Badge from '../components/ui/Badge';
import Breadcrumbs from '../components/seo/Breadcrumbs';

const LegalPageLayout = ({ title, badge, lastUpdated, effectiveDate, intro, sections, children }) => {
  return (
    <PageContainer animate>
      {/* Hero Banner */}
      <div className="relative bg-brand-secondary text-white py-20 md:py-28 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
        <MaxWidthContainer size="lg" className="relative z-10 text-center space-y-5">
          <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
            <FileText className="w-3 h-3 mr-1.5 inline" />{badge}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
            {title}
          </h1>
          {(lastUpdated || effectiveDate) && (
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-sans flex-wrap">
              {lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />Last Updated: {lastUpdated}
                </span>
              )}
              {effectiveDate && (
                <span className="text-slate-500">|</span>
              )}
              {effectiveDate && (
                <span>Effective Date: {effectiveDate}</span>
              )}
            </div>
          )}
        </MaxWidthContainer>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="lg" className="py-3">
          <Breadcrumbs items={[{ label: title }]} />
        </MaxWidthContainer>
      </div>

      {/* Content */}
      <div className="bg-white py-14 md:py-20">
        <MaxWidthContainer size="md">
          {/* Intro */}
          {intro && (
            <div className="mb-10 p-6 bg-brand-bg border border-brand-primary/10 rounded-2xl">
              <p className="text-sm text-slate-600 font-sans leading-relaxed">{intro}</p>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-10 prose-like">
            {sections && sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-lg font-extrabold font-heading text-brand-secondary flex items-center gap-2.5">
                  <span className="text-brand-primary text-sm font-black tabular-nums w-6 text-right">{String(idx + 1).padStart(2, '0')}.</span>
                  {section.heading}
                </h2>
                {section.content && (
                  <div className="text-sm text-slate-600 font-sans leading-relaxed space-y-3 pl-8">
                    {Array.isArray(section.content)
                      ? section.content.map((para, i) => (
                          typeof para === 'string'
                            ? <p key={i}>{para}</p>
                            : <ul key={i} className="list-disc pl-5 space-y-1.5">{para.map((li, j) => <li key={j}>{li}</li>)}</ul>
                        ))
                      : <p>{section.content}</p>
                    }
                  </div>
                )}
              </div>
            ))}
            {children}
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>
        </MaxWidthContainer>
      </div>
    </PageContainer>
  );
};

export default LegalPageLayout;

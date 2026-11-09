import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ResourcePageLayout from '../layouts/ResourcePageLayout';
import { getResourceBySlug, RESOURCES } from '../data/resourcesContent';
import PageContainer from '../components/ui/PageContainer';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import SEOHead from '../components/seo/SEOHead';
import { PAGE_SEO } from '../config/seo';
import { ArrowRight, BookOpen } from 'lucide-react';

// Resources listing page (shown at /resources)
const ResourcesListing = () => (
  <PageContainer animate>
    <SEOHead
      title={PAGE_SEO.resources.title}
      description={PAGE_SEO.resources.description}
      canonical={PAGE_SEO.resources.canonical}
    />
    <div className="relative bg-brand-secondary text-white py-20 md:py-28 border-b border-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-brand-primary/15 via-transparent to-transparent pointer-events-none" />
      <MaxWidthContainer size="lg" className="relative z-10 text-center space-y-5">
        <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
          <BookOpen className="w-3 h-3 mr-1.5 inline" />Knowledge Centre
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
          Business Guides & Resources
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-base font-sans leading-relaxed">
          Expert guides on company registration, GST, trademark, compliance, and business setup — written by ClearFiling's advisory team.
        </p>
      </MaxWidthContainer>
    </div>

    <div className="bg-white py-16 md:py-20">
      <MaxWidthContainer size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((resource) => (
            <Link key={resource.slug} to={`/resources/${resource.slug}`} className="group block">
              <Card isHoverable className="h-full p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 group-hover:bg-brand-primary transition-colors rounded-t-xl" />
                <div className="pt-1">
                  <Badge variant="light" className="text-[10px] font-bold">{resource.category}</Badge>
                </div>
                <h2 className="text-sm font-extrabold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">
                  {resource.title}
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed flex-1">{resource.intro}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">{resource.readTime}</span>
                  <span className="flex items-center gap-1 text-xs text-brand-primary font-bold group-hover:gap-2 transition-all">
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </MaxWidthContainer>
    </div>
  </PageContainer>
);

// Individual resource detail page (shown at /resources/:slug)
const ResourceDetail = () => {
  const { slug } = useParams();
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return (
      <PageContainer animate>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-3xl font-extrabold font-heading text-brand-secondary mb-4">Guide Not Found</h1>
          <p className="text-slate-500 mb-8 font-sans">This resource guide is currently being drafted by our advisory team.</p>
          <Link to="/resources" className="text-brand-primary font-bold hover:underline flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />View All Guides
          </Link>
        </div>
      </PageContainer>
    );
  }

  return <ResourcePageLayout resource={resource} />;
};

export { ResourcesListing, ResourceDetail };
export default ResourceDetail;

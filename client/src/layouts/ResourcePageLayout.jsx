/**
 * ResourcePageLayout.jsx
 * Reusable layout for all Guide / Resource pages.
 * Data-driven — accepts a resource config object and renders the full page.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ArrowRight, Clock, Tag, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import PageContainer from '../components/ui/PageContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/seo/Breadcrumbs';

const ResourcePageLayout = ({ resource }) => {
  const [openFaq, setOpenFaq] = React.useState(0);

  if (!resource) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ClearFiling, I need help with ${resource.title}.`);
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  return (
    <PageContainer animate>
      {/* Hero */}
      <div className="relative bg-brand-secondary text-white py-20 md:py-28 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-primary/15 via-transparent to-transparent pointer-events-none" />
        <MaxWidthContainer size="lg" className="relative z-10 space-y-5">
          <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
            <BookOpen className="w-3 h-3 mr-1.5 inline" />{resource.category || 'Guide'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight max-w-3xl">
            {resource.title}
          </h1>
          <p className="text-slate-300 max-w-2xl text-base font-sans leading-relaxed">{resource.intro}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            {resource.readTime && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{resource.readTime}</span>}
            {resource.tags && resource.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
        </MaxWidthContainer>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="lg" className="py-3">
          <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: resource.title }]} />
        </MaxWidthContainer>
      </div>

      {/* Main Content */}
      <div className="bg-white py-14 md:py-20">
        <MaxWidthContainer size="lg" className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article body */}
          <article className="lg:col-span-8 space-y-10">
            {resource.sections && resource.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-extrabold font-heading text-brand-secondary">{section.heading}</h2>
                <div className="text-sm text-slate-600 font-sans leading-relaxed space-y-3">
                  {Array.isArray(section.content)
                    ? section.content.map((para, i) =>
                        typeof para === 'string'
                          ? <p key={i}>{para}</p>
                          : <ul key={i} className="list-disc pl-5 space-y-1.5 text-slate-600">{para.map((li, j) => <li key={j}>{li}</li>)}</ul>
                      )
                    : <p>{section.content}</p>
                  }
                </div>
              </div>
            ))}

            {/* Key Points */}
            {resource.keyPoints && (
              <div className="bg-brand-bg border border-brand-primary/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-extrabold font-heading text-brand-secondary">Key Takeaways</h2>
                <ul className="space-y-2.5">
                  {resource.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0" />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {resource.faqs && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold font-heading text-brand-secondary flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-primary" />Frequently Asked Questions
                </h2>
                <div className="space-y-2.5">
                  {resource.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200/70 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left flex justify-between items-center gap-4 p-4 text-sm font-semibold text-brand-secondary"
                      >
                        {faq.q}
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-brand-primary' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100">
                            <div className="p-4 text-xs text-slate-500 font-sans leading-relaxed">{faq.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CTA Card */}
            <Card className="p-6 bg-brand-secondary text-white rounded-2xl space-y-4 border-0">
              <h3 className="text-base font-extrabold font-heading">Need Expert Help?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Speak directly with our senior compliance advisors. Free consultation, no obligations.</p>
              <button onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white rounded-xl py-3 text-xs font-bold hover:bg-brand-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />Request Free Consultation
              </button>
              <a href="tel:+919250201718" className="flex items-center justify-center text-xs text-slate-300 hover:text-white transition-colors">
                Or call +91 9250201718
              </a>
            </Card>

            {/* Related Resources */}
            {resource.relatedResources && (
              <Card className="p-6 space-y-4 rounded-2xl">
                <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Related Guides</h3>
                <div className="space-y-2.5">
                  {resource.relatedResources.map(r => (
                    <Link key={r.slug} to={`/resources/${r.slug}`}
                      className="flex items-center gap-2 text-xs text-brand-primary hover:text-brand-accent transition-colors group">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />{r.title}
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Related Services */}
            {resource.relatedServices && (
              <Card className="p-6 space-y-4 rounded-2xl">
                <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Related Services</h3>
                <div className="space-y-2.5">
                  {resource.relatedServices.map(s => (
                    <Link key={s.slug} to={s.slug ? `/services/${s.slug}` : '/services'}
                      className="flex items-center gap-2 text-xs text-brand-primary hover:text-brand-accent transition-colors group">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />{s.title}
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </MaxWidthContainer>
      </div>
    </PageContainer>
  );
};

export default ResourcePageLayout;

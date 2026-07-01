import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '../components/ui/PageContainer';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { SERVICES, ICON_MAP } from '../data/services';

// Get unique categories
const ALL_CATEGORIES = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];
const ACTIVE_SLUGS = ['private-limited-company', 'gst-registration', 'trademark-registration'];

const Services = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = SERVICES.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageContainer animate>
      {/* Hero */}
      <div className="relative bg-brand-secondary text-white py-20 md:py-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-primary/15 via-transparent to-transparent pointer-events-none" />
        <MaxWidthContainer size="lg" className="relative z-10 text-center space-y-5">
          <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
            60+ Services
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
            Professional Business Services
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base font-sans leading-relaxed">
            From company registration to trademark filing, GST compliance to annual returns — find the right service for your business.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Search services..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl outline-none focus:border-brand-primary focus:bg-white/15 transition-all text-sm font-sans"
            />
          </div>
        </MaxWidthContainer>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="lg" className="py-3">
          <Breadcrumbs items={[{ label: 'Services' }]} />
        </MaxWidthContainer>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-100 sticky top-[64px] z-30">
        <MaxWidthContainer size="lg" className="py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {ALL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap
                  ${activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </MaxWidthContainer>
      </div>

      {/* Services Grid */}
      <div className="bg-white py-12 md:py-16 min-h-[50vh]">
        <MaxWidthContainer size="lg" className="space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-sans">
              <p className="text-lg font-semibold">No services found for "{search}"</p>
              <p className="text-sm mt-2">Try a different keyword or browse by category.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 font-sans">{filtered.length} services found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((service, idx) => {
                  const IconComponent = ICON_MAP[service.iconName];
                  const isActive = ACTIVE_SLUGS.includes(service.slug);
                  return (
                    <motion.div key={service.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}>
                      {isActive ? (
                        <Link to={`/services/${service.slug}`} className="group block h-full">
                          <Card isHoverable className="h-full flex flex-col p-5 gap-3 relative">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 group-hover:bg-brand-primary transition-colors rounded-t-xl" />
                            <div className="flex items-start justify-between pt-1">
                              <div className="p-2.5 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                                {IconComponent && <IconComponent className="w-4.5 h-4.5" />}
                              </div>
                              <Badge variant="light" className="text-[9px] font-bold bg-brand-success/10 text-brand-success border-brand-success/20">Active</Badge>
                            </div>
                            <h2 className="text-sm font-bold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">
                              {service.title}
                            </h2>
                            <p className="text-xs text-slate-500 font-sans leading-relaxed flex-1">{service.shortDescription}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                              <span className="text-[10px] text-slate-400">{service.processingTime}</span>
                              <span className="flex items-center gap-1 text-xs text-brand-primary font-bold group-hover:gap-1.5 transition-all">
                                View Details <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </Card>
                        </Link>
                      ) : (
                        <Card className="h-full flex flex-col p-5 gap-3 opacity-90 hover:opacity-100 transition-opacity">
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl">
                              {IconComponent && <IconComponent className="w-4.5 h-4.5" />}
                            </div>
                            <Badge variant="outline" className="text-[9px] font-bold">Enquire</Badge>
                          </div>
                          <h2 className="text-sm font-bold font-heading text-brand-secondary leading-snug">{service.title}</h2>
                          <p className="text-xs text-slate-500 font-sans leading-relaxed flex-1">{service.shortDescription}</p>
                          <Link to="/contact"
                            className="flex items-center gap-1 text-xs text-brand-primary font-bold hover:gap-1.5 transition-all pt-2 border-t border-slate-100 mt-auto">
                            Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </Card>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </MaxWidthContainer>
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-bg border-t border-slate-100 py-14 text-center">
        <MaxWidthContainer size="md" className="space-y-4">
          <h2 className="text-xl font-extrabold font-heading text-brand-secondary">Can't find what you need?</h2>
          <p className="text-sm text-slate-500 font-sans">Our advisors can assist with any compliance or registration requirement not listed here.</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-md shadow-brand-primary/20">
            <ArrowRight className="w-4 h-4" />Talk to an Advisor
          </Link>
        </MaxWidthContainer>
      </div>
    </PageContainer>
  );
};

export default Services;

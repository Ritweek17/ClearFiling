import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Phone, 
  MessageSquare, 
  Search, 
  FileText, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Landmark, 
  Scale, 
  BookOpen, 
  TrendingUp 
} from 'lucide-react';

import { SERVICES, CATEGORIES, CONSULTANTS, ICON_MAP, CATEGORY_SERVICES_MAP } from '../../data/services';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import SectionContainer from '../ui/SectionContainer';
import SectionHeading from '../ui/SectionHeading';
import Spacer from '../ui/Spacer';

// SEO Helpers
import JsonLd from '../seo/JsonLd';
import { generateServiceSchema, generateFAQSchema } from '../seo/SchemaHelpers';

// Precompute lowercase search text for all services once at module initialization
const SERVICES_SEARCH_CACHE = SERVICES.map(s => ({
  service: s,
  searchText: [
    s.title.toLowerCase(),
    s.category.toLowerCase(),
    (s.subtitle || '').toLowerCase(),
    s.description.toLowerCase(),
    ...(s.keywords || []).map(k => (typeof k === 'string' ? k.toLowerCase() : ''))
  ].join(' ')
}));

const FeaturedServices = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [clickedCategory, setClickedCategory] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Dynamic Featured Card Selector State
  const [activeFeaturedId, setActiveFeaturedId] = useState('private-limited-company');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);

  // Close search suggestions and category dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setClickedCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to smooth scroll to the featured card details
  const scrollToFeaturedCard = () => {
    setTimeout(() => {
      const element = document.getElementById('featured-service-card');
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 80);
  };

  // 1. Intelligent Fuzzy Search Matcher (Memoized to prevent string allocation churn)
  const filteredServices = useMemo(() => {
    let candidates = SERVICES_SEARCH_CACHE;
    
    // Filter by Category Chip
    if (activeCategory !== 'All') {
      candidates = candidates.filter(item => item.service.category === activeCategory);
    } else if (searchQuery.trim() === '') {
      // Default view when 'All' is selected and no search query: show only featured services
      return SERVICES.filter(s => s.featured);
    }
    
    // Fuzzy Query match
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === '') {
      return candidates.map(item => item.service);
    }

    const q = trimmedQuery.toLowerCase();
    
    // Synonym mappings to match variations (e.g. return -> filings, itr -> tax, company -> pvt ltd/llp)
    const queryTokens = [q];
    if (q.includes('gst')) queryTokens.push('tax', 'gstin', 'indirect tax', 'returns', 'filing');
    if (q.includes('itr') || q.includes('tax') || q.includes('income')) {
      queryTokens.push('income tax', 'tds', 'returns', 'filing');
    }
    if (q.includes('company') || q.includes('setup') || q.includes('firm')) {
      queryTokens.push('private limited', 'llp', 'incorporation', 'partnership', 'opc', 'formation');
    }
    if (q.includes('trademark') || q.includes('logo') || q.includes('brand') || q.includes('patent') || q.includes('copyright')) {
      queryTokens.push('brand name', 'ipr', 'copyright', 'stamp', 'patent');
    }
    if (q.includes('audit') || q.includes('book') || q.includes('account') || q.includes('cost')) {
      queryTokens.push('bookkeeping', 'accounting', 'ledger', 'compliance', 'audit');
    }
    if (q.includes('annual') || q.includes('roc') || q.includes('mca') || q.includes('filing') || q.includes('compliance')) {
      queryTokens.push('compliance', 'returns', 'kyc', 'director');
    }

    return candidates
      .filter(item => queryTokens.some(token => item.searchText.includes(token)))
      .map(item => item.service);
  }, [activeCategory, searchQuery]);

  // Check if search matches Consultant profiles (CA, CS, Legal, Banker, Cost) - Memoized
  const showConsultantsGrid = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return /(ca|cs|consultant|advisor|lawyer|attorney|banker|accountant|auditor|secretary|merchant)/i.test(q);
  }, [searchQuery]);

  // Dynamic selector logic: Automatically update active featured service if current is filtered out
  useEffect(() => {
    if (filteredServices.length > 0) {
      const currentStillExists = filteredServices.some(s => s.id === activeFeaturedId);
      if (!currentStillExists) {
        // Fallback to the first matching service in the list
        setActiveFeaturedId(filteredServices[0].id);
      }
    }
  }, [filteredServices, activeFeaturedId]);

  const activeFeaturedService = useMemo(() => {
    return SERVICES.find(s => s.id === activeFeaturedId) || SERVICES[0];
  }, [activeFeaturedId]);

  // Suggestions Autocomplete dropdown - Memoized
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestionsList = [];
    
    // Check if matching Consultant terms
    if (/(ca|cs|consultant|advisor|lawyer|accountant)/i.test(q)) {
      suggestionsList.push({ type: 'Consultant', label: 'Consult with Chartered Accountant (CA)', id: 'ca' });
      suggestionsList.push({ type: 'Consultant', label: 'Consult with Company Secretary (CS)', id: 'cs' });
    }

    SERVICES.forEach(s => {
      if (s.title.toLowerCase().includes(q)) {
        suggestionsList.push({ type: 'Service', label: s.title, id: s.id });
      }
    });

    Object.keys(CATEGORY_SERVICES_MAP).forEach(cat => {
      if (cat.toLowerCase().includes(q)) {
        suggestionsList.push({ type: 'Category', label: cat, id: cat });
      }
      CATEGORY_SERVICES_MAP[cat].forEach(sub => {
        if (sub.title.toLowerCase().includes(q) && !suggestionsList.some(item => item.label === sub.title)) {
          suggestionsList.push({ type: 'Sub-Service', label: sub.title, id: sub.id });
        }
      });
    });

    return suggestionsList.slice(0, 5);
  }, [searchQuery]);

  // Click handler for service card selection in grid
  const handleServiceCardClick = (serviceId) => {
    setActiveFeaturedId(serviceId);
    scrollToFeaturedCard();
  };

  // Click handler for popular searches
  const handlePopularSearchClick = (term) => {
    setSearchQuery(term);
    setActiveCategory('All');
    
    const matchedService = SERVICES.find(s => 
      s.title.toLowerCase().includes(term.toLowerCase()) ||
      s.id.toLowerCase().includes(term.toLowerCase())
    );
    if (matchedService) {
      setActiveFeaturedId(matchedService.id);
    }
    scrollToFeaturedCard();
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919250201718';
  };

  const handleWhatsApp = (serviceTitle = '') => {
    const text = encodeURIComponent(
      serviceTitle 
        ? `Hi ClearFiling, I'm interested in ${serviceTitle} service. Please guide me.`
        : "Hi ClearFiling, I'd like to get a free consultation for corporate advisory and filings."
    );
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  const handleWhatsAppConsultant = (whatsappText) => {
    const text = encodeURIComponent(whatsappText);
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  const handleConsultation = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.type === 'Consultant') {
      setSearchQuery('CA');
      setShowSuggestions(false);
    } else {
      setSearchQuery(item.label);
      setShowSuggestions(false);
      
      if (item.type === 'Category') {
        setActiveCategory(item.id);
      } else {
        setActiveCategory('All');
        setActiveFeaturedId(item.id);
        scrollToFeaturedCard();
      }
    }
  };

  const POPULAR_SEARCHES = [
    'Private Limited',
    'GST Registration',
    'Trademark',
    'LLP',
    'FSSAI',
    'MSME',
    'IEC',
    'Income Tax'
  ];

  // Schema generation for SEO-First architecture
  const serviceSchema = generateServiceSchema(activeFeaturedService);
  const faqSchema = generateFAQSchema(activeFeaturedService.faqReference);

  return (
    <SectionContainer id="services" bgType="default" animate={false} className="py-24 bg-brand-bg select-none">
      
      {/* 3. Dynamic JSON-LD Structured Data Schema Injection */}
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={faqSchema} />

      <MaxWidthContainer size="xl" className="flex flex-col items-center">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Professional Business Services"
          title="Our Professional Services"
          description="Helping startups, businesses and growing companies with registration, taxation, compliance and legal services."
          align="center"
        />

        <Spacer size={8} />

        {/* 1. Search Bar */}
        <div ref={searchRef} className="w-full max-w-2xl relative z-40 px-4 md:px-0">
          <div className="relative flex items-center bg-white border border-slate-200 hover:border-brand-accent/50 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 rounded-2xl shadow-sm transition-all duration-300">
            <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
            <input
              type="text"
              aria-label="Search services or consultants"
              placeholder="Search services or consultants (e.g. GST, CA)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-4 py-4 text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                className="mr-5 text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider outline-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-2 mx-4 md:mx-0 bg-white border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden z-50 divide-y divide-slate-100"
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-5 py-3.5 hover:bg-brand-bg transition-colors duration-150 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
                      <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                      {item.type}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Spacer size={8} />

        {/* 2. Category Dropdowns (Desktop Hover / Mobile Accordion) */}
        <div className="w-full py-4 relative z-30">
          
          {/* Desktop Category Chips (With Floating Dropdowns) */}
          <div ref={categoriesRef} className="hidden lg:flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() => setActiveCategory('All')}
              className={`
                px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 outline-none
                ${activeCategory === 'All'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              All Services
            </button>

            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const childServices = CATEGORY_SERVICES_MAP[category] || [];

              return (
                <div
                  key={category}
                  className="relative group/category"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => {
                      setActiveCategory(category);
                      setClickedCategory(clickedCategory === category ? null : category);
                    }}
                    className={`
                      px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-200 outline-none
                      ${isActive 
                        ? 'bg-brand-primary text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span>{category}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <AnimatePresence>
                    {(hoveredCategory === category || clickedCategory === category) && childServices.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-4 z-50 divide-y divide-slate-100"
                      >
                        <div className="pb-2 mb-2">
                          <span className="text-[10px] font-bold text-brand-primary tracking-widest uppercase">{category} catalog</span>
                        </div>
                        <div className="space-y-1 pt-2">
                          {childServices.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                handlePopularSearchClick(sub.title);
                                setHoveredCategory(null);
                                setClickedCategory(null);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-brand-bg transition-all flex flex-col group/sub outline-none"
                            >
                              <span className="text-xs font-bold text-brand-secondary group-hover/sub:text-brand-primary transition-colors flex items-center justify-between">
                                {sub.title}
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sub.desc}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Mobile Categories (Vertical Accordion) */}
          <div className="lg:hidden w-full max-w-md mx-auto space-y-2 px-4">
            <button
              onClick={() => setActiveCategory('All')}
              className={`
                w-full px-4 py-3 rounded-xl text-left text-sm font-bold flex justify-between items-center transition-all duration-200 outline-none
                ${activeCategory === 'All'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
                }
              `}
            >
              <span>Show All Services</span>
              {activeCategory === 'All' && <Check className="w-4 h-4 text-white" />}
            </button>

            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const isAccordionOpen = activeAccordion === category;
              const childServices = CATEGORY_SERVICES_MAP[category] || [];

              return (
                <div key={category} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveAccordion(isAccordionOpen ? null : category);
                    }}
                    className={`
                      w-full px-4 py-3 text-left text-sm font-bold flex justify-between items-center outline-none
                      ${isActive ? 'text-brand-primary border-l-4 border-brand-primary' : 'text-slate-700'}
                    `}
                  >
                    <span>{category}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isAccordionOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-50 border-t border-slate-100"
                      >
                        <div className="p-3 space-y-1">
                          {childServices.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                handlePopularSearchClick(sub.title);
                                setActiveAccordion(null);
                              }}
                              className="w-full text-left p-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-primary hover:bg-white transition-all flex justify-between items-center outline-none"
                            >
                              <span>{sub.title}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

        <Spacer size={8} />

        {/* Dynamic Featured Card Section */}
        <div id="featured-service-card" className="w-full max-w-5xl px-4 md:px-0">
          <div className="text-left mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
            <span className="text-xs font-extrabold tracking-widest text-brand-secondary uppercase">
              Service Highlight & Requirements (SEO Schema)
            </span>
          </div>

          <Card 
            className="bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.03)] rounded-2xl overflow-hidden transition-all duration-300 relative"
            isHoverable={false}
          >
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-primary" />
            
            <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary">
                      {React.createElement(ICON_MAP[activeFeaturedService.iconName] || FileText, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <Badge variant="light" className="bg-brand-bg text-brand-primary border-brand-primary/20">
                        {activeFeaturedService.category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-brand-secondary mt-1 tracking-tight">
                        {activeFeaturedService.title} {activeFeaturedService.subtitle || 'Registration'}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans pt-1">
                    {activeFeaturedService.description}
                  </p>

                  {/* Core Benefits */}
                  {activeFeaturedService.benefits && (
                    <div className="space-y-3 pt-3">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-heading">Key Program Benefits</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeFeaturedService.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="p-0.5 bg-brand-success/15 rounded-full mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-brand-success" />
                            </div>
                            <span className="text-xs text-slate-700 font-sans leading-snug">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Related services chips */}
                {activeFeaturedService.relatedServices && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 font-heading">Related Services:</span>
                    {activeFeaturedService.relatedServices.map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => handlePopularSearchClick(rel.title)}
                        className="text-[10px] font-semibold bg-slate-50 text-slate-600 hover:text-brand-primary hover:bg-brand-bg border border-slate-200/40 hover:border-brand-primary/20 px-2.5 py-1 rounded transition-all outline-none"
                      >
                        {rel.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Required Documents and CTA details */}
              <div className="lg:col-span-5 lg:pl-8 lg:border-l border-slate-100 flex flex-col justify-between bg-slate-50/50 p-6 md:p-8 rounded-xl space-y-6">
                
                <div className="space-y-5">
                  {activeFeaturedService.requiredDocuments && (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-heading">Required Documents</span>
                      <ul className="space-y-2">
                        {activeFeaturedService.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 font-sans leading-tight">
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Processing Timeline */}
                  {activeFeaturedService.processingTime && (
                    <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-brand-primary flex-shrink-0" />
                      <span>Estimated Timeline: <span className="text-brand-secondary font-bold">{activeFeaturedService.processingTime}</span></span>
                    </div>
                  )}

                  {/* Expert Advice Tag */}
                  <div className="flex items-center gap-2.5 bg-brand-primary/5 border border-brand-primary/10 px-3 py-2 rounded-lg text-[11px] text-brand-primary font-bold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 text-brand-primary" />
                    <span>Includes Chartered Accountant / CS Verification</span>
                  </div>
                </div>

                {/* Direct Action CTAs */}
                <div className="space-y-2 pt-2">
                  <Button 
                    variant="primary" 
                    className="w-full flex items-center justify-center gap-2 py-3.5 shadow-md shadow-brand-primary/10 font-bold rounded-xl"
                    onClick={() => handleWhatsApp(activeFeaturedService.title)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border-slate-200 text-slate-700 bg-white text-xs font-bold rounded-lg"
                      onClick={handlePhoneCall}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border-slate-200 text-slate-700 bg-white text-xs font-bold rounded-lg"
                      onClick={handleConsultation}
                    >
                      <span>Consultation</span>
                    </Button>
                  </div>
                </div>

              </div>

            </div>
          </Card>
        </div>

        <Spacer size={16} />

        {/* Consultants Section (Dynamically rendered when query matches CA/CS/advisors) */}
        {showConsultantsGrid && (
          <div className="w-full max-w-6xl px-4 md:px-0 mb-16">
            <div className="text-left mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-primary" />
              <span className="text-xs font-extrabold tracking-widest text-brand-secondary uppercase">
                Matching Professional Advisors
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {CONSULTANTS.map((advisor) => {
                const AdvisorIcon = ICON_MAP[advisor.iconName] || BookOpen;
                return (
                  <Card
                    key={advisor.id}
                    isHoverable={true}
                    className="bg-white border border-slate-200/60 shadow-[0_4px_16px_rgba(15,23,42,0.02)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)] rounded-xl p-6 relative flex flex-col justify-between h-full group transition-all duration-300 border-t-2 border-t-brand-primary/50 hover:border-t-brand-primary"
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-brand-primary/5 rounded-xl text-brand-primary w-fit">
                        <AdvisorIcon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Professional Role</span>
                        <h4 className="text-base font-bold font-heading text-brand-secondary mt-0.5">{advisor.role}</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">{advisor.description}</p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="py-2 border-slate-200 text-slate-700 bg-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                        onClick={handlePhoneCall}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </Button>
                      <Button
                        variant="primary"
                        className="py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 bg-brand-primary hover:bg-brand-primary/95"
                        onClick={() => handleWhatsAppConsultant(advisor.whatsappText)}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Talk</span>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Refined Grid Layout for matching services */}
        <div className="w-full max-w-6xl px-4 md:px-0">
          <div className="text-left mb-6 flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              {activeCategory === 'All' ? 'All Advisory Services' : `${activeCategory} List`} ({filteredServices.length} matching)
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 font-sans">
              No services found matching "{searchQuery}". Try select a popular chip below.
            </div>
          ) : (
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => {
                  const IconComponent = ICON_MAP[service.iconName] || FileText;
                  const isCurrentlyFeatured = service.id === activeFeaturedId;

                  return (
                    <motion.div
                      layout
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        onClick={() => handleServiceCardClick(service.id)}
                        isHoverable={true}
                        className={`
                          bg-white border rounded-xl p-6 relative flex flex-col justify-between h-full group transition-all duration-300
                          ${isCurrentlyFeatured 
                            ? 'border-brand-primary ring-2 ring-brand-primary/10 shadow-[0_12px_36px_rgba(29,78,216,0.06)]' 
                            : 'border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)] hover:border-brand-primary/20'
                          }
                        `}
                      >
                        <div className={`
                          absolute top-0 left-0 right-0 h-[2.5px] transition-all duration-300
                          ${isCurrentlyFeatured ? 'bg-brand-primary' : 'bg-slate-100 group-hover:bg-brand-primary'}
                        `} />
                        
                        <div className="space-y-4 mt-2">
                          <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 w-fit text-brand-primary">
                            <IconComponent className="w-5.5 h-5.5" />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-brand-accent tracking-widest uppercase">
                              {service.category}
                            </span>
                            <h4 className="text-base font-bold font-heading text-brand-secondary mt-1 group-hover:text-brand-primary transition-colors duration-200">
                              {service.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-3">
                            {service.description}
                          </p>
                        </div>

                        {/* Card bottom actions */}
                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-sans text-slate-400 font-semibold uppercase tracking-wide">
                            {service.processingTime || 'Inquire'}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering selection
                              handleWhatsApp(service.title);
                            }}
                            className="flex items-center justify-center p-2.5 rounded-full bg-slate-50 text-slate-500 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 outline-none"
                            aria-label={`Inquire about ${service.title}`}
                          >
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <Spacer size={10} />

        {/* Popular Searches */}
        <div className="w-full max-w-5xl px-4 md:px-0 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Popular Searches:</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearchClick(term)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-brand-primary/10 hover:text-brand-primary border border-slate-200/40 text-slate-600 rounded-full text-xs font-medium transition-all outline-none"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <Spacer size={20} />

        {/* Bottom CTA Panel */}
        <div className="w-full max-w-4xl bg-brand-secondary text-white rounded-2xl p-10 md:p-14 relative overflow-hidden shadow-2xl border border-slate-800 text-center">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <Badge variant="accent" className="bg-brand-accent text-white px-3 py-1.5 font-bold tracking-wider rounded-full text-[10px]">
              Expert Consultation
            </Badge>

            <h3 className="text-3xl md:text-4xl font-extrabold font-heading leading-tight tracking-tight text-white max-w-xl">
              Need help choosing the right service?
            </h3>
            
            <p className="text-slate-200 max-w-lg text-sm md:text-base font-sans leading-relaxed">
              Talk directly with our senior corporate compliance advisors. We analyze your requirements and structure the ideal path forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <Button
                variant="outlineDark"
                icon={Phone}
                onClick={handlePhoneCall}
                className="px-6 py-3.5 font-bold border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl transition-all"
              >
                Call +91 9250201718
              </Button>
              <Button
                variant="primary"
                icon={MessageSquare}
                onClick={() => handleWhatsApp()}
                className="bg-brand-primary text-white border-transparent hover:bg-brand-primary/95 px-6 py-3.5 font-bold rounded-xl shadow-lg shadow-brand-primary/20 transition-all"
              >
                WhatsApp Consultation
              </Button>
            </div>
          </div>
        </div>

      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default FeaturedServices;

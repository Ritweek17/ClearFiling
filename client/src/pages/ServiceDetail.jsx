import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  MapPin,
  Sparkles,
  Send,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { SERVICES, ICON_MAP } from '../data/services';
import { sendInquiry } from '../services/emailService';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import SectionContainer from '../components/ui/SectionContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spacer from '../components/ui/Spacer';

// SEO Components
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEOHead from '../components/seo/SEOHead';
import JsonLd from '../components/seo/JsonLd';
import { generateServiceSchema, generateFAQSchema } from '../components/seo/SchemaHelpers';

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Lead Consultation Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [honeypot, setHoneypot] = useState('');

  // Scroll to top on page navigation and reset form state
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setFormSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
    setHoneypot('');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setActiveFaq(null);
  }, [slug]);

  // Find target service
  const service = SERVICES.find(s => s.slug === slug);
  const LOAN_SLUGS = [
    'personal-loan',
    'home-loan',
    'business-loan',
    'msme-loan',
    'startup-loan',
    'working-capital-loan',
    'education-loan',
    'vehicle-loan',
    'car-loan',
    'bike-loan',
    'gold-loan',
    'loan-against-property',
    'machinery-loan',
    'equipment-finance',
    'project-loan',
    'cash-credit',
    'overdraft-facility',
    'professional-loan',
    'commercial-vehicle-loan',
    'construction-loan'
  ];

  const activeSlugs = [
    'private-limited-company',
    'gst-registration',
    'trademark-registration',
    ...LOAN_SLUGS
  ];

  // Check if service is within active services, otherwise render NotFound / fallback
  if (!service || !activeSlugs.includes(slug)) {
    return (
      <SectionContainer className="py-32 bg-white text-center min-h-[60vh] flex flex-col items-center justify-center">
        <SEOHead
          title="Service Coming Soon | ClearFiling"
          description="The page for this service is currently being drafted by our corporate advisory team."
          canonical={`https://www.clearfiling.co.in/services/${slug}`}
        />
        <ShieldCheck className="w-16 h-16 text-slate-300 mb-6" />
        <h1 className="text-3xl font-extrabold text-brand-secondary font-heading mb-4">Service Page Coming Soon</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-sans">
          The page for this service is currently being drafted by our corporate advisory team. Please check back later.
        </p>
        <Link to="/services">
          <Button variant="primary" className="font-bold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Services</span>
          </Button>
        </Link>
      </SectionContainer>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateLeadForm = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      return 'Full Name is required.';
    }
    if (trimmedName.length < 2) {
      return 'Please enter a valid full name.';
    }
    if (trimmedName.length > 80) {
      return 'Name cannot exceed 80 characters.';
    }

    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      return 'Phone number is required.';
    }
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    const trimmedEmail = formData.email.trim();
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return 'Please enter a valid email address.';
      }
      if (trimmedEmail.length > 100) {
        return 'Email address is too long.';
      }
    }

    if (formData.message && formData.message.length > 1000) {
      return 'Message cannot exceed 1000 characters.';
    }

    return null;
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    // Guard against concurrent/duplicate submissions
    if (submitting) return;

    // Accessible hidden honeypot check for bots
    if (honeypot) {
      // Silently discard bot submission while displaying visual acknowledgment
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);
      return;
    }

    const validationError = validateLeadForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const canonicalUrl = `https://www.clearfiling.co.in/services/${service.slug}`;
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        serviceTitle: service.title,
        serviceSlug: service.slug,
        source: 'service-detail',
        pageUrl: canonicalUrl,
      };

      const result = await sendInquiry(payload);

      if (result.success) {
        setFormSubmitted(true);
        // Reset form inputs only after successful transmission
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSubmitError(null);
        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setSubmitError(
        err.message || 'Unable to submit your inquiry right now. Please try again or call us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919250201718';
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ClearFiling, I would like to consult regarding ${service.title}.`);
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // SEO schemas
  const serviceSchema = generateServiceSchema(service);
  const faqs = service.faqs || service.faqReference;
  const faqSchema = generateFAQSchema(faqs);

  const ServiceIcon = ICON_MAP[service.iconName] || FileText;

  return (
    <div className="bg-brand-bg relative min-h-screen pt-24 font-sans text-left">
      {/* Route-level SEO Metadata */}
      <SEOHead
        title={service.metaTitle || `${service.title} | ClearFiling`}
        description={service.metaDescription || service.description || service.shortDescription}
        canonical={service.canonicalSlug || `https://www.clearfiling.co.in/services/${service.slug}`}
        keywords={Array.isArray(service.keywords) ? service.keywords.join(', ') : service.keywords}
      />

      {/* Dynamic JSON-LD Schemas */}
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={faqSchema} />

      {/* 1. Breadcrumbs Navigation */}
      <MaxWidthContainer size="xl" className="px-4 md:px-8 py-4">
        <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: service.title }]} />
      </MaxWidthContainer>

      {/* 2. Hero Section with Split Layout & Lead Form */}
      <SectionContainer bgType="default" animate={false} className="py-8 md:py-16 bg-brand-bg relative overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-radial-gradient from-brand-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
        
        <MaxWidthContainer size="xl" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 md:px-8">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 py-1.5 px-3 font-bold tracking-wider rounded-md text-xs">
                {service.category}
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-brand-secondary leading-tight tracking-tight">
                {service.heroTitle || service.title}
              </h1>
              
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-sans max-w-2xl">
                {service.heroDescription || service.shortDescription}
              </p>
            </div>

            {/* Quick Metrics tags */}
            <div className="flex flex-wrap gap-4 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/60 px-3.5 py-2 rounded-xl shadow-sm">
                <Clock className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span>Timeline: <strong className="text-brand-secondary">{service.processingTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/60 px-3.5 py-2 rounded-xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span>CA & CS Verified Approval</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => scrollToSection('lead-consultation-form')}
                className="py-3.5 px-6 font-bold flex items-center justify-center gap-2 rounded-xl shadow-md shadow-brand-primary/10"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePhoneCall}
                  className="py-3 px-4 border-slate-200 text-slate-700 bg-white text-sm font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span>Call Now</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="py-3 px-4 border-slate-200 text-slate-700 bg-white text-sm font-bold rounded-xl flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-brand-success" />
                  <span>WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Right Column: High-Trust Lead Form */}
          <div id="lead-consultation-form" className="lg:col-span-5 w-full max-w-md mx-auto">
            <Card className="bg-white border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.04)] rounded-2xl p-6 md:p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-primary" />
              
              <div className="text-left mb-6 space-y-1">
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                  <span>Instant Lead Request</span>
                </span>
                <h3 className="text-lg font-bold font-heading text-brand-secondary">Get Free Expert Advice</h3>
                <p className="text-xs text-slate-400 font-sans">No signup. No upfront fees. Free consultation call.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-left" noValidate>
                {/* Honeypot field for bot suppression (hidden from visual and screen readers) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="service-hp-field">Leave this empty</label>
                  <input
                    type="text"
                    id="service-hp-field"
                    name="service-hp-field"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {submitError && (
                  <div
                    className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    disabled={submitting}
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      disabled={submitting}
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      disabled={submitting}
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="name@company.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Describe your business requirement
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    disabled={submitting}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder={`e.g. Need assistance with registering a ${service.title}`}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  isDisabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </Button>
              </form>

              {/* Toast alert on submission */}
              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    role="status"
                    aria-live="polite"
                    className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-10"
                  >
                    <div className="p-3 bg-brand-success/15 text-brand-success rounded-full mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-extrabold text-brand-secondary font-heading">Inquiry Submitted Successfully</h3>
                    <p className="text-xs text-slate-500 font-sans mt-2 max-w-xs">
                      Thank you! Our senior compliance advisors will call you shortly regarding {service.title}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

        </MaxWidthContainer>
      </SectionContainer>

      {/* 3. Service Overview Section */}
      <SectionContainer bgType="white" animate={false} className="py-20 bg-white border-t border-slate-100/50">
        <MaxWidthContainer size="lg" className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                Overview of {service.title} Services
              </h2>
              <p className="text-slate-600 font-sans text-base leading-relaxed">
                {service.longDescription || service.description}
              </p>
            </div>
            
            <div className="md:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-6 text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Target Timeline</span>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-brand-primary flex-shrink-0" />
                  <span className="text-base font-extrabold text-brand-secondary font-heading">{service.processingTime}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  {service.category === 'Loan Services' ? 'Advisory Support' : 'CA/CS Audit Certificate'}
                </span>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-brand-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-600">
                    {service.category === 'Loan Services' ? 'End-to-End Application Assistance' : 'Included in standard rates'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthContainer>
      </SectionContainer>

      {/* 4. Benefits Section */}
      {service.benefits && (
        <SectionContainer bgType="default" animate={false} className="py-20 bg-slate-50/50 border-t border-slate-100">
          <MaxWidthContainer size="xl" className="px-4 md:px-8 text-center space-y-12">
            <div className="space-y-3">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Key Advantages
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                {service.category === 'Loan Services' ? 'Key Loan Benefits' : 'Key Benefits of Registering'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {service.benefits.map((benefit, idx) => (
                <Card 
                  key={idx}
                  isHoverable={true}
                  className="bg-white p-6 border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-primary/15 transition-all duration-300 relative group flex gap-4"
                >
                  <div className="p-2.5 bg-brand-primary/5 text-brand-primary rounded-xl h-fit border border-brand-primary/10">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                      {benefit.split(':')[0] || benefit}
                    </h3>
                    {benefit.includes(':') ? (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {benefit.split(':')[1]}
                      </p>
                    ) : service.category !== 'Loan Services' ? (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Ensures standard regulatory protections, limited liabilities, and builds operational trust in market ecosystems.
                      </p>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 5. Who Should Apply (Eligibility) */}
      {service.eligibility && (
        <SectionContainer bgType="white" animate={false} className="py-20 bg-white border-t border-slate-100">
          <MaxWidthContainer size="xl" className="px-4 md:px-8 text-center space-y-12">
            <div className="space-y-3">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Target Groups
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                Who Should Apply for This Service?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {service.eligibility.map((item, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl relative space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2 bg-brand-primary/5 text-brand-primary rounded-lg border border-brand-primary/10 w-fit">
                      <UserCheck className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-sm font-bold font-heading text-brand-secondary">{item}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans tracking-wide">Fully Eligible</span>
                </div>
              ))}
            </div>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 6. Required Documents */}
      {service.requiredDocuments && (
        <SectionContainer bgType="default" animate={false} className="py-20 bg-slate-50/50 border-t border-slate-100">
          <MaxWidthContainer size="lg" className="px-4 md:px-8 space-y-10 text-left">
            <div className="space-y-3 text-center">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Checklist Requirements
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                {service.category === 'Loan Services' ? 'Documents Required for Application' : 'Documents Required for Registration'}
              </h2>
            </div>

            <Card className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 md:p-8 divide-y divide-slate-100">
              {service.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="p-1 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 rounded-lg mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 font-sans">{doc}</span>
                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Digital scanned copies are acceptable</span>
                  </div>
                </div>
              ))}
            </Card>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 7. Registration Process Timeline */}
      {service.process && (
        <SectionContainer bgType="white" animate={false} className="py-20 bg-white border-t border-slate-100">
          <MaxWidthContainer size="lg" className="px-4 md:px-8 space-y-12">
            <div className="space-y-3 text-center">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Step-by-Step
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                Our Registration Process Flow
              </h2>
            </div>

            {/* Progress Pipeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-primary/20 space-y-10 text-left">
              {service.process.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Circle Pin indicator */}
                  <div className="absolute -left-10 sm:-left-12 top-0 p-1.5 bg-brand-primary text-white border-4 border-white shadow-md rounded-full z-10 transition-transform group-hover:scale-110 duration-200">
                    <span className="text-[10px] font-black font-heading leading-none w-3.5 h-3.5 flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-accent tracking-wider uppercase">{step.step}</span>
                    <h3 className="text-base font-bold font-heading text-brand-secondary">{step.title}</h3>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-xl">{step.desc}</p>
                  </div>
                </div>
              ))}

              {/* Completion Pin */}
              <div className="relative group">
                <div className="absolute -left-10 sm:-left-12 top-0 p-1.5 bg-brand-success text-white border-4 border-white shadow-md rounded-full z-10">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-success tracking-wider uppercase">Done</span>
                  <h3 className="text-base font-bold font-heading text-brand-secondary">Approval & Certificate Shared</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    The registration certificate is delivered directly to your email, ready for operations.
                  </p>
                </div>
              </div>
            </div>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 9. Frequently Asked Questions (Accordion) */}
      {faqs && (
        <SectionContainer bgType="default" animate={false} className="py-20 bg-slate-50/50 border-t border-slate-100">
          <MaxWidthContainer size="lg" className="px-4 md:px-8 space-y-12">
            <div className="space-y-3 text-center">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Common Queries
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 w-full text-left">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
                    <button
                      id={`faq-btn-${idx}`}
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      className="w-full p-5 text-left text-sm font-bold text-brand-secondary flex justify-between items-center outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-inset"
                    >
                      <span>{faq.q || faq.question}</span>
                      <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-255 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${idx}`}
                          role="region"
                          aria-labelledby={`faq-btn-${idx}`}
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                        >
                          <div className="p-5 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                            {faq.a || faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 10. Related Services Section */}
      {service.relatedServices && (
        <SectionContainer bgType="white" animate={false} className="py-20 bg-white border-t border-slate-100">
          <MaxWidthContainer size="xl" className="px-4 md:px-8 space-y-12">
            <div className="space-y-3 text-center">
              <Badge variant="light" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 font-bold uppercase tracking-wider text-[10px] py-1 px-3.5">
                Internal Links
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary tracking-tight">
                Recommended Related Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {service.relatedServices.map((rel) => {
                // Try finding matches to extract descriptors, or use generic
                const detail = SERVICES.find(s => s.id === rel.id) || rel;
                return (
                  <Link 
                    key={rel.id} 
                    to={activeSlugs.includes(detail.slug) ? `/services/${detail.slug}` : '/services'}
                    className="block group"
                  >
                    <Card
                      isHoverable={true}
                      className="bg-white border border-slate-200/60 p-6 rounded-2xl h-full flex flex-col justify-between hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300 relative"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-slate-100 group-hover:bg-brand-primary transition-colors" />
                      
                      <div className="space-y-3 pt-2">
                        <div className="p-2.5 bg-brand-primary/5 text-brand-primary rounded-xl w-fit">
                          <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors">
                          {detail.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-3">
                          {detail.shortDescription || 'Access professional registration, documentation compliance and support for growth.'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
                        <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Explore Service</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </MaxWidthContainer>
        </SectionContainer>
      )}

      {/* 11. Final Consultation Section */}
      <SectionContainer bgType="default" animate={false} className="py-24 bg-brand-secondary text-white border-t border-slate-800 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
        
        <MaxWidthContainer size="lg" className="px-4 md:px-8 text-center space-y-8 relative z-10 flex flex-col items-center">
          <Badge variant="accent" className="bg-brand-accent text-white py-1 px-3 font-bold tracking-wider rounded-full text-[10px]">
            Consult compliance experts
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight max-w-xl mx-auto">
            {service.ctaTitle || (service.category === 'Loan Services' ? 'Ready to Apply for Financing?' : 'Ready to Complete Your Registration?')}
          </h2>
          
          <p className="text-slate-200 max-w-md mx-auto text-sm md:text-base leading-relaxed font-sans">
            {service.ctaDescription || (service.category === 'Loan Services' ? 'Discuss your financing requirements with our experienced loan advisors and financial experts.' : 'Discuss your business setup and licensing requirements with our verified Chartered Accountants (CAs).')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
            <Button
              variant="outlineDark"
              onClick={handlePhoneCall}
              className="px-6 py-3.5 border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call +91 9250201718</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleWhatsApp}
              className="bg-brand-primary text-white border-transparent hover:bg-brand-primary/95 px-6 py-3.5 font-bold rounded-xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </Button>
          </div>
        </MaxWidthContainer>
      </SectionContainer>
    </div>
  );
};

export default ServiceDetail;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Mail, Clock, Send, Check, ChevronDown, AlertCircle, ShieldCheck } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEOHead from '../components/seo/SEOHead';
import JsonLd from '../components/seo/JsonLd';
import { PAGE_SEO, getContactPageSchema } from '../config/seo';
import { COMPANY_INFO } from '../data/companyInfo';
import { sendContactEmail } from '../services/emailService';
import { INDIAN_STATES, getCitiesForState } from '../data/indianLocations';
import {
  CONTACT_CATEGORIES,
  CONTACT_SERVICES_BY_CATEGORY,
  ALL_CONTACT_SERVICES
} from '../data/services';

// Import reusable Contact components
import ContactHero from '../components/contact/ContactHero';
import ContactInfoCards from '../components/contact/ContactInfoCards';
import OfficeLocations from '../components/contact/OfficeLocations';

export const normalizeIndianMobile = (input) => {
  if (!input) return '';
  let cleaned = input.trim().replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }
  return cleaned.replace(/\D/g, '');
};

export const validateIndianMobile = (input) => {
  if (!input || !input.trim()) {
    return 'Mobile number is required.';
  }

  const normalized = normalizeIndianMobile(input);

  if (normalized.length !== 10) {
    return 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (!/^[6-9]/.test(normalized)) {
    return 'Mobile number must begin with 6, 7, 8, or 9.';
  }

  if (/^([0-9])\1{9}$/.test(normalized)) {
    return 'Please enter a valid active mobile number (repeated digits are not accepted).';
  }

  return null;
};

const GENERIC_FILLER_WORDS = new Set([
  'hi', 'hello', 'hey', 'dear', 'sir', 'madam',
  'call', 'contact', 'phone', 'ring', 'reach',
  'me', 'us', 'my', 'we', 'i', 'am',
  'please', 'pls', 'plz', 'kindly',
  'urgently', 'urgent', 'asap', 'soon', 'today', 'now',
  'need', 'needed', 'want', 'wanted', 'require', 'required', 'requiring',
  'help', 'assist', 'assistance', 'support',
  'send', 'share', 'give', 'provide',
  'details', 'detail', 'info', 'information', 'more', 'data', 'pdf',
  'thanks', 'thank', 'you',
  'inquire', 'inquiry', 'enquire', 'enquiry',
  'test', 'testing', 'check',
  'interested', 'regarding', 'about', 'for', 'the', 'a', 'an', 'to', 'in', 'of', 'with'
]);

export const validateMessage = (input) => {
  if (!input || !input.trim()) {
    return 'Message is required.';
  }
  const trimmed = input.trim();
  if (trimmed.length > 1000) {
    return 'Message cannot exceed 1,000 characters.';
  }
  if (trimmed.length < 20) {
    return 'Please provide a more detailed message (minimum 20 characters).';
  }

  const words = trimmed.split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w));
  if (words.length < 4) {
    return 'Please provide at least 4 meaningful words describing your requirement.';
  }

  // Reject messages with no letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Message must contain words describing your requirement.';
  }

  // Reject repeated single character (e.g. "aaaaaaaaaaaaaaaaaaaaa", "....................")
  const nonSpace = trimmed.replace(/\s+/g, '');
  if (/^(.)\1+$/.test(nonSpace)) {
    return 'Please enter a meaningful message (repeated characters are not accepted).';
  }

  // Reject low character diversity (e.g. "abababababababababab")
  const uniqueChars = new Set(nonSpace.toLowerCase());
  if (uniqueChars.size < 5) {
    return 'Please enter a meaningful message describing your business requirement.';
  }

  // Check for generic-only message composed solely of generic filler words without business substance
  const wordTokens = trimmed.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const substantiveWords = wordTokens.filter(w => !GENERIC_FILLER_WORDS.has(w) && !/^\d+$/.test(w));
  if (substantiveWords.length < 2) {
    return 'Please describe your specific business requirement (e.g., service needed, company type, or timeline).';
  }

  return null;
};

const CONTACT_FAQS = [
  { q: 'How quickly will I receive a response to my inquiry?', a: 'We respond to WhatsApp inquiries within 30 minutes during business hours. Email and other inquiries are answered within 2–4 business hours (office hours: 9 AM – 9 PM, 7 days). Phone and landline calls are answered immediately during working hours.' },
  { q: 'Do I need to visit your office to get started?', a: 'No. All our services are delivered digitally. Documents are collected via email or WhatsApp, and registrations are filed online. You do not need to visit our office in person.' },
  { q: 'Is the first consultation free?', a: 'Yes, the initial consultation is completely free. We discuss your requirements, recommend the appropriate service, and provide a transparent pricing quote — with no obligation.' },
  { q: 'What areas do you serve across India?', a: 'ClearFiling serves clients across all states and union territories of India. Our primary offices are in Delhi, Deoria, and Gorakhpur (UP), but we operate digitally nationwide.' },
  { q: 'Can you handle urgent or time-sensitive registrations?', a: 'Yes. We prioritise urgent requirements such as expiring GST registrations, trademark filing deadlines, and compliance due dates. Please mention your timeline during your initial consultation.' },
];

// Custom Hook to manage contact form logic and API integration
const useContactForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    category: '',
    service: '',
    subService: '',
    customRequirement: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [messageError, setMessageError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, city: '' }));
    } else if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        service: '',
        subService: '',
        customRequirement: ''
      }));
    } else if (name === 'service') {
      setFormData(prev => ({
        ...prev,
        service: value,
        subService: '',
        customRequirement: ''
      }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: value }));
      if (phoneError) {
        const err = validateIndianMobile(value);
        if (!err) setPhoneError(null);
      }
    } else if (name === 'message') {
      setFormData(prev => ({ ...prev, message: value }));
      if (messageError) {
        const err = validateMessage(value);
        if (!err) setMessageError(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone.trim()) {
      const err = validateIndianMobile(formData.phone);
      setPhoneError(err);
    }
  };

  const handleMessageBlur = () => {
    if (formData.message.trim()) {
      const err = validateMessage(formData.message);
      setMessageError(err);
    }
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Name is required.';
    }
    const phoneMsg = validateIndianMobile(formData.phone);
    if (phoneMsg) {
      setPhoneError(phoneMsg);
      return phoneMsg;
    }
    if (!formData.email.trim()) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    const msgError = validateMessage(formData.message);
    if (msgError) {
      setMessageError(msgError);
      return msgError;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const normalizedDigits = normalizeIndianMobile(formData.phone);
      const normalizedPhone = `+91 ${normalizedDigits}`;
      const location = formData.city && formData.state
        ? `${formData.city}, ${formData.state}`
        : (formData.city || formData.state || 'Direct Website Inquiry');

      const selectedService = ALL_CONTACT_SERVICES.find(s => s.slug === formData.service);
      const serviceTitle = selectedService
        ? selectedService.title
        : (formData.service === 'other' || formData.service === 'Other'
            ? (formData.category === 'other' ? 'Other Inquiry' : `Other (${formData.category || 'Service'})`)
            : (formData.category ? `General (${formData.category})` : 'General Inquiry'));
      const serviceSlug = selectedService ? selectedService.slug : (formData.service === 'other' || formData.service === 'Other' ? 'other' : '');
      const serviceCategory = formData.category === 'other'
        ? 'Other'
        : (formData.category || (selectedService ? selectedService.category : 'General Inquiry'));

      const emailPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: normalizedPhone,
        company: location,
        state: formData.state,
        city: formData.city,
        serviceCategory: serviceCategory,
        service: serviceTitle,
        serviceTitle: serviceTitle,
        serviceSlug: serviceSlug,
        subService: formData.subService ? formData.subService.trim() : '',
        customRequirement: formData.customRequirement ? formData.customRequirement.trim() : '',
        message: formData.message.trim(),
      };

      const result = await sendContactEmail(emailPayload);
      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          state: '',
          city: '',
          category: '',
          service: '',
          subService: '',
          customRequirement: '',
          message: ''
        });
        setPhoneError(null);
        setMessageError(null);
        if (onSuccess) onSuccess();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit your inquiry right now. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    submitted,
    submitError,
    phoneError,
    messageError,
    handleChange,
    handlePhoneBlur,
    handleMessageBlur,
    handleSubmit,
    setSubmitError
  };
};

const Contact = () => {
  const {
    formData,
    submitting,
    submitted,
    submitError,
    phoneError,
    messageError,
    handleChange,
    handlePhoneBlur,
    handleMessageBlur,
    handleSubmit,
  } = useContactForm();

  const [openFaq, setOpenFaq] = useState(null);
  const availableCities = formData.state ? getCitiesForState(formData.state) : [];
  const availableServices = formData.category && CONTACT_SERVICES_BY_CATEGORY[formData.category]
    ? CONTACT_SERVICES_BY_CATEGORY[formData.category]
    : [];

  const onSubmit = (e) => {
    handleSubmit(e);
  };

  const inputBase = 'w-full h-[52px] bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-sans';
  const inputClass = inputBase;
  const selectClass = `${inputBase} cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`;
  const textareaClass = 'w-full h-[120px] bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-sans resize-none';
  const labelClass = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <PageContainer animate>
      {/* Route-level SEO Metadata & Structured Data */}
      <SEOHead
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        canonical={PAGE_SEO.contact.canonical}
        keywords={PAGE_SEO.contact.keywords}
      />
      <JsonLd schema={getContactPageSchema()} />

      {/* Reusable Premium Hero */}
      <ContactHero />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="lg" className="py-3">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
        </MaxWidthContainer>
      </div>

      {/* Reusable Contact Info Cards */}
      <ContactInfoCards />

      {/* Detail Grid: Direct Office Info & Form */}
      <section className="bg-white py-16 md:py-20">
        <MaxWidthContainer size="lg" className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Consultation Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Office Support</span>
              <h2 className="text-2xl font-extrabold font-heading text-brand-secondary">Consultation SLA</h2>
              <p className="text-sm text-slate-500 font-sans leading-relaxed">
                Connect with our expert panels who advise startups and businesses across India.
              </p>
            </div>

            <div className="space-y-4">
              {/* Working SLA details */}
              <div className="p-5 bg-brand-bg/50 border border-brand-primary/10 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/15 flex items-center justify-center text-brand-primary">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Office Hours</span>
                    <span className="text-xs font-bold text-slate-700">{COMPANY_INFO.contact.hours}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/15 flex items-center justify-center text-brand-primary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Typical SLA</span>
                    <span className="text-xs font-bold text-slate-700">Response within 2–4 business hours</span>
                  </div>
                </div>
              </div>

              {/* Centralized Address Details */}
              <div className="space-y-3.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-heading">Our Registered Office</span>
                {COMPANY_INFO.offices.map((office) => (
                  <address key={office.id} className="not-italic p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs text-slate-600 font-sans leading-relaxed">
                    <div className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest mb-1">{office.label}</div>
                    <div>{office.address}</div>
                  </address>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Web3Forms Consultation Form */}
          <div className="lg:col-span-7">
            <Card className="relative p-7 md:p-8 rounded-2xl border border-slate-200/80 shadow-[0_8px_40px_rgba(15,23,42,0.05)]">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-primary rounded-t-2xl" />

              <div className="mb-6 space-y-1">
                <h2 className="text-xl font-extrabold font-heading text-brand-secondary">Request Call Back</h2>
                <p className="text-xs text-slate-400 font-sans">Submit your business inquiry below and we will contact you shortly.</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4" noValidate>

                {submitError && (
                  <div id="contact-form-error" className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      aria-invalid={submitError && !formData.name.trim() ? 'true' : undefined}
                      aria-describedby={submitError && !formData.name.trim() ? 'contact-form-error' : undefined}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Mobile Number *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      aria-invalid={phoneError || (submitError && !formData.phone.trim()) ? 'true' : undefined}
                      aria-describedby={phoneError ? 'contact-phone-error' : (submitError && !formData.phone.trim() ? 'contact-form-error' : undefined)}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handlePhoneBlur}
                      placeholder="+91 98765 43210"
                      className={`${inputClass} ${phoneError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                      disabled={submitting}
                    />
                    {phoneError && (
                      <p id="contact-phone-error" className="text-xs text-red-500 font-sans mt-1.5 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{phoneError}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      aria-invalid={submitError && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) ? 'true' : undefined}
                      aria-describedby={submitError && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) ? 'contact-form-error' : undefined}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={inputClass}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-category" className={labelClass}>Service Category</label>
                    <select
                      id="contact-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={selectClass}
                      disabled={submitting}
                    >
                      <option value="">Select Category...</option>
                      {CONTACT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-service" className={labelClass}>Service Required</label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={selectClass}
                      disabled={submitting || !formData.category}
                    >
                      <option value="">
                        {!formData.category ? 'Select Category first...' : 'Select a service...'}
                      </option>
                      {availableServices.map((srv) => (
                        <option key={srv.slug} value={srv.slug}>
                          {srv.title}
                        </option>
                      ))}
                      {formData.category ? <option value="other">Other</option> : null}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-requirement" className={labelClass}>Specific Requirement (Optional)</label>
                    <input
                      id="contact-requirement"
                      type="text"
                      name="customRequirement"
                      value={formData.customRequirement}
                      onChange={handleChange}
                      placeholder="Add any specific requirements (optional)..."
                      className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
                      disabled={submitting || !formData.service}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-state" className={labelClass}>State</label>
                    <select
                      id="contact-state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={selectClass}
                      disabled={submitting}
                    >
                      <option value="">Select State / UT...</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-city" className={labelClass}>City</label>
                    <select
                      id="contact-city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={selectClass}
                      disabled={submitting || !formData.state}
                    >
                      <option value="">
                        {!formData.state ? 'Select State first...' : 'Select City...'}
                      </option>
                      {availableCities.map((ct) => (
                        <option key={ct} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>Your Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    maxLength={1000}
                    required
                    aria-invalid={messageError || (submitError && !formData.message.trim()) ? 'true' : undefined}
                    aria-describedby={messageError ? 'contact-message-error' : (submitError && !formData.message.trim() ? 'contact-form-error' : undefined)}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleMessageBlur}
                    placeholder="Briefly describe your business and compliance requirements (minimum 20 characters)..."
                    className={`${textareaClass} ${messageError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                    disabled={submitting}
                  />
                  {messageError && (
                    <p id="contact-message-error" className="text-xs text-red-500 font-sans mt-1.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{messageError}</span>
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full h-[52px] font-bold rounded-xl flex items-center justify-center gap-2 text-sm" disabled={submitting}>
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                </Button>

                <p className="text-[10px] text-slate-400 text-center font-sans">
                  By submitting this form, you agree to our <a href="/privacy-policy" className="underline hover:text-brand-primary">Privacy Policy</a>.
                </p>
              </form>

              {/* Success Toast */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-8 text-center z-20"
                  >
                    <div className="p-4 bg-brand-primary/10 text-brand-primary rounded-full mb-4">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold font-heading text-brand-secondary mb-2">Inquiry Received!</h3>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-sans">
                      Your inquiry has been successfully sent. Our advisor will review and contact you within 2–4 business hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </MaxWidthContainer>
      </section>

      {/* Reusable physical locations maps view */}
      <OfficeLocations />

      {/* Contact FAQs */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20">
        <MaxWidthContainer size="lg" className="space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="light" className="font-bold tracking-wider text-[10px]">Common Questions</Badge>
            <h2 className="text-2xl font-extrabold font-heading text-brand-secondary">Contact FAQ</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {CONTACT_FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden">
                <button
                  id={`faq-contact-btn-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-contact-content-${i}`}
                  className="w-full text-left flex justify-between items-center gap-4 p-4 text-sm font-semibold text-brand-secondary outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-inset"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      id={`faq-contact-content-${i}`}
                      role="region"
                      aria-labelledby={`faq-contact-btn-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 text-xs text-slate-500 font-sans leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* FAQ CTA linking to main homepage FAQ */}
          <div className="text-center pt-8 border-t border-slate-100 mt-8">
            <p className="text-xs text-slate-500 font-sans">
              Have more compliance questions?{' '}
              <a href="/#faq" className="text-brand-primary font-bold hover:underline">
                Browse our Full FAQ Directory &rarr;
              </a>
            </p>
          </div>
        </MaxWidthContainer>
      </section>

      {/* Final CTA Strip */}
      <section className="bg-brand-secondary py-16 md:py-20 border-t border-slate-800 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-radial-gradient from-brand-primary/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <MaxWidthContainer size="md" className="text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Prefer to Connect Directly?</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-sans leading-relaxed">
            Call us or send a WhatsApp message — our senior advisors respond to WhatsApp enquiries within 30 minutes during business hours (other enquiries: 2–4 business hours).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href={COMPANY_INFO.contact.mobile.href}
              className="flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20">
              <Phone className="w-4 h-4" />
              <span>Call {COMPANY_INFO.contact.mobile.display}</span>
            </a>
            <a href={COMPANY_INFO.contact.whatsappHref}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/8 transition-colors">
              <MessageSquare className="w-4 h-4 text-brand-success" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </MaxWidthContainer>
      </section>
    </PageContainer>
  );
};

export default Contact;

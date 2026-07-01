import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Mail, Clock, Send, Check, ChevronDown, AlertCircle, ShieldCheck } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { COMPANY_INFO } from '../data/companyInfo';

// Import reusable Contact components
import ContactHero from '../components/contact/ContactHero';
import ContactInfoCards from '../components/contact/ContactInfoCards';
import OfficeLocations from '../components/contact/OfficeLocations';

const CONTACT_FAQS = [
  { q: 'How quickly will I receive a response to my inquiry?', a: 'We respond to all WhatsApp and email inquiries within 2–4 business hours during office hours (9 AM – 9 PM, 7 days). Phone and landline calls are answered immediately during working hours.' },
  { q: 'Do I need to visit your office to get started?', a: 'No. All our services are delivered digitally. Documents are collected via email or WhatsApp, and registrations are filed online. You do not need to visit our office in person.' },
  { q: 'Is the first consultation free?', a: 'Yes, the initial consultation is completely free. We discuss your requirements, recommend the appropriate service, and provide a transparent pricing quote — with no obligation.' },
  { q: 'What areas do you serve across India?', a: 'ClearFiling serves clients across all states and union territories of India. Our primary offices are in Delhi and Deoria (UP), but we operate digitally nationwide.' },
  { q: 'Can you handle urgent or time-sensitive registrations?', a: 'Yes. We prioritise urgent requirements such as expiring GST registrations, trademark filing deadlines, and compliance due dates. Please mention your timeline during your initial consultation.' },
];

// Custom Hook to manage contact form logic and API integration
const useContactForm = (onSuccess) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', service: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Name is required.';
    }
    if (!formData.email.trim()) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      return 'Phone number is required.';
    }
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
      return 'Please enter a valid phone number with at least 10 digits.';
    }
    if (!formData.message.trim()) {
      return 'Message is required.';
    }
    return null;
  };

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New Consultation Inquiry - ClearFiling',
          from_name: `${formData.name} (ClearFiling Contact Form)`,
          ...formData
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', city: '', service: '', message: '' });
        if (onSuccess) onSuccess();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    submitted,
    submitError,
    handleChange,
    handleSubmit,
    setSubmitError
  };
};

const Contact = () => {
  const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  const {
    formData,
    submitting,
    submitted,
    submitError,
    handleChange,
    handleSubmit,
  } = useContactForm();

  const [openFaq, setOpenFaq] = useState(null);

  const onSubmit = (e) => {
    handleSubmit(e, ACCESS_KEY);
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-sans';
  const labelClass = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <PageContainer animate>
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
                <input
                  type="hidden"
                  name="access_key"
                  value={ACCESS_KEY || ''}
                />

                {submitError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Full Name *</label>
                    <input id="contact-name" type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass} disabled={submitting} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Mobile Number *</label>
                    <input id="contact-phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputClass} disabled={submitting} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email Address *</label>
                    <input id="contact-email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@company.com" className={inputClass} disabled={submitting} />
                  </div>
                  <div>
                    <label htmlFor="contact-city" className={labelClass}>City / State</label>
                    <input id="contact-city" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Delhi, Mumbai" className={inputClass} disabled={submitting} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelClass}>Service Required</label>
                  <select id="contact-service" name="service" value={formData.service} onChange={handleChange} className={inputClass} disabled={submitting}>
                    <option value="">Select a service...</option>
                    <option>Private Limited Company Registration</option>
                    <option>LLP Registration</option>
                    <option>GST Registration</option>
                    <option>Trademark Registration</option>
                    <option>Income Tax Filing</option>
                    <option>Annual Compliance</option>
                    <option>MSME Registration</option>
                    <option>Website Development</option>
                    <option>E-Commerce Website Development</option>
                    <option>Custom Web Applications</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>Your Message *</label>
                  <textarea id="contact-message" name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Briefly describe your business and compliance requirements..." className={`${inputClass} resize-none`} disabled={submitting} />
                </div>

                <Button type="submit" variant="primary" className="w-full py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 text-sm" disabled={submitting}>
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-8 text-center z-20">
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
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex justify-between items-center gap-4 p-4 text-sm font-semibold text-brand-secondary outline-none">
                  <span>{faq.q}</span>
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
            Call us or send a WhatsApp message — our senior advisors respond within 30 minutes during business hours.
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

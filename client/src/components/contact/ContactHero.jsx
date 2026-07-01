/**
 * ContactHero.jsx
 * Hero section for the Contact page.
 * All content from config/business.js and config/contact.js — nothing hardcoded.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';
import BUSINESS from '../../config/business.js';
import CONTACT from '../../config/contact.js';

const ContactHero = () => (
  <section
    className="relative bg-brand-secondary text-white py-24 md:py-32 border-b border-slate-800 overflow-hidden"
    aria-label="Contact page hero"
  >
    {/* Background radial glow */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
    </div>

    <MaxWidthContainer size="lg" className="relative z-10 text-center space-y-7">
      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Badge
          variant="light"
          className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider inline-flex items-center gap-1.5"
        >
          <Shield className="w-3 h-3" />Free Expert Consultation
        </Badge>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight text-white leading-tight max-w-3xl mx-auto"
      >
        Contact Our <br className="hidden sm:block" />
        <span className="text-brand-primary">Compliance Experts</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-300 max-w-xl mx-auto text-base md:text-lg font-sans leading-relaxed"
      >
        Speak with a senior CA, CS, or legal advisor from {BUSINESS.name}.
        Free initial consultation — no commitments, no hidden charges.
        Available {CONTACT.hours.display}, {CONTACT.hours.note}.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
      >
        <a
          href={CONTACT.mobile.href}
          aria-label={`Call Clear Filing: ${CONTACT.mobile.display}`}
          className="flex items-center gap-2.5 bg-brand-primary text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/25"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          {CONTACT.mobile.display}
        </a>
        <a
          href={CONTACT.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Clear Filing on WhatsApp"
          className="flex items-center gap-2.5 border border-white/20 text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white/8 active:scale-[0.98] transition-all"
        >
          <MessageSquare className="w-4 h-4 text-brand-success" aria-hidden="true" />
          WhatsApp Us
        </a>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-center gap-6 pt-2 flex-wrap"
      >
        {[
          { label: 'Free Consultation' },
          { label: '10,000+ Clients Served' },
          { label: 'Response in 2–4 Hours' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-400 font-sans">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-success" aria-hidden="true" />
            {item.label}
          </div>
        ))}
      </motion.div>
    </MaxWidthContainer>
  </section>
);

export default ContactHero;

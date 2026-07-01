import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CTASection = () => {
  const handlePhoneCall = () => {
    window.location.href = 'tel:+919250201718';
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Hi ClearFiling, I would like to get a free consultation for my business compliance needs.'
    );
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  return (
    <SectionContainer
      id="contact"
      bgType="dark"
      animate={false}
      className="py-20 md:py-28 bg-brand-secondary relative overflow-hidden border-t border-slate-800"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-radial-gradient from-brand-primary/20 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-radial-gradient from-brand-accent/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <MaxWidthContainer size="lg" className="text-center space-y-8 px-4 md:px-8 relative z-10 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Badge
            variant="accent"
            className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 py-1.5 px-4 font-bold tracking-wider rounded-full text-[10px]"
          >
            <Sparkles className="w-3 h-3 mr-1.5 inline" />
            Free Expert Consultation
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Need Expert Business Guidance?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-base md:text-lg leading-relaxed font-sans">
            Whether you are starting a new business, filing taxes, registering a trademark, or meeting annual compliance obligations — our senior advisors are ready to assist you today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-7 py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Secondary CTA */}
          <Button
            variant="outlineDark"
            size="lg"
            onClick={handlePhoneCall}
            className="w-full sm:w-auto px-7 py-4 border-white/20 text-white hover:bg-white/8 rounded-xl font-bold flex items-center justify-center gap-2.5"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </Button>
        </motion.div>

        {/* WhatsApp note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-slate-400 text-xs font-sans flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-3.5 h-3.5 text-brand-success" />
          <span>Or chat directly on WhatsApp — typically replied within 30 minutes during business hours.</span>
        </motion.p>

      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default CTASection;

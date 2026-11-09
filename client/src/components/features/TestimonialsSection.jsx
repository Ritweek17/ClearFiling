import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const TESTIMONIALS = [
  {
    name: 'Rakesh Sharma',
    role: 'Founder, TechVista Solutions',
    businessType: 'IT Startup, Delhi',
    rating: 5,
    review:
      'ClearFiling helped us incorporate our Private Limited Company in under 5 days. The process was completely paperless, and our advisor kept us updated at every stage. Truly outstanding service.',
  },
  {
    name: 'Priya Mehta',
    role: 'Director, Nourish Organics',
    businessType: 'Food & Retail, Noida',
    rating: 5,
    review:
      'We needed both FSSAI and GST registration simultaneously. ClearFiling coordinated both applications seamlessly without any confusion on our end. Highly recommend for any food business owner.',
  },
  {
    name: 'Amit Verma',
    role: 'Managing Partner, Verma & Associates',
    businessType: 'Professional Services, Lucknow',
    rating: 5,
    review:
      'Their LLP registration process was swift and completely transparent. The team answered every query patiently and delivered all documents well within the promised timeline. Excellent professionals.',
  },
  {
    name: 'Sunita Agarwal',
    role: 'Proprietor, StyleCraft Boutique',
    businessType: 'Retail Fashion, Deoria',
    rating: 5,
    review:
      'I was worried about trademark registration being complicated, but ClearFiling made it very simple. They did the trademark search, filed the application, and I received my TM acknowledgement within 24 hours.',
  },
  {
    name: 'Mohammed Farouk',
    role: 'CEO, GlobalTrade Exports',
    businessType: 'Export-Import, Delhi',
    rating: 5,
    review:
      'From IEC code to GST LUT filing, the ClearFiling team handled everything. Their knowledge of export compliance is exceptional, and their communication is always prompt and clear.',
  },
  {
    name: 'Kavita Joshi',
    role: 'Principal, Bright Minds Academy',
    businessType: 'Education Services, Gorakhpur',
    rating: 5,
    review:
      'We registered our trust through ClearFiling and also completed our 12A and 80G filings. The team was thorough, patient, and incredibly helpful throughout this complex compliance journey.',
  },
];

const StarRating = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const TestimonialCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className="h-full"
  >
    <Card
      isHoverable
      className="h-full flex flex-col justify-between p-6 md:p-7 bg-white border border-slate-200/60 rounded-2xl relative overflow-hidden group"
    >
      {/* Quote decoration */}
      <div className="absolute top-4 right-5 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-14 h-14 text-brand-primary" />
      </div>

      <div className="space-y-4 relative z-10">
        <StarRating count={item.rating} />
        <p className="text-sm text-slate-600 font-sans leading-relaxed">
          "{item.review}"
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3 relative z-10">
        {/* Avatar initial */}
        <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-extrabold text-sm font-heading flex-shrink-0">
          {item.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-brand-secondary font-heading">{item.name}</div>
          <div className="text-[10px] text-slate-400 font-sans">{item.businessType}</div>
        </div>
      </div>
    </Card>
  </motion.div>
);

const TestimonialsSection = () => {
  return (
    <SectionContainer
      id="testimonials"
      bgType="white"
      animate={false}
      className="py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-radial-gradient from-brand-bg via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="xl" className="space-y-14 px-4 md:px-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="light" className="font-bold tracking-wider text-[10px] py-1 px-3.5">
            Client Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight leading-tight">
            Trusted by Business Owners Across India
          </h2>
          <p className="text-slate-500 font-sans text-base leading-relaxed">
            Real experiences from the entrepreneurs and founders who chose ClearFiling to navigate their compliance journey.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <TestimonialCard key={item.name} item={item} index={idx} />
          ))}
        </div>

        {/* Summary stat bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          {[
            { value: '10,000+', label: 'Clients Served' },
            { value: '4.9 / 5', label: 'Average Rating' },
            { value: '99.4%', label: 'Client Satisfaction' },
            { value: '6+ Years', label: 'Industry Experience' },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4">
              <div className="text-2xl font-black font-heading text-brand-primary">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default TestimonialsSection;

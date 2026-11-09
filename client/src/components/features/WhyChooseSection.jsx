import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Users, Shield, FileCheck, TrendingUp, Clock, HeartHandshake,
  BadgeCheck, Lightbulb, Phone, Landmark, Award, Star
} from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const WHY_CHOOSE_ITEMS = [
  {
    icon: Users,
    title: 'Expert CA & CS Team',
    description:
      'Our panel of Chartered Accountants and Company Secretaries brings deep regulatory expertise and practical industry experience to every engagement.',
  },
  {
    icon: Landmark,
    title: 'Legal & Advisory Experts',
    description:
      'Qualified advocates and corporate legal advisors support your trademark filings, agreements, and dispute resolutions with precision.',
  },
  {
    icon: Award,
    title: 'Merchant Bankers & Cost Accountants',
    description:
      'Specialized professionals handle financial restructuring, cost audits, and merchant banking requirements under SEBI-compliant frameworks.',
  },
  {
    icon: BadgeCheck,
    title: '10,000+ Clients Served',
    description:
      'From early-stage founders to established MSMEs, we have guided over ten thousand Indian clients through successful compliance journeys since 2020.',
  },
  {
    icon: Shield,
    title: 'Transparent Process',
    description:
      'No hidden charges, no confusing fine print. Every step — from document collection to government filing — is communicated clearly and in advance.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Support Team',
    description:
      'Each client is assigned a dedicated compliance advisor who tracks your application status and responds to queries within the same business day.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description:
      'We leverage streamlined government portals and a systematic document workflow to deliver approvals significantly faster than industry averages.',
  },
  {
    icon: Star,
    title: 'Trusted Since 2020',
    description:
      'Built on the values of integrity, sincerity, and dedication — ClearFiling has earned a reputation as one of the most reliable compliance LLPs in North India.',
  },
];

const WhyChooseCard = ({ item, index }) => {
  const IconComponent = item.icon;
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        isHoverable
        className="h-full p-6 md:p-7 flex flex-col gap-4 bg-white border border-slate-200/60 rounded-2xl group relative overflow-hidden"
      >
        {/* Subtle top accent bar on hover */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 group-hover:bg-brand-primary transition-colors duration-300 rounded-t-2xl" />

        <div className="p-3 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors duration-200">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            {item.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

const WhyChooseSection = () => {
  return (
    <SectionContainer
      id="why-choose"
      bgType="default"
      animate={false}
      className="py-20 md:py-28 bg-brand-bg relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial-gradient from-brand-primary/4 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="xl" className="space-y-14 px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="light" className="font-bold tracking-wider text-[10px] py-1 px-3.5">
            Why ClearFiling
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight leading-tight">
            Why Businesses Choose ClearFiling
          </h2>
          <p className="text-slate-500 font-sans text-base leading-relaxed">
            We combine deep professional expertise with a transparent, client-first approach to deliver compliance outcomes that truly support your growth.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {WHY_CHOOSE_ITEMS.map((item, idx) => (
            <WhyChooseCard key={item.title} item={item} index={idx} />
          ))}
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default WhyChooseSection;

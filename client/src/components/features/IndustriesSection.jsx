import React from 'react';
import { motion } from 'framer-motion';
import {
  Factory, ShoppingCart, Store, HeartPulse, GraduationCap, MonitorSmartphone,
  UtensilsCrossed, Globe, HardHat, Rocket, Banknote, Briefcase
} from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';

const INDUSTRIES = [
  { icon: Factory, label: 'Manufacturing', desc: 'Factory licensing, pollution compliance, FSSAI & labour regulations.' },
  { icon: ShoppingCart, label: 'E-Commerce', desc: 'GST registration, marketplace onboarding, and DPIIT recognition.' },
  { icon: Store, label: 'Retail', desc: 'Shop act licenses, trademark protection, and GST compliance.' },
  { icon: HeartPulse, label: 'Healthcare', desc: 'Clinic establishment, medical device licensing, and NABH compliance.' },
  { icon: GraduationCap, label: 'Education', desc: 'Trust registration, NGO compliance, and statutory reporting.' },
  { icon: MonitorSmartphone, label: 'Information Technology', desc: 'Startup India recognition, DPIIT filing, and IP protection.' },
  { icon: UtensilsCrossed, label: 'Food Businesses', desc: 'FSSAI licensing, GST registration, and FPO compliance support.' },
  { icon: Globe, label: 'Export & Import', desc: 'IEC code, AD code, GST LUT filing, and customs advisory.' },
  { icon: HardHat, label: 'Construction', desc: 'RERA registration, contractor licensing, and labour compliance.' },
  { icon: Rocket, label: 'Startups', desc: 'Company registration, DPIIT startup recognition, and funding prep.' },
  { icon: Banknote, label: 'Financial Services', desc: 'NBFCs, RBI compliance, AML policies, and RBI reporting.' },
  { icon: Briefcase, label: 'Professional Firms', desc: 'LLP registration, partnership deeds, and professional tax.' },
];

const IndustryCard = ({ item, index }) => {
  const IconComponent = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="group flex flex-col items-start gap-3 p-5 bg-white border border-slate-200/60 rounded-2xl
        hover:border-brand-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
    >
      <div className="p-2.5 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors duration-200 mb-1">
          {item.label}
        </h3>
        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
};

const IndustriesSection = () => {
  return (
    <SectionContainer
      id="industries"
      bgType="default"
      animate={false}
      className="py-20 md:py-28 bg-slate-50/70 border-t border-slate-100 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-radial-gradient from-brand-accent/4 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="xl" className="space-y-14 px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="light" className="font-bold tracking-wider text-[10px] py-1 px-3.5">
            Sector Coverage
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight leading-tight">
            Industries We Serve
          </h2>
          <p className="text-slate-500 font-sans text-base leading-relaxed">
            ClearFiling works across a broad range of sectors, delivering targeted compliance strategies for each industry's unique regulatory environment.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {INDUSTRIES.map((item, idx) => (
            <IndustryCard key={item.label} item={item} index={idx} />
          ))}
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default IndustriesSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, FileText, Briefcase, ChevronRight } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import Grid from '../ui/Grid';
import Flex from '../ui/Flex';
import Stack from '../ui/Stack';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import HeroIllustration from './HeroIllustration';

const TRUST_POINTS = [
  { icon: Briefcase, label: 'Company Registration' },
  { icon: ShieldCheck, label: 'GST & Tax Filings' },
  { icon: FileText, label: 'Trademark & IP' },
  { icon: CheckCircle2, label: 'Annual Compliances' },
];

const STATS = [
  { value: '10,000+', label: 'Filings Completed' },
  { value: '99.4%', label: 'Client Satisfaction' },
  { value: '5', label: 'Qualified Professionals' },
];

const Hero = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Content animation variants
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const handleConsultation = () => {
    navigate('/contact');
  };

  const handleServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#services';
    }
  };

  return (
    <SectionContainer
      id="home"
      bgType="default"
      animate={false} // Custom inner staggered animations
      className="min-h-screen pt-28 md:pt-36 flex items-center"
      containerSize="xl"
    >
      <Grid cols={{ base: 1, lg: 12 }} gap={8} className="items-center w-full">
        {/* LEFT COLUMN: Texts and CTAs (Span 7) */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Trust Badge */}
          <motion.div variants={itemVariants} className="mb-5">
            <Badge variant="light" className="py-1 px-3 flex items-center gap-1.5 font-semibold text-xs tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
              <span>Verified CA, CS & Legal Advisory Services</span>
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.1] mb-6"
          >
            Business Registration &amp;{' '}
            <span className="text-brand-primary block mt-1">Compliance Made Simple.</span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed mb-8"
          >
            ClearFiling is India's premium corporate advisory firm. We help entrepreneurs, 
            MSMEs, and enterprises manage company incorporation, GST registrations, 
            trademarks, and taxation with transparent processing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleConsultation}
              aria-label="Get Free Consultation"
              className="text-center"
            >
              Get Free Consultation
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleServices}
              icon={ChevronRight}
              iconPosition="right"
              aria-label="Explore Services list"
              className="text-center group"
            >
              Explore Services
            </Button>
          </motion.div>

          {/* Trust Points */}
          <motion.div variants={itemVariants} className="w-full mb-10">
            <Grid cols={{ base: 2, sm: 4 }} gap={4} className="border-t border-slate-200/50 pt-8 w-full">
              {TRUST_POINTS.map((point, index) => {
                const Icon = point.icon;
                return (
                  <Flex key={index} align="center" gap={2} className="text-slate-700">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs font-semibold tracking-tight">{point.label}</span>
                  </Flex>
                );
              })}
            </Grid>
          </motion.div>

          {/* Statistics Row */}
          <motion.div variants={itemVariants} className="w-full">
            <Flex
              direction={{ base: 'row' }}
              wrap="wrap"
              gap={8}
              className="border-t border-slate-200/50 pt-8 justify-between sm:justify-start"
            >
              {STATS.map((stat, index) => (
                <div key={index} className="flex flex-col pr-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-heading leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </Flex>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Premium Vector Artwork (Span 5) */}
        <div className="lg:col-span-5 flex items-center justify-center mt-12 lg:mt-0 w-full">
          <HeroIllustration />
        </div>
      </Grid>
    </SectionContainer>
  );
};

export default Hero;

import React from 'react';
import { Shield, Zap, Receipt, Lock, Headphones, HeartHandshake } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import SectionHeading from '../ui/SectionHeading';
import Grid from '../ui/Grid';
import Spacer from '../ui/Spacer';
import TrustFeatureCard from './TrustFeatureCard';
import StatsStrip from './StatsStrip';
import ProcessSteps from './ProcessSteps';
import SecurityStrip from './SecurityStrip';

const TRUST_CARDS_DATA = [
  {
    icon: Shield,
    title: 'Expert CA & CS Professionals',
    description: 'Direct oversight on all applications and filings by licensed Chartered Accountants and Company Secretaries.',
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Swift turnaround times backed by tech-enabled workflow monitors and real-time filing status updates.',
  },
  {
    icon: Receipt,
    title: 'Transparent Pricing',
    description: 'No hidden consultation fees or surprise add-ons. You get flat quotes before we begin.',
  },
  {
    icon: Lock,
    title: 'Secure Documentation',
    description: 'Your financial statements and corporate registers are stored in 256-bit encrypted secure digital vaults.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Customer Support',
    description: 'Designated account agents managing your profile and addressing your regulatory doubts on demand.',
  },
  {
    icon: HeartHandshake,
    title: 'End-to-End Assistance',
    description: 'From company registration and licensing to routine monthly filings—we handle your entire journey.',
  },
];

const TrustSection = () => {
  return (
    <SectionContainer id="about" bgType="white" containerSize="xl" className="relative">
      {/* Premium ambient glows (Double radial blur layers) */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-radial-gradient from-brand-accent/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-40 right-1/4 w-[600px] h-[600px] bg-radial-gradient from-brand-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Header & Trust Heading (Matching rhythm of Hero Section) */}
      <SectionHeading
        badge="About ClearFiling"
        title="Trusted by Startups, MSMEs & Growing Businesses"
        description="We streamline legal setup, tax compliance, and finance workflows for businesses in India. Our emphasis on speed, professional precision, and complete clarity ensures you remain compliant always."
        align="center"
        className="mx-auto mb-16"
      />

      {/* 2. Trust Feature Cards Grid (Compact 3x2 desktop grid) */}
      <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={6} className="w-full">
        {TRUST_CARDS_DATA.map((card, index) => (
          <TrustFeatureCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </Grid>

      {/* Spacing gap matching Hero rhythm */}
      <Spacer size={24} />

      {/* 3. Statistics Section (Redesigned into Premium cards) */}
      <div className="w-full border-t border-slate-100 pt-16 mt-16">
        <SectionHeading
          title="Why Clients Choose ClearFiling"
          description="A visual look at our corporate milestones and core compliance metrics."
          align="center"
          className="mx-auto mb-12"
        />
        <StatsStrip />
      </div>

      <Spacer size={24} />

      {/* 4. Process Highlights (Modern Horizontal timeline track) */}
      <div className="w-full border-t border-slate-100 pt-16 mt-16">
        <SectionHeading
          title="Our Seamless Filing Process"
          description="How we transition your company filings from consultation to registered status in four steps."
          align="center"
          className="mx-auto mb-16"
        />
        <ProcessSteps />
      </div>

      {/* 5. Security & Confidence Strip */}
      <SecurityStrip />
    </SectionContainer>
  );
};

export default TrustSection;

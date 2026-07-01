import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle, FolderOpen, FilePen, Send, CheckCircle2, LifeBuoy
} from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';

const STEPS = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Free Consultation',
    description:
      'Connect with our senior compliance advisor for a no-obligation consultation. We understand your business goals, suggest the most suitable service, and provide a clear pricing quote upfront.',
    color: 'brand-primary',
  },
  {
    icon: FolderOpen,
    step: '02',
    title: 'Document Collection',
    description:
      'You receive a tailored document checklist via WhatsApp or email. Submit scanned copies securely through our encrypted document portal — no courier required.',
    color: 'brand-primary',
  },
  {
    icon: FilePen,
    step: '03',
    title: 'Application Preparation',
    description:
      'Our CA or CS expert reviews your documents, prepares government forms, drafts required declarations, and audits for any compliance gaps before submission.',
    color: 'brand-primary',
  },
  {
    icon: Send,
    step: '04',
    title: 'Government Filing',
    description:
      'We file your application directly on the MCA, GST, IP India, or respective government portals with digital signatures. You receive an acknowledgement number for real-time tracking.',
    color: 'brand-primary',
  },
  {
    icon: CheckCircle2,
    step: '05',
    title: 'Approval & Delivery',
    description:
      'Upon government approval, your registration certificate, CIN, GSTIN, or TM number is shared directly to your email in a ready-to-use digital format.',
    color: 'brand-success',
  },
  {
    icon: LifeBuoy,
    step: '06',
    title: 'Post-Registration Support',
    description:
      'Our relationship does not end at registration. We continue to assist with annual filings, compliance reminders, renewal alerts, and respond to any post-approval government queries.',
    color: 'brand-success',
  },
];

const TimelineStep = ({ step, index, isLast }) => {
  const IconComponent = step.icon;
  const isSuccess = step.color === 'brand-success';

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex gap-6 md:gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
    >
      {/* Step connector line */}
      {!isLast && (
        <div className="absolute left-6 md:left-1/2 top-14 w-[2px] h-[calc(100%+2rem)] bg-gradient-to-b from-brand-primary/30 to-transparent -translate-x-1/2 hidden sm:block" />
      )}

      {/* Icon bubble */}
      <div className="flex-shrink-0 relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2
            ${isSuccess
              ? 'bg-brand-success/10 text-brand-success border-brand-success/20'
              : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
            }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 pb-10">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-brand-primary/15 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span
              className={`text-[10px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded-full
                ${isSuccess ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-primary/8 text-brand-primary'}`}
            >
              Step {step.step}
            </span>
          </div>
          <h3 className="text-base font-bold font-heading text-brand-secondary mb-2">
            {step.title}
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HowWeWorkSection = () => {
  return (
    <SectionContainer
      id="how-we-work"
      bgType="white"
      animate={false}
      className="py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient from-brand-bg via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="lg" className="space-y-14 px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="light" className="font-bold tracking-wider text-[10px] py-1 px-3.5">
            Our Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight leading-tight">
            How We Work with You
          </h2>
          <p className="text-slate-500 font-sans text-base leading-relaxed">
            A transparent, six-step process designed to get your registration done without confusion, delays, or surprises.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {STEPS.map((step, idx) => (
            <TimelineStep
              key={step.step}
              step={step}
              index={idx}
              isLast={idx === STEPS.length - 1}
            />
          ))}
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default HowWeWorkSection;

import React from 'react';
import { PhoneCall, FolderUp, Award, Activity } from 'lucide-react';
import Flex from '../ui/Flex';
import Stack from '../ui/Stack';

const STEPS = [
  {
    number: '01',
    icon: PhoneCall,
    title: 'Consultation',
    desc: 'Connect with a senior CA/CS expert to discuss your business requirements.',
  },
  {
    number: '02',
    icon: FolderUp,
    title: 'Documentation',
    desc: 'Securely upload the required documents to your compliance vault.',
  },
  {
    number: '03',
    icon: Award,
    title: 'Registration',
    desc: 'Our legal desk files applications and manages government liaison.',
  },
  {
    number: '04',
    icon: Activity,
    title: 'Ongoing Support',
    desc: 'Receive alerts, compliance reports, and support for routine filings.',
  },
];

const ProcessSteps = () => {
  return (
    <div className="w-full relative py-6">
      {/* Premium Gradient Timeline Track for Desktop */}
      <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-brand-primary/10 via-brand-primary/30 to-brand-accent/20 -z-10" />

      <Flex
        direction={{ base: 'col', lg: 'row' }}
        gap={{ base: 4, lg: 8 }}
        className="w-full justify-between items-stretch"
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === STEPS.length - 1;

          return (
            <div
              key={index}
              className="w-full lg:w-[22%] flex flex-col items-center lg:items-start text-center lg:text-left group relative"
            >
              {/* Step Node */}
              <div className="mb-5 relative flex justify-center lg:justify-start w-full">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-brand-primary shadow-sm group-hover:border-brand-primary transition-all duration-300 relative z-10 group-hover:shadow-[0_0_20px_rgba(22,101,52,0.1)]">
                  <Icon className="w-6 h-6 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Float-badge step number */}
                <span className="absolute top-0 right-1/2 translate-x-8 lg:translate-x-12 z-20 w-6 h-6 rounded-full bg-brand-primary text-white text-[10px] font-bold font-heading flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {step.number}
                </span>
              </div>

              {/* Step Texts */}
              <Stack gap={2} className="items-center lg:items-start px-4 lg:px-0">
                <h4 className="text-base font-bold text-brand-dark font-heading transition-colors duration-200 group-hover:text-brand-primary">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </Stack>

              {/* Vertical connector line on Mobile/Tablet */}
              {!isLast && (
                <div className="lg:hidden w-[2px] h-10 bg-gradient-to-b from-brand-primary/20 to-brand-primary/10 my-4 self-center" />
              )}
            </div>
          );
        })}
      </Flex>
    </div>
  );
};

export default ProcessSteps;

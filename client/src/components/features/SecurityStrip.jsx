import React from 'react';
import { Lock, EyeOff, UserCheck, Headphones } from 'lucide-react';
import Flex from '../ui/Flex';
import Badge from '../ui/Badge';

const BADGES = [
  { icon: Lock, label: 'Secure Documentation' },
  { icon: EyeOff, label: 'Confidential Information' },
  { icon: UserCheck, label: 'Expert CA & CS Guidance' },
  { icon: Headphones, label: 'Dedicated Customer Support' },
];

const SecurityStrip = () => {
  return (
    <div className="w-full border-t border-slate-200/50 pt-10 mt-16">
      <div className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-5 md:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
        <Flex
          direction={{ base: 'col', lg: 'row' }}
          gap={4}
          className="w-full items-center justify-between"
        >
          {/* Label section */}
          <Flex align="center" gap={2} className="text-xs font-bold uppercase tracking-widest text-slate-400">
            <Lock className="w-3.5 h-3.5 text-brand-primary" />
            <span>Assurance &amp; Protection</span>
          </Flex>
          
          {/* Badges Flow */}
          <Flex
            direction={{ base: 'col', sm: 'row' }}
            wrap="wrap"
            gap={3}
            className="items-center justify-center w-full lg:w-auto"
          >
            {BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-full px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors duration-200 hover:border-brand-primary/20"
                >
                  <Icon className="w-4 h-4 text-brand-primary stroke-[2]" />
                  <span className="text-xs font-semibold text-slate-600 tracking-tight">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default SecurityStrip;

/**
 * ContactInfoCards.jsx
 * Renders the grid of contact method cards.
 * Data comes exclusively from data/contactDetails.js — nothing hardcoded here.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone, PhoneCall, MessageSquare, Mail, Clock, Zap,
} from 'lucide-react';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import CONTACT_DETAILS from '../../data/contactDetails.js';

// Icon resolver — maps icon name strings to Lucide components
const ICON_RESOLVER = { Phone, PhoneCall, MessageSquare, Mail, Clock, Zap };

const ContactInfoCards = () => (
  <section
    className="bg-white py-14 md:py-18 border-b border-slate-100"
    aria-label="Contact information"
  >
    <MaxWidthContainer size="lg" className="space-y-8">
      {/* Section header */}
      <div className="text-center space-y-2">
        <Badge variant="light" className="font-bold tracking-wider text-[10px]">How to Reach Us</Badge>
        <h2 className="text-xl font-extrabold font-heading text-brand-secondary">Multiple Ways to Connect</h2>
        <p className="text-sm text-slate-500 font-sans max-w-sm mx-auto">Choose the contact method most convenient for you.</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONTACT_DETAILS.map((item, idx) => {
          const IconComponent = ICON_RESOLVER[item.iconName];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
            >
              {item.href && item.id !== 'email' ? (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={`${item.label}: ${item.value}`}
                  className="group block h-full"
                >
                  <Card
                    isHoverable
                    className="h-full p-5 flex items-start gap-4"
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 ${item.bgColorClass} ${item.hoverColorClass}`}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" aria-hidden="true" />}
                    </div>
                    {/* Text */}
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                      <div className="text-sm font-bold text-brand-secondary mt-0.5 truncate group-hover:text-brand-primary transition-colors">{item.value}</div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{item.subLabel}</div>
                    </div>
                  </Card>
                </a>
              ) : item.id === 'email' ? (
                <Card className="h-full p-5 flex items-start gap-4">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${item.bgColorClass}`}>
                    {IconComponent && <IconComponent className="w-5 h-5" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <div className="mt-1 flex flex-col gap-1">
                      {item.emails.map((emailObj) => (
                        <a
                          key={emailObj.display}
                          href={emailObj.href}
                          className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors block truncate"
                          aria-label={`Email us at ${emailObj.display}`}
                        >
                          {emailObj.display}
                        </a>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-1.5">{item.subLabel}</div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full p-5 flex items-start gap-4">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${item.bgColorClass}`}>
                    {IconComponent && <IconComponent className="w-5 h-5" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <div className="text-sm font-bold text-brand-secondary mt-0.5">{item.value}</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">{item.subLabel}</div>
                  </div>
                </Card>
              )}
            </motion.div>
          );
        })}
      </div>
    </MaxWidthContainer>
  </section>
);

export default ContactInfoCards;

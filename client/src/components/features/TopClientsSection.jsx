import React from 'react';
import { motion } from 'framer-motion';
import SectionContainer from '../ui/SectionContainer';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import TOP_CLIENTS from '../../data/topClients';

const TopClientsSection = () => {
  return (
    <SectionContainer
      id="top-clients"
      bgType="default"
      animate={false}
      className="py-20 md:py-28 bg-brand-bg border-t border-slate-100 relative overflow-hidden"
    >
      {/* Premium subtle ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gradient from-brand-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <SectionHeading
        badge="OUR TOP CLIENTS"
        title="Businesses That Trust Us"
        description="We are proud to provide company registration, taxation, legal compliance, digital solutions and business advisory services to startups, MSMEs and enterprises across India."
        align="center"
        className="mx-auto mb-16"
      />

      {/* Client List Showcase Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5 px-4 md:px-8 max-w-7xl mx-auto">
        {TOP_CLIENTS.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <Card
              isHoverable
              className="h-full flex flex-col items-center justify-between p-5 bg-white border border-slate-200/60 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/10 transition-all duration-300 text-center group"
            >
              {/* Logo container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100 flex items-center justify-center text-brand-primary font-heading font-black text-base tracking-wider shadow-inner group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                {client.logo}
              </div>

              {/* Client Text Info */}
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xs font-bold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                  {client.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-sans tracking-wide mt-1.5 uppercase font-medium">
                  {client.industry}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default TopClientsSection;

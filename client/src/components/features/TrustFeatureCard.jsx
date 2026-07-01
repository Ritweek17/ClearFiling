import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Flex from '../ui/Flex';
import Stack from '../ui/Stack';

const TrustFeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card
      isHoverable
      variant="default"
      className="group p-5 md:p-6 transition-all duration-300 border border-slate-200/50 hover:border-brand-primary/30 hover:shadow-[0_12px_30px_rgba(22,101,52,0.05)] bg-white h-full"
    >
      <Stack gap={4} align="start" className="h-full">
        {/* Expanded Icon Container with hover scaling */}
        <Flex
          align="center"
          justify="center"
          className="w-12 h-12 rounded-xl bg-brand-primary/5 text-brand-primary flex-shrink-0 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white"
        >
          <Icon className="w-6 h-6 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
        </Flex>

        {/* Text Stack */}
        <Stack gap={2} className="flex-grow">
          <h3 className="text-base font-bold text-brand-dark font-heading leading-snug transition-colors duration-200 group-hover:text-brand-primary">
            {title}
          </h3>
          <p className="text-sm text-slate-500 font-sans leading-relaxed">
            {description}
          </p>
        </Stack>
      </Stack>
    </Card>
  );
};

export default TrustFeatureCard;

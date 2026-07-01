import React from 'react';
import { Users, FileCheck2, ShieldAlert, Award } from 'lucide-react';
import Card from '../ui/Card';
import Grid from '../ui/Grid';
import Stack from '../ui/Stack';
import Flex from '../ui/Flex';

const STATS_DATA = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Businesses Served',
    desc: 'Empowering startups & MSMEs across India',
  },
  {
    icon: FileCheck2,
    value: '99.4%',
    label: 'Client Satisfaction',
    desc: 'Consistently rated 5-stars by founders',
  },
  {
    icon: ShieldAlert,
    value: '15+',
    label: 'CAs & CSs Experts',
    desc: 'Dedicated professional compliance team',
  },
  {
    icon: Award,
    value: '10+',
    label: 'Years Combined Exper.',
    desc: 'Delivering top-tier corporate advisory',
  },
];

const StatsStrip = () => {
  return (
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={6} className="w-full">
      {STATS_DATA.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            isHoverable
            variant="default"
            className="p-6 border border-slate-200/50 hover:border-brand-primary/20 hover:shadow-[0_12px_30px_rgba(22,101,52,0.04)] bg-white transition-all duration-300 group"
          >
            <Stack gap={4} className="items-center text-center">
              {/* Stat Icon */}
              <Flex
                align="center"
                justify="center"
                className="w-10 h-10 rounded-lg bg-brand-primary/5 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary/10"
              >
                <Icon className="w-5 h-5 stroke-[1.75]" />
              </Flex>

              {/* Number and Label */}
              <Stack gap={1} className="w-full">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight font-heading group-hover:scale-105 transition-transform duration-300 inline-block">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-brand-dark leading-tight">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 mt-1 leading-normal">
                  {stat.desc}
                </span>
              </Stack>
            </Stack>
          </Card>
        );
      })}
    </Grid>
  );
};

export default StatsStrip;

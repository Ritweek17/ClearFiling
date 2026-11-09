import React from 'react';
import { motion } from 'framer-motion';

const HeroIllustration = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut'
      }}
      className={`relative w-full max-w-[480px] lg:max-w-none aspect-[4/3] flex items-center justify-center ${className}`}
    >
      <div className="relative w-full h-full flex items-center justify-center animate-hero-float">
        {/* Decorative ambient background glows */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-accent/10 via-transparent to-transparent blur-3xl rounded-full scale-110 -z-10" />
      <div className="absolute w-40 h-40 bg-brand-primary/5 blur-2xl rounded-full top-10 right-10 -z-10 animate-pulse duration-4000" />

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-full h-full drop-shadow-[0_8px_24px_rgba(15,23,42,0.03)]"
      >
        {/* Background Grid Lines (Subtle Linear details) */}
        <path d="M50 350 H450" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M50 280 H450" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        <path d="M50 210 H450" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        <path d="M50 140 H450" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        
        {/* Vertical alignment line */}
        <path d="M250 50 V350" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

        {/* Dynamic Growth Wave (Primary Accent Green) */}
        <motion.path
          d="M50 320 C 130 260, 180 290, 270 170 C 330 90, 390 120, 450 60"
          stroke="url(#accentGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Growth Gradient Fill underneath */}
        <motion.path
          d="M50 320 C 130 260, 180 290, 270 170 C 330 90, 390 120, 450 60 V 350 H 50 Z"
          fill="url(#areaGrad)"
          opacity="0.08"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        {/* Nodes / Intersections on Growth Curve */}
        <circle cx="270" cy="170" r="6" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="450" cy="60" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
        
        {/* Document Box Representation (Compliance) */}
        <g opacity="0.9">
          {/* Main Card */}
          <rect x="80" y="80" width="130" height="170" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Header check circle */}
          <circle cx="120" cy="120" r="14" fill="#1D4ED8" fillOpacity="0.08" />
          <path d="M115 120 L118 123 L125 116" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Lines */}
          <rect x="145" y="112" width="50" height="6" rx="3" fill="#94A3B8" opacity="0.4" />
          <rect x="145" y="124" width="30" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
          <rect x="105" y="160" width="80" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="105" y="174" width="80" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="105" y="188" width="60" height="5" rx="2.5" fill="#E2E8F0" />
 
          {/* Abstract Blue Tag */}
          <rect x="105" y="210" width="50" height="14" rx="7" fill="#1D4ED8" fillOpacity="0.08" />
          <rect x="115" y="215" width="30" height="4" rx="2" fill="#1D4ED8" />
        </g>
 
        {/* Dashboard Stat Circle Representation */}
        <g opacity="0.9">
          {/* Container Card */}
          <rect x="290" y="220" width="140" height="100" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Trend arrow */}
          <circle cx="325" cy="255" r="12" fill="#2563EB" fillOpacity="0.08" />
          <path d="M321 259 L329 251 M324 251 H329 V256" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Typography placeholders */}
          <rect x="345" y="248" width="40" height="6" rx="3" fill="#0F172A" opacity="0.75" />
          <rect x="345" y="258" width="20" height="4" rx="2" fill="#94A3B8" opacity="0.4" />
          
          {/* Small graph line */}
          <path d="M310 295 L340 285 L370 298 L410 280" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="410" cy="280" r="3.5" fill="#1D4ED8" />
        </g>
 
        {/* Floating Gear / Compliance Details (Subtle design lines) */}
        <circle cx="390" cy="120" r="18" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <circle cx="390" cy="120" r="8" fill="#2563EB" fillOpacity="0.1" />
 
        {/* Gradients definitions */}
        <defs>
          <linearGradient id="accentGrad" x1="50" y1="320" x2="450" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1D4ED8" />
            <stop offset="0.5" stopColor="#1E40AF" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="250" y1="60" x2="250" y2="350" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" stopOpacity="1" />
            <stop offset="1" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      </div>
    </motion.div>
  );
};

export default HeroIllustration;

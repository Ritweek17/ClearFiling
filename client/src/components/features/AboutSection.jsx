import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, MapPin, Users, Target, Eye, Briefcase, Landmark } from 'lucide-react';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import SectionContainer from '../ui/SectionContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Grid from '../ui/Grid';
import Spacer from '../ui/Spacer';
import { COMPANY_INFO } from '../../data/companyInfo';

const AboutSection = () => {
  return (
    <SectionContainer id="about" bgType="white" containerSize="xl" animate={false} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-radial-gradient from-brand-accent/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-40 right-1/4 w-[600px] h-[600px] bg-radial-gradient from-brand-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Story, Mission, Vision, Values, Stats */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <Badge variant="light" className="bg-brand-bg text-brand-primary border-brand-primary/10 px-3 py-1 font-bold tracking-wider">
              About Clear Filing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-brand-secondary leading-tight tracking-tight">
              Helping Businesses Grow with Confidence Since 2020
            </h2>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              Clear Filing & Compliance LLP (brand name **ClearFiling**) is a premier CA, legal, and corporate compliance firm. We simplify the regulatory landscape for companies in India, enabling you to focus fully on operational growth.
            </p>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              By combining specialized professional expertise with a modern, tech-enabled document workflow, we complete registrations, tax returns, and licensing filings efficiently, transparently, and securely.
            </p>
          </div>

          {/* Mission & Vision cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card className="p-5 bg-slate-50 border border-slate-100/80 rounded-xl space-y-3">
              <div className="p-2 bg-brand-primary/5 rounded-lg border border-brand-primary/10 w-fit text-brand-primary">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-heading text-brand-secondary">Our Mission</h4>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                To simplify legal setups, tax compliance, and finance filings for Indian enterprises through high-speed, expert-backed solutions.
              </p>
            </Card>

            <Card className="p-5 bg-slate-50 border border-slate-100/80 rounded-xl space-y-3">
              <div className="p-2 bg-brand-primary/5 rounded-lg border border-brand-primary/10 w-fit text-brand-primary">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-heading text-brand-secondary">Our Vision</h4>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                To be the primary growth-partner for Indian business founders, delivering absolute pricing clarity and sincere consulting.
              </p>
            </Card>
          </div>

          {/* Core Values */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Our Core Values</span>
            <div className="flex flex-wrap gap-3">
              {['Integrity', 'Sanctity', 'Dedication'].map((value) => (
                <div 
                  key={value}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-bg/50 border border-brand-primary/10 rounded-full text-xs font-bold text-brand-primary tracking-wide"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Statistics Grid */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Quick Statistics</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl font-black font-heading text-brand-primary">2020</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Established</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl font-black font-heading text-brand-primary">6+ Years</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Experience</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl font-black font-heading text-brand-primary">10,000+</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Clients Served</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl font-black font-heading text-brand-primary">5</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Professionals</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <div className="text-sm font-black font-heading text-brand-primary leading-none mt-1.5">Delhi, Deoria & Gorakhpur</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">Active Offices</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Professional Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[450px] aspect-[4/3] bg-brand-bg border border-brand-primary/10 rounded-2xl p-8 flex items-center justify-center relative shadow-sm">
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">ClearFiling Dashboard</span>
            </div>
            
            <svg viewBox="0 0 240 180" className="w-full h-full text-brand-primary">
              {/* Background grids */}
              <line x1="20" y1="150" x2="220" y2="150" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="220" y2="100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="20" y1="50" x2="220" y2="50" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Y Axis line */}
              <line x1="20" y1="150" x2="20" y2="20" stroke="#CBD5E1" strokeWidth="2" />
              
              {/* Splines representing Growth */}
              <path d="M 20 140 Q 60 110, 110 80 T 200 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M 20 148 Q 70 130, 120 110 T 210 65" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              
              {/* Data points */}
              <circle cx="110" cy="80" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="200" cy="30" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              
              {/* Document popout overlay */}
              <g transform="translate(125, 85)" className="drop-shadow-[0_4px_10px_rgba(15,23,42,0.05)]">
                <rect x="0" y="0" width="85" height="50" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <rect x="8" y="8" width="16" height="16" rx="4" fill="#1D4ED8" fillOpacity="0.1" />
                <path d="M 13 16 L 15 18 L 19 13" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="30" y="11" width="45" height="4" rx="2" fill="#475569" />
                <rect x="30" y="19" width="30" height="3" rx="1.5" fill="#94A3B8" />
                <rect x="8" y="32" width="67" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="39" width="50" height="3" rx="1.5" fill="#E2E8F0" />
              </g>

              {/* Verified badge placeholder decoration */}
              <g transform="translate(30, 30)" className="drop-shadow-sm">
                <rect x="0" y="0" width="70" height="26" rx="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="13" cy="13" r="7" fill="#10B981" />
                <path d="M 10 13 L 12 15 L 16 11" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="24" y="16" fill="#0F172A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Verified CA</text>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </SectionContainer>
  );
};

export default AboutSection;

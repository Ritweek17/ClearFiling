import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, ShieldCheck, MapPin, Users, Target, Eye, Briefcase, Landmark,
  CheckCircle2, ArrowRight, Phone, MessageSquare, Star, Clock, HeartHandshake
} from 'lucide-react';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import PageContainer from '../components/ui/PageContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEOHead from '../components/seo/SEOHead';
import { PAGE_SEO } from '../config/seo';
import { COMPANY_INFO } from '../data/companyInfo';

// ─── Data ──────────────────────────────────────────────────────────────────
const CORE_VALUES = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'We deliver honest, unbiased advisory — even when the answer is not what the client hoped to hear. Transparency is non-negotiable.' },
  { icon: HeartHandshake, title: 'Sanctity', desc: 'Every client engagement is treated with the same dedication we would apply to our own business. No shortcuts.' },
  { icon: Star, title: 'Dedication', desc: 'We stay committed to every case from the first consultation to final approval delivery — and beyond, through post-registration support.' },
];

const TEAM = [
  { name: 'CA Team', title: 'Chartered Accountants', desc: 'Registered with ICAI. Specialists in tax, audit, company registration, and ROC compliance filings.', icon: Briefcase },
  { name: 'CS Team', title: 'Company Secretaries', desc: 'Registered with ICSI. Experts in MCA filings, board governance, and secretarial compliance for companies and LLPs.', icon: Landmark },
  { name: 'Legal Advisors', title: 'Corporate Legal Experts', desc: 'Qualified lawyers handling trademark filings, agreements, IP disputes, and RERA matters.', icon: Award },
  { name: 'Business Advisors', title: 'Merchant Bankers & Cost Accountants', desc: 'Specialists in financial structuring, cost audits, merchant banking compliance, and SEBI regulations.', icon: Target },
];

const JOURNEY = [
  { year: '2020', title: 'Firm Founded', desc: 'ClearFiling & Compliance LLP was established in Delhi with a core team of 2 CAs and 1 CS, focusing on company registrations and ROC compliance.' },
  { year: '2021', title: 'GST & Tax Practice Launched', desc: 'Expanded services to include GST registration, monthly return filing, and income tax advisory for businesses.' },
  { year: '2022', title: 'Trademark & Legal Team Added', desc: 'Onboarded qualified legal advisors and expanded services to trademark registration, copyright, and commercial agreements.' },
  { year: '2023', title: 'Deoria Office Opened', desc: 'Established our second office in Deoria, Uttar Pradesh to serve clients in the eastern UP region with the same quality of service.' },
  { year: '2024', title: '5,000+ Client Milestone', desc: 'Crossed the 5,000 satisfied client milestone — a reflection of the trust Indian businesses place in ClearFiling.' },
  { year: '2026', title: 'Present Day', desc: 'Serving over 10,000+ clients nationwide with a full panel of CA, CS, legal, and advisory professionals.' },
];

const STATS = [
  { value: '10,000+', label: 'Clients Served', icon: Users },
  { value: '6+ Years', label: 'Industry Experience', icon: Clock },
  { value: '5', label: 'Qualified Professionals', icon: Briefcase },
  { value: '3', label: 'Active Offices', icon: MapPin },
];

// ─── Component ──────────────────────────────────────────────────────────────
const About = () => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hi ClearFiling, I would like to learn more about your services.');
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  return (
    <PageContainer animate>
      {/* Route-level SEO Metadata */}
      <SEOHead
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        canonical={PAGE_SEO.about.canonical}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-brand-secondary text-white py-24 md:py-32 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-primary/20 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
        <MaxWidthContainer size="xl" className="relative z-10 text-center space-y-6">
          <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
            About ClearFiling
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Integrity. Sanctity. Dedication.
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-sans leading-relaxed">
            Since 2020, ClearFiling & Compliance LLP has helped over 10,000 clients across India with company registration, taxation, trademark, and compliance advisory — with full transparency and expert precision.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <Link to="/contact"
              className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20">
              <ArrowRight className="w-4 h-4" />Request Free Consultation
            </Link>
            <a href={COMPANY_INFO.contact.mobile.href}
              className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/8 transition-colors">
              <Phone className="w-4 h-4" />Call Now
            </a>
          </div>
        </MaxWidthContainer>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="xl" className="py-3">
          <Breadcrumbs items={[{ label: 'About Us' }]} />
        </MaxWidthContainer>
      </div>

      {/* ── 2. Company Story ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <MaxWidthContainer size="xl" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block">Our Background</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-brand-secondary leading-tight">The Story Behind ClearFiling</h2>
            </div>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              ClearFiling & Compliance LLP was founded in 2020 with a clear purpose: to make corporate advisory, business registration, and regulatory compliance accessible, transparent, and professional for every Indian entrepreneur.
            </p>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              What began as a boutique firm serving early-stage startups and MSMEs in Delhi has grown into a full-service compliance practice with offices in New Delhi, Deoria, and Gorakhpur, Uttar Pradesh. Our panel now includes Chartered Accountants, Company Secretaries, legal advisors, merchant bankers, and cost accountants — each bringing deep domain expertise.
            </p>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              Over the past six years, we have guided more than 10,000 clients through company registrations, GST filings, trademark applications, and annual ROC compliance — with no hidden fees, no delays, and no confusion. Every client receives dedicated advisor support and regular status updates.
            </p>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <Card className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <div className="p-2 bg-brand-primary/5 border border-brand-primary/10 rounded-lg w-fit"><Target className="w-5 h-5 text-brand-primary" /></div>
                <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Our Mission</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">To simplify corporate compliance, taxation, and company registration for Indian enterprises through fast, reliable, and expert-backed solutions — at transparent pricing.</p>
              </Card>
              <Card className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <div className="p-2 bg-brand-primary/5 border border-brand-primary/10 rounded-lg w-fit"><Eye className="w-5 h-5 text-brand-primary" /></div>
                <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Our Vision</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">To become India's most trusted compliance partner — known for integrity, transparent pricing, and dedicated expert support for businesses of every size.</p>
              </Card>
            </div>
          </div>

          {/* Stats right column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <Card key={stat.label} className="p-5 flex items-center gap-4">
                  <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-brand-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black font-heading text-brand-secondary">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Core values */}
            <Card className="p-5 bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Values</span>
              <div className="flex flex-wrap gap-2">
                {['Integrity', 'Sanctity', 'Dedication'].map(v => (
                  <div key={v} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg border border-brand-primary/10 rounded-full text-xs font-bold text-brand-primary">
                    <ShieldCheck className="w-3.5 h-3.5" />{v}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </MaxWidthContainer>
      </section>

      {/* ── 3. Core Values ──────────────────────────────────────────────────── */}
      <section className="bg-brand-bg border-t border-slate-100 py-20 md:py-24">
        <MaxWidthContainer size="xl" className="space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="light" className="font-bold tracking-wider text-[10px]">Guiding Principles</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((val, idx) => (
              <motion.div key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                <Card isHoverable className="h-full p-7 flex flex-col gap-4">
                  <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary rounded-xl w-fit">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold font-heading text-brand-secondary">{val.title}</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{val.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </MaxWidthContainer>
      </section>

      {/* ── 4. Meet Our Experts ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-20 md:py-24">
        <MaxWidthContainer size="xl" className="space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="light" className="font-bold tracking-wider text-[10px]">Our Professionals</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary">Meet Our Expert Team</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm font-sans leading-relaxed">Our team spans five professional disciplines, each bringing deep regulatory knowledge and hands-on advisory experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }}>
                <Card isHoverable className="h-full p-6 flex flex-col gap-4 text-left group">
                  <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <member.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">{member.name}</div>
                    <h3 className="text-sm font-extrabold font-heading text-brand-secondary">{member.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{member.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </MaxWidthContainer>
      </section>

      {/* ── 5. Our Journey (Timeline) ─────────────────────────────────────────── */}
      <section className="bg-brand-bg border-t border-slate-100 py-20 md:py-24">
        <MaxWidthContainer size="lg" className="space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="light" className="font-bold tracking-wider text-[10px]">Our Timeline</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-secondary">Our Journey Since 2020</h2>
          </div>
          <div className="relative pl-8 border-l-2 border-brand-primary/20 space-y-8">
            {JOURNEY.map((item, idx) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative">
                <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-md">
                  {item.year.slice(2)}
                </div>
                <Card className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-primary">{item.year}</span>
                    <div className="w-px h-3 bg-slate-200" />
                    <h3 className="text-sm font-extrabold font-heading text-brand-secondary">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </MaxWidthContainer>
      </section>

      {/* ── 6. Final CTA ────────────────────────────────────────────────────── */}
      <section className="bg-brand-secondary py-20 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-radial-gradient from-brand-primary/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <MaxWidthContainer size="md" className="text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Ready to Work With Us?</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-sans leading-relaxed">
            Connect with our senior compliance advisors for a free, no-obligation consultation about your business requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/contact"
              className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20">
              <ArrowRight className="w-4 h-4" />Request Free Consultation
            </Link>
            <button onClick={handleWhatsApp}
              className="flex items-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/8 transition-colors">
              <MessageSquare className="w-4 h-4 text-brand-success" />WhatsApp Us
            </button>
          </div>
        </MaxWidthContainer>
      </section>
    </PageContainer>
  );
};

export default About;

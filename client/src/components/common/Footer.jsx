/**
 * Footer.jsx
 * Production-ready, fully config-driven Footer component.
 * All data is imported from footerConfig.js — no hardcoded values here.
 *
 * Structure:
 *  1. Company brand + description + contact methods + social
 *  2. Popular Services column
 *  3. Quick Links column
 *  4. Office Addresses + Resources column
 *  5. Bottom copyright bar + legal links
 */

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone, MessageSquare, Mail, MapPin, Clock, Facebook, Instagram, ArrowRight,
} from 'lucide-react';

import {
  FOOTER_COMPANY,
  FOOTER_CONTACT,
  FOOTER_OFFICES,
  FOOTER_SOCIAL,
  FOOTER_QUICK_LINKS,
  FOOTER_LOANS,
  FOOTER_SERVICES,
  FOOTER_RESOURCES,
  FOOTER_LEGAL,
} from '../../data/footerConfig';

// ─── Icon map for social media (only icons used in footerConfig) ──────────────
const SOCIAL_ICON_MAP = { Facebook, Instagram };

// ─── Reusable sub-components ─────────────────────────────────────────────────

/** Section column with title + accent underline */
const FooterColumn = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-extrabold font-heading text-white tracking-wide">{title}</h4>
    <div className="w-8 h-0.5 bg-brand-primary rounded-full" aria-hidden="true" />
    <nav aria-label={title}>
      <ul className="space-y-2.5">
        {children}
      </ul>
    </nav>
  </div>
);

/** Animated arrow prefix on hover */
const ArrowPrefix = () => (
  <ArrowRight
    className="w-3 h-3 text-brand-primary opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity duration-200"
    aria-hidden="true"
  />
);

/** Smart link — handles internal routes, section scrolls, and future-route stubs */
const FooterNavLink = ({ label, to, section, slug, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseClass =
    'text-xs text-slate-400 hover:text-white transition-colors duration-200 font-sans flex items-center gap-1.5 group';

  // Service page link
  if (slug) {
    return (
      <li>
        <Link
          to={`/services/${slug}`}
          className={baseClass}
          title={title || label}
        >
          <ArrowPrefix />
          {label}
        </Link>
      </li>
    );
  }

  // Section scroll — if already on home page, scroll; otherwise navigate + scroll
  if (section) {
    const handleSectionClick = (e) => {
      e.preventDefault();
      const scrollToSection = () => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      if (location.pathname === '/') {
        scrollToSection();
      } else {
        navigate(to || '/');
        setTimeout(scrollToSection, 400);
      }
    };

    return (
      <li>
        <a
          href={`${to || '/'}#${section}`}
          onClick={handleSectionClick}
          className={baseClass}
          title={title || label}
        >
          <ArrowPrefix />
          {label}
        </a>
      </li>
    );
  }

  // Standard internal page link
  if (to) {
    return (
      <li>
        <Link to={to} className={baseClass} title={title || label}>
          <ArrowPrefix />
          {label}
        </Link>
      </li>
    );
  }

  // Future route: render non-interactive but styled (keeps visual consistency)
  return (
    <li>
      <span className={`${baseClass} cursor-default opacity-60`} title="Coming soon">
        <ArrowPrefix />
        {label}
      </span>
    </li>
  );
};

/** Clickable contact row with icon box */
const ContactRow = ({ href, icon: Icon, hoverColor, children }) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors group"
  >
    <div
      className={`w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center transition-all duration-200
        group-hover:bg-${hoverColor} group-hover:border-${hoverColor}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
    </div>
    <span>{children}</span>
  </a>
);

/** Social icon button — only rendered when href is truthy */
const SocialButton = ({ href, icon: iconName, label }) => {
  const Icon = SOCIAL_ICON_MAP[iconName];
  if (!href || !Icon) return null;

  return (
    <a
      href={href}
      aria-label={`Follow ClearFiling on ${label}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 hover:bg-brand-primary hover:border-brand-primary flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  );
};

// ─── Main Footer Component ────────────────────────────────────────────────────

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-brand-secondary text-slate-400 border-t border-slate-800"
      aria-label="ClearFiling site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      {/* ── Main Grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* ── Col 1: Company info + Contact + Social (spans 3 of 12) ── */}
          <div
            className="sm:col-span-2 lg:col-span-3 space-y-6"
            itemScope
            itemType="https://schema.org/Organization"
          >
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2.5"
                aria-label={`${FOOTER_COMPANY.brandName} — return to homepage`}
              >
                <div
                  className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-primary/20"
                  aria-hidden="true"
                >
                  <span className="text-white font-black text-sm font-heading">CF</span>
                </div>
                <div>
                  <div
                    className="text-white font-extrabold text-base font-heading leading-none"
                    itemProp="name"
                  >
                    {FOOTER_COMPANY.brandName}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                    {FOOTER_COMPANY.legalName}
                  </div>
                </div>
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.15em]">
              {FOOTER_COMPANY.tagline}
            </p>

            {/* Description */}
            <p
              className="text-xs text-slate-400 font-sans leading-relaxed"
              itemProp="description"
            >
              {FOOTER_COMPANY.description}
            </p>

            {/* Contact Methods */}
            <div
              className="space-y-2.5"
              itemScope
              itemType="https://schema.org/ContactPoint"
            >
              {/* Mobile */}
              <a
                href={FOOTER_CONTACT.mobile.href}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors group"
                aria-label={`Call us: ${FOOTER_CONTACT.mobile.display}`}
                itemProp="telephone"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:bg-brand-primary group-hover:border-brand-primary flex items-center justify-center transition-all duration-200">
                  <Phone className="w-3 h-3" aria-hidden="true" />
                </div>
                <span>{FOOTER_CONTACT.mobile.display}</span>
              </a>

              {/* Landline */}
              <a
                href={FOOTER_CONTACT.landline.href}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors group"
                aria-label={`Landline: ${FOOTER_CONTACT.landline.display}`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:bg-brand-primary group-hover:border-brand-primary flex items-center justify-center transition-all duration-200">
                  <Phone className="w-3 h-3 opacity-70" aria-hidden="true" />
                </div>
                <span>{FOOTER_CONTACT.landline.display}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={FOOTER_CONTACT.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors group"
                aria-label="Send us a WhatsApp message"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:bg-brand-success group-hover:border-brand-success flex items-center justify-center transition-all duration-200">
                  <MessageSquare className="w-3 h-3" aria-hidden="true" />
                </div>
                <span>{FOOTER_CONTACT.whatsapp.display}</span>
              </a>

              {/* Email */}
              <a
                href={FOOTER_CONTACT.email.href}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors group"
                aria-label={`Email us at ${FOOTER_CONTACT.email.display}`}
                itemProp="email"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:bg-brand-accent group-hover:border-brand-accent flex items-center justify-center transition-all duration-200">
                  <Mail className="w-3 h-3" aria-hidden="true" />
                </div>
                <span>{FOOTER_CONTACT.email.display}</span>
              </a>

              {/* Office Hours */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 pt-0.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-800 flex items-center justify-center">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                </div>
                <span>
                  {FOOTER_CONTACT.hours.display}
                  <span className="block text-[10px] text-slate-600">{FOOTER_CONTACT.hours.note}</span>
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                Follow Us
              </div>
              <div className="flex items-center gap-2" role="list" aria-label="Social media links">
                {FOOTER_SOCIAL.map((s) => (
                  <div key={s.id} role="listitem">
                    <SocialButton href={s.href} icon={s.icon} label={s.label} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 2: Popular Services (spans 2 of 12) ── */}
          <div className="lg:col-span-2">
            <FooterColumn title="Popular Services">
              {FOOTER_SERVICES.map((s) => (
                <FooterNavLink key={s.label} label={s.label} to="/services" slug={s.slug} />
              ))}
            </FooterColumn>
          </div>

          {/* ── Col 3: Loan Services (spans 2 of 12) ── */}
          <div className="lg:col-span-2">
            <FooterColumn title="Loan Services">
              {FOOTER_LOANS.map((l) => (
                <FooterNavLink key={l.label} label={l.label} to="/services" slug={l.slug} />
              ))}
            </FooterColumn>
          </div>

          {/* ── Col 4: Quick Links (spans 2 of 12) ── */}
          <div className="lg:col-span-2">
            <FooterColumn title="Quick Links">
              {FOOTER_QUICK_LINKS.map((l) => (
                <FooterNavLink
                  key={l.label}
                  label={l.label}
                  to={l.to}
                  section={l.section}
                />
              ))}
            </FooterColumn>
          </div>

          {/* ── Col 4: Offices + Resources (spans 3 of 12) ── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Office Addresses */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold font-heading text-white tracking-wide">Our Offices</h4>
              <div className="w-8 h-0.5 bg-brand-primary rounded-full" aria-hidden="true" />

              <div className="space-y-5">
                {FOOTER_OFFICES.map((office) => (
                  <address
                    key={office.id}
                    className="not-italic space-y-1"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                      {office.label}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin
                        className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="text-xs text-slate-400 font-sans leading-relaxed" itemProp="streetAddress">
                        {office.lines.map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                        {office.mapsUrl && (
                          <a
                            href={office.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:underline text-[10px] mt-1 inline-flex items-center gap-1"
                          >
                            View on Maps
                          </a>
                        )}
                      </div>
                    </div>
                  </address>
                ))}
              </div>
            </div>

            {/* Resources */}
            <FooterColumn title="Resources">
              {FOOTER_RESOURCES.map((r) => (
                <FooterNavLink key={r.label} label={r.label} to={r.to} />
              ))}
            </FooterColumn>

          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 font-sans text-center sm:text-left">
            © {currentYear}{' '}
            <span itemProp="legalName">{FOOTER_COMPANY.legalName}</span>. All Rights Reserved.
            &nbsp;Est. {FOOTER_COMPANY.established}.
          </p>

          <nav aria-label="Legal links" className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            {FOOTER_LEGAL.map((item, i) => (
              <React.Fragment key={item.label}>
                <Link
                  to={item.to}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors font-sans"
                >
                  {item.label}
                </Link>
                {i < FOOTER_LEGAL.length - 1 && (
                  <span className="text-slate-700 text-[11px]" aria-hidden="true">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

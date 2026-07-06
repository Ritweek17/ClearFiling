/**
 * OfficeLocations.jsx
 * Renders office cards from data/officeLocations.js.
 * When mapsUrl/mapsEmbed is provided in data, maps render automatically.
 * This component NEVER needs editing when office data changes.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import OFFICE_LOCATIONS from '../../data/officeLocations.js';

// Map placeholder — shown when mapsEmbed is null
const MapPlaceholder = ({ officeName }) => (
  <div className="h-48 bg-brand-bg border border-brand-primary/10 rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden">
    {/* Dot grid texture */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: 'radial-gradient(circle, #1D4ED8 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      aria-hidden="true"
    />
    <div className="relative z-10 text-center space-y-2">
      <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-brand-primary/30">
        <MapPin className="w-5 h-5" aria-hidden="true" />
      </div>
      <p className="text-xs font-bold text-brand-secondary">{officeName}</p>
      <p className="text-[10px] text-slate-400">Map coming soon</p>
    </div>
  </div>
);

const OfficeLocations = () => (
  <section
    className="bg-slate-50 border-t border-slate-100 py-16 md:py-20"
    aria-label="Our office locations"
  >
    <MaxWidthContainer size="lg" className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="light" className="font-bold tracking-wider text-[10px]">Our Offices</Badge>
        <h2 className="text-2xl font-extrabold font-heading text-brand-secondary">Find Us Here</h2>
        <p className="text-sm text-slate-500 font-sans max-w-md mx-auto">
          Walk-in appointments available by prior arrangement. Call ahead to confirm availability.
        </p>
      </div>

      {/* Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFICE_LOCATIONS.map((office, idx) => (
          <motion.div
            key={office.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              {/* Map area */}
              <div className="relative">
                {office.mapsEmbed ? (
                  <iframe
                    src={office.mapsEmbed}
                    title={`Map of ${office.label}`}
                    className="w-full h-48 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label={`Google Maps view of ${office.label}`}
                  />
                ) : (
                  <MapPlaceholder officeName={office.label} />
                )}
                {/* HQ badge */}
                {office.isHeadquarters && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] font-extrabold text-white bg-brand-primary px-2 py-1 rounded-full uppercase tracking-wider shadow">
                      {office.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Office details */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">{office.label}</div>
                  <h3 className="text-base font-extrabold font-heading text-brand-secondary">{office.city}</h3>
                </div>

                {/* Address */}
                <address
                  className="not-italic space-y-1"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <div className="flex items-start gap-2 text-sm text-slate-600 font-sans leading-relaxed">
                    <MapPin className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div itemProp="streetAddress">
                      <span className="block">{office.addressLine1}</span>
                      <span className="block">{office.addressLine2}</span>
                      <span className="block">{office.addressLine3}</span>
                      {office.landmark && (
                        <span className="block text-xs text-slate-400 mt-0.5">
                          Near: {office.landmark}
                        </span>
                      )}
                    </div>
                  </div>
                </address>

                {/* Contact links */}
                <div className="space-y-1.5 mt-auto pt-3 border-t border-slate-100">
                  <a href={office.phoneHref} className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />{office.phone}
                  </a>
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                      {office.emails ? (
                        office.emails.map((emailAddr) => (
                          <a
                            key={emailAddr}
                            href={`mailto:${emailAddr}`}
                            className="hover:text-brand-primary transition-colors block"
                          >
                            {emailAddr}
                          </a>
                        ))
                      ) : (
                        <a href={`mailto:${office.email}`} className="hover:text-brand-primary transition-colors block">
                          {office.email}
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Maps CTA — ready for when URL is provided */}
                  {office.mapsUrl && (
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-brand-primary font-bold hover:underline mt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </MaxWidthContainer>
  </section>
);

export default OfficeLocations;

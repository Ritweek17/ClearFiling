/**
 * contact.js — All contact methods, hours, and CTA text.
 * To update phone, email, WhatsApp, or hours: edit ONLY this file.
 * Components must never contain hardcoded contact values.
 */

const CONTACT = {
  // Primary contact
  mobile: {
    display: '+91 9250201718',
    href: 'tel:+919250201718',
    raw: '9250201718',
  },

  // Landline
  landline: {
    display: '05568-450351',
    href: 'tel:05568450351',
    raw: '05568450351',
  },

  // Gorakhpur Office
  gorakhpur: {
    display: '+91 9336379826',
    href: 'tel:+919336379826',
    raw: '9336379826',
  },

  // WhatsApp
  whatsapp: {
    number: '919250201718',
    defaultMessage: 'Hi Clear Filing, I need compliance assistance for my business.',
    get href() {
      return `https://wa.me/${this.number}?text=${encodeURIComponent(this.defaultMessage)}`;
    },
    display: 'Chat on WhatsApp',
  },

  // Email
  email: {
    display: 'clearfiling@zohomail.in',
    href: 'mailto:clearfiling@zohomail.in',
  },
  email2: {
    display: 'support.clearfiling@gmail.com',
    href: 'mailto:support.clearfiling@gmail.com',
  },

  // Office Hours
  hours: {
    display: '9:00 AM – 9:00 PM',
    note: 'Open 7 Days a Week',
    full: '9:00 AM – 9:00 PM, Monday to Sunday',
  },

  // Response SLA
  responseSLA: '2–4 business hours',
  whatsappSLA: 'Within 30 minutes',
  otherSLA: '2–4 business hours',
};

export default CONTACT;

/**
 * contactDetails.js — Structured contact method data for UI rendering.
 * Components import this array to render contact cards.
 * All values sourced from config/contact.js — never hardcode here.
 */

import CONTACT from '../config/contact.js';

const CONTACT_DETAILS = [
  {
    id: 'mobile',
    label: 'Mobile',
    subLabel: 'Call us directly',
    value: CONTACT.mobile.display,
    href: CONTACT.mobile.href,
    actionText: 'Call Now',
    iconName: 'Phone',
    external: false,
    hoverColorClass: 'group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white',
    bgColorClass: 'bg-brand-primary/5 border-brand-primary/15 text-brand-primary',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    subLabel: 'Chat with an advisor',
    value: CONTACT.whatsapp.display,
    href: CONTACT.whatsapp.href,
    actionText: 'Chat Now',
    iconName: 'MessageSquare',
    external: true,
    hoverColorClass: 'group-hover:bg-brand-success group-hover:border-brand-success group-hover:text-white',
    bgColorClass: 'bg-brand-success/5 border-brand-success/15 text-brand-success',
  },
  {
    id: 'email',
    label: 'Email',
    subLabel: 'Write to us anytime',
    value: CONTACT.email.display,
    href: CONTACT.email.href,
    actionText: 'Send Email',
    iconName: 'Mail',
    external: false,
    hoverColorClass: 'group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-white',
    bgColorClass: 'bg-brand-accent/5 border-brand-accent/15 text-brand-accent',
  },
  {
    id: 'landline',
    label: 'Landline',
    subLabel: 'Deoria office',
    value: CONTACT.landline.display,
    href: CONTACT.landline.href,
    actionText: 'Call Office',
    iconName: 'PhoneCall',
    external: false,
    hoverColorClass: 'group-hover:bg-slate-600 group-hover:border-slate-600 group-hover:text-white',
    bgColorClass: 'bg-slate-100 border-slate-200 text-slate-500',
  },
  {
    id: 'hours',
    label: 'Office Hours',
    subLabel: CONTACT.hours.note,
    value: CONTACT.hours.display,
    href: null,
    actionText: null,
    iconName: 'Clock',
    external: false,
    hoverColorClass: '',
    bgColorClass: 'bg-brand-bg border-brand-primary/10 text-brand-primary',
  },
  {
    id: 'response',
    label: 'Response Time',
    subLabel: 'Typical reply speed',
    value: CONTACT.responseSLA,
    href: null,
    actionText: null,
    iconName: 'Zap',
    external: false,
    hoverColorClass: '',
    bgColorClass: 'bg-brand-success/5 border-brand-success/15 text-brand-success',
  },
];

export default CONTACT_DETAILS;

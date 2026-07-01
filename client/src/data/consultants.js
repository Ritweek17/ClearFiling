/**
 * consultants.js — Available consultation types and expert panel.
 * Update this file when team members change. Components never need editing.
 */

export const CONSULTANT_TYPES = [
  {
    id: 'ca',
    title: 'Chartered Accountant (CA)',
    shortTitle: 'CA',
    specialty: 'Tax, Audit & Company Registration',
    description: 'ICAI-registered CAs specializing in company incorporation, income tax planning, statutory audit, and GST advisory.',
    iconName: 'BarChart3',
    available: true,
    tag: 'Most Popular',
  },
  {
    id: 'cs',
    title: 'Company Secretary (CS)',
    shortTitle: 'CS',
    specialty: 'MCA, ROC & Secretarial Compliance',
    description: 'ICSI-registered Company Secretaries handling board governance, annual ROC filings, and corporate secretarial services.',
    iconName: 'FileText',
    available: true,
    tag: null,
  },
  {
    id: 'legal',
    title: 'Legal Advisor',
    shortTitle: 'Advocate',
    specialty: 'Trademark, IP & Legal Documentation',
    description: 'Qualified lawyers handling trademark registration, copyright, commercial agreements, and intellectual property advisory.',
    iconName: 'Scale',
    available: true,
    tag: null,
  },
  {
    id: 'merchant-banker',
    title: 'Merchant Banker',
    shortTitle: 'Merchant Banker',
    specialty: 'SEBI & Financial Compliance',
    description: 'SEBI-registered merchant bankers advising on capital structuring, financial compliance, and regulatory approvals.',
    iconName: 'TrendingUp',
    available: true,
    tag: null,
  },
];

export const CONSULTATION_BENEFITS = [
  'Free initial consultation — no commitment',
  'Response within 2–4 business hours',
  'Transparent flat-rate pricing, no hidden fees',
  'Dedicated advisor for your complete journey',
  'Post-registration support included',
];

export default CONSULTANT_TYPES;

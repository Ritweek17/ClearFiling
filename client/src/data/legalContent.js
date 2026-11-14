/**
 * legalContent.js
 * Centralized content for Privacy Policy, Terms & Conditions, and Disclaimer.
 * LegalPageLayout renders these data objects. Update here to change content.
 */
import BUSINESS from '../config/business.js';
import CONTACT from '../config/contact.js';
import OFFICE_LOCATIONS from './officeLocations.js';

const WEBSITE_DOMAIN = new URL(BUSINESS.websiteUrl).hostname.replace(/^www\./, '');

const LEGAL_CONTACT_LINES = [
  `Email: ${CONTACT.email.display} / ${CONTACT.email2.display}`,
  `Phone: ${CONTACT.mobile.display} | Landline: ${CONTACT.landline.display} | Gorakhpur: ${CONTACT.gorakhpur.display}`,
  ...OFFICE_LOCATIONS.map((office) => `${office.label.replace(' Office', '')} Office: ${office.legalAddress}`),
];

// ─── PRIVACY POLICY ───────────────────────────────────────────────────────────
export const PRIVACY_POLICY = {
  title: 'Privacy Policy',
  badge: 'Legal Document',
  lastUpdated: '1 July 2026',
  effectiveDate: '1 July 2026',
  metaTitle: `Privacy Policy | ${BUSINESS.legalName}`,
  metaDescription: `Read the ${BUSINESS.primaryBrandName} privacy policy to understand how we collect, use, and protect your personal information.`,
  intro: `${BUSINESS.legalName} ("${BUSINESS.primaryBrandName}", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website ${WEBSITE_DOMAIN} or engage with our services. Please read this policy carefully. By using this website, you agree to the terms described herein.`,
  sections: [
    {
      heading: 'Information We Collect',
      content: [
        'We collect information you provide directly to us when you:',
        ['Submit a contact or lead inquiry form', 'Request a free consultation', 'Send us an email or WhatsApp message', 'Call our office', 'Engage with our compliance advisory services'],
        'The types of personal information we may collect include: full name, mobile number, email address, company name, business type, city/state, and the nature of the compliance matter you are enquiring about.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      content: [
        'We use the personal information we collect for the following purposes:',
        ['To respond to your inquiries and provide requested services', 'To schedule consultations and follow up on pending matters', 'To send relevant compliance reminders, renewal alerts, or service updates', 'To improve our website experience and service delivery', 'To comply with applicable Indian laws and regulatory obligations'],
      ],
    },
    {
      heading: 'Information Sharing & Disclosure',
      content: [
        `${BUSINESS.primaryBrandName} does not sell, rent, trade, or otherwise transfer your personal information to third parties without your consent, except in the following limited circumstances:`,
        ['With government portals or regulatory bodies as required by law to deliver our services (e.g., filing documents with MCA, GST portal, IP India)', 'With qualified professional associates bound by confidentiality obligations', 'Where required by a court order or applicable law in India'],
      ],
    },
    {
      heading: 'Data Security',
      content: [
        'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, accidental loss, alteration, or disclosure. Our staff are trained to handle client data with the utmost confidentiality.',
        'However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.',
      ],
    },
    {
      heading: 'Cookies & Tracking Technologies',
      content: [
        'Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyse website traffic, and understand user behaviour. These are small data files placed on your device.',
        'You can instruct your browser to refuse cookies or alert you when cookies are being sent. However, some parts of this website may not function properly if you disable cookies.',
      ],
    },
    {
      heading: 'Third-Party Links',
      content: [
        'Our website may contain links to third-party websites, government portals, or partner resources. We have no control over the content or privacy practices of those sites. We encourage you to review the privacy policies of any third-party site you visit.',
      ],
    },
    {
      heading: 'Retention of Data',
      content: [
        'We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, to comply with our professional obligations, and as required under applicable Indian laws including the Income Tax Act, Companies Act, GST Act, and other applicable statutes.',
      ],
    },
    {
      heading: 'Your Rights',
      content: [
        `You have the right to access, correct, or request deletion of your personal information held by us. To exercise any of these rights, please contact us at ${CONTACT.email.display} or ${CONTACT.email2.display} or call us at ${CONTACT.mobile.display}. We will respond to your request within a reasonable timeframe.`,
      ],
    },
    {
      heading: 'Children\'s Privacy',
      content: [
        'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a child, please contact us immediately.',
      ],
    },
    {
      heading: 'Changes to This Policy',
      content: [
        'We reserve the right to update this Privacy Policy at any time. When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically to stay informed.',
      ],
    },
    {
      heading: 'Contact Us',
      content: [
        'If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:',
        LEGAL_CONTACT_LINES,
      ],
    },
  ],
};

// ─── TERMS & CONDITIONS ───────────────────────────────────────────────────────
export const TERMS_CONDITIONS = {
  title: 'Terms & Conditions',
  badge: 'Legal Document',
  lastUpdated: '1 July 2026',
  effectiveDate: '1 July 2026',
  metaTitle: `Terms & Conditions | ${BUSINESS.legalName}`,
  metaDescription: `Review the terms and conditions governing the use of ${BUSINESS.primaryBrandName} services and this website.`,
  intro: `These Terms & Conditions ("Terms") govern your access to and use of the website ${WEBSITE_DOMAIN} and the professional advisory and compliance services provided by ${BUSINESS.legalName}. By accessing this website or engaging our services, you agree to be bound by these Terms. If you do not agree, please do not use this website.`,
  sections: [
    {
      heading: 'Services Offered',
      content: [
        `${BUSINESS.legalName} provides professional advisory and facilitation services in the following areas:`,
        ['Company and business entity registration', 'GST registration and return filing', 'Trademark and intellectual property filing', 'Income tax return preparation and filing', 'Annual ROC compliance and secretarial services', 'MSME, FSSAI, IEC and other government registrations', 'Business advisory and legal documentation'],
        'We act as facilitators and professional advisors. We do not provide legal representation in courts of law.',
      ],
    },
    {
      heading: 'Professional Responsibility',
      content: [
        'All services are delivered by qualified Chartered Accountants (CAs), Company Secretaries (CSs), and legal professionals registered under the relevant Indian professional bodies. Our advice is based on current laws and regulations at the time of engagement.',
        `Laws and government regulations change frequently. Clients are advised to seek updated advice for their specific situations. ${BUSINESS.primaryBrandName} shall not be liable for changes in law that occur after the date of the advice provided.`,
      ],
    },
    {
      heading: 'Client Responsibilities',
      content: [
        'By engaging our services, you agree to:',
        ['Provide accurate, complete, and truthful information and documents', 'Inform us immediately of any changes in your business status or information', 'Maintain confidentiality of any government credentials or login access we facilitate', 'Not use our services for any unlawful purpose or to file fraudulent documents', 'Cooperate promptly in providing requested documents within agreed timelines'],
      ],
    },
    {
      heading: 'Fees & Payments',
      content: [
        'Service fees are communicated upfront during the free consultation phase. Government fees, stamp duties, and statutory charges are additional and billed at actuals.',
        'Fees once paid for professional services rendered are non-refundable unless the service has not been initiated. Refund requests must be made in writing within 48 hours of payment.',
        `${BUSINESS.primaryBrandName} reserves the right to revise service fees with notice. Existing engagement fees are not affected retroactively.`,
      ],
    },
    {
      heading: 'Timelines & Delays',
      content: [
        `Processing timelines provided are indicative estimates based on normal government processing speeds. ${BUSINESS.primaryBrandName} is not responsible for delays caused by government processing backlogs, technical issues on government portals, or failure by the client to provide required documents on time.`,
      ],
    },
    {
      heading: 'Intellectual Property',
      content: [
        `All content on this website, including text, graphics, logos, images, and downloadable materials, is the intellectual property of ${BUSINESS.legalName} unless otherwise stated. You may not copy, reproduce, distribute, or create derivative works without our prior written consent.`,
      ],
    },
    {
      heading: 'Limitation of Liability',
      content: [
        `${BUSINESS.primaryBrandName}'s liability in connection with any service shall not exceed the fees paid by the client for that specific service. We shall not be liable for any indirect, consequential, or punitive damages arising from the use of this website or our services.`,
      ],
    },
    {
      heading: 'Confidentiality',
      content: [
        'We treat all client information with strict confidentiality. Our professionals are bound by professional codes of conduct under ICAI, ICSI, and Bar Council regulations. We will not disclose client information except as required by law or with your consent.',
      ],
    },
    {
      heading: 'Governing Law',
      content: [
        'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.',
      ],
    },
    {
      heading: 'Amendments',
      content: [
        'We reserve the right to modify these Terms at any time. Continued use of this website after any change constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.',
      ],
    },
    {
      heading: 'Contact for Legal Queries',
      content: [
        LEGAL_CONTACT_LINES,
      ],
    },
  ],
};

// ─── DISCLAIMER ───────────────────────────────────────────────────────────────
export const DISCLAIMER = {
  title: 'Disclaimer',
  badge: 'Legal Notice',
  lastUpdated: '1 July 2026',
  effectiveDate: '1 July 2026',
  metaTitle: `Disclaimer | ${BUSINESS.legalName}`,
  metaDescription: `Read the ${BUSINESS.primaryBrandName} legal disclaimer covering professional advisory limitations and website content usage.`,
  intro: `The information provided on this website (${WEBSITE_DOMAIN}) and by ${BUSINESS.legalName} is for general informational and educational purposes only. It does not constitute formal legal, tax, or financial advice. Please read this disclaimer carefully before relying on any content from this website.`,
  sections: [
    {
      heading: 'Not a Substitute for Professional Advice',
      content: [
        'The content published on this website, including articles, guides, FAQs, and blog posts, is intended to provide general awareness about corporate, legal, and tax matters in India. This content does not constitute specific professional advice tailored to your individual circumstances.',
        'Before making any legal, financial, or business decision, you should consult a qualified Chartered Accountant, Company Secretary, or legal professional for advice specific to your situation.',
      ],
    },
    {
      heading: 'Accuracy of Information',
      content: [
        `We make every reasonable effort to ensure that the information on this website is accurate and up to date. However, laws, regulations, and government procedures in India change frequently. ${BUSINESS.primaryBrandName} does not warrant that all information on this website is complete, accurate, or current at the time of your reading.`,
        'Users are advised to independently verify critical regulatory information from official government sources such as MCA21, the GST Portal, IP India, and the Income Tax Department website.',
      ],
    },
    {
      heading: 'No Attorney-Client Relationship',
      content: [
        'Visiting this website or submitting an inquiry form does not create an attorney-client, CA-client, or any other professional-client relationship. A formal professional engagement begins only upon execution of a service agreement and receipt of documented authorisation.',
      ],
    },
    {
      heading: 'Government Portal Dependencies',
      content: [
        `${BUSINESS.primaryBrandName} provides facilitation and advisory services for government registrations. Processing timelines and outcomes depend on government portals, regulatory authorities, and applicable laws — all of which are beyond our control. We do not guarantee specific approval outcomes.`,
      ],
    },
    {
      heading: 'External Links',
      content: [
        `This website may link to external government portals, third-party resources, or reference materials for your convenience. ${BUSINESS.primaryBrandName} does not endorse, verify, or take responsibility for the content or policies of any external websites.`,
      ],
    },
    {
      heading: 'Testimonials & Case Studies',
      content: [
        'Client testimonials and success stories shared on this website reflect individual experiences. Results may vary based on individual business circumstances, government processing, and applicable laws. Past performance does not guarantee future results.',
      ],
    },
    {
      heading: 'Limitation of Liability',
      content: [
        `${BUSINESS.legalName}, its partners, employees, and associates shall not be held liable for any loss, damage, or harm arising directly or indirectly from the use of information published on this website or from reliance on any content herein without independent professional verification.`,
      ],
    },
    {
      heading: 'Jurisdiction',
      content: [
        'This disclaimer is governed by the laws of India. Any dispute arising from the use of this website shall be subject to the jurisdiction of courts in New Delhi, India.',
      ],
    },
  ],
};

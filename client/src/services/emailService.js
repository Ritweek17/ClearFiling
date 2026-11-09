import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Standardized inquiry submission service.
 * Supports inquiries from both the Contact page and Service Detail pages.
 * Current transport: EmailJS Browser SDK.
 * Transport-independent contract designed for future migration to POST /api/leads.
 *
 * @param {Object} data - The inquiry payload.
 * @param {string} data.name - Prospect full name.
 * @param {string} [data.email] - Prospect email address (optional for quick phone consultations).
 * @param {string} data.phone - Prospect contact phone number.
 * @param {string} [data.company] - City, state, or company descriptor.
 * @param {string} [data.service] - Service category or name.
 * @param {string} [data.serviceTitle] - Formal title of the service.
 * @param {string} [data.serviceSlug] - URL slug of the service.
 * @param {string} [data.message] - User-supplied requirement message.
 * @param {string} [data.source] - Lead origin identifier (e.g. 'service-detail', 'contact-page').
 * @param {string} [data.pageUrl] - Canonical URL of the originating page.
 * @returns {Promise<{success: boolean, autoReplySent: boolean, autoReplyError?: string}>}
 */
export const sendInquiry = async (data) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !AUTOREPLY_TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('Email configuration is incomplete. Please check your environment variables.');
  }

  // Initialize EmailJS with public key
  emailjs.init(PUBLIC_KEY);

  const serviceIdentifier = data.serviceTitle || data.service || 'General Compliance';
  const companyOrLocation =
    data.company ||
    (data.city && data.state ? `${data.city}, ${data.state}` : '') ||
    (data.serviceTitle ? `Inquiry for ${data.serviceTitle}` : 'Direct Website Inquiry');

  // Format contextual message with metadata for admin notification
  let formattedMessage = (data.message || '').trim();
  const metaLines = [];
  if (data.serviceCategory) metaLines.push(`Category: ${data.serviceCategory}`);
  if (data.serviceTitle) metaLines.push(`Service: ${data.serviceTitle}`);
  if (data.serviceSlug) metaLines.push(`Slug: ${data.serviceSlug}`);
  if (data.subService) metaLines.push(`Sub-Service: ${data.subService}`);
  if (data.customRequirement) metaLines.push(`Requirement: ${data.customRequirement}`);
  if (data.state) metaLines.push(`State: ${data.state}`);
  if (data.city) metaLines.push(`City: ${data.city}`);
  if (data.source) metaLines.push(`Source: ${data.source}`);
  if (data.pageUrl) metaLines.push(`Page URL: ${data.pageUrl}`);

  if (metaLines.length > 0) {
    formattedMessage = formattedMessage
      ? `${formattedMessage}\n\n─── Lead Metadata ───\n${metaLines.join('\n')}`
      : `Direct consultation requested.\n\n─── Lead Metadata ───\n${metaLines.join('\n')}`;
  }

  const templateParams = {
    name: data.name ? data.name.trim() : '',
    email: data.email && data.email.trim() ? data.email.trim() : 'Not provided',
    phone: data.phone ? data.phone.trim() : '',
    company: companyOrLocation,
    service: serviceIdentifier,
    serviceCategory: data.serviceCategory || '',
    serviceTitle: data.serviceTitle || serviceIdentifier,
    serviceSlug: data.serviceSlug || '',
    subService: data.subService || '',
    customRequirement: data.customRequirement || '',
    state: data.state || '',
    city: data.city || '',
    source: data.source || '',
    pageUrl: data.pageUrl || '',
    message: formattedMessage,
  };

  // 1. Send the primary enquiry notification to admin (MANDATORY)
  const adminRes = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  if (adminRes.status !== 200) {
    throw new Error(`Failed to send inquiry: status ${adminRes.status}`);
  }

  // 2. Send the auto-reply confirmation email to visitor ONLY if valid email supplied
  let autoReplySent = false;
  let autoReplyError = null;

  const userEmail = data.email ? data.email.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (userEmail && emailRegex.test(userEmail)) {
    try {
      const autoReplyParams = {
        name: data.name ? data.name.trim() : '',
        email: userEmail,
        phone: data.phone ? data.phone.trim() : '',
        company: companyOrLocation,
        service: serviceIdentifier,
        message: data.message ? data.message.trim() : `Inquiry for ${serviceIdentifier}`,
      };

      const autoReplyRes = await emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, autoReplyParams);
      if (autoReplyRes.status === 200) {
        autoReplySent = true;
      } else {
        console.warn(`Auto-reply confirmation failed: status ${autoReplyRes.status}`);
        autoReplyError = `status ${autoReplyRes.status}`;
      }
    } catch (err) {
      // Auto-reply failure does NOT reject the lead submission since admin notification succeeded
      console.warn('Auto-reply confirmation error:', err);
      autoReplyError = err.message || 'Auto-reply dispatch failed';
    }
  }

  return {
    success: true,
    autoReplySent,
    ...(autoReplyError ? { autoReplyError } : {}),
  };
};

/**
 * Preserved export for Contact.jsx to maintain full backward compatibility.
 * Re-uses sendInquiry with contact-page metadata.
 *
 * @param {Object} data - Contact form payload from Contact.jsx.
 * @returns {Promise<{success: boolean}>}
 */
export const sendContactEmail = async (data) => {
  const location = data.company ||
    (data.city && data.state ? `${data.city}, ${data.state}` : (data.city || data.state || 'Direct Website Inquiry'));

  const result = await sendInquiry({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: location,
    state: data.state,
    city: data.city,
    serviceCategory: data.serviceCategory,
    service: data.serviceTitle || data.service,
    serviceTitle: data.serviceTitle || data.service,
    serviceSlug: data.serviceSlug,
    subService: data.subService,
    customRequirement: data.customRequirement,
    message: data.message,
    source: 'contact-page',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  });

  return { success: result.success };
};

export default { sendInquiry, sendContactEmail };

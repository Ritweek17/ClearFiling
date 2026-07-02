import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends the contact form inquiry using the EmailJS Browser SDK.
 * It sends two emails:
 * 1. An enquiry alert containing submission details.
 * 2. An auto-reply confirmation email to the visitor.
 *
 * @param {Object} data - The contact inquiry payload.
 * @param {string} data.name - Visitor's name.
 * @param {string} data.email - Visitor's email.
 * @param {string} data.phone - Visitor's phone number.
 * @param {string} data.company - Visitor's city/state (mapped to company).
 * @param {string} data.service - Selected service category.
 * @param {string} data.message - Custom message details.
 * @returns {Promise<{success: boolean}>}
 */
export const sendContactEmail = async (data) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !AUTOREPLY_TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('Email configuration is incomplete. Please check your environment variables.');
  }

  // Initialize EmailJS with public key
  emailjs.init(PUBLIC_KEY);

  const templateParams = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    service: data.service,
    message: data.message,
  };

  // 1. Send the primary enquiry notification
  const adminRes = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  if (adminRes.status !== 200) {
    throw new Error(`Failed to send inquiry: status ${adminRes.status}`);
  }

  // 2. Send the auto-reply confirmation email
  const autoReplyRes = await emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, templateParams);
  if (autoReplyRes.status !== 200) {
    console.warn(`Auto-reply confirmation failed: status ${autoReplyRes.status}`);
  }

  return { success: true };
};

export default { sendContactEmail };

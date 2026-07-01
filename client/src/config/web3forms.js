/**
 * web3forms.js — Web3Forms integration configuration.
 * The access key is read ONLY from the environment variable VITE_WEB3FORMS_ACCESS_KEY.
 * To change the key: update .env only. Never touch this file.
 *
 * Setup:
 *   1. Create client/.env
 *   2. Add:  VITE_WEB3FORMS_ACCESS_KEY=your_key_here
 *   3. Restart the dev server
 */

const WEB3FORMS_CONFIG = {
  /**
   * Access key from environment. If missing, returns null (form shows config error).
   * Never hardcode the key here.
   */
  get accessKey() {
    return import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || null;
  },

  endpoint: 'https://api.web3forms.com/submit',

  // Hidden fields sent with every submission
  subject: 'New Website Inquiry | Clear Filing',
  company: 'Clear Filing & Compliance LLP',
  redirectTo: 'https://clearfiling.in/contact?success=true',

  // UI copy
  messages: {
    configMissing: 'Form configuration missing. Please contact us directly at clearfilling@zohomail.in or call +91 9250201718.',
    success: 'Thank you! Your inquiry has been received. Our advisor will contact you within 2–4 business hours.',
    error: 'Unable to submit your inquiry right now. Please call us directly at +91 9250201718 or send a WhatsApp message.',
    submitting: 'Sending your inquiry...',
  },
};

export default WEB3FORMS_CONFIG;

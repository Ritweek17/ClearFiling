import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Badge from '../ui/Badge';

const FAQS = [
  // Company Registration
  {
    category: 'Company Registration',
    q: 'What is the difference between a Private Limited Company and an LLP?',
    a: 'A Private Limited Company (Pvt Ltd) offers shareholders limited liability protection and is governed by the Companies Act, 2013. An LLP (Limited Liability Partnership) combines the flexibility of a partnership with the protection of limited liability. Pvt Ltd is preferred for raising external funding and structured corporate governance, while LLP suits professional service firms seeking simpler compliance.',
  },
  {
    category: 'Company Registration',
    q: 'How long does it take to register a Private Limited Company in India?',
    a: 'With all documents in order, ClearFiling typically completes Private Limited Company registration within 5 to 7 working days. The process includes DIN allotment, name approval, and issuance of the Certificate of Incorporation by MCA.',
  },
  {
    category: 'Company Registration',
    q: 'What is the minimum capital requirement to register a company?',
    a: 'There is no mandatory minimum paid-up capital requirement under the Companies Act, 2013 to register a Private Limited Company. However, an authorized capital of ₹1 lakh is standard for initial incorporation.',
  },
  // GST
  {
    category: 'GST',
    q: 'Who is required to register for GST in India?',
    a: 'GST registration is mandatory for businesses whose annual turnover exceeds ₹40 lakhs (for goods) or ₹20 lakhs (for services). E-commerce operators, interstate suppliers, and import/export businesses must register regardless of turnover.',
  },
  {
    category: 'GST',
    q: 'How long does GST registration take?',
    a: 'Typically, ClearFiling completes GST registration within 3 to 7 working days once all required documents are submitted correctly. The government processes the application through the GST portal and issues the GSTIN electronically.',
  },
  {
    category: 'GST',
    q: 'Can I file GST returns after GST registration?',
    a: 'Yes, once registered, you are obligated to file regular GST returns — GSTR-1 (sales), GSTR-3B (summary return), and annual GSTR-9. ClearFiling also provides ongoing GST return filing services to keep you fully compliant.',
  },
  // Trademark
  {
    category: 'Trademark',
    q: 'Can I use the ™ symbol before trademark registration is complete?',
    a: 'Yes. You can use the ™ (TM) symbol as soon as you file the trademark application with IP India. The ® symbol can only be used after your trademark registration is officially granted, which typically takes 12 to 18 months.',
  },
  {
    category: 'Trademark',
    q: 'What is the validity of a registered trademark?',
    a: 'A registered trademark is valid for 10 years from the date of filing. It can be renewed indefinitely in successive 10-year periods by filing Form TM-R with the Registrar of Trademarks before the expiry date.',
  },
  // Compliance
  {
    category: 'Annual Compliance',
    q: 'What annual compliances must a Private Limited Company fulfill?',
    a: 'Every Private Limited Company must file annual returns (MGT-7 / MGT-7A) and financial statements (AOC-4) with the MCA. Additionally, audited accounts, board meeting minutes, AGM records, and director KYC (DIR-3 KYC) must be maintained and filed within prescribed timelines.',
  },
  {
    category: 'Annual Compliance',
    q: 'What happens if a company misses its annual compliance filings?',
    a: 'Non-filing of annual returns attracts late fees of ₹100 per day per form, which accumulates significantly. Persistent non-compliance can lead to the company being struck off the register by the Registrar of Companies (RoC). Directors may also face disqualification.',
  },
  // Income Tax
  {
    category: 'Income Tax',
    q: 'What is the income tax rate for a Private Limited Company?',
    a: 'The domestic company tax rate under Section 115BAB is 22% (plus applicable surcharge and cess), subject to certain conditions. New manufacturing companies may avail the concessional rate of 15%. ClearFiling helps you select the most tax-efficient slab applicable.',
  },
  {
    category: 'Income Tax',
    q: 'What is TDS and who needs to deduct it?',
    a: 'TDS (Tax Deducted at Source) is a tax collected at the time of payment. Businesses making specified payments — salary, rent, professional fees, contractor payments — exceeding prescribed thresholds are required to deduct TDS and deposit it to the government. ClearFiling helps with TDS registration, quarterly returns, and TDS certificates.',
  },
  {
    category: 'Income Tax',
    q: 'Do startups get any special income tax exemptions?',
    a: 'Yes. DPIIT-recognized startups can claim a 3-year income tax holiday under Section 80-IAC. Additionally, capital gains arising from investments in eligible startups may also qualify for exemptions under Section 54GB. ClearFiling assists with DPIIT recognition applications.',
  },
  // Business Consultation
  {
    category: 'Business Consultation',
    q: 'Which business structure is best for a new startup?',
    a: 'The right structure depends on your goals. A Private Limited Company is recommended if you plan to raise angel or VC funding, as it allows equity-based investment and has a globally recognized structure. An LLP works well for service-based businesses and professional firms. Our advisors offer a free consultation to guide you.',
  },
  {
    category: 'Business Consultation',
    q: 'How can ClearFiling help my business with post-registration support?',
    a: 'ClearFiling offers ongoing support including annual return filing, GST compliance, trademark renewal alerts, director KYC, Board meeting documentation, and HR compliance. Our advisors are available for queries via phone and WhatsApp throughout the year.',
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <div className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-sm">
    <button
      id={`faq-button-${index}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full text-left flex items-start justify-between gap-4 px-5 py-4 md:py-5 outline-none group"
    >
      <div className="flex items-start gap-3 flex-1">
        <span className={`mt-0.5 flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
          ${isOpen ? 'bg-brand-primary text-white' : 'bg-brand-primary/8 text-brand-primary'}`}>
          {faq.category}
        </span>
        <span className={`text-sm font-semibold font-heading transition-colors ${isOpen ? 'text-brand-primary' : 'text-brand-secondary'}`}>
          {faq.q}
        </span>
      </div>
      <ChevronDown
        className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-250 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 pt-1 text-sm text-slate-500 font-sans leading-relaxed border-t border-slate-100 bg-slate-50/40">
            {faq.a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <SectionContainer
      id="faq"
      bgType="default"
      animate={false}
      className="py-20 md:py-28 bg-brand-bg border-t border-slate-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-brand-accent/4 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="lg" className="space-y-14 px-4 md:px-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="light" className="font-bold tracking-wider text-[10px] py-1 px-3.5">
            Common Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-secondary tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-sans text-base leading-relaxed">
            Find clear, expert answers to the most commonly asked questions about registration, taxation, trademark, and compliance.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <FAQItem
              key={idx}
              faq={faq}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default FAQSection;

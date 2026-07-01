/**
 * resourcesContent.js
 * Centralized content for all Resource / Guide pages.
 * ResourcePageLayout renders these objects dynamically via /resources/:slug.
 */

export const RESOURCES = [
  // ── 1. Company Registration Guide ──────────────────────────────────────────
  {
    slug: 'company-registration',
    title: 'Complete Guide to Company Registration in India (2026)',
    category: 'Company Formation',
    intro: 'Registering a company in India is the first step toward building a legitimate, scalable business. This guide explains every type of business entity, the registration process, documents required, timelines, and costs — in clear, non-technical language.',
    readTime: '8 min read',
    tags: ['Company Registration', 'MCA', 'Private Limited', 'LLP'],
    metaTitle: 'Company Registration in India 2026 | Complete Step-by-Step Guide | ClearFiling',
    metaDescription: 'Learn how to register a Private Limited Company, LLP, or OPC in India. Full guide on process, documents, fees, and timelines.',
    sections: [
      {
        heading: 'Why Register Your Business?',
        content: [
          'Operating as a registered business entity offers significant advantages over running an unregistered sole proprietorship. A registered company enjoys limited liability protection, which means the personal assets of founders are shielded from business debts.',
          'Additionally, registered companies can open dedicated bank accounts, raise institutional funding, enter into formal contracts, apply for government tenders, and are perceived as more credible by customers, vendors, and financial institutions.',
        ],
      },
      {
        heading: 'Types of Business Entities in India',
        content: [
          'The most common business structures for registration in India include:',
          [
            'Private Limited Company (Pvt Ltd): Best for startups seeking investment, scalability, and structured governance. Governed by the Companies Act, 2013.',
            'Limited Liability Partnership (LLP): Ideal for professional service firms and small businesses. Combines partnership flexibility with limited liability.',
            'One Person Company (OPC): Suited for solo founders who want limited liability without a co-founder.',
            'Partnership Firm: Suitable for small traditional businesses. Easier to form but no limited liability protection.',
            'Sole Proprietorship: The simplest form — no formal registration required, but offers no liability protection.',
          ],
        ],
      },
      {
        heading: 'How to Register a Private Limited Company',
        content: [
          'Step 1 — Obtain a Digital Signature Certificate (DSC): Every proposed director must obtain a Class-3 DSC from a certified authority.',
          'Step 2 — Obtain Director Identification Number (DIN): Apply through the MCA SPICe+ form. DIN is the unique identity number for each director.',
          'Step 3 — Name Approval via RUN: Apply for name reservation through the MCA\'s Reserve Unique Name (RUN) service. Names must comply with the Companies Act naming rules.',
          'Step 4 — File SPICe+ Form: Submit the integrated incorporation form along with the Memorandum of Association (MoA) and Articles of Association (AoA).',
          'Step 5 — Receive Certificate of Incorporation (CIN): The Registrar of Companies issues a digitally signed Certificate of Incorporation, confirming your company\'s legal existence.',
        ],
      },
      {
        heading: 'Documents Required',
        content: [
          'For incorporating a Private Limited Company, you will need:',
          ['PAN card and Aadhaar of all directors and shareholders', 'Passport-size photographs of all directors', 'Latest bank statement or utility bill as address proof (not older than 2 months)', 'Electricity bill or NOC for the registered office address', 'Rental agreement if the registered office is rented'],
        ],
      },
      {
        heading: 'Typical Timeline & Fees',
        content: [
          'With all documents in order, ClearFiling typically completes a Private Limited Company registration within 5–7 working days. Government fees depend on the authorised capital of the company. Professional fees vary based on complexity.',
          'MSME-certified companies may benefit from certain reduced fee structures during specific government schemes.',
        ],
      },
      {
        heading: 'Post-Registration Compliance',
        content: [
          'After incorporation, your company must fulfill the following immediate obligations:',
          ['Open a current bank account in the company\'s name', 'Commence business within 180 days of incorporation (INC-20A filing)', 'Apply for GST registration if turnover threshold is met', 'Maintain statutory registers and minute books', 'File annual returns (MGT-7) and financial statements (AOC-4) each year'],
        ],
      },
    ],
    keyPoints: [
      'Private Limited Company is the most preferred structure for funded startups.',
      'Minimum 2 directors and 2 shareholders required for a Pvt Ltd company.',
      'DIN and DSC are mandatory prerequisites for director onboarding.',
      'Government processing on MCA21 portal typically takes 3–5 working days.',
      'ClearFiling handles end-to-end registration with a dedicated advisor.',
    ],
    faqs: [
      { q: 'How many directors are required to form a Private Limited Company?', a: 'A minimum of 2 directors and a maximum of 15 directors are required. At least one director must be a resident Indian.' },
      { q: 'Can a foreign national be a director in an Indian company?', a: 'Yes, foreign nationals can be directors, but at least one director on the board must be an Indian resident (a person who has stayed in India for at least 182 days in the preceding calendar year).' },
      { q: 'Is there a minimum capital requirement?', a: 'No. There is no mandatory minimum paid-up capital under the Companies Act, 2013. Most companies start with an authorised capital of ₹1 lakh.' },
      { q: 'What is the difference between authorised and paid-up capital?', a: 'Authorised capital is the maximum share capital a company can issue. Paid-up capital is the amount actually paid by shareholders. You can increase authorised capital later by passing a resolution and paying additional government fees.' },
    ],
    relatedResources: [
      { slug: 'gst-guide', title: 'GST Registration Guide' },
      { slug: 'startup-guide', title: 'Startup Recognition Guide' },
      { slug: 'compliance-guide', title: 'Annual Compliance Guide' },
    ],
    relatedServices: [
      { slug: 'private-limited-company', title: 'Private Limited Company Registration' },
      { slug: null, title: 'LLP Registration' },
      { slug: null, title: 'OPC Registration' },
    ],
  },

  // ── 2. GST Guide ────────────────────────────────────────────────────────────
  {
    slug: 'gst-guide',
    title: 'GST Registration & Filing Guide for Indian Businesses (2026)',
    category: 'Taxation',
    intro: 'The Goods and Services Tax (GST) is India\'s unified indirect tax system. This guide covers GST registration eligibility, the registration process, return filing schedules, and common compliance mistakes to avoid.',
    readTime: '7 min read',
    tags: ['GST', 'Taxation', 'GSTIN', 'Compliance'],
    metaTitle: 'GST Registration Guide 2026 | How to Apply Online | ClearFiling',
    metaDescription: 'Complete guide to GST registration in India. Learn who must register, documents required, how to file returns, and avoid penalties.',
    sections: [
      {
        heading: 'What is GST?',
        content: [
          'GST (Goods and Services Tax) is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. It replaced a complex web of central and state indirect taxes including VAT, service tax, excise duty, and others.',
          'GST has four slabs: 5%, 12%, 18%, and 28%, with some goods and services being exempt or zero-rated. The tax is collected at every stage of supply but the burden ultimately falls on the final consumer.',
        ],
      },
      {
        heading: 'Who Must Register for GST?',
        content: [
          'GST registration is mandatory for:',
          [
            'Businesses with aggregate annual turnover exceeding ₹40 lakhs (for goods) or ₹20 lakhs (for services)',
            'Businesses in special category states with turnover above ₹10 lakhs',
            'Interstate suppliers of goods or services regardless of turnover',
            'E-commerce operators and sellers on e-commerce platforms',
            'Importers and exporters of goods and services',
            'Businesses liable to pay tax under reverse charge mechanism',
            'Casual taxable persons or non-resident taxable persons',
          ],
        ],
      },
      {
        heading: 'Documents Required for GST Registration',
        content: [
          ['PAN card of the applicant (individual or business)', 'Aadhaar card of the authorised signatory', 'Business registration certificate (for companies: CIN; for LLP: LLPIN)', 'Bank account statement or cancelled cheque', 'Electricity bill or rent agreement for principal place of business', 'Digital signature (for companies and LLPs)', 'Photographs of the authorised signatory'],
        ],
      },
      {
        heading: 'The GST Registration Process',
        content: [
          'Step 1 — Generate TRN: File Part A of the GST REG-01 form on the GST portal. An OTP-verified Temporary Reference Number (TRN) is generated.',
          'Step 2 — Complete Part B: Submit business details, document uploads, and digital signature in Part B within 15 days of TRN generation.',
          'Step 3 — ARN Generated: An Application Reference Number (ARN) confirms your application has been submitted and is under scrutiny.',
          'Step 4 — GSTIN Allotted: After GST officer verification (typically 3–7 working days), your 15-digit GSTIN is issued electronically.',
        ],
      },
      {
        heading: 'GST Return Filing Obligations',
        content: [
          'Once registered, GST-registered businesses must file the following returns:',
          [
            'GSTR-1: Monthly or quarterly outward supplies (sales) return',
            'GSTR-3B: Monthly summary return with tax payment',
            'GSTR-9: Annual consolidated return (due by 31 December each year)',
            'GSTR-4: Annual return for Composition Scheme taxpayers',
          ],
          'Late filing attracts a daily late fee of ₹50 (₹25 CGST + ₹25 SGST) per day, subject to a maximum limit. Non-filing can lead to GST registration cancellation.',
        ],
      },
      {
        heading: 'GST for E-Commerce & Startups',
        content: [
          'All sellers on platforms like Amazon, Flipkart, Meesho, and Myntra must mandatorily register for GST, regardless of their annual turnover. E-commerce aggregators collect TCS (Tax Collected at Source) at 1% on behalf of sellers.',
          'DPIIT-recognized startups are still required to register for GST once turnover thresholds are met. There are no GST turnover exemptions specifically for DPIIT startups.',
        ],
      },
    ],
    keyPoints: [
      'GST registration is mandatory for interstate supply regardless of turnover.',
      'You can apply for voluntary GST registration even below the threshold.',
      'Input Tax Credit (ITC) allows you to offset GST paid on purchases against GST collected on sales.',
      'Regular filers must file GSTR-1 and GSTR-3B every month.',
      'ClearFiling handles GST registration + return filing services end-to-end.',
    ],
    faqs: [
      { q: 'Can I register for GST if my turnover is below ₹20 lakhs?', a: 'Yes, you can voluntarily register for GST even if your turnover is below the mandatory threshold. This is beneficial if you want to claim Input Tax Credit or sell to GST-registered businesses.' },
      { q: 'What is the Composition Scheme under GST?', a: 'The Composition Scheme allows small taxpayers with turnover up to ₹1.5 crore to pay GST at a flat rate and file simplified quarterly returns instead of monthly returns. They cannot claim ITC and cannot issue tax invoices.' },
      { q: 'What happens if I miss a GST return due date?', a: 'Late filing attracts a daily fee of ₹50 per return per day (₹25 CGST + ₹25 SGST). Persistent non-compliance can lead to GST registration suspension or cancellation.' },
    ],
    relatedResources: [
      { slug: 'company-registration', title: 'Company Registration Guide' },
      { slug: 'compliance-guide', title: 'Annual Compliance Guide' },
    ],
    relatedServices: [
      { slug: 'gst-registration', title: 'GST Registration' },
      { slug: null, title: 'GST Return Filing' },
    ],
  },

  // ── 3. Trademark Guide ──────────────────────────────────────────────────────
  {
    slug: 'trademark-guide',
    title: 'Trademark Registration in India — Complete Guide (2026)',
    category: 'Intellectual Property',
    intro: 'A registered trademark is one of the most valuable business assets you can own. This guide explains what a trademark is, how to file an application in India, trademark classes, timelines, and how to protect your brand legally.',
    readTime: '6 min read',
    tags: ['Trademark', 'IP India', 'Brand Protection', 'TM'],
    metaTitle: 'Trademark Registration Guide India 2026 | Brand Protection | ClearFiling',
    metaDescription: 'Learn how to register a trademark in India. Step-by-step guide covering classes, process, timelines, and brand protection strategies.',
    sections: [
      {
        heading: 'What is a Trademark?',
        content: [
          'A trademark is a distinctive sign, symbol, word, logo, phrase, or combination thereof that identifies the goods or services of one business and distinguishes them from those of others. Trademarks are registered under the Trade Marks Act, 1999 and managed by the IP India portal under the Ministry of Commerce.',
          'A registered trademark allows you to use the ® symbol, which signals legal ownership and deters competitors from copying your brand identity.',
        ],
      },
      {
        heading: 'Benefits of Trademark Registration',
        content: [
          ['Legal exclusive ownership over your brand name or logo', 'Right to use the ™ symbol immediately upon filing and ® upon registration', 'Ability to take legal action against brand infringers', 'Builds brand equity and increases business valuation', 'Creates a licensable, assignable intellectual property asset', '50% government fee concession for MSME-registered entities'],
        ],
      },
      {
        heading: 'Understanding Trademark Classes (Nice Classification)',
        content: [
          'India follows the International Nice Classification, which divides all goods and services into 45 classes (Classes 1–34 for goods, Classes 35–45 for services). You must file your trademark application in the class relevant to your business.',
          'For example: Software companies typically file under Class 42. Clothing brands file under Class 25. Food products fall under Class 30. A business can file in multiple classes if it offers goods/services across categories.',
        ],
      },
      {
        heading: 'How to Register a Trademark in India',
        content: [
          'Step 1 — Trademark Search: Conduct a thorough search on the IP India trademark database to check for identical or phonetically similar existing marks.',
          'Step 2 — Identify the Correct Class: Determine the appropriate trademark class(es) for your goods or services.',
          'Step 3 — File Form TM-A: File the trademark application on the IP India portal with the required fee (₹4,500 for individuals/startups/MSMEs; ₹9,000 for companies).',
          'Step 4 — Examination: The trademark registry examines the application and may issue an examination report with objections.',
          'Step 5 — Journal Publication: If approved, the mark is published in the Trademark Journal for 4 months, during which third parties can file opposition.',
          'Step 6 — Registration Certificate: If no opposition is filed or opposition is resolved in your favour, the trademark registration certificate is issued.',
        ],
      },
      {
        heading: 'Timeline for Trademark Registration',
        content: [
          'The ™ symbol can be used immediately upon filing. The full ® registration typically takes 12–24 months, depending on examination timelines and any opposition proceedings.',
          'ClearFiling files your application within 24 hours of document submission.',
        ],
      },
    ],
    keyPoints: [
      'Use ™ immediately after filing — you do not need to wait for registration.',
      'MSME registration entitles you to a 50% government fee discount.',
      'A trademark is valid for 10 years and can be renewed indefinitely.',
      'Conduct a trademark search before launching your brand to avoid conflicts.',
      'ClearFiling provides complete trademark filing, response, and monitoring services.',
    ],
    faqs: [
      { q: 'Can I trademark my personal name?', a: 'Yes, personal names can be trademarked for commercial use, provided they are distinctive enough and not likely to be confused with an existing registered mark.' },
      { q: 'What if my trademark application is objected to?', a: 'You must file a response to the examination report within 30 days. If required, you may be called for a hearing. ClearFiling helps draft and file examination replies.' },
      { q: 'Can I trademark a common English word?', a: 'Generic and purely descriptive words cannot be trademarked. However, invented words, misspellings, or words with acquired distinctiveness may qualify.' },
    ],
    relatedResources: [
      { slug: 'company-registration', title: 'Company Registration Guide' },
      { slug: 'startup-guide', title: 'Startup Recognition Guide' },
    ],
    relatedServices: [
      { slug: 'trademark-registration', title: 'Trademark Registration' },
      { slug: null, title: 'Trademark Renewal' },
    ],
  },

  // ── 4. Compliance Guide ─────────────────────────────────────────────────────
  {
    slug: 'compliance-guide',
    title: 'Annual Compliance Guide for Indian Companies & LLPs (2026)',
    category: 'Compliance',
    intro: 'After registering your company, annual compliance is not optional — it is legally mandatory. This guide covers all annual compliance obligations for Private Limited Companies and LLPs, including MCA filings, tax returns, and director KYC.',
    readTime: '7 min read',
    tags: ['Annual Compliance', 'ROC Filings', 'MCA', 'Companies Act'],
    metaTitle: 'Annual Compliance Guide for Companies & LLPs India 2026 | ClearFiling',
    metaDescription: 'Complete annual compliance checklist for Private Limited Companies and LLPs in India. Learn about ROC filings, tax returns, and due dates.',
    sections: [
      {
        heading: 'Why Annual Compliance Matters',
        content: [
          'Compliance with the Companies Act, 2013 and LLP Act, 2008 is not merely a legal formality. Failure to comply attracts heavy daily late fees, director disqualification, and in extreme cases, company strike-off from the MCA database.',
          'Maintaining clean compliance records also improves your company\'s credibility with banks, investors, and regulatory authorities.',
        ],
      },
      {
        heading: 'Key Annual Compliance for Private Limited Companies',
        content: [
          ['Board Meetings: Minimum 4 board meetings per year; first meeting within 30 days of incorporation', 'Annual General Meeting (AGM): Mandatory AGM within 6 months of financial year end', 'AOC-4 (Financial Statements Filing): Due within 30 days of AGM', 'MGT-7A (Annual Return Filing): Due within 60 days of AGM', 'Income Tax Return: Company ITR-6 due by 31 October each year', 'DIR-3 KYC: Annual KYC for each director — due by 30 September every year', 'Statutory Audit: Mandatory annual audit by a registered CA'],
        ],
      },
      {
        heading: 'Key Annual Compliance for LLPs',
        content: [
          ['LLP Form 11 (Annual Return): Due by 30 May every year', 'LLP Form 8 (Statement of Accounts): Due by 30 October every year', 'Income Tax Return for LLP: Due by 31 October (if audit required)', 'Statutory Audit: Required if turnover exceeds ₹40 lakhs or capital contribution exceeds ₹25 lakhs'],
        ],
      },
      {
        heading: 'Consequences of Non-Compliance',
        content: [
          'Non-filing of annual returns and financial statements with MCA attracts a late fee of ₹100 per day per form. For companies with significant capital, this can accumulate to lakhs of rupees.',
          'Directors of non-compliant companies may be disqualified from acting as directors in other companies for up to 5 years under Section 164(2) of the Companies Act, 2013.',
        ],
      },
      {
        heading: 'Other Compliance Areas',
        content: [
          'Beyond MCA filings, companies must maintain compliance across:',
          ['GST monthly/quarterly return filing', 'TDS (Tax Deducted at Source) quarterly returns', 'Professional tax registration and payment (state-specific)', 'Employee Provident Fund (EPF) and ESI registration (once workforce exceeds 20)', 'Labour law compliance and payroll processing'],
        ],
      },
    ],
    keyPoints: [
      'A Private Limited Company must hold at least 4 board meetings per year.',
      'Annual returns (MGT-7A) and financial statements (AOC-4) must be filed every year.',
      'Director KYC (DIR-3 KYC) must be completed by 30 September annually.',
      'Missed filings attract ₹100 per day late fees — these accumulate quickly.',
      'ClearFiling provides full-year annual compliance packages at flat pricing.',
    ],
    faqs: [
      { q: 'What is the due date for filing annual returns for a company?', a: 'MGT-7A (Annual Return) is due within 60 days of the AGM. AOC-4 (Financial Statements) is due within 30 days of the AGM. For most companies with a financial year ending 31 March, the AGM must be held by 30 September.' },
      { q: 'What happens if a company is struck off from the MCA register?', a: 'A struck-off company loses its legal existence. Directors may be disqualified. Restoration requires filing a revival petition with the NCLT, which is a costly and time-consuming process.' },
    ],
    relatedResources: [
      { slug: 'company-registration', title: 'Company Registration Guide' },
      { slug: 'gst-guide', title: 'GST Guide' },
    ],
    relatedServices: [
      { slug: null, title: 'Annual ROC Compliance' },
      { slug: null, title: 'Income Tax Filing' },
    ],
  },

  // ── 5. Startup Guide ────────────────────────────────────────────────────────
  {
    slug: 'startup-guide',
    title: 'Startup India Recognition (DPIIT) — Complete Guide (2026)',
    category: 'Startup',
    intro: 'The Startup India initiative launched by the Government of India provides significant benefits to eligible startups — from tax exemptions to easier winding-up procedures. This guide explains how to get DPIIT recognition and what benefits it unlocks.',
    readTime: '6 min read',
    tags: ['Startup India', 'DPIIT', 'Tax Exemption', 'Funding'],
    metaTitle: 'Startup India DPIIT Recognition Guide 2026 | Benefits & Application | ClearFiling',
    metaDescription: 'Learn how to get DPIIT startup recognition in India. Step-by-step guide on eligibility, application, and tax benefits for recognized startups.',
    sections: [
      {
        heading: 'What is Startup India Recognition?',
        content: [
          'The Department for Promotion of Industry and Internal Trade (DPIIT) under the Ministry of Commerce recognizes eligible businesses as "Startups" under the Startup India Policy. This recognition unlocks several financial, regulatory, and tax benefits.',
          'DPIIT recognition is not the same as company registration — it is an additional certification that a registered company or LLP must apply for separately.',
        ],
      },
      {
        heading: 'Eligibility Criteria for DPIIT Recognition',
        content: [
          ['The entity must be incorporated as a Private Limited Company, LLP, or Partnership Firm', 'Age of the entity should not exceed 10 years from the date of incorporation', 'Annual turnover should not have exceeded ₹100 crore in any previous financial year', 'The entity must be working towards innovation, development, deployment, or commercialisation of new products, processes, or services driven by technology or intellectual property', 'The entity must not have been formed by splitting or reconstructing an existing business'],
        ],
      },
      {
        heading: 'Key Benefits of DPIIT Recognition',
        content: [
          ['3-Year Income Tax Holiday: Under Section 80-IAC, recognized startups can claim a 100% deduction on profits for 3 consecutive years out of the first 10 years', 'Exemption from Angel Tax: Investments received from recognized investors are exempt from Section 56(2)(viib) of the Income Tax Act', '50% reduction in trademark government fees', 'Faster insolvency resolution (90-day process)', 'Self-certification under labour and environmental laws', 'Priority access to government procurement through GeM portal', 'Eligible for SIDBI Fund of Funds for funding support'],
        ],
      },
      {
        heading: 'How to Apply for DPIIT Recognition',
        content: [
          'Step 1: Register on the Startup India portal at startupindia.gov.in',
          'Step 2: Complete the online application form with details about your company, business model, and innovation.',
          'Step 3: Upload the required documents — Certificate of Incorporation, PAN, and a brief description of the startup\'s innovative nature.',
          'Step 4: Submit the application. DPIIT recognition is typically issued within 2–3 working days for straightforward applications.',
          'ClearFiling assists with the complete DPIIT application, including drafting the innovation description that meets the recognition criteria.',
        ],
      },
    ],
    keyPoints: [
      'DPIIT recognition is free of charge — only a government portal application is needed.',
      'A startup must be genuinely innovative to qualify — purely trading businesses are not eligible.',
      'The 80-IAC income tax benefit must be separately applied for after DPIIT recognition.',
      'DPIIT recognition does not automatically exempt you from GST or other tax obligations.',
      'ClearFiling handles complete DPIIT applications with a high approval rate.',
    ],
    faqs: [
      { q: 'Does DPIIT recognition exempt a startup from filing annual returns?', a: 'No. DPIIT recognition does not exempt a startup from filing annual returns, GST returns, income tax returns, or MCA compliance. Annual compliance obligations remain the same.' },
      { q: 'Can a service-based company get DPIIT recognition?', a: 'Yes, service-based companies can be recognized if they offer innovative technology-driven services. Pure commodity trading or reselling businesses generally do not qualify.' },
    ],
    relatedResources: [
      { slug: 'company-registration', title: 'Company Registration Guide' },
      { slug: 'compliance-guide', title: 'Annual Compliance Guide' },
    ],
    relatedServices: [
      { slug: 'private-limited-company', title: 'Private Limited Company Registration' },
      { slug: null, title: 'MSME Registration' },
    ],
  },

  // ── 6. Business Resources ───────────────────────────────────────────────────
  {
    slug: 'business-resources',
    title: 'Business Resources & Compliance Toolkit for Indian Entrepreneurs',
    category: 'Business Resources',
    intro: 'A curated collection of practical checklists, guides, and reference material for Indian business owners — from pre-incorporation planning to annual compliance management.',
    readTime: '5 min read',
    tags: ['Business Setup', 'Checklist', 'Resources', 'Compliance'],
    metaTitle: 'Business Resources & Toolkit for Indian Entrepreneurs | ClearFiling',
    metaDescription: 'Access business checklists, regulatory guides, and compliance resources for Indian startups and MSMEs. ClearFiling expert toolkit.',
    sections: [
      {
        heading: 'Pre-Incorporation Checklist',
        content: [
          'Before you register a company, ensure you have clarity on:',
          ['Business name — check availability on MCA and IP India trademark database', 'Business structure — Pvt Ltd, LLP, OPC, or Partnership', 'Director and shareholder details — minimum 2 for Pvt Ltd', 'Registered office address — can be a home address initially', 'Proposed business objects — clearly define your main business activity', 'Capital structure — initial authorised capital of ₹1 lakh is standard'],
        ],
      },
      {
        heading: 'Annual Compliance Calendar',
        content: [
          ['Jan–Mar: TDS quarterly return (Q3), advance tax payment', 'Apr–Jun: TDS quarterly return (Q4), DIR-3 KYC update', 'Jul–Sep: Income Tax Return filing, AGM, TDS Q1 return', 'Oct–Dec: AOC-4 and MGT-7A filing, TDS Q2 return, GST Annual Return (GSTR-9)'],
        ],
      },
      {
        heading: 'Key Government Portals for Business Compliance',
        content: [
          ['MCA21 Portal: mca.gov.in — Company registrations, annual filings, DIN services', 'GST Portal: gst.gov.in — GST registration, return filing, refund claims', 'Income Tax Portal: incometax.gov.in — ITR filing, TDS returns, tax payments', 'IP India: ipindia.gov.in — Trademark, copyright, patent registrations', 'Udyam Portal: udyamregistration.gov.in — MSME registration', 'Startup India: startupindia.gov.in — DPIIT recognition applications'],
        ],
      },
      {
        heading: 'Common Compliance Mistakes to Avoid',
        content: [
          ['Missing annual return filing deadlines (₹100/day late fees)', 'Not updating the registered office address with MCA after moving', 'Failing to complete DIR-3 KYC before the 30 September deadline', 'Not filing GST returns for nil months (you must file \'nil\' returns even with no business)', 'Mixing personal and business finances — always use a separate business bank account'],
        ],
      },
    ],
    keyPoints: [
      'Plan compliance obligations before incorporating — not after.',
      'Use a compliance calendar to track all government due dates.',
      'GST returns must be filed every month even if there is no transaction.',
      'ClearFiling offers annual compliance packages that cover all mandatory filings.',
      'Delegate compliance to professionals so you can focus on business growth.',
    ],
    faqs: [
      { q: 'How much does it cost to maintain a Private Limited Company per year?', a: 'Annual compliance costs typically include: statutory audit fees, CA fees for ITR filing, ROC annual filing fees, and professional fees for compliance management. ClearFiling offers transparent flat-rate annual packages.' },
    ],
    relatedResources: [
      { slug: 'company-registration', title: 'Company Registration Guide' },
      { slug: 'compliance-guide', title: 'Annual Compliance Guide' },
      { slug: 'gst-guide', title: 'GST Guide' },
    ],
    relatedServices: [
      { slug: null, title: 'Annual ROC Compliance' },
      { slug: 'private-limited-company', title: 'Private Limited Company Registration' },
    ],
  },
];

// Helper to get resource by slug
export const getResourceBySlug = (slug) => RESOURCES.find(r => r.slug === slug);

export default RESOURCES;

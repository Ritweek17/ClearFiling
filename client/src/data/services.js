import { 
  Building2, 
  Briefcase, 
  FileCheck2, 
  ShieldAlert, 
  DollarSign, 
  FileSpreadsheet, 
  Scale, 
  HelpCircle, 
  Stamp, 
  BookOpen, 
  TrendingUp, 
  UserCheck,
  Globe,
  Award,
  Lock,
  Landmark,
  Zap,
  CheckCircle2,
  Laptop,
  ShoppingCart,
  Code
} from 'lucide-react';

export const CATEGORIES = [
  'Business Formation',
  'Business Registrations',
  'Trademark & Intellectual Property',
  'GST & Indirect Tax',
  'Income Tax Services',
  'Corporate Compliance',
  'International Business Services',
  'Digital Solutions',
  'Loan Services'
];

export const SERVICES = [
  // ==========================================
  // BUSINESS FORMATION (8 Services)
  // ==========================================
  {
    id: 'private-limited-company',
    slug: 'private-limited-company',
    category: 'Business Formation',
    title: 'Private Limited Company',
    shortDescription: 'Incorporate a Private Limited Company online in India. High credibility, limited liability, and separate legal entity.',
    description: 'The Private Limited Company is the most popular corporate structure for high-growth startups and SMEs in India. It offers limited liability protection, separates personal and business assets, and makes raising venture capital seamless.',
    longDescription: 'Registering a Private Limited Company is the primary choice for businesses aiming to raise venture capital or offer ESOPs to employees. It is recognized as a separate legal entity, guaranteeing that the founders personal liabilities are strictly limited to their shares. With ClearFiling, we guide you through name approvals on the MCA portal, DSC creation, drafting the memorandum & articles of association, and receiving the final Certificate of Incorporation together with PAN & TAN cards.',
    metaTitle: 'Private Limited Company Registration Online India | ClearFiling',
    metaDescription: 'Register a Private Limited Company online in India with ClearFiling. Handled by verified CAs & CSs. Fast name approvals and company incorporation.',
    keywords: ['pvt ltd', 'company registration', 'incorporation', 'formation', 'startup registration', 'register company', 'pvt ltd setup'],
    iconName: 'Building2',
    featured: true,
    processingTime: '7 - 10 Business Days',
    timeline: '7 - 10 Business Days',
    heroTitle: 'Private Limited Company Registration',
    heroDescription: 'Incorporate your startup as a Private Limited Company in 7 to 10 days. Get Certificate of Incorporation, PAN, TAN, and business bank account assistance, guided step-by-step by senior CAs.',
    ctaTitle: 'Ready to Register Your Private Limited Company?',
    ctaDescription: 'Launch your business with complete compliance confidence. Get in touch with our corporate compliance lawyers today.',
    requiredDocuments: [
      'PAN & Aadhaar of all Directors',
      'Proof of Identity (Voter ID, Passport, or DL)',
      'Bank Statement (not older than 2 months)',
      'Registered Office Rent Agreement & Utility Bill'
    ],
    benefits: [
      'Limited liability protection for shareholders',
      'High credibility with institutional investors and banks',
      'Easy transferability of shares and perpetual succession',
      'Separate legal identity from its owners'
    ],
    eligibility: [
      'Startups planning to raise equity funding',
      'Sole proprietors wanting to convert to corporate structures',
      'Partnership firms scale-up projects',
      'E-commerce businesses listing on major marketplaces'
    ],
    process: [
      { step: 'Step 1', title: 'DSC & DIN Issuance', desc: 'Secure Class 3 Digital Signature Certificates and Director Identification Numbers (DIN) for all proposed directors.' },
      { step: 'Step 2', title: 'MCA Name Reservation', desc: 'File name approval request via SPICe+ Part A on the MCA portal to secure a unique, brand-aligned name.' },
      { step: 'Step 3', title: 'Deed & Constitution Draft', desc: 'Draft the Memorandum of Association (MOA) and Articles of Association (AOA) outlining business scope and share rules.' },
      { step: 'Step 4', title: 'Final SPICe+ Filing', desc: 'Submit incorporation documents, pay PAN/TAN fees, and secure the Certificate of Incorporation (COI).' }
    ],
    faqReference: [
      { q: 'How many directors are required for a Pvt Ltd?', a: 'A minimum of two directors are required to register a Private Limited Company in India.' },
      { q: 'Is physical presence required for registration?', a: 'No, the entire process is 100% online. You do not need to visit any government office.' }
    ],
    faqs: [
      { q: 'How many directors are required for a Pvt Ltd?', a: 'A minimum of two directors are required to register a Private Limited Company in India.' },
      { q: 'Is physical presence required for registration?', a: 'No, the entire process is 100% online. You do not need to visit any government office.' },
      { q: 'What is the minimum capital required to start?', a: 'There is no statutory minimum capital requirement; you can start with a nominal authorized capital like ₹10,000.' }
    ],
    relatedServices: [
      { id: 'llp-registration', title: 'LLP Registration' },
      { id: 'opc-registration', title: 'OPC Registration' },
      { id: 'gst-registration', title: 'GST Registration' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/private-limited-company',
    futurePage: '/services/private-limited-company'
  },
  {
    id: 'llp-registration',
    slug: 'llp-registration',
    category: 'Business Formation',
    title: 'LLP Registration',
    shortDescription: 'Incorporate a Limited Liability Partnership (LLP) online. Fits service startups and consulting firms.',
    description: 'Limited Liability Partnership (LLP) combines the advantages of a corporate structure with the internal flexibility of a partnership. It protects partners from individual liabilities arising from negligence of other partners.',
    metaTitle: 'LLP Registration Online India | Limited Liability Partnership | ClearFiling',
    metaDescription: 'Register your LLP in India in a few simple steps. Professional LLP agreement drafting and compliance registration handled by compliance experts.',
    keywords: ['llp registration', 'llp setup', 'limited liability partnership', 'incorporation', 'partnership registration'],
    iconName: 'Scale',
    featured: true,
    processingTime: '8 - 12 Business Days',
    requiredDocuments: [
      'PAN & Aadhaar of all Partners',
      'Proof of Address of Partners',
      'NOC from property owner for registered address',
      'Electricity Bill of business place'
    ],
    benefits: [
      'No minimum capital requirement',
      'Fewer compliance regulations compared to private companies',
      'Personal assets of partners are protected from business debts',
      'Audit not mandatory for small turnover firms'
    ],
    faqReference: [
      { q: 'What is the minimum capital for an LLP?', a: 'There is no statutory minimum capital requirement for establishing an LLP.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/llp-registration',
    futurePage: '/services/llp-registration'
  },
  {
    id: 'opc-registration',
    slug: 'opc-registration',
    category: 'Business Formation',
    title: 'OPC Registration',
    shortDescription: 'Register a One Person Company (OPC). Ideal for solo founders wanting corporate protection.',
    description: 'One Person Company allows a single promoter to run a corporate entity with limited liability. It provides the legal structure of a company without the requirement of finding a second director/shareholder.',
    metaTitle: 'One Person Company (OPC) Registration Online | ClearFiling',
    metaDescription: 'Register your One Person Company online. Access the benefits of limited liability under sole proprietorship with professional CA support.',
    keywords: ['opc registration', 'one person company', 'solo founder company', 'opc setup', 'register opc'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '7 - 10 Business Days',
    requiredDocuments: ['PAN & Aadhaar of the Promoter', 'Nominee Consent Form & KYC details', 'Address Proof of Registered Premises'],
    benefits: ['Single owner control', 'Separate legal entity protection', 'Limited personal liability'],
    faqReference: [{ q: 'Is a Nominee mandatory for OPC?', a: 'Yes, a nominee must be appointed in case of death or disability of the sole promoter.' }],
    canonicalSlug: 'https://clearfiling.in/services/opc-registration',
    futurePage: '/services/opc-registration'
  },
  {
    id: 'partnership-firm',
    slug: 'partnership-firm',
    category: 'Business Formation',
    title: 'Partnership Firm',
    shortDescription: 'Register a Partnership Firm. Draft partnership deeds and complete register office setup.',
    description: 'A traditional business structure managed by two or more individuals. While it lacks limited liability, it remains highly popular due to simple setup and minimal regulatory compliances.',
    metaTitle: 'Partnership Firm Registration & Deed Drafting | ClearFiling',
    metaDescription: 'Register your Partnership Firm online. Professional drafting of Partnership Deeds and registration with the Registrar of Firms.',
    keywords: ['partnership deed', 'partnership firm', 'registrar of firms', 'firm registration', 'deed drafting'],
    iconName: 'Scale',
    featured: false,
    processingTime: '5 - 7 Business Days',
    requiredDocuments: ['Identity Proof of all Partners', 'Address Proof of Partners', 'Drafted Partnership Deed', 'Rent Agreement of Office'],
    benefits: ['Easy to establish', 'Shared pooling of resources', 'Fewer annual filing requirements'],
    faqReference: [{ q: 'Is registration of a partnership deed compulsory?', a: 'Registration is not legally compulsory but highly recommended to enforce legal partnership rights.' }],
    canonicalSlug: 'https://clearfiling.in/services/partnership-firm',
    futurePage: '/services/partnership-firm'
  },
  {
    id: 'public-limited-company',
    slug: 'public-limited-company',
    category: 'Business Formation',
    title: 'Public Limited Company',
    shortDescription: 'Incorporate a Public Limited Company. Ideal for large enterprises raising public capital.',
    description: 'A Public Limited Company is suitable for businesses that plan to raise equity capital from the public. It requires a minimum of 7 shareholders and 3 directors and follows strict compliance disclosure norms.',
    metaTitle: 'Public Limited Company Registration Online India | ClearFiling',
    metaDescription: 'Establish your Public Limited Company with ClearFiling. Comprehensive registration support including DSC, DIN, MOA, and AOA drafting.',
    keywords: ['public limited company', 'public company registration', 'public ltd setup', 'raise public capital', 'large company formation'],
    iconName: 'Landmark',
    featured: false,
    processingTime: '15 - 20 Business Days',
    requiredDocuments: ['KYC of 3 Directors & 7 Shareholders', 'Digital Signature Certificates', 'Registered Address Proof'],
    benefits: ['Ability to raise public equity capital', 'High market reputation and trust', 'Transferability of shares on stock market'],
    faqReference: [{ q: 'How many directors are needed for a Public Company?', a: 'A minimum of three directors are required.' }],
    canonicalSlug: 'https://clearfiling.in/services/public-limited-company',
    futurePage: '/services/public-limited-company'
  },
  {
    id: 'producer-company',
    slug: 'producer-company',
    category: 'Business Formation',
    title: 'Producer Company',
    shortDescription: 'Form a Producer Company. Tailored for farmers and agricultural primary producers.',
    description: 'A Producer Company allows primary producers (farmers, agriculturalists, weavers) to organize themselves into a corporate body to access credit, resources, and institutional crop marketing under the Companies Act.',
    metaTitle: 'Producer Company Registration Online India | ClearFiling',
    metaDescription: 'Register a Producer Company to support agricultural cooperatives. 100% compliant CA advisory for farmer groups.',
    keywords: ['producer company', 'farmer company registration', 'agriculture producer company', 'cooperative company'],
    iconName: 'Building2',
    featured: false,
    processingTime: '15 - 22 Business Days',
    requiredDocuments: ['KYC of 10 or more primary producers', 'Producer certificate or land records', 'Registered office address proof'],
    benefits: ['Corporate structure for rural producers', 'Tax exemptions on agricultural income', 'Access to government agro-subsidies'],
    faqReference: [{ q: 'What is the minimum member count for a Producer Company?', a: 'A minimum of 10 primary producers (individuals) or 2 producer institutions are required.' }],
    canonicalSlug: 'https://clearfiling.in/services/producer-company',
    futurePage: '/services/producer-company'
  },
  {
    id: 'section-8-organization',
    slug: 'section-8-organization',
    category: 'Business Formation',
    title: 'Section 8 Organization',
    shortDescription: 'Incorporate a Section 8 NGO/NPO Company. Ideal for social charity initiatives.',
    description: 'A Section 8 Company is registered for promoting charitable objectives like art, science, education, charity, and environment protection. All profits are applied solely to promote the company objectives (no dividends are paid).',
    metaTitle: 'Section 8 Company Registration Online | NGO Formation | ClearFiling',
    metaDescription: 'Form your charitable Section 8 Company online. Complete advisory on NGO license, MOA drafting, and 12A/80G registrations.',
    keywords: ['section 8 company', 'ngo registration', 'non profit registration', 'charitable company', 'npo setup'],
    iconName: 'Landmark',
    featured: false,
    processingTime: '12 - 18 Business Days',
    requiredDocuments: ['KYC of 2 Directors', 'Charitable objective statement', 'Registered office documents', 'Digital signature certificates'],
    benefits: ['Access to corporate social responsibility (CSR) funds', 'No minimum capital requirement', 'Tax exemptions on donations'],
    faqReference: [{ q: 'Can a Section 8 company pay dividends?', a: 'No, payment of dividends or distribution of profit to members is strictly prohibited.' }],
    canonicalSlug: 'https://clearfiling.in/services/section-8-organization',
    futurePage: '/services/section-8-organization'
  },
  {
    id: 'trust-registration',
    slug: 'trust-registration',
    category: 'Business Formation',
    title: 'Trust Registration',
    shortDescription: 'Create and register a public or private Charitable Trust. Draft trust deeds legally.',
    description: 'Registering a Trust provides a structured legal framework to hold properties or funds for social, religious, educational, or charitable benefit. Requires a minimum of two trustees and a registered trust deed.',
    metaTitle: 'Charitable Trust Registration Online | Trust Deed Drafting | ClearFiling',
    metaDescription: 'Register a Public or Private Trust in India. Sincere legal drafting of Trust Deeds and sub-registrar filings.',
    keywords: ['trust registration', 'charitable trust setup', 'trust deed drafting', 'register trust', 'public trust'],
    iconName: 'Scale',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Deed details and objectives', 'KYC of Author and Trustees', 'Registered Office address proof', 'Two Witnesses KYC'],
    benefits: ['Simple structure for religious/charitable setups', 'Perpetual legal existence', 'Exemptions on income tax via 12A registration'],
    faqReference: [{ q: 'What is the minimum member count for a trust?', a: 'A minimum of two trustees are required to register a trust.' }],
    canonicalSlug: 'https://clearfiling.in/services/trust-registration',
    futurePage: '/services/trust-registration'
  },

  // ==========================================
  // BUSINESS REGISTRATIONS (13 Services)
  // ==========================================
  {
    id: 'msme-registration',
    slug: 'msme-registration',
    category: 'Business Registrations',
    title: 'MSME Registration',
    shortDescription: 'Avail MSME (Micro, Small, Medium Enterprises) registration online to secure government subsidies.',
    description: 'MSME Registration (Udyam) provides a unique identification to your business that unlocks priority bank lending, lower credit interest rates, government subsidies, and legal protection against delayed payments.',
    metaTitle: 'MSME Registration Online | Udyam Registration Certificate | ClearFiling',
    metaDescription: 'Get your MSME / Udyam registration certificate online with ClearFiling. Access loan subsidies, collateral-free credit, and delay-payment protection.',
    keywords: ['msme registration', 'udyam registration', 'ssi certificate', 'small business registration', 'udyam certificate'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: ['Aadhaar Card of the Proprietor / Director', 'PAN Card of the Entity', 'GSTIN (if applicable)', 'Bank Account details'],
    benefits: [
      'Collateral-free loans and priority sector credit',
      'Substantial discounts on patent and trademark filings',
      'Protection against delayed payments (MSME Samadhaan protection)',
      'Rebates on electricity bills and municipal approvals'
    ],
    faqReference: [{ q: 'Is GST mandatory for MSME registration?', a: 'GST is mandatory only for businesses where GST registration is legally required under GST law.' }],
    canonicalSlug: 'https://clearfiling.in/services/msme-registration',
    futurePage: '/services/msme-registration'
  },
  {
    id: 'startup-india-registration',
    slug: 'startup-india-registration',
    category: 'Business Registrations',
    title: 'Startup India Registration',
    shortDescription: 'Get recognized under DPIIT Startup India. Access tax holidays, self-compliances, and patents rebate.',
    description: 'DPIIT Recognition under the Startup India scheme unlocks tax holidays for 3 consecutive years, access to government fund-of-funds, fast-tracked patent examination, and simple self-certification under labor and environmental laws.',
    metaTitle: 'Startup India Recognition Online | DPIIT Certificate | ClearFiling',
    metaDescription: 'Apply for Startup India DPIIT recognition. Unlock income tax exemptions, relaxed tenders, and fast-track patents.',
    keywords: ['startup india registration', 'dpiit recognition', 'startup tax exemption', 'startup certificate', 'dpiit registration'],
    iconName: 'Zap',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Certificate of Incorporation', 'Detailed pitch deck or business write-up', 'Product videos or app links', 'Director details'],
    benefits: ['Income tax exemption under Section 80IAC', 'Easy winding up and self-certification', 'Patent filing cost discounts up to 80%'],
    faqReference: [{ q: 'Can a Partnership Firm get DPIIT recognition?', a: 'Yes, registered partnership firms, LLPs, and Private Limited companies are eligible.' }],
    canonicalSlug: 'https://clearfiling.in/services/startup-india-registration',
    futurePage: '/services/startup-india-registration'
  },
  {
    id: 'iec-registration',
    slug: 'iec-registration',
    category: 'Business Registrations',
    title: 'IEC Registration',
    shortDescription: 'Import Export Code (IEC) registration. Mandatory code required to import or export goods internationally.',
    description: 'An Import Export Code (IEC) is a 10-digit identification code issued by the Directorate General of Foreign Trade (DGFT), Ministry of Commerce. It is mandatory for any Indian business importing or exporting goods or services.',
    metaTitle: 'IEC Code Online Registration | Import Export License | ClearFiling',
    metaDescription: 'Register for Import Export Code (IEC) online. Lifetime validity DGFT code processing in 48 hours.',
    keywords: ['iec registration', 'import export code', 'iec license', 'dgft registration', 'export import license'],
    iconName: 'TrendingUp',
    featured: false,
    processingTime: '2 - 3 Business Days',
    requiredDocuments: ['PAN & Aadhaar of Promoter', 'Cancelled Cheque of current account', 'Address proof of office (electricity bill)'],
    benefits: ['Legal permission to trade globally', 'No annual renewal required (Lifetime validity)', 'Access to export promotional incentives'],
    faqReference: [{ q: 'Does IEC code require yearly renewal?', a: 'No, IEC has lifetime validity, but the profile details must be updated yearly on the DGFT portal.' }],
    canonicalSlug: 'https://clearfiling.in/services/iec-registration',
    futurePage: '/services/iec-registration'
  },
  {
    id: 'trade-license',
    slug: 'trade-license',
    category: 'Business Registrations',
    title: 'Trade License',
    shortDescription: 'Obtain a Trade License from municipal authorities. Mandatory for retail, restaurants, and manufacturing.',
    description: 'A Trade License is a local municipal permit that allows a business to operate in a specific commercial region. It ensures the business is operating in accordance with safety, environment, and zoning regulations.',
    metaTitle: 'Trade License Online Registration | MCD/Municipal License | ClearFiling',
    metaDescription: 'Get your local municipal Trade License. Sincere legal coordination with municipal corporations.',
    keywords: ['trade license', 'mcd license', 'municipal license', 'commercial trade permit', 'health trade license'],
    iconName: 'Briefcase',
    featured: false,
    processingTime: '15 - 25 Business Days',
    requiredDocuments: ['Business Incorporation Certificate', 'Rent agreement & tax paid receipt of office', 'Layout diagram of commercial space', 'NOC from fire department (if applicable)'],
    benefits: ['Guarantees legal commercial operation', 'Protects against heavy municipal penal notices', 'Increases customer confidence'],
    faqReference: [{ q: 'Is a trade license required for online services?', a: 'No, it is typically required only for physical commercial activities, stores, eateries, and factories.' }],
    canonicalSlug: 'https://clearfiling.in/services/trade-license',
    futurePage: '/services/trade-license'
  },
  {
    id: 'shop-establishment',
    slug: 'shop-establishment',
    category: 'Business Registrations',
    title: 'Shop & Establishment',
    shortDescription: 'Get Shop & Establishment (Gumasta) license. Required to open commercial shops and office workspaces.',
    description: 'Shop & Establishment license (also called Gumasta/Labor registration) is a state-level license mandatory for any retail store, commercial office, or workspace employing workers. It regulates working hours, wage payments, and employee leaves.',
    metaTitle: 'Shop and Establishment Act Registration Online | Gumasta License | ClearFiling',
    metaDescription: 'Register under the Shop and Establishment Act. Secure your Gumasta license to open current bank accounts.',
    keywords: ['shop and establishment registration', 'gumasta license', 'labor license', 'shop registration', 'gumasta setup'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Identity proof of the employer', 'Address proof of the store/office', 'Photo of the shop front showing name board', 'List of employees'],
    benefits: ['Serves as proof of commercial existence', 'Mandatory for opening corporate current bank accounts', 'Legal compliance under state labor department laws'],
    faqReference: [{ q: 'Is a Shop license mandatory for home-based offices?', a: 'Depending on the state laws, home-based businesses are often exempt, but having it helps open current bank accounts.' }],
    canonicalSlug: 'https://clearfiling.in/services/shop-establishment',
    futurePage: '/services/shop-establishment'
  },
  {
    id: 'digital-signature',
    slug: 'digital-signature',
    category: 'Business Registrations',
    title: 'Digital Signature',
    shortDescription: 'Class 3 Digital Signature Certificate (DSC) online. Necessary for MCA, income tax, and e-tendering portal filings.',
    description: 'A Digital Signature Certificate (DSC) is a secure digital key issued by certifying authorities. It is legally required to sign electronic documents, complete company incorporations on the MCA portal, file income tax returns, and submit online e-tenders.',
    metaTitle: 'Class 3 Digital Signature Certificate (DSC) Online | ClearFiling',
    metaDescription: 'Get Class 3 Digital Signature Certificate (DSC) with USB ePass token. Video verification support for fast approvals.',
    keywords: ['dsc online', 'class 3 digital signature', 'dsc registration', 'epass token', 'digital signature certificate'],
    iconName: 'Lock',
    featured: false,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: ['PAN & Aadhaar of applicant', 'Active Mobile Number and Email', 'Video/Mobile verification matching Aadhaar details'],
    benefits: ['Lawful signature verification on online portals', 'Secure encrypted signatures preventing tamper tampering', 'Required for filing government e-tenders'],
    faqReference: [{ q: 'What is the validity of a DSC?', a: 'DSC tokens are usually issued with a validity of 2 years or 3 years.' }],
    canonicalSlug: 'https://clearfiling.in/services/digital-signature',
    futurePage: '/services/digital-signature'
  },
  {
    id: 'iso-certification',
    slug: 'iso-certification',
    category: 'Business Registrations',
    title: 'ISO Certification',
    shortDescription: 'Obtain ISO 9001:2015, ISO 14001, or ISO 27001 certifications. Boosts international brand authority.',
    description: 'ISO Certification demonstrates that your organizational processes meet international quality standards. It enhances internal process structures, qualifies you for high-end international tenders, and improves customer trust.',
    metaTitle: 'ISO 9001:2015 Quality Certification Online | ClearFiling',
    metaDescription: 'Get certified under ISO standards. Audit coordination and certification processing for ISO 9001, 14001, and 27001.',
    keywords: ['iso certification', 'iso 9001 registration', 'quality management standard', 'iso certificate online'],
    iconName: 'Award',
    featured: false,
    processingTime: '5 - 7 Business Days',
    requiredDocuments: ['Business profile & product catalog', 'Company registration proof', 'Scope of work details'],
    benefits: ['Global validation of process quality', 'Mandatory eligibility for international corporate tenders', 'Improves team execution standards'],
    faqReference: [{ q: 'Which is the most common ISO standard?', a: 'ISO 9001:2015 (Quality Management System) is the most widely adopted standard.' }],
    canonicalSlug: 'https://clearfiling.in/services/iso-certification',
    futurePage: '/services/iso-certification'
  },
  {
    id: 'professional-tax-registration',
    slug: 'professional-tax-registration',
    category: 'Business Registrations',
    title: 'Professional Tax Registration',
    shortDescription: 'Register for Professional Tax (PT). Mandatory for employers to deduct and pay PT on salaries.',
    description: 'Professional Tax is a state-level tax levied on salaried employees and professionals. Employers must register under the state tax portal, deduct PT from employees, and remit it to the state exchequer regularly.',
    metaTitle: 'Professional Tax (PT) Registration Online | ClearFiling',
    metaDescription: 'Complete your Professional Tax registration. State-specific legal compliance setups for employers.',
    keywords: ['professional tax registration', 'pt return', 'professional tax certificate', 'pt registration online'],
    iconName: 'Briefcase',
    featured: false,
    processingTime: '5 - 7 Business Days',
    requiredDocuments: ['Incorporate certificate of company', 'PAN of the directors/entity', 'Employee list & salary details', 'Bank statement'],
    benefits: ['Mandatory compliance for hiring workforce', 'Avoid heavy penalties under state PT rules', 'Enables neat salary deductions'],
    faqReference: [{ q: 'Is professional tax applicable in all Indian states?', a: 'No, Professional Tax is active only in specific states like Maharashtra, Karnataka, Tamil Nadu, and West Bengal.' }],
    canonicalSlug: 'https://clearfiling.in/services/professional-tax-registration',
    futurePage: '/services/professional-tax-registration'
  },
  {
    id: 'fssai-registration',
    slug: 'fssai-registration',
    category: 'Business Registrations',
    title: 'FSSAI Registration',
    shortDescription: 'FSSAI food safety license and registration. Mandatory for restaurants, cafes, packaging, and retail.',
    description: 'FSSAI (Food Safety and Standards Authority of India) registration is mandatory for any business entity that manufactures, processes, packages, stores, distributes, or sells food products. It guarantees that food quality is safe for human consumption.',
    metaTitle: 'FSSAI Food License Online Registration | FOSCOS Registration | ClearFiling',
    metaDescription: 'Register for FSSAI food license online. Professional file audit to avoid FOSCOS rejections. Custom support for basic, state, and central licenses.',
    keywords: ['fssai registration', 'food license online', 'foscos registration', 'fssai number', 'restaurant license'],
    iconName: 'ShieldAlert',
    featured: false,
    processingTime: '4 - 7 Business Days',
    requiredDocuments: ['Identity and address proof of the promoter', 'Details of food categories to sell', 'Premises address proof (Rent deed & NOC)', 'Water testing report (for state/central licenses)'],
    benefits: ['Legally sell food items in commercial markets', 'Necessary for onboarding on Zomato and Swiggy', 'Guarantees food safety and hygiene to buyers'],
    faqReference: [{ q: 'What is the limit for basic FSSAI registration?', a: 'Basic registration is for food business operators with an annual turnover below ₹12 Lakhs.' }],
    canonicalSlug: 'https://clearfiling.in/services/fssai-registration',
    futurePage: '/services/fssai-registration'
  },
  {
    id: 'udyam-registration',
    slug: 'udyam-registration',
    category: 'Business Registrations',
    title: 'Udyam Registration',
    shortDescription: 'Alternative entry portal registration for Udyam micro businesses. Lifetime validity certificates.',
    description: 'Get recognized under MSME through the Udyam portal to enjoy government tenders, credit access, and lower loan rates.',
    metaTitle: 'Udyam Registration Certificate Online | ClearFiling',
    metaDescription: 'Register on the Udyam portal. Quick and secure processing with Senior CA support.',
    keywords: ['udyam registration', 'udyam portal', 'msme certificate', 'udyam certificate online'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: ['Aadhaar and PAN details of Director/Owner', 'Bank Details', 'Turnover figures'],
    benefits: ['Subsidized loan interest', 'Delayed payment protection', 'Priority procurement'],
    faqReference: [{ q: 'Can a trader get Udyam registration?', a: 'Yes, the government has extended MSME benefits to retail and wholesale traders.' }],
    canonicalSlug: 'https://clearfiling.in/services/udyam-registration',
    futurePage: '/services/udyam-registration'
  },
  {
    id: 'import-export-code',
    slug: 'import-export-code',
    category: 'Business Registrations',
    title: 'Import Export Code',
    shortDescription: 'Additional import-export code configurations on the DGFT registration portal.',
    description: 'Apply for the Import Export Code (IEC) to trade globally. Valid forever.',
    metaTitle: 'Import Export Code (IEC) Certificate Online | ClearFiling',
    metaDescription: 'Acquire your import-export code legally with professional DGFT filings.',
    keywords: ['import export code', 'iec code registration', 'dgft portal code'],
    iconName: 'TrendingUp',
    featured: false,
    processingTime: '2 - 3 Business Days',
    requiredDocuments: ['PAN & Aadhaar of Promoter', 'Cancelled Cheque', 'Office address proof'],
    benefits: ['Lifetime validity', 'Global sales expansion', 'Customs clearance approval'],
    faqReference: [{ q: 'Is IEC required for service exports?', a: 'IEC is not mandatory for service exports, but holds immense utility.' }],
    canonicalSlug: 'https://clearfiling.in/services/import-export-code',
    futurePage: '/services/import-export-code'
  },
  {
    id: 'barcode-registration',
    slug: 'barcode-registration',
    category: 'Business Registrations',
    title: 'Barcode Registration',
    shortDescription: 'GS1 Barcode registration for retail products. Essential to list on retail chains & e-commerce.',
    description: 'Barcode registration from GS1 India assigns unique numbers to your items. Mandatory to sell in supermarkets, retail chains, and global e-commerce portals like Amazon.',
    metaTitle: 'GS1 Barcode Registration Online India | ClearFiling',
    metaDescription: 'Acquire official GS1 product barcodes. Clear registration and pricing advisory.',
    keywords: ['gs1 barcode', 'barcode registration', 'retail product barcode', 'product packaging label'],
    iconName: 'Briefcase',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Registration proof of business', 'PAN Card of entity', 'Product details and packaging label'],
    benefits: ['Sell globally in supermarkets', 'Automates billing and ledger systems', 'Reduces labeling mistakes'],
    faqReference: [{ q: 'How many barcodes should I buy?', a: 'GS1 allocates barcodes in sets (e.g., 100, 1000, etc.) depending on the number of unique product variants.' }],
    canonicalSlug: 'https://clearfiling.in/services/barcode-registration',
    futurePage: '/services/barcode-registration'
  },
  {
    id: 'bis-certification',
    slug: 'bis-certification',
    category: 'Business Registrations',
    title: 'BIS Certification',
    shortDescription: 'Bureau of Indian Standards (BIS) certification. Mandatory for electronics, toys, and steel items.',
    description: 'BIS registration certifies that products satisfy quality, safety, and reliability standards. It is mandatory for importing/selling toys, smartphones, batteries, cement, and electrical accessories in India.',
    metaTitle: 'BIS ISI Certification Online India | CRS Registration | ClearFiling',
    metaDescription: 'Get BIS ISI and CRS certification for your products. Comprehensive laboratory testing support.',
    keywords: ['bis certification', 'isi mark registration', 'crs certification', 'product safety compliance'],
    iconName: 'Award',
    featured: false,
    processingTime: '25 - 40 Business Days',
    requiredDocuments: ['Product lab test reports', 'Manufacturing setup layout details', 'Quality checklist documents', 'Authorized representative details'],
    benefits: [' ISI/CRS mark on packaging increases sales', 'Mandatory compliance to avoid seizure of goods', 'Attests safety and quality standards to users'],
    faqReference: [{ q: 'Is laboratory testing mandatory for BIS?', a: 'Yes, products must be tested in BIS-certified laboratory facilities.' }],
    canonicalSlug: 'https://clearfiling.in/services/bis-certification',
    futurePage: '/services/bis-certification'
  },

  // ==========================================
  // TRADEMARK & INTELLECTUAL PROPERTY (10 Services)
  // ==========================================
  {
    id: 'trademark-registration',
    slug: 'trademark-registration',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Registration',
    shortDescription: 'Protect your brand name, logo, or slogan. Register under trademark classes to use ® symbol.',
    description: 'Trademark registration grants you exclusive ownership rights over your brand name, logos, and slogans. It prevents competitors from riding on your hard-earned corporate reputation and protects business assets.',
    longDescription: 'Registering a Trademark is essential to safeguard your unique brand assets—like names, logos, or marketing slogans—from competitors. Trademark registration allows you to legally use the ™ symbol immediately upon filing and the ® symbol once registered. It establishes an intangible asset that boosts business valuations and prevents other firms from riding on your hard-earned market reputation.',
    metaTitle: 'Trademark Registration Online India | Register Logo & Brand Name | ClearFiling',
    metaDescription: 'Secure your brand trademark registration. File applications instantly under correct trademark classes. Access 50% discount for MSMEs.',
    keywords: ['trademark registration', 'register brand name', 'logo trademark', 'trademark filing online', 'tm application'],
    iconName: 'Stamp',
    featured: true,
    processingTime: '1 - 2 Business Days',
    timeline: '1 - 2 Business Days',
    heroTitle: 'Trademark Registration Online',
    heroDescription: 'Secure legal ownership over your brand name, logo, or slogan. Use the ™ symbol in 24 hours. Avail of a 50% government fee rebate for MSME registration.',
    ctaTitle: 'Protect Your Brand Name Today',
    ctaDescription: 'Prevent copycats from stealing your business identity. Start your trademark application with our legal advisors today.',
    requiredDocuments: [
      'Soft copy of the logo / brand name to be registered',
      'Signed authorization form TM-48 (provided by our legal advisor)',
      'Identity and address proof of the applicant',
      'MSME registration certificate (to claim the 50% government fee subsidy)'
    ],
    benefits: [
      'Legal ownership rights over your brand branding',
      'Use the ® symbol and build distinct corporate identity',
      'Stop competitors from copying your logo or name',
      'Builds a valuable, assignable intellectual asset'
    ],
    eligibility: [
      'Founders and startups protecting new brand names',
      'SMEs scaling their retail product labels',
      'Individual creators, bloggers, and authors',
      'Companies wanting to prevent brand hijacking'
    ],
    process: [
      { step: 'Step 1', title: 'Trademark Search', desc: 'Perform a comprehensive check in the government database to detect conflicting identical or similar phonetic marks.' },
      { step: 'Step 2', title: 'Class Classification', desc: 'Identify the correct trademark classes (out of 45 classes) that align with your business offerings.' },
      { step: 'Step 3', title: 'Filing Application', desc: 'Draft and file Form TM-A with the IP India website to receive your application number and enable the ™ symbol.' },
      { step: 'Step 4', title: 'Registry Scrutiny', desc: 'The application goes through examination. If published in the Trademark Journal without opposition, the ® registration certificate is issued.' }
    ],
    faqReference: [
      { q: 'How long does a trademark registration take?', a: 'You can use the TM symbol within 24 hours of application filing, but final ® registration takes 9 to 18 months.' }
    ],
    faqs: [
      { q: 'How long does a trademark registration take?', a: 'You can use the TM symbol within 24 hours of application filing, but final ® registration takes 9 to 18 months.' },
      { q: 'What is a trademark class?', a: 'Trademark registry groups goods and services into 45 distinct classes. You must file in the class representing your trade.' },
      { q: 'Can I register a trademark as an individual?', a: 'Yes, trademarks can be registered by individuals, proprietorships, companies, or LLPs.' }
    ],
    relatedServices: [
      { id: 'trademark-renewal', title: 'Trademark Renewal' },
      { id: 'trademark-objection', title: 'Trademark Objection' },
      { id: 'copyright-registration', title: 'Copyright Registration' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/trademark-registration',
    futurePage: '/services/trademark-registration'
  },
  {
    id: 'trademark-renewal',
    slug: 'trademark-renewal',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Renewal',
    shortDescription: 'Renew your trademark registration. Required every 10 years to maintain exclusive rights.',
    description: 'Trademark rights must be renewed every 10 years. Complete the renewal filing to avoid brand abandonment and removal from the registrar of trademarks.',
    metaTitle: 'Trademark Renewal Online India | Renew Brand TM | ClearFiling',
    metaDescription: 'Renew your trademark registry before it expires. Sincere TM-R filing with the IP department.',
    keywords: ['trademark renewal', 'renew brand name', 'tm renewal online', 'form tm-r', 'renew trademark'],
    iconName: 'Stamp',
    featured: false,
    processingTime: '2 - 4 Business Days',
    requiredDocuments: ['Copy of registered trademark certificate', 'Power of attorney documents', 'Applicant PAN / Aadhaar'],
    benefits: ['Continuous protection of brand rights', 'Avoid competitive trademark hijackers', 'Maintain asset value in ledger balance sheets'],
    faqReference: [{ q: 'When can I apply for trademark renewal?', a: 'You can apply within 6 months before the 10-year expiry window.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-renewal',
    futurePage: '/services/trademark-renewal'
  },
  {
    id: 'trademark-objection',
    slug: 'trademark-objection',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Objection',
    shortDescription: 'File responses to trademark objection reports (e.g., Section 9 or Section 11 objections).',
    description: 'If the Trademark Registrar objects to your application (under Section 9 relative grounds or Section 11 identical marks), a detailed legal counter-reply must be submitted within 30 days to avoid abandonment.',
    metaTitle: 'Trademark Objection Reply Online | Section 9 & 11 Reply | ClearFiling',
    metaDescription: 'Receive a trademark objection notice? Get professional replies drafted by senior IP attorneys.',
    keywords: ['trademark objection', 'objection reply', 'section 9 objection', 'section 11 reply', 'tm examination report'],
    iconName: 'ShieldAlert',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Examination report copy', 'Notice from registry', 'User affidavit & brand proof of usage'],
    benefits: ['Prevents abandonment of your application', 'Defends brand distinctiveness legally', 'Increases chances of application publication'],
    faqReference: [{ q: 'What is the timeline to reply to an objection?', a: 'A written response must be filed within 30 days from the date of receipt of the examination report.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-objection',
    futurePage: '/services/trademark-objection'
  },
  {
    id: 'trademark-opposition',
    slug: 'trademark-opposition',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Opposition',
    shortDescription: 'Oppose identical trademarks published in the TM Journal, or defend your opposed trademark.',
    description: 'When a trademark is published in the journal, third parties can oppose it within 4 months. We assist in filing oppositions against copycats or defending your application against opposition notices.',
    metaTitle: 'Trademark Opposition Filing & Defense | IP Attorney Support | ClearFiling',
    metaDescription: 'File or defend trademark oppositions. Expert IP attorney representation to safeguard brand assets.',
    keywords: ['trademark opposition', 'tm journal opposition', 'defend trademark', 'form tm-o filing'],
    iconName: 'Scale',
    featured: false,
    processingTime: '5 - 10 Business Days',
    requiredDocuments: ['Opposition notice or counter statement details', 'Brand evidence certificates', 'Attested user affidavit'],
    benefits: ['Stop competitors from registering similar logos', 'Protect brand exclusivity in commercial markets', 'Attested legal protection'],
    faqReference: [{ q: 'What is the time limit for trademark opposition?', a: 'An opposition must be filed within 4 months of the trademark publication in the Trademark Journal.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-opposition',
    futurePage: '/services/trademark-opposition'
  },
  {
    id: 'trademark-hearing',
    slug: 'trademark-hearing',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Hearing',
    shortDescription: 'Legal representation for trademark hearings before the Registrar of Trademarks.',
    description: 'If the examination response is not fully accepted, the registrar schedules an official hearing. We provide experienced trademark attorneys to represent your case and secure registration approval.',
    metaTitle: 'Trademark Show Cause Hearing Representation | ClearFiling',
    metaDescription: 'Expert representation for show cause trademark hearings. Sincere arguments by senior IP practitioners.',
    keywords: ['trademark hearing', 'show cause hearing', 'tm registry representation', 'advocate trademark'],
    iconName: 'Scale',
    featured: false,
    processingTime: 'Hearing Date dependent',
    requiredDocuments: ['Hearing notice copy', 'Written arguments memo', 'Proof of brand usage history'],
    benefits: ['Professional verbal advocacy before the examiner', 'Direct answers to examiner objections', 'Secures final registration approval'],
    faqReference: [{ q: 'Is physical appearance required for hearings?', a: 'Most trademark hearings are now held virtually via video conference.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-hearing',
    futurePage: '/services/trademark-hearing'
  },
  {
    id: 'trademark-rectification',
    slug: 'trademark-rectification',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Rectification',
    shortDescription: 'Remove or correct error entries in the official Trademarks Register.',
    description: 'File applications to rectify error entries, update proprietor addresses, or cancel registered trademarks that have not been in active use for over 5 years.',
    metaTitle: 'Trademark Rectification Online India | Correct TM Register | ClearFiling',
    metaDescription: 'Correct details in the trademark database. Sincere filing of TM-O and TM-P forms.',
    keywords: ['trademark rectification', 'rectify tm registry', 'tm-p filing', 'cancel trademark'],
    iconName: 'Stamp',
    featured: false,
    processingTime: '15 - 30 Business Days',
    requiredDocuments: ['Copy of trademark certificate', 'Application statement showing reasons', 'Supportive evidence documents'],
    benefits: ['Keeps records updated and error-free', 'Cancel unused similar marks to clear path', 'Legal record authenticity'],
    faqReference: [{ q: 'Can I rectify my own address in TM register?', a: 'Yes, you can file a correction request (Form TM-P) to update address details.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-rectification',
    futurePage: '/services/trademark-rectification'
  },
  {
    id: 'copyright-registration',
    slug: 'copyright-registration',
    category: 'Trademark & Intellectual Property',
    title: 'Copyright Registration',
    shortDescription: 'Register copyrights for software codes, websites, books, music, video, and artworks.',
    description: 'Copyright registration protects original creative work—including software code, music, paintings, cinematic videos, and literary scripts—from being pirated or copied. It lasts for the lifetime of the creator plus 60 years.',
    metaTitle: 'Copyright Registration Online India | Register Software & Art | ClearFiling',
    metaDescription: 'Protect your creative works online. Register copyrights for code databases, books, music, and designs.',
    keywords: ['copyright registration', 'register software code', 'website copyright', 'literary work copyright', 'copyright online'],
    iconName: 'Lock',
    featured: false,
    processingTime: '15 - 30 Business Days (Filing)',
    requiredDocuments: ['Copy of the original creative work', 'Applicant identity card', 'NOC from author / publisher (if applicable)'],
    benefits: ['Prevents duplication of proprietary software codes', 'Grants exclusive publishing and distribution rights', 'Strong legal evidence in copyright infringement lawsuits'],
    faqReference: [{ q: 'Is software code copyrightable in India?', a: 'Yes, software source codes and object codes are copyrightable under literary works.' }],
    canonicalSlug: 'https://clearfiling.in/services/copyright-registration',
    futurePage: '/services/copyright-registration'
  },
  {
    id: 'patent-registration',
    slug: 'patent-registration',
    category: 'Trademark & Intellectual Property',
    title: 'Patent Registration',
    shortDescription: 'File provisional or complete patent specifications for inventions.',
    description: 'Secure exclusive manufacturing and commercial exploitation rights for your unique scientific or technological inventions by filing patent specifications with the Indian Patent Office.',
    metaTitle: 'Patent Registration Online India | Patent Filing Process | ClearFiling',
    metaDescription: 'File your provisional or complete patent specification. Sincere patent drafting support from registered patent agents.',
    keywords: ['patent filing', 'patent registration', 'provisional patent', 'patent specification drafting'],
    iconName: 'Briefcase',
    featured: false,
    processingTime: 'Drafting dependent',
    requiredDocuments: ['Invention write-up & schematics', 'Novelty assessment summary', 'Applicant identity details'],
    benefits: ['Excludes others from copying your technology for 20 years', 'High valuation asset for raising venture capital', 'License or lease technology for royalty streams'],
    faqReference: [{ q: 'What is the validity of a patent in India?', a: 'Patents have a legal validity of 20 years from the date of filing.' }],
    canonicalSlug: 'https://clearfiling.in/services/patent-registration',
    futurePage: '/services/patent-registration'
  },
  {
    id: 'industrial-design-registration',
    slug: 'industrial-design-registration',
    category: 'Trademark & Intellectual Property',
    title: 'Industrial Design Registration',
    shortDescription: 'Protect the unique shape, configuration, and visual appearance of manufactured products.',
    description: 'Design registration protects the aesthetic look, shape, pattern, or ornamentation applied to a manufactured article. It excludes others from copying the visual design of items like furniture, bottles, or gear cases.',
    metaTitle: 'Industrial Design Registration Online India | ClearFiling',
    metaDescription: 'Protect product shapes and designs under the Designs Act. Register designs online.',
    keywords: ['design registration', 'industrial design protection', 'product shape patent', 'aesthetic design registry'],
    iconName: 'Stamp',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['High-resolution photos from 6 viewpoints (front, side, top, etc.)', 'Statement of novelty details', 'Applicant identity card'],
    benefits: ['Prevents visual design copies by competitors', 'Establishes visual brand assets', 'Filing discounts for startup entities'],
    faqReference: [{ q: 'How long is a design registration valid?', a: 'Valid for 10 years, extendable by another 5 years.' }],
    canonicalSlug: 'https://clearfiling.in/services/industrial-design-registration',
    futurePage: '/services/industrial-design-registration'
  },
  {
    id: 'trademark-assignment',
    slug: 'trademark-assignment',
    category: 'Trademark & Intellectual Property',
    title: 'Trademark Assignment',
    shortDescription: 'Transfer ownership rights of a trademark to another person or business entity.',
    description: 'Assign your trademark rights to another individual or business with or without goodwill. We draft trademark assignment deeds and file required TM-P forms with the registrar.',
    metaTitle: 'Trademark Assignment online India | Transfer TM Ownership | ClearFiling',
    metaDescription: 'Transfer your trademark rights legally. Professional deed drafting and registrar filing.',
    keywords: ['trademark assignment', 'transfer trademark ownership', 'tm-p assignment deed'],
    iconName: 'Stamp',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Registered trademark certificate', 'Drafted Assignment Deed', 'PAN & Aadhaar of Assignor and Assignee'],
    benefits: ['Legally monetise brand values', 'Clean transfer of ownership details in register', 'Enables easy franchising of businesses'],
    faqReference: [{ q: 'Can an unregistered trademark be assigned?', a: 'Yes, unregistered trademarks can also be assigned under the Trademarks Act.' }],
    canonicalSlug: 'https://clearfiling.in/services/trademark-assignment',
    futurePage: '/services/trademark-assignment'
  },

  // ==========================================
  // GST & INDIRECT TAX (10 Services)
  // ==========================================
  {
    id: 'gst-registration',
    slug: 'gst-registration',
    category: 'GST & Indirect Tax',
    title: 'GST Registration',
    shortDescription: 'Register for GST online. Mandatory for businesses with turnover over ₹20L/₹40L.',
    description: 'Acquire your 15-digit Goods and Services Tax Identification Number (GSTIN). GST registration is mandatory for businesses with turnover exceeding threshold limits or involved in inter-state supply.',
    longDescription: 'GST Registration is legally mandatory for companies supplying goods or services across state lines, or exceeding the annual threshold turnover. Registering for GST gives businesses legal recognition, enables them to collect tax from customers, and allows them to pass on Input Tax Credit (ITC) savings. ClearFiling ensures a completely smooth registration process, verifying address documents beforehand to prevent GST department queries.',
    metaTitle: 'GST Registration Online India | Apply for GSTIN | ClearFiling',
    metaDescription: 'Get your GST registration certificate online. Sincere review by tax experts to avoid government queries and ensure smooth approval.',
    keywords: ['gst registration', 'apply for gst', 'get gstin', 'gst certificate online', 'gst setup'],
    iconName: 'FileCheck2',
    featured: true,
    processingTime: '3 - 5 Business Days',
    timeline: '3 - 5 Business Days',
    heroTitle: 'GST Registration Online',
    heroDescription: 'Acquire your 15-digit GSTIN certificate in 3 to 5 business days. Seamless online documentation reviewed by professional tax CAs to prevent query delays.',
    ctaTitle: 'Need a GST Registration Certificate?',
    ctaDescription: 'Avoid compliance late fees and start billing your clients with legal GST invoices. Contact us to start your registration today.',
    requiredDocuments: [
      'PAN & Aadhaar of Promoter/Owner',
      'Passport size photograph of applicant',
      'Proof of Business Address (Utility Bill, Rent Agreement)',
      'NOC from property owner (for rented premises)'
    ],
    benefits: [
      'Legally recognize your business and avoid compliance penalties',
      'Eligible to collect GST from buyers and offset it via Input Tax Credit',
      'Sell products online on Amazon, Flipkart, and e-commerce stores',
      'Unrestricted business transaction across state borders'
    ],
    eligibility: [
      'Businesses with goods turnover exceeding ₹40 Lakhs annually',
      'Service providers with turnover exceeding ₹20 Lakhs annually',
      'E-commerce sellers selling products online',
      'Any business supplying goods or services inter-state'
    ],
    process: [
      { step: 'Step 1', title: 'Document Verification', desc: 'Sincere CA audit of address proofs, electricity bills, and NOCs to ensure no discrepancies exist.' },
      { step: 'Step 2', title: 'Portal Profile Setup', desc: 'Create a tax profile on the official GST Common Portal and complete mobile OTP e-verification.' },
      { step: 'Step 3', title: 'Form GST REG-01 Filing', desc: 'Upload director credentials, address certificates, bank accounts info, and file the REG-01 form.' },
      { step: 'Step 4', title: 'ARN & GSTIN Generation', desc: 'Receive Application Reference Number (ARN) to track status until approval and download the GST certificate.' }
    ],
    faqReference: [
      { q: 'What is the turnover limit for GST registration?', a: 'GST is mandatory for services with turnover exceeding ₹20 Lakhs and goods exceeding ₹40 Lakhs (lower for hill states).' }
    ],
    faqs: [
      { q: 'What is the turnover limit for GST registration?', a: 'GST is mandatory for services with turnover exceeding ₹20 Lakhs and goods exceeding ₹40 Lakhs (lower for hill states).' },
      { q: 'Is a business bank account mandatory for GST?', a: 'Yes, but you can upload personal bank details during filing and update it with a current account within 45 days of getting your GSTIN.' },
      { q: 'Can I apply for GST voluntarily?', a: 'Yes, any business can voluntarily register for GST to claim input tax credits or list on e-commerce sites.' }
    ],
    relatedServices: [
      { id: 'gst-return-filing', title: 'GST Return Filing' },
      { id: 'gst-annual-return', title: 'GST Annual Return' },
      { id: 'virtual-office-gst', title: 'Virtual Office + GST' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/gst-registration',
    futurePage: '/services/gst-registration'
  },
  {
    id: 'gst-return-filing',
    slug: 'gst-return-filing',
    category: 'GST & Indirect Tax',
    title: 'GST Return Filing',
    shortDescription: 'File monthly or quarterly GST returns (GSTR-1, GSTR-3B, QRMP scheme).',
    description: 'Ensure accurate and regular filing of your GST returns. We reconcile purchases with GSTR-2B, draft sales reports, and submit GSTR-1 and GSTR-3B filings timely to avoid late interest penalties.',
    metaTitle: 'GST Return Filing Services online India | ClearFiling',
    metaDescription: 'Outsource your monthly GST returns filing. High-end reconciliation with GSTR-2B by expert accountants.',
    keywords: ['gst return filing', 'gstr-1 online', 'gstr-3b filing', 'gst reconciliation', 'qrmp scheme'],
    iconName: 'FileSpreadsheet',
    featured: false,
    processingTime: 'Monthly Filing schedule',
    requiredDocuments: ['Sales invoice registers', 'Purchase bills & records', 'GST portal credentials'],
    benefits: ['Avoid monthly late fee penalties', 'Maximize Input Tax Credit offsets', 'Stay compliant for corporate audits'],
    faqReference: [{ q: 'What is the QRMP scheme in GST?', a: 'QRMP allows taxpayers with turnover below ₹5 Crores to file GSTR-1 and GSTR-3B quarterly while paying tax monthly.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-return-filing',
    futurePage: '/services/gst-return-filing'
  },
  {
    id: 'gst-annual-return',
    slug: 'gst-annual-return',
    category: 'GST & Indirect Tax',
    title: 'GST Annual Return',
    shortDescription: 'File GSTR-9 annual returns and GSTR-9C reconciliation statements.',
    description: 'GSTR-9 is the annual return file consolidating all monthly/quarterly filings of the financial year. Taxpayers with turnover exceeding threshold limits must also submit the audited GSTR-9C reconciliation statement.',
    metaTitle: 'GSTR-9 Annual Return Filing & GSTR-9C Audit | ClearFiling',
    metaDescription: 'File your GSTR-9 annual returns. Complete consolidation and tax audits by senior CAs.',
    keywords: ['gstr-9 filing', 'gst annual return', 'gstr-9c reconciliation', 'gst audit'],
    iconName: 'FileSpreadsheet',
    featured: false,
    processingTime: '5 - 7 Business Days',
    requiredDocuments: ['Annual sales ledger', 'Monthly GSTR-1 & 3B logs', 'Audited financial reports'],
    benefits: ['Consolidates all errors made in monthly files', 'Mandatory compliance to avoid tax audit notices', 'Clean ledger reports'],
    faqReference: [{ q: 'Who needs to file GSTR-9?', a: 'Registered taxpayers with an annual turnover exceeding ₹2 Crores must file GSTR-9.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-annual-return',
    futurePage: '/services/gst-annual-return'
  },
  {
    id: 'gst-notice-reply',
    slug: 'gst-notice-reply',
    category: 'GST & Indirect Tax',
    title: 'GST Notice Reply',
    shortDescription: 'Draft and file legal responses to GST show cause notices (ASMT-10, DRC-01).',
    description: 'If you receive GST demand notices, scrutiny notices (ASMT-10), or discrepancies alerts in GSTR-1 and GSTR-3B, our expert CAs draft legal responses to defend your calculations and avoid high tax penalties.',
    metaTitle: 'GST Notice Reply online | DRC-01 & ASMT-10 Response | ClearFiling',
    metaDescription: 'Received a GST notice? Sincere replies drafted by verified tax professionals to resolve disputes.',
    keywords: ['gst notice reply', 'asmt-10 reply', 'drc-01 show cause notice', 'gst scrutiny reply'],
    iconName: 'ShieldAlert',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Copy of notice received', 'Sales/Purchase records of matching period', 'Reason for discrepancies statement'],
    benefits: ['Defends business against wrongful tax demands', 'Reduces penalties and interest liabilities', 'Prevents ledger freeze actions by officers'],
    faqReference: [{ q: 'What is ASMT-10?', a: 'ASMT-10 is a notice issued by a tax officer to point out tax returns discrepancies discovered during audit.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-notice-reply',
    futurePage: '/services/gst-notice-reply'
  },
  {
    id: 'gst-amendment',
    slug: 'gst-amendment',
    category: 'GST & Indirect Tax',
    title: 'GST Amendment',
    shortDescription: 'Amend GST registration details (change business address, trade name, or promoters).',
    description: 'Update core and non-core fields in your GST registration profile, such as trade name change, partner/director addition, or registered business address shifts.',
    metaTitle: 'GST Registration Amendment Online | ClearFiling',
    metaDescription: 'Update GST registration details. File amendments for address, phone, or partners.',
    keywords: ['gst amendment', 'change address in gst', 'gst profile update', 'core field amendment'],
    iconName: 'FileCheck2',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['GST certificate copy', 'Proof of change (New rent agreement / Board resolution)', 'Promoter KYC (if changing promoter)'],
    benefits: ['Maintains legally updated GST registry profiles', 'Avoids address matching errors on invoicing', 'Ensures compliant returns filing'],
    faqReference: [{ q: 'What are core fields in GST amendment?', a: 'Core fields include business name, addition of stakeholders, and registered office address.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-amendment',
    futurePage: '/services/gst-amendment'
  },
  {
    id: 'gst-revocation',
    slug: 'gst-revocation',
    category: 'GST & Indirect Tax',
    title: 'GST Revocation',
    shortDescription: 'Revoke cancelled GST registrations. File within timelines to restore GSTIN.',
    description: 'If your GST registration was cancelled by a tax officer due to non-filing of returns, we can apply for revocation of cancellation to restore your GSTIN active.',
    metaTitle: 'Revocation of GST Cancellation Online | Restore GSTIN | ClearFiling',
    metaDescription: 'Restore your cancelled GSTIN. Sincere filing of revocation applications with tax offices.',
    keywords: ['gst revocation', 'restore cancelled gst', 'gst activation', 'revocation application'],
    iconName: 'FileCheck2',
    featured: false,
    processingTime: '5 - 10 Business Days',
    requiredDocuments: ['Cancellation order copy', 'Pending returns invoices database', 'Revocation application memo'],
    benefits: ['Restores your active trade invoicing status', 'Avoids starting a new registration process', 'Resolve past liabilities cleanly'],
    faqReference: [{ q: 'What is the limit to apply for GST revocation?', a: 'An application must be filed within 90 days from the cancellation order date.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-revocation',
    futurePage: '/services/gst-revocation'
  },
  {
    id: 'gst-cancellation',
    slug: 'gst-cancellation',
    category: 'GST & Indirect Tax',
    title: 'GST Cancellation',
    shortDescription: 'Surrender or cancel GST registration online for closed businesses.',
    description: 'File applications to cancel or surrender your GSTIN if you have shut down business activities or fall below threshold limits, avoiding mandatory filing liabilities.',
    metaTitle: 'Cancel GST Registration Online | Surrender GSTIN | ClearFiling',
    metaDescription: 'Surrender your GST registration online. Reconcile final liabilities and file clean surrenders.',
    keywords: ['gst cancellation', 'surrender gst certificate', 'gst closure', 'cancel gstin'],
    iconName: 'FileCheck2',
    featured: false,
    processingTime: '4 - 7 Business Days',
    requiredDocuments: ['GSTIN credentials', 'Final sales database', 'Reason statement for surrendering'],
    benefits: ['Stop mandatory zero-return filings requirements', 'Save compliance costs on unused registration', 'Avoid default notices'],
    faqReference: [{ q: 'Can I cancel GST if returns are pending?', a: 'All pending tax liabilities and returns must be cleared before requesting cancellation.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-cancellation',
    futurePage: '/services/gst-cancellation'
  },
  {
    id: 'gst-lut',
    slug: 'gst-lut',
    category: 'GST & Indirect Tax',
    title: 'GST LUT',
    shortDescription: 'File Letter of Undertaking (LUT) to export goods/services without paying IGST.',
    description: 'Letter of Undertaking (LUT) is filed on the GST portal to export products or services without payment of Integrated GST (IGST), saving significant working capital cashflows.',
    metaTitle: 'GST LUT Filing Online | Export without IGST | ClearFiling',
    metaDescription: 'File your Letter of Undertaking (LUT) online. Crucial for exporters and software agencies.',
    keywords: ['gst lut', 'letter of undertaking', 'lut filing online', 'export without tax', 'lut for exporters'],
    iconName: 'FileCheck2',
    featured: false,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: ['GSTIN credentials', 'PAN & Aadhaar of applicant', 'Details of two witnesses'],
    benefits: ['Export services/goods at 0% tax rate legally', 'Protects business working capital reserves', 'Simple annual processing online'],
    faqReference: [{ q: 'How long is a GST LUT valid?', a: 'LUT is valid for one financial year and must be refiled every April.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-lut',
    futurePage: '/services/gst-lut'
  },
  {
    id: 'gst-foreign-business',
    slug: 'gst-foreign-business',
    category: 'GST & Indirect Tax',
    title: 'GST for Foreign Businesses',
    shortDescription: 'GST registration and compliance management for non-resident taxable foreign entities.',
    description: 'We assist foreign companies supplying services or goods in India to register as Non-Resident Taxable Persons (NRTP) and handle monthly tax filings.',
    metaTitle: 'GST Registration for Foreign Entities India | ClearFiling',
    metaDescription: 'Compliance support for foreign corporate entities. Setup NRTP GST accounts legally.',
    keywords: ['foreign business gst', 'nrtp registration', 'non resident taxable person', 'international tax india'],
    iconName: 'Globe',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Foreign incorporate certificate (tax identification)', 'Board resolution authorizing Indian agent', 'Indian representative KYC'],
    benefits: ['Legally serve products in the Indian marketplace', 'Claim Input tax offsets on Indian imports', 'Transparent cross-border setup'],
    faqReference: [{ q: 'What is the validity of an NRTP GST registration?', a: 'It is typically issued for 90 days, extendable by another 90 days.' }],
    canonicalSlug: 'https://clearfiling.in/services/gst-foreign-business',
    futurePage: '/services/gst-foreign-business'
  },
  {
    id: 'virtual-office-gst',
    slug: 'virtual-office-gst',
    category: 'GST & Indirect Tax',
    title: 'Virtual Office + GST',
    shortDescription: 'Acquire commercial virtual office address with full NOC for GST registration.',
    description: 'For remote startups and digital firms, we arrange a virtual commercial office address complete with Rent Deed, NOC, and Electricity Bill to register for GST.',
    metaTitle: 'Virtual Office Address for GST Registration | ClearFiling',
    metaDescription: 'Secure virtual office locations in premium cities for GST registration. Includes NOC, rent deed, and mail handling.',
    keywords: ['virtual office gst', 'virtual address NOC', 'gst registration address', 'remote startup office'],
    iconName: 'Building2',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Promoter Identity proof', 'Incorporation details of business', 'GST profile requirement info'],
    benefits: ['Premium corporate business address at low cost', 'Complete legally compliant GST registration NOC documents', 'Mail collection and sorting services'],
    faqReference: [{ q: 'Is virtual office legal for GST registration?', a: 'Yes, provided a physical space partition and valid NOC agreements exist.' }],
    canonicalSlug: 'https://clearfiling.in/services/virtual-office-gst',
    futurePage: '/services/virtual-office-gst'
  },

  // ==========================================
  // INCOME TAX SERVICES (9 Services)
  // ==========================================
  {
    id: 'income-tax-filing',
    slug: 'income-tax-filing',
    category: 'Income Tax Services',
    title: 'Individual ITR',
    shortDescription: 'File Income Tax Return (ITR-1, ITR-2) online. Optimized deductions under Section 80C.',
    description: 'Accurate tax filing for salaried, freelancing, and capital gain investors. We assess your income, compile TDS credits, and optimize tax savings legitimately.',
    metaTitle: 'Individual ITR Filing Online | File Income Tax Return | ClearFiling',
    metaDescription: 'File your personal income tax returns online. Senior CA review to ensure maximum deductions and avoid errors.',
    keywords: ['itr filing', 'individual itr-1', 'income tax return', 'itr-2 online', 'tax refund'],
    iconName: 'DollarSign',
    featured: true,
    processingTime: '2 - 3 Business Days',
    requiredDocuments: ['PAN & Aadhaar', 'Form 16 / Form 26AS / AIS', 'Bank statements (financial year)', 'Investment proof documents'],
    benefits: [
      'Avoid high interest and penalties for delayed filings',
      'Maximize deductions and claim eligible tax refunds',
      'Strong financial proof needed for bank loan and visa approvals',
      'Clean credit history record'
    ],
    faqReference: [{ q: 'Which ITR should a salaried person file?', a: 'ITR-1 (Sahaj) is filed by individuals with salary income up to ₹50 Lakhs.' }],
    canonicalSlug: 'https://clearfiling.in/services/income-tax-filing',
    futurePage: '/services/income-tax-filing'
  },
  {
    id: 'business-itr',
    slug: 'business-itr',
    category: 'Income Tax Services',
    title: 'Business ITR',
    shortDescription: 'File business income tax return (ITR-3, ITR-4 presumptive taxation).',
    description: 'ITR filing for sole proprietors, professionals, and businesses. File returns under Presumptive Taxation (Section 44AD/44ADA) to claim profit margins without detailed ledger audits.',
    metaTitle: 'Business Tax Return Filing Online | ITR-3 & ITR-4 | ClearFiling',
    metaDescription: 'File your business ITR online. Complete analysis under Presumptive Taxation by tax experts.',
    keywords: ['business itr', 'itr-4 presumptive tax', 'itr-3 filing', 'proprietorship tax return', 'tax audit return'],
    iconName: 'Briefcase',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Business sales database', 'Bank statement of business accounts', 'PAN of promoter', 'TDS credit logs'],
    benefits: ['Presumptive filing options save bookkeeping costs', 'Build credit profile for commercial loans', 'Stay fully compliant'],
    faqReference: [{ q: 'What is Section 44AD presumptive taxation?', a: 'It allows small businesses with turnover below ₹2 Crores to declare profit at 8% (6% for digital sales) without maintaining books.' }],
    canonicalSlug: 'https://clearfiling.in/services/business-itr',
    futurePage: '/services/business-itr'
  },
  {
    id: 'company-itr',
    slug: 'company-itr',
    category: 'Income Tax Services',
    title: 'Company ITR',
    shortDescription: 'File corporate income tax return (ITR-6) for registered private companies.',
    description: 'Corporate tax return filing is mandatory for all registered companies regardless of profit or loss. We draft audited balance sheets and submit ITR-6 files accurately.',
    metaTitle: 'Company ITR-6 Filing Services online India | ClearFiling',
    metaDescription: 'Mandatory corporate ITR-6 filing. Financial statement review and tax audits led by CAs.',
    keywords: ['company itr', 'itr-6 filing online', 'corporate tax return', 'balance sheet audit'],
    iconName: 'Building2',
    featured: false,
    processingTime: '5 - 10 Business Days',
    requiredDocuments: ['Audited Profit & Loss Statement', 'Balance Sheet and ledger details', 'Director details and PAN', 'TDS deduction certificates'],
    benefits: ['Fulfill statutory MCA and tax portal compliances', 'Carry forward business losses to offset future profits', 'Avoid company status cancellation warnings'],
    faqReference: [{ q: 'Is ITR mandatory for a loss-making company?', a: 'Yes, filing ITR-6 is mandatory for all companies, even if there is zero business activity or loss.' }],
    canonicalSlug: 'https://clearfiling.in/services/company-itr',
    futurePage: '/services/company-itr'
  },
  {
    id: 'llp-itr',
    slug: 'llp-itr',
    category: 'Income Tax Services',
    title: 'LLP ITR',
    shortDescription: 'File ITR-5 for Limited Liability Partnerships (LLP) and partnership firms.',
    description: 'LLPs and Partnerships must file ITR-5 annually. We compile partnership income, adjust salary/interest paid to partners, and file returns securely.',
    metaTitle: 'LLP ITR-5 Filing online | Partnership Tax Return | ClearFiling',
    metaDescription: 'File tax returns for partnerships and LLPs. Complete deduction optimization for partners.',
    keywords: ['llp tax filing', 'itr-5 online', 'partnership tax return', 'partner salary tax deductions'],
    iconName: 'Scale',
    featured: false,
    processingTime: '4 - 7 Business Days',
    requiredDocuments: ['Partnership deed copy', 'Financial statement of firm', 'KYC of partners', 'Partner ledger accounts'],
    benefits: ['Claim deductions on partner salary & interest', 'Fulfill statutory partnership legal requirements', 'Establish loan credentials'],
    faqReference: [{ q: 'What is the tax rate for LLPs?', a: 'LLPs are taxed at a flat rate of 30% plus applicable surcharge and cess.' }],
    canonicalSlug: 'https://clearfiling.in/services/llp-itr',
    futurePage: '/services/llp-itr'
  },
  {
    id: 'ngo-tax-filing',
    slug: 'ngo-tax-filing',
    category: 'Income Tax Services',
    title: 'NGO Tax Filing',
    shortDescription: 'File ITR-7 for charitable trusts, societies, and Section 8 NGOs.',
    description: 'NGOs holding 12A/12AB tax registrations must file ITR-7 annually. We ensure compliance with the application of income rules (85% utilization threshold) to maintain tax exemption status.',
    metaTitle: 'NGO ITR-7 Filing Online | Trust Tax Returns | ClearFiling',
    metaDescription: 'File annual returns for your charitable trust or NGO. Ensure compliance with NGO tax exemption laws.',
    keywords: ['ngo tax filing', 'itr-7 online', 'trust tax return', '12a compliance'],
    iconName: 'Landmark',
    featured: false,
    processingTime: '7 - 12 Business Days',
    requiredDocuments: ['Books of accounts & donation registers', '12A & 80G registration certificates', 'Details of trustees', 'Income application proof'],
    benefits: ['Retains tax-free NGO income status', 'Clear record of donor funds for audits', 'Avoid tax revocation notices'],
    faqReference: [{ q: 'What is the income utilization limit for NGOs?', a: 'NGOs must apply at least 85% of their income to charitable purposes in India annually.' }],
    canonicalSlug: 'https://clearfiling.in/services/ngo-tax-filing',
    futurePage: '/services/ngo-tax-filing'
  },
  {
    id: 'tds-return',
    slug: 'tds-return',
    category: 'Income Tax Services',
    title: 'TDS Return',
    shortDescription: 'Quarterly TDS return filing (Form 24Q, 26Q, 27Q). Issue Form 16/16A certificates.',
    description: 'File quarterly TDS returns to report tax deducted on salaries, contractor payments, and rents, and generate TRACES Form 16/16A certificates for payees.',
    metaTitle: 'TDS Return Filing Online | TRACES Filing Form 26Q & 24Q | ClearFiling',
    metaDescription: 'File your quarterly TDS returns. Reconcile PAN inputs to avoid late penalties and interest fees.',
    keywords: ['tds return filing', 'form 26q online', 'form 24q filing', 'traces tds', 'form 16 certificate'],
    iconName: 'DollarSign',
    featured: false,
    processingTime: 'Quarterly Schedule',
    requiredDocuments: ['TDS deduction challans', 'PAN list of deductees', 'Payment registers'],
    benefits: ['Ensures deductees get tax credit in Form 26AS', 'Avoid late filing fees of ₹200/day under tax laws', 'Accurate compliance'],
    faqReference: [{ q: 'What is the due date for quarterly TDS filing?', a: 'TDS returns must be filed within 31 days from the end of each quarter.' }],
    canonicalSlug: 'https://clearfiling.in/services/tds-return',
    futurePage: '/services/tds-return'
  },
  {
    id: 'tan-registration',
    slug: 'tan-registration',
    category: 'Income Tax Services',
    title: 'TAN Registration',
    shortDescription: 'Get Tax Deduction Account Number (TAN). Mandatory for entities deducting tax at source.',
    description: 'Secure your 10-digit alphanumeric TAN code legally required for any individual or corporate business making TDS deductions.',
    metaTitle: 'TAN Registration Online India | Apply for TAN Code | ClearFiling',
    metaDescription: 'Acquire your business TAN code online. Simple processing under Income Tax guidelines.',
    keywords: ['tan registration', 'apply for tan', 'tax deduction account number', 'tan application'],
    iconName: 'FileCheck2',
    featured: false,
    processingTime: '2 - 3 Business Days',
    requiredDocuments: ['PAN of the business promoter/entity', 'Identity and address proof of deductor'],
    benefits: ['Mandatory code for collecting and filing TDS', 'Avoid heavy penalties for missing TAN references', 'Lifetime validity code'],
    faqReference: [{ q: 'Is PAN required for TAN registration?', a: 'Yes, PAN of the applicant or corporate entity is mandatory.' }],
    canonicalSlug: 'https://clearfiling.in/services/tan-registration',
    futurePage: '/services/tan-registration'
  },
  {
    id: 'income-tax-notice',
    slug: 'income-tax-notice',
    category: 'Income Tax Services',
    title: 'Income Tax Notice',
    shortDescription: 'Draft replies for tax notices (Section 143(1), 139(9) defective return, or 148).',
    description: 'Received a tax notice? We draft detailed legal counter-replies to address discrepancy notices, defective returns (Section 139(9)), or tax reassessments.',
    metaTitle: 'Income Tax Notice Reply Online | Defective Return 139(9) Reply | ClearFiling',
    metaDescription: 'Draft counter-replies for Income Tax notices. Sincere CA representation to resolve notices.',
    keywords: ['income tax notice', 'defective return reply', 'section 143(1) notice', 'tax scrutiny reply'],
    iconName: 'ShieldAlert',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Copy of notice from department', 'Original ITR filing transcript', 'Financial records matching period'],
    benefits: ['Saves applicant from hefty tax assessments', 'Corrects defect errors on filing portals', 'Resolves tax disputes safely'],
    faqReference: [{ q: 'What is a defective return under Section 139(9)?', a: 'It means the tax department found missing info or errors in your filed ITR.' }],
    canonicalSlug: 'https://clearfiling.in/services/income-tax-notice',
    futurePage: '/services/income-tax-notice'
  },
  {
    id: 'revised-return',
    slug: 'revised-return',
    category: 'Income Tax Services',
    title: 'Revised Return',
    shortDescription: 'Correct mistakes in filed ITR. File a revised tax return under Section 139(5).',
    description: 'If you made an error in your filed ITR (omitted income details, wrong deductions, or ledger mismatches), we can file a revised return to correct the data.',
    metaTitle: 'Revised ITR Filing Online | Section 139(5) Revised Return | ClearFiling',
    metaDescription: 'Revise your income tax returns. Correct errors and claim refunds legally.',
    keywords: ['revised return ITR', 'section 139(5) revision', 'correct filing mistakes', 'revise tax return'],
    iconName: 'DollarSign',
    featured: false,
    processingTime: '2 - 3 Business Days',
    requiredDocuments: ['Original ITR acknowledgment copy', 'Correction details database', 'New bank or income details'],
    benefits: ['Corrects error statements before scrutiny triggers', 'Avoids notices for mismatching data', 'Legally allowed updates'],
    faqReference: [{ q: 'What is the time limit to file a revised return?', a: 'You can revise a return at any time before 3 months prior to the end of the assessment year.' }],
    canonicalSlug: 'https://clearfiling.in/services/revised-return',
    futurePage: '/services/revised-return'
  },

  // ==========================================
  // CORPORATE COMPLIANCE (12 Services)
  // ==========================================
  {
    id: 'annual-compliance',
    slug: 'annual-compliance',
    category: 'Corporate Compliance',
    title: 'Annual Compliance',
    shortDescription: 'Annual filing compliances for Private Limited Companies (Form AOC-4 and MGT-7).',
    description: 'Ensure your private limited company remains active on the MCA register. We draft board resolutions, prepare financial statements, file AOC-4 (financials), and submit MGT-7 (annual returns) annually.',
    metaTitle: 'Company Annual Compliance online | AOC-4 and MGT-7 Filing | ClearFiling',
    metaDescription: 'Manage your company\'s annual compliance filings. Handled by verified CAs and CSs to avoid hefty ROC late fees.',
    keywords: ['annual compliance pvt ltd', 'aoc-4 filing', 'mgt-7 filing', 'roc compliance online', 'company annual compliance'],
    iconName: 'FileSpreadsheet',
    featured: true,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: [
      'Directors Report & Financial Ledgers',
      'Audited Profit & Loss/Balance sheet',
      'Active DSC of two Directors',
      'Shareholding pattern details'
    ],
    benefits: [
      'Maintain "Active" company status on the MCA registry portal',
      'Avoid high late filing penalties of ₹100/day per form',
      'Clean compliance status necessary for raising investor funding',
      'Protects directors from disqualification actions'
    ],
    faqReference: [{ q: 'What is the penalty for late ROC filings?', a: 'The delay penalty is ₹100 per day per form (AOC-4 and MGT-7) with no upper cap.' }],
    canonicalSlug: 'https://clearfiling.in/services/annual-compliance',
    futurePage: '/services/annual-compliance'
  },
  {
    id: 'llp-compliance',
    slug: 'llp-compliance',
    category: 'Corporate Compliance',
    title: 'LLP Compliance',
    shortDescription: 'Annual compliance filings for LLPs (Form 8 and Form 11 returns).',
    description: 'Limited Liability Partnerships must file Form 11 (Annual Return) and Form 8 (Statement of Accounts) to the Registrar of Companies annually.',
    metaTitle: 'LLP Annual Compliance Filing online | Form 8 & Form 11 | ClearFiling',
    metaDescription: 'Manage your LLP\'s annual compliance. Timely filings to avoid penalties.',
    keywords: ['llp compliance', 'llp form 8 filing', 'llp form 11 return', 'annual return llp'],
    iconName: 'Scale',
    featured: false,
    processingTime: '5 - 10 Business Days',
    requiredDocuments: ['Account statement of LLP', 'Partner details update records', 'Active DSC of partners'],
    benefits: ['Protects partners against heavy regulatory penalties', 'Keeps LLP active on register', 'Smooth banking operations'],
    faqReference: [{ q: 'What is the due date for LLP Form 11?', a: 'Form 11 must be filed by 30th May, and Form 8 by 30th October every year.' }],
    canonicalSlug: 'https://clearfiling.in/services/llp-compliance',
    futurePage: '/services/llp-compliance'
  },
  {
    id: 'opc-compliance',
    slug: 'opc-compliance',
    category: 'Corporate Compliance',
    title: 'OPC Compliance',
    shortDescription: 'Annual secretarial filings and accounting compliance for One Person Companies.',
    description: 'Manage ROC annual compliance filings for One Person Companies. Includes AOC-4 financial filings and MGT-7A simplified annual returns.',
    metaTitle: 'OPC Annual Compliance Online | One Person Company Filing | ClearFiling',
    metaDescription: 'Annual filings for OPC. Sincere CA/CS compliance support.',
    keywords: ['opc compliance', 'opc aoc-4 filing', 'mgt-7a filing online', 'one person company return'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '7 - 10 Business Days',
    requiredDocuments: ['Financial statement of OPC', 'Promoter identity logs', 'Nominee details'],
    benefits: ['Maintains corporate legal validity', 'Clear credit status', 'Avoids default penalties'],
    faqReference: [{ q: 'Does OPC require physical board meetings?', a: 'No, OPC is exempt from holding annual general meetings and physical board meetings.' }],
    canonicalSlug: 'https://clearfiling.in/services/opc-compliance',
    futurePage: '/services/opc-compliance'
  },
  {
    id: 'din-kyc',
    slug: 'din-kyc',
    category: 'Corporate Compliance',
    title: 'DIN KYC',
    shortDescription: 'Annual Director DIR-3 KYC compliance. Mandatory to avoid DIN deactivation.',
    description: 'Every individual holding a Director Identification Number (DIN) must submit DIR-3 KYC details to the MCA annually to keep their DIN active.',
    metaTitle: 'DIR-3 DIN KYC Filing Online | Active DIN compliance | ClearFiling',
    metaDescription: 'Complete your annual DIR-3 KYC filing online. Avoid deactivation and ₹5,000 late fees.',
    keywords: ['din kyc', 'dir-3 kyc filing', 'director kyc online', 'reactivate din'],
    iconName: 'UserCheck',
    featured: false,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: ['PAN & Aadhaar of Director', 'Personal Mobile & Email for OTP verification', 'DSC of the Director'],
    benefits: ['Prevents deactivation of director status', 'Avoids steep penalty fee of ₹5,000 for delay', 'Enables director to sign corporate forms'],
    faqReference: [{ q: 'What happens if DIN KYC is not filed?', a: 'The DIN is deactivated, and a late fee of ₹5,000 is charged to reactivate it.' }],
    canonicalSlug: 'https://clearfiling.in/services/din-kyc',
    futurePage: '/services/din-kyc'
  },
  {
    id: 'director-change',
    slug: 'director-change',
    category: 'Corporate Compliance',
    title: 'Director Change',
    shortDescription: 'Add a new director or file resignation for an existing director (DIR-12 filing).',
    description: 'Apply for the appointment of a new director or process director resignations legally by drafting board resolutions and filing Form DIR-12 with the ROC.',
    metaTitle: 'Add or Remove Company Director Online | DIR-12 Filing | ClearFiling',
    metaDescription: 'Process appointments and resignations of company directors. Sincere legal documentation support.',
    keywords: ['change director', 'add director online', 'director resignation', 'dir-12 filing'],
    iconName: 'Building2',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Board Resolution & Consent letter', 'DIN & KYC of the new director', 'Resignation letter (for removal)', 'DSC of director'],
    benefits: ['Legally valid corporate structural changes', 'Updates public registry logs instantly', 'Smooth corporate transitions'],
    faqReference: [{ q: 'What is DIR-12?', a: 'DIR-12 is the ROC form filed to notify changes in directors or key managerial personnel.' }],
    canonicalSlug: 'https://clearfiling.in/services/director-change',
    futurePage: '/services/director-change'
  },
  {
    id: 'registered-office-change',
    slug: 'registered-office-change',
    category: 'Corporate Compliance',
    title: 'Registered Office Change',
    shortDescription: 'Change registered business address (within city, state, or outside state).',
    description: 'File address change requests (Form INC-22) with the Registrar of Companies to shift your registered office within the same city, state, or to a new state.',
    metaTitle: 'Registered Office Address Change Online | INC-22 Filing | ClearFiling',
    metaDescription: 'Update company registered office address on the MCA portal. Draft NOC and rent agreements.',
    keywords: ['registered office change', 'inc-22 filing online', 'change company address', 'mca address update'],
    iconName: 'Building2',
    featured: false,
    processingTime: '5 - 10 Business Days',
    requiredDocuments: ['New Rent Agreement & Electricity Bill', 'NOC from landlord', 'Board Resolution details'],
    benefits: ['Maintains legally valid corporate communication channel', 'Aligns GST and company registries', 'Avoids non-compliance notices'],
    faqReference: [{ q: 'Which form is filed for office address change?', a: 'Form INC-22 is submitted to the ROC for registered office updates.' }],
    canonicalSlug: 'https://clearfiling.in/services/registered-office-change',
    futurePage: '/services/registered-office-change'
  },
  {
    id: 'share-transfer',
    slug: 'share-transfer',
    category: 'Corporate Compliance',
    title: 'Share Transfer',
    shortDescription: 'Transfer equity shares in a private company (SH-4 filing & share certificates).',
    description: 'Draft share transfer deeds (Form SH-4), pay stamp duty, cancel existing certificates, and issue new share certificates to transfer ownership in a private company.',
    metaTitle: 'Share Transfer in Private Limited Company | SH-4 Filing | ClearFiling',
    metaDescription: 'Transfer company shares legally. Professional SH-4 deed drafting and board resolutions support.',
    keywords: ['share transfer', 'form sh-4 filing', 'share transfer deed', 'transfer equity company'],
    iconName: 'FileSpreadsheet',
    featured: false,
    processingTime: '7 - 10 Business Days',
    requiredDocuments: ['Share Transfer Deed (SH-4)', 'Share certificates to be transferred', 'Identity proof of transferor and transferee', 'Board Resolution'],
    benefits: ['Legally valid transfer of business equity', 'Accurate updates in company register of members', 'Saves stamp duty penalty risks'],
    faqReference: [{ q: 'Is stamp duty payable on share transfers?', a: 'Yes, stamp duty of 0.015% is payable on the value of shares transferred.' }],
    canonicalSlug: 'https://clearfiling.in/services/share-transfer',
    futurePage: '/services/share-transfer'
  },
  {
    id: 'moa-amendment',
    slug: 'moa-amendment',
    category: 'Corporate Compliance',
    title: 'MOA Amendment',
    shortDescription: 'Amend Memorandum of Association (MOA) to change business objects (MGT-14 filing).',
    description: 'Modify the object clause, name clause, or capital clause of your Memorandum of Association (MOA) by passing special resolutions and filing Form MGT-14.',
    metaTitle: 'MOA Object Clause Amendment Online | MGT-14 Filing | ClearFiling',
    metaDescription: 'Amend your company Memorandum of Association objects clause. Complete board resolution drafting support.',
    keywords: ['moa amendment', 'change business object', 'mgt-14 filing', 'memorandum of association object'],
    iconName: 'Building2',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Copy of existing MOA & AOA', 'Proposed new object clause draft', 'Notice and minutes of board meeting'],
    benefits: ['Pivot business activities legally', 'Expands commercial operating limits', 'Compliant MCA records'],
    faqReference: [{ q: 'Which form is filed for changing business objects?', a: 'Form MGT-14 must be filed with the ROC within 30 days of passing the special resolution.' }],
    canonicalSlug: 'https://clearfiling.in/services/moa-amendment',
    futurePage: '/services/moa-amendment'
  },
  {
    id: 'aoa-amendment',
    slug: 'aoa-amendment',
    category: 'Corporate Compliance',
    title: 'AOA Amendment',
    shortDescription: 'Amend Articles of Association (AOA) to change company internal rules.',
    description: 'Modify company internal bylaws (Articles of Association - AOA) regarding management, voting rights, share transfer restrictions, or board structures.',
    metaTitle: 'AOA Articles of Association Amendment Online | ClearFiling',
    metaDescription: 'Amend company Articles of Association. Professional corporate drafting and ROC filings.',
    keywords: ['aoa amendment', 'articles of association', 'mgt-14 aoa update'],
    iconName: 'Building2',
    featured: false,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: ['Existing AOA copy', 'Special resolution text details', 'Board meeting documentation'],
    benefits: ['Align articles with new investor agreements', 'Change voting structures legally', 'Ensures smooth management'],
    faqReference: [{ q: 'Is shareholder approval required to amend AOA?', a: 'Yes, a special resolution requiring 75% approval from shareholders is mandatory.' }],
    canonicalSlug: 'https://clearfiling.in/services/aoa-amendment',
    futurePage: '/services/aoa-amendment'
  },
  {
    id: 'authorized-capital-increase',
    slug: 'authorized-capital-increase',
    category: 'Corporate Compliance',
    title: 'Authorized Capital Increase',
    shortDescription: 'Increase company authorized share capital limit (Form SH-7 filing).',
    description: 'Raise the maximum value of shares your company is authorized to issue to shareholders by paying requisite government stamp duty and filing Form SH-7.',
    metaTitle: 'Increase Authorized Share Capital Online | Form SH-7 | ClearFiling',
    metaDescription: 'Raise your company\'s authorized capital. Complete board resolution drafting and stamp duty coordination.',
    keywords: ['increase authorized capital', 'form sh-7 filing', 'share capital stamp duty', 'raise capital limit'],
    iconName: 'FileSpreadsheet',
    featured: false,
    processingTime: '7 - 10 Business Days',
    requiredDocuments: ['Copy of MOA/AOA', 'Board Resolution details', 'Details of proposed capital increase amount'],
    benefits: ['Enable issuance of new equity shares to investors', 'Increases corporate transaction limits', 'Smooth legal process'],
    faqReference: [{ q: 'What is the government fee to increase capital?', a: 'Government fee and stamp duty depend on the capital amount and the state of registration.' }],
    canonicalSlug: 'https://clearfiling.in/services/authorized-capital-increase',
    futurePage: '/services/authorized-capital-increase'
  },
  {
    id: 'dormant-company-filing',
    slug: 'dormant-company-filing',
    category: 'Corporate Compliance',
    title: 'Dormant Company Filing',
    shortDescription: 'Apply for Dormant Company status (Form MSC-1) to pause business compliances.',
    description: 'If your company is temporarily inactive with no significant accounting transactions, you can apply for "Dormant" status (Form MSC-1) to reduce yearly audit compliances while retaining corporate name rights.',
    metaTitle: 'Apply for Dormant Company Status Online | MSC-1 Filing | ClearFiling',
    metaDescription: 'Pause compliance operations for inactive companies. Secure dormant status from ROC.',
    keywords: ['dormant company status', 'msc-1 filing online', 'inactive company compliance', 'pause company filing'],
    iconName: 'Building2',
    featured: false,
    processingTime: '15 - 20 Business Days',
    requiredDocuments: ['Audited financial ledgers', 'Board and shareholder consent resolution', 'Assets and liabilities certificate'],
    benefits: ['Drastically reduces yearly audit and compliance filing fees', 'Retains company name rights for future use', 'Avoid strike-off notices'],
    faqReference: [{ q: 'How long can a company remain dormant?', a: 'A company can hold dormant status for a maximum of 5 consecutive years.' }],
    canonicalSlug: 'https://clearfiling.in/services/dormant-company-filing',
    futurePage: '/services/dormant-company-filing'
  },
  {
    id: 'company-closure',
    slug: 'company-closure',
    category: 'Corporate Compliance',
    title: 'Company Closure',
    shortDescription: 'Wind up or strike off registered company online (Form STK-2 filing).',
    description: 'Legally close down an inactive company and strike off its name from the Registrar of Companies by filing Form STK-2, avoiding lifetime compliance default liabilities.',
    metaTitle: 'Company Closure online India | STK-2 Strike Off | ClearFiling',
    metaDescription: 'Legally wind up your inactive business. Fast STK-2 filings with expert CA and CS oversight.',
    keywords: ['company closure', 'strike off pvt ltd', 'form stk-2 filing', 'close business entity'],
    iconName: 'Building2',
    featured: false,
    processingTime: '3 - 6 Months (ROC Dependent)',
    requiredDocuments: ['Zero liability statement (audited)', 'Bank closure certificate', 'Promoter indemnity bond', 'DSC of all directors'],
    benefits: ['Stop all statutory monthly/yearly filing requirements', 'Save directors from future regulatory disqualifications', 'Legally sound wind up process'],
    faqReference: [{ q: 'When can a company apply for strike-off?', a: 'A company can apply if it has been inactive for a minimum of 2 consecutive years.' }],
    canonicalSlug: 'https://clearfiling.in/services/company-closure',
    futurePage: '/services/company-closure'
  },

  // ==========================================
  // INTERNATIONAL BUSINESS SERVICES (6 Services)
  // ==========================================
  {
    id: 'uae-company-setup',
    slug: 'uae-company-setup',
    category: 'International Business Services',
    title: 'UAE Company Setup',
    shortDescription: 'Setup business in Dubai and UAE Free Zones. Complete license and residency support.',
    description: 'Incorporate your business in the UAE (Dubai Mainland or Free Zones) to enjoy a tax-friendly business environment, premium global logistics, and access to UAE residence visas for founders.',
    metaTitle: 'UAE Company Setup | Dubai Free Zone Incorporation | ClearFiling',
    metaDescription: 'Expand business to Dubai. Setup UAE mainland or free zone entities. 100% remote process coordination.',
    keywords: ['uae company setup', 'dubai business registration', 'dubai free zone company', 'incorporation in dubai'],
    iconName: 'Globe',
    featured: true,
    processingTime: '10 - 15 Business Days',
    requiredDocuments: [
      'Passport Copy of the promoters',
      'Address proof of directors',
      'Proposed business activity description',
      'Visa copy / Entry stamp'
    ],
    benefits: [
      'Access to a 0% corporate tax regime (subject to thresholds)',
      '100% foreign business ownership in UAE Free Zones',
      'Acquire resident visa facilities for founders and families',
      'Strategic global trading hub connection'
    ],
    faqReference: [{ q: 'Is physical travel mandatory to setup a Dubai company?', a: 'Most Free Zone registrations can be fully completed remotely without traveling.' }],
    canonicalSlug: 'https://clearfiling.in/services/uae-company-setup',
    futurePage: '/services/uae-company-setup'
  },
  {
    id: 'usa-company-registration',
    slug: 'usa-company-registration',
    category: 'International Business Services',
    title: 'USA Company Registration',
    shortDescription: 'Register a US LLC or C-Corp online. Complete Delaware/Wyoming filing and EIN acquisition.',
    description: 'Establish your business in the USA as an LLC or C-Corp (Delaware or Wyoming). Includes Article of Organization filing, EIN registration, and assistance in opening US business bank accounts (Mercury/Wise).',
    metaTitle: 'US LLC Registration Online India | USA Incorporation | ClearFiling',
    metaDescription: 'Setup Delaware LLC or C-Corp from India. Complete registration support including EIN and corporate bank accounts.',
    keywords: ['us llc registration', 'delaware company setup', 'wyoming llc online', 'ein code registration', 'us c-corp'],
    iconName: 'Globe',
    featured: false,
    processingTime: '8 - 12 Business Days',
    requiredDocuments: ['Passport copy of promoter', 'Details of US registered agent', 'Business description details'],
    benefits: ['Acquire global SaaS payments access (Stripe, Paypal US)', 'High prestige and trust for selling in Western markets', 'Access US venture capital investors'],
    faqReference: [{ q: 'Which US state is best for IT startups?', a: 'Delaware is preferred for VC-backed C-Corps, while Wyoming is popular for bootstrap LLCs due to lower fees.' }],
    canonicalSlug: 'https://clearfiling.in/services/usa-company-registration',
    futurePage: '/services/usa-company-registration'
  },
  {
    id: 'uk-company-registration',
    slug: 'uk-company-registration',
    category: 'International Business Services',
    title: 'UK Company Registration',
    shortDescription: 'Incorporate a UK Limited Company (LTD). Complete HMRC filing and UK bank setup.',
    description: 'Setup a UK Limited (LTD) company remotely. Includes UK Companies House registration, corporate physical address routing, and virtual banking coordination.',
    metaTitle: 'UK LTD Company Registration Online India | ClearFiling',
    metaDescription: 'Register your UK Limited company. 100% remote process with Companies House.',
    keywords: ['uk company registration', 'uk ltd setup', 'companies house online', 'uk business registration'],
    iconName: 'Globe',
    featured: false,
    processingTime: '3 - 5 Business Days',
    requiredDocuments: ['Passport copy of Director', 'Registered address details', 'Share structure plan'],
    benefits: ['Extremely low setup cost and annual fees', 'Setup Wise/Payoneer corporate accounts instantly', 'Simple tax laws'],
    faqReference: [{ q: 'How long does UK registration take?', a: 'Companies House typically registers the LTD company within 24 to 48 hours.' }],
    canonicalSlug: 'https://clearfiling.in/services/uk-company-registration',
    futurePage: '/services/uk-company-registration'
  },
  {
    id: 'singapore-business-setup',
    slug: 'singapore-business-setup',
    category: 'International Business Services',
    title: 'Singapore Business Setup',
    shortDescription: 'Incorporate a Singapore Private Limited Company. Gateway to Southeast Asian markets.',
    description: 'Establish a Singapore entity to access Southeast Asian commercial networks. Includes ACRA registration, corporate secretary service, and resident nominee director coordination.',
    metaTitle: 'Singapore Company Registration Online | ACRA Setup | ClearFiling',
    metaDescription: 'Incorporate in Singapore. Complete corporate secretarial and ACRA filing support.',
    keywords: ['singapore company setup', 'acra registration', 'nominee director singapore', 'singapore pvt ltd'],
    iconName: 'Globe',
    featured: false,
    processingTime: '7 - 10 Business Days',
    requiredDocuments: ['Passport and Address proof of promoters', 'Nominee director agreement details', 'Corporate bank account requirements info'],
    benefits: ['Voted the world\'s easiest place to do business', 'Extremely low tax rates and startup tax exemption credits', 'Access to top Asian investment hubs'],
    faqReference: [{ q: 'Is a resident director mandatory in Singapore?', a: 'Yes, Singapore law requires a minimum of one local resident nominee director.' }],
    canonicalSlug: 'https://clearfiling.in/services/singapore-business-setup',
    futurePage: '/services/singapore-business-setup'
  },
  {
    id: 'overseas-trademark',
    slug: 'overseas-trademark',
    category: 'International Business Services',
    title: 'Overseas Trademark',
    shortDescription: 'Register trademarks in USA, UK, EU, or via Madrid Protocol.',
    description: 'Protect your brand name globally. We file international trademark applications directly with USPTO, UKIPO, EUIPO, or via the Madrid Protocol (covering 120+ countries).',
    metaTitle: 'International Trademark Registration | US & EU Brand Protection | ClearFiling',
    metaDescription: 'Register your brand trademark globally. File via Madrid protocol with expert IP assistance.',
    keywords: ['international trademark', 'uspto filing', 'madrid protocol trademark', 'euipo brand registration'],
    iconName: 'Stamp',
    featured: false,
    processingTime: 'Madrid Timeline dependent',
    requiredDocuments: ['Indian trademark application copy (for Madrid protocol)', 'Power of attorney documents', 'Logo designs representation'],
    benefits: ['Global brand asset protection against piracy', 'Legal monopoly rights in export markets', 'Safeguards international trading operations'],
    faqReference: [{ q: 'What is the Madrid Protocol?', a: 'It is an international treaty allowing trademark owners to protect brands in 120+ countries with one application.' }],
    canonicalSlug: 'https://clearfiling.in/services/overseas-trademark',
    futurePage: '/services/overseas-trademark'
  },
  {
    id: 'international-advisory',
    slug: 'international-advisory',
    category: 'International Business Services',
    title: 'International Advisory',
    shortDescription: 'Strategic advice on cross-border tax agreements (DTAA) and corporate structural planning.',
    description: 'Consultation on cross-border structuring, Double Taxation Avoidance Agreements (DTAA), transfer pricing, and foreign direct investments compliance under FEMA guidelines.',
    metaTitle: 'International Business Advisory & DTAA Structuring | ClearFiling',
    metaDescription: 'Strategic consultation on FEMA guidelines, DTAA tax planning, and overseas structuring by senior CAs.',
    keywords: ['international advisory', 'dtaa consultation', 'fema compliance', 'transfer pricing advisory'],
    iconName: 'HelpCircle',
    featured: false,
    processingTime: 'Project dependent',
    requiredDocuments: ['Corporate structure draft', 'FEMA requirements info', 'Cross-border transaction details'],
    benefits: ['Avoid double taxation payouts legally', 'Compliant FEMA/RBI structures for fund routing', 'Tax-efficient corporate planning'],
    faqReference: [{ q: 'What is DTAA?', a: 'DTAA is a tax treaty between countries to ensure taxpayers do not pay double tax on the same income.' }],
    canonicalSlug: 'https://clearfiling.in/services/international-advisory',
    futurePage: '/services/international-advisory'
  },
  {
    id: 'digital-signature',
    slug: 'digital-signature',
    category: 'Digital Solutions',
    title: 'Digital Signature',
    subtitle: 'Certificate (DSC)',
    shortDescription: 'Obtain Class 3 Digital Signature Certificate (DSC) online. Secure, verified, and mandatory for e-filings in India.',
    description: 'A Class 3 Digital Signature Certificate (DSC) is the highest level of security certificate issued under the Information Technology Act. It is mandatory for company incorporation, GST registration, income tax filing, and government e-tenders.',
    longDescription: 'Get your secure Class 3 Digital Signature Certificate (DSC) issued in under 24 hours. The process is completely paperless and relies on video/Aadhaar verification. ClearFiling helps you secure your USB token and signature files quickly so you can proceed with MCA, GST, or tax filing. A digital signature establishes the signer\'s identity legally and guarantees document integrity.',
    metaTitle: 'Class 3 Digital Signature Certificate (DSC) Online | ClearFiling',
    metaDescription: 'Get your secure Class 3 Digital Signature Certificate (DSC) online with ClearFiling. 100% paperless verification. USB token delivery across India.',
    keywords: ['digital signature', 'dsc online', 'class 3 dsc', 'usb token signature', 'signature', 'digital signature certificate', 'dsc', 'class 3 dsc', 'usb token'],
    iconName: 'FileCheck2',
    featured: true,
    processingTime: '1 - 2 Business Days',
    requiredDocuments: [
      'PAN Card of applicant',
      'Aadhaar Card or Address Proof',
      'Mobile number linked with Aadhaar',
      'Email address'
    ],
    benefits: [
      'Legally valid under the Information Technology Act',
      'Class 3 security grade for MCA, GST, and Income Tax portals',
      'Paperless paper-free Aadhaar-based application',
      'Fast video verification support from our experts'
    ],
    faqReference: [
      { q: 'What is a Class 3 Digital Signature?', a: 'Class 3 DSC is the highest level of digital signature used for e-filing, e-tenders, MCA, and GST portal actions.' },
      { q: 'How long is the DSC valid?', a: 'Typically, Digital Signature Certificates are issued with a validity of 2 years, after which they must be renewed.' }
    ],
    relatedServices: [
      { id: 'private-limited-company', title: 'Private Limited Company' },
      { id: 'gst-registration', title: 'GST Registration' },
      { id: 'trademark-registration', title: 'Trademark Registration' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/digital-signature',
    futurePage: '/services/digital-signature'
  },
  {
    id: 'website-development',
    slug: 'website-development',
    category: 'Digital Solutions',
    title: 'Website Development',
    shortDescription: 'Premium corporate websites designed to build trust and capture leads. Fast, responsive, and SEO-optimized.',
    description: 'Get a high-performance, responsive corporate website built with clean code and modern aesthetics to showcase your services and generate leads.',
    longDescription: 'We design and build bespoke corporate websites that establish online authority, improve brand positioning, and convert visitors into clients. Built with SEO best practices, fast loading times, and intuitive responsive navigation.',
    metaTitle: 'Corporate Website Development Services India | ClearFiling',
    metaDescription: 'Get a custom, premium corporate website designed by ClearFiling. Full SEO optimization, responsive layout, and modern designs for businesses.',
    keywords: ['website development', 'corporate website', 'web designer', 'custom website', 'wordpress website', 'business site setup', 'responsive web design'],
    iconName: 'Globe',
    featured: true,
    processingTime: '7 - 14 Business Days',
    requiredDocuments: [
      'Company logo & brand guidelines',
      'Content for pages (About, Services, Team)',
      'Contact details & office addresses',
      'Domain credentials (if purchased)'
    ],
    benefits: [
      'Custom, responsive layout designed for mobile & desktop',
      'SEO-friendly structure to boost Google search rankings',
      'Integration of lead-capture contact forms',
      'Fast page speeds and secure SSL configuration'
    ],
    faqReference: [
      { q: 'Will the website be mobile-friendly?', a: 'Yes, all our websites are fully responsive and optimized for mobile, tablet, and desktop screens.' },
      { q: 'Do you provide website hosting?', a: 'We assist in setting up hosting and domains on your preferred platform (e.g., Hostinger, AWS, GoDaddy) so you retain full ownership.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/website-development',
    futurePage: '/services/website-development'
  },
  {
    id: 'ecommerce-website-development',
    slug: 'ecommerce-website-development',
    category: 'Digital Solutions',
    title: 'E-Commerce Website Development',
    shortDescription: 'Full-featured online stores with secure payment gateway integration, product catalogs, and easy order management.',
    description: 'Launch your online store with custom product catalogs, secure payment gateway integrations, shipping setups, and an intuitive admin panel.',
    longDescription: 'Our e-commerce development service builds robust, secure, and user-friendly online shopping experiences. We handle database design, catalog management, shopping cart functionality, payment gateways (like Razorpay/Paytm), and order processing workflows.',
    metaTitle: 'E-Commerce Online Store Development India | ClearFiling',
    metaDescription: 'Build a secure, fast, and feature-rich e-commerce store with ClearFiling. Integrated payment gateways, product catalogs, and custom shopping carts.',
    keywords: ['ecommerce website', 'online store registration', 'shopify development', 'woocommerce setup', 'payment gateway integration', 'sell online india'],
    iconName: 'ShoppingCart',
    featured: true,
    processingTime: '14 - 21 Business Days',
    requiredDocuments: [
      'GSTIN & Bank Account details for payment gateway',
      'Product listings (images, pricing, descriptions)',
      'Privacy Policy & Return Policy documents',
      'Logo & brand assets'
    ],
    benefits: [
      'Seamless payment gateway integration (Razorpay, Stripe, Paytm)',
      'Interactive product catalog with advanced search & filter',
      'Secure transaction processing with SSL certification',
      'Custom dashboard for easy order & inventory tracking'
    ],
    faqReference: [
      { q: 'Which payment gateways can you integrate?', a: 'We can integrate any major payment gateway, including Razorpay, Paytm, Instamojo, Stripe, and PayPal.' },
      { q: 'Can I manage products myself?', a: 'Yes, we provide a user-friendly admin dashboard where you can easily add, edit, or remove products and track orders.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/ecommerce-website-development',
    futurePage: '/services/ecommerce-website-development'
  },
  {
    id: 'custom-web-applications',
    slug: 'custom-web-applications',
    category: 'Digital Solutions',
    title: 'Custom Web Applications',
    shortDescription: 'Tailor-made web applications, SaaS MVPs, and business automation portals built for performance and scalability.',
    description: 'Develop bespoke software solutions, internal business portals, CRM/ERP modules, and SaaS products tailored to your operational needs.',
    longDescription: 'We develop secure, scalable, and high-performance custom web applications designed to streamline business workflows, automate processes, or launch your software-as-a-service (SaaS) product. From API design to database optimization, we build solutions that scale.',
    metaTitle: 'Custom Web Application & SaaS Development India | ClearFiling',
    metaDescription: 'Custom web application development services. Build secure SaaS portals, ERP, CRM, and automation tools with ClearFiling.',
    keywords: ['custom web application', 'saas development', 'business automation software', 'portal development', 'custom crm', 'web app developers', 'website', 'website development'],
    iconName: 'Laptop',
    featured: true,
    processingTime: '21 - 45 Business Days',
    requiredDocuments: [
      'Detailed software requirements & wireframes (if any)',
      'API documentation (if third-party integrations needed)',
      'Database schemas or workflow guidelines'
    ],
    benefits: [
      'Tailor-made architecture built precisely for your workflows',
      'Highly secure user authentication & access controls',
      'Scalable database structure for high user volumes',
      'Robust APIs ready for mobile app integrations'
    ],
    faqReference: [
      { q: 'What technology stack do you use?', a: 'We typically use modern, reliable stacks like MERN (MongoDB, Express, React, Node.js) or standard SQL backends for high performance.' },
      { q: 'Do you offer post-development support?', a: 'Yes, we offer ongoing maintenance and support packages to keep your custom application secure and up to date.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/custom-web-applications',
    futurePage: '/services/custom-web-applications'
  },
  {
    id: 'personal-loan',
    slug: 'personal-loan',
    category: 'Loan Services',
    title: 'Personal Loan',
    shortDescription: 'Unsecured personal financing to meet immediate individual capital requirements with flexible repayment options.',
    description: 'Obtain quick personal financing for personal, medical, or urgent needs. Hassle-free online verification and quick disbursal.',
    iconName: 'UserCheck',
    processingTime: '2 - 4 Business Days',
    keywords: ['personal loan', 'unsecured loan', 'personal finance', 'quick loan'],
    benefits: [
      'No collateral or security required',
      'Flexible tenures up to 60 months',
      'Instant online eligibility check',
      'Direct bank account transfer'
    ],
    requiredDocuments: [
      'PAN Card and Aadhaar Card',
      'Salary slips for the last 3 months',
      'Bank statement for the last 6 months',
      'Address proof'
    ],
    faqReference: [
      { q: 'What is the minimum credit score for a Personal Loan?', a: 'Most banks prefer a credit score of 750 or above for unsecured personal loans.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/personal-loan',
    futurePage: '/services/personal-loan'
  },
  {
    id: 'home-loan',
    slug: 'home-loan',
    category: 'Loan Services',
    title: 'Home Loan',
    shortDescription: 'Long-term housing finance solutions for purchasing, constructing, or renovating residential properties.',
    description: 'Long-term housing finance solutions to help you purchase your dream home, construct a new house, or renovate an existing property.',
    iconName: 'Building2',
    processingTime: '7 - 15 Business Days',
    keywords: ['home loan', 'housing finance', 'home construction', 'property loan'],
    benefits: [
      'Attractive interest rates with tax benefits under Sec 24 & 80C',
      'Repayment tenure up to 30 years',
      'Simple step-by-step documentation',
      'Balance transfer option available'
    ],
    requiredDocuments: [
      'Identity and Address Proofs',
      'Income proof (Salaried or Self-Employed)',
      'Property title deeds & chain documents',
      'No Objection Certificate (NOC) from authority'
    ],
    faqReference: [
      { q: 'Can I get tax benefits on a Home Loan?', a: 'Yes, you can claim deductions on principal under Section 80C and interest under Section 24.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/home-loan',
    futurePage: '/services/home-loan'
  },
  {
    id: 'business-loan',
    slug: 'business-loan',
    category: 'Loan Services',
    title: 'Business Loan',
    shortDescription: 'Customized funding solutions for company expansion, commercial upgrades, and inventory investment.',
    description: 'Secure capital for corporate expansion, technology upgrades, working capital, or inventory purchase. ClearFiling helps you prepare project reports, assess eligibility, and process loan applications with leading banks.',
    iconName: 'Landmark',
    featured: true,
    processingTime: '7 - 14 Business Days',
    keywords: ['business loan', 'corporate finance', 'secured loan', 'unsecured business credit', 'bank loan company', 'business funding'],
    benefits: [
      'Competitive interest rates from leading public & private banks',
      'Flexible repayment tenures up to 5 years',
      'Professional project report preparation by experienced CAs',
      'End-to-end application tracking and bank coordination'
    ],
    requiredDocuments: [
      'Last 2 years ITR and Audited Financials',
      'Bank statement for the last 6 months',
      'KYC documents of Promoters/Directors',
      'GST Returns (GSTR-3B) for the last 1 year',
      'Project report and fund utilization plan'
    ],
    faqReference: [
      { q: 'What is the eligibility for a Business Loan?', a: 'Eligibility depends on business vintage (typically min 2 years), annual turnover, credit score, and financial health shown in tax returns.' },
      { q: 'Do you guarantee loan approval?', a: 'While we structure your application to maximize approval chances, the final sanction depends on the bank\'s internal credit assessment.' }
    ],
    relatedServices: [
      { id: 'msme-registration', title: 'MSME Registration' },
      { id: 'private-limited-company', title: 'Private Limited Company' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/business-loan',
    futurePage: '/services/business-loan'
  },
  {
    id: 'msme-loan',
    slug: 'msme-loan',
    category: 'Loan Services',
    title: 'MSME Loan',
    shortDescription: 'Specialized government-backed credit schemes to support micro, small, and medium enterprises.',
    description: 'Avail government-backed schemes like CGTMSE, PMEGP, or Mudra loans. Specially designed to boost the MSME sector with low interest rates.',
    iconName: 'Briefcase',
    processingTime: '5 - 10 Business Days',
    keywords: ['msme loan', 'cgtmse', 'mudra loan', 'small business loan', 'government loan'],
    benefits: [
      'Collateral-free options under government schemes',
      'Subsidized interest rates and processing fees',
      'Priority sector lending benefits',
      'Quick approval process'
    ],
    requiredDocuments: [
      'Udyam Registration Certificate',
      'Business KYC and entity proof',
      'ITR and GST returns',
      'Project profile and quotation for machinery'
    ],
    faqReference: [
      { q: 'Is Udyam Registration mandatory for MSME loans?', a: 'Yes, a valid Udyam Registration Certificate is required to claim MSME interest subsidies.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/msme-loan',
    futurePage: '/services/msme-loan'
  },
  {
    id: 'startup-loan',
    slug: 'startup-loan',
    category: 'Loan Services',
    title: 'Startup Loan',
    shortDescription: 'Seed funding and initial capital solutions designed specifically to launch high-potential startups.',
    description: 'Access seed capital and specialized funding programs designed to help early-stage startups establish operations and scale.',
    iconName: 'Zap',
    processingTime: '10 - 20 Business Days',
    keywords: ['startup loan', 'seed funding', 'venture loan', 'startup capital'],
    benefits: [
      'Funding options tailored for non-revenue or early-revenue models',
      'Advisory on government startup grant programs',
      'Mentorship and business validation support',
      'Flexible restructuring options'
    ],
    requiredDocuments: [
      'DPIIT Startup Recognition Certificate',
      'Pitch deck and business model blueprint',
      'Founder profile and credit reports',
      'Incorporation certificate & tax registrations'
    ],
    faqReference: [
      { q: 'Can a newly registered company apply for a startup loan?', a: 'Yes, startup-specific credit schemes evaluate business feasibility and promoter profile rather than historic financials.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/startup-loan',
    futurePage: '/services/startup-loan'
  },
  {
    id: 'working-capital-loan',
    slug: 'working-capital-loan',
    category: 'Loan Services',
    title: 'Working Capital Loan',
    shortDescription: 'Short-term funding to manage daily operational expenses, payroll, and maintain healthy cash flow.',
    description: 'Ensure smooth operational flow. Short-term funds to finance raw materials, inventory, payroll, and other daily running costs.',
    iconName: 'TrendingUp',
    processingTime: '5 - 10 Business Days',
    keywords: ['working capital', 'inventory funding', 'short term business loan', 'cash flow loan'],
    benefits: [
      'Maintains uninterrupted business operations',
      'Short-term commitment with quick payback cycles',
      'Improves credit standing with suppliers',
      'Customized limits based on turnover'
    ],
    requiredDocuments: [
      'Audited financial statements',
      'Stock and debtors statement',
      'GST returns and bank statement',
      'Existing loan track record'
    ],
    faqReference: [
      { q: 'What is the limit based on?', a: 'The limit is calculated using the holding period of inventory, debtors, and creditors.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/working-capital-loan',
    futurePage: '/services/working-capital-loan'
  },
  {
    id: 'education-loan',
    slug: 'education-loan',
    category: 'Loan Services',
    title: 'Education Loan',
    shortDescription: 'Comprehensive student financial aid to cover domestic and international academic tuition fees.',
    description: 'Finance your higher education in India or abroad. Covers tuition fees, exam fees, travel, and accommodation.',
    iconName: 'BookOpen',
    processingTime: '4 - 7 Business Days',
    keywords: ['education loan', 'student loan', 'abroad study finance', 'higher education'],
    benefits: [
      'Covers up to 100% of education costs',
      'Moratorium period during the course duration + 1 year',
      'Tax benefit on interest paid under Section 80E',
      'Co-applicant flexibility'
    ],
    requiredDocuments: [
      'Admission letter from university/college',
      'Fee structure document',
      'Academic marksheets (10th, 12th, Graduation)',
      'KYC & Income proof of co-borrower/parent'
    ],
    faqReference: [
      { q: 'When does the repayment start?', a: 'Repayment typically begins 6 months to 1 year after course completion or upon securing a job, whichever is earlier.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/education-loan',
    futurePage: '/services/education-loan'
  },
  {
    id: 'vehicle-loan',
    slug: 'vehicle-loan',
    category: 'Loan Services',
    title: 'Vehicle Loan',
    shortDescription: 'Flexible financing options for purchasing corporate and private transportation fleets.',
    description: 'Get attractive terms for commercial or private vehicles. Cover new or pre-owned vehicles with easy EMIs.',
    iconName: 'Award',
    processingTime: '2 - 4 Business Days',
    keywords: ['vehicle loan', 'auto loan', 'car finance', 'commercial vehicle'],
    benefits: [
      'Funding up to 90% of on-road price',
      'Competitive interest rates with quick processing',
      'Minimal paperwork and fast disbursal',
      'Flexible tenures up to 7 years'
    ],
    requiredDocuments: [
      'KYC and address proof of applicant',
      'Salary slip or ITR files',
      'Vehicle quotation invoice',
      'Bank statement for the last 6 months'
    ],
    faqReference: [
      { q: 'Is collateral needed for a vehicle loan?', a: 'No, the vehicle itself acts as hypothecated collateral for the bank.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/vehicle-loan',
    futurePage: '/services/vehicle-loan'
  },
  {
    id: 'car-loan',
    slug: 'car-loan',
    category: 'Loan Services',
    title: 'Car Loan',
    shortDescription: 'Affordable auto loans with attractive interest rates for personal and executive vehicles.',
    description: 'Drive home your preferred car. Finance packages covering new launches, hatchbacks, sedans, and SUVs.',
    iconName: 'Award',
    processingTime: '2 - 3 Business Days',
    keywords: ['car loan', 'auto finance', 'new car loan', 'used car loan'],
    benefits: [
      'High-value financing on top models',
      'Customized monthly payment (EMI) programs',
      'Exclusive dealer ties and offers',
      'Fast digital validation'
    ],
    requiredDocuments: [
      'Proof of identity and address',
      'Bank statement & salary slips/ITR',
      'Proforma invoice from car dealer'
    ],
    faqReference: [
      { q: 'Can I get a loan for a used car?', a: 'Yes, pre-owned car financing is widely available at slightly different rates.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/car-loan',
    futurePage: '/services/car-loan'
  },
  {
    id: 'bike-loan',
    slug: 'bike-loan',
    category: 'Loan Services',
    title: 'Bike Loan',
    shortDescription: 'Quick and hassle-free two-wheeler finance solutions with minimal documentation requirements.',
    description: 'Get instant approvals on two-wheeler loans. Cover sports bikes, commuter motorbikes, and electric scooters.',
    iconName: 'Award',
    processingTime: '1 - 2 Business Days',
    keywords: ['bike loan', 'two wheeler loan', 'scooter finance', 'motorcycle loan'],
    benefits: [
      'Up to 95% funding on key models',
      'Low down payment schemes',
      'Super fast approvals within hours',
      'Flexible tenures up to 4 years'
    ],
    requiredDocuments: [
      'PAN card & Aadhaar Card',
      'Recent passport size photographs',
      'Income proof or banking history'
    ],
    faqReference: [
      { q: 'Can I buy an electric scooter with a bike loan?', a: 'Yes, modern green vehicle loans cover electric two-wheelers.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/bike-loan',
    futurePage: '/services/bike-loan'
  },
  {
    id: 'gold-loan',
    slug: 'gold-loan',
    category: 'Loan Services',
    title: 'Gold Loan',
    shortDescription: 'Instant liquidity options by securing loans against gold ornaments with competitive rate margins.',
    description: 'Instant liquidity against gold jewelry. Fast evaluations, maximum per-gram value, and low interest rates.',
    iconName: 'DollarSign',
    processingTime: '1 Business Day',
    keywords: ['gold loan', 'loan against gold', 'instant gold finance', 'jewel loan'],
    benefits: [
      'Disbursal in under 60 minutes',
      'Minimal documentation (only KYC needed)',
      'No income proof or credit score verification',
      'Secure locker storage with insurance'
    ],
    requiredDocuments: [
      'KYC documents (Aadhaar/PAN)',
      'Gold ornaments/jewelry to be pledged',
      'Proof of address'
    ],
    faqReference: [
      { q: 'What gold purity is accepted?', a: 'Banks accept gold ornaments with purity ranging from 18 to 22 karats.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/gold-loan',
    futurePage: '/services/gold-loan'
  },
  {
    id: 'loan-against-property',
    slug: 'loan-against-property',
    category: 'Loan Services',
    title: 'Loan Against Property',
    shortDescription: 'Unlocking equity value from commercial or residential properties for major capital needs.',
    description: 'Leverage the value of your commercial or residential property to raise high-value long-term funds at lower rates.',
    iconName: 'Building2',
    processingTime: '10 - 20 Business Days',
    keywords: ['loan against property', 'lap', 'property mortgage', 'secured finance'],
    benefits: [
      'Lower interest rates compared to personal loans',
      'Longer repayment tenure up to 15 years',
      'High loan value based on property valuation',
      'Continue using the mortgaged property'
    ],
    requiredDocuments: [
      'Property title deeds & NOCs',
      'Income proof & bank statement',
      'Approved building plan & layout',
      'Tax receipts of the property'
    ],
    faqReference: [
      { q: 'Which properties are eligible?', a: 'Clear, freehold, and non-disputed residential, commercial, or industrial properties are eligible.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/loan-against-property',
    futurePage: '/services/loan-against-property'
  },
  {
    id: 'machinery-loan',
    slug: 'machinery-loan',
    category: 'Loan Services',
    title: 'Machinery Loan',
    shortDescription: 'Asset-backed financing to acquire advanced industrial machinery and expand production capacity.',
    description: 'Acquire new or imported manufacturing machines to scale production. Asset-based mortgage structure.',
    iconName: 'Briefcase',
    processingTime: '7 - 14 Business Days',
    keywords: ['machinery loan', 'equipment loan', 'manufacturing finance', 'factory setup'],
    benefits: [
      'Financing up to 80% of machinery value',
      'No collateral requirement other than the machine itself',
      'Structured repayment aligning with production capacity',
      'Customized import financing options'
    ],
    requiredDocuments: [
      'Proforma invoice from machinery supplier',
      'Business financials & ITR',
      'GST registration and filing sheets',
      'Factory/workshop ownership details'
    ],
    faqReference: [
      { q: 'Can I finance imported machinery?', a: 'Yes, we facilitate Letter of Credit (LC) and trade finance for imported industrial machinery.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/machinery-loan',
    futurePage: '/services/machinery-loan'
  },
  {
    id: 'equipment-finance',
    slug: 'equipment-finance',
    category: 'Loan Services',
    title: 'Equipment Finance',
    shortDescription: 'Tailored commercial finance to lease or purchase operational tools and tech equipment.',
    description: 'Flexible funding options for medical equipment, IT hardware, office assets, or specialized lab tools.',
    iconName: 'Briefcase',
    processingTime: '5 - 10 Business Days',
    keywords: ['equipment finance', 'it equipment loan', 'medical tools lease', 'asset funding'],
    benefits: [
      'Preserves cash reserves by spreading asset costs',
      'Enables technology upgrades without high initial costs',
      'Potential tax depreciation benefits',
      'Easy loan structure'
    ],
    requiredDocuments: [
      'Equipment quotation and catalog details',
      'Business tax records & entity proof',
      'Banking transaction records'
    ],
    faqReference: [
      { q: 'Is there a lease option available?', a: 'Yes, we advise on both equipment lease models and direct purchase finance.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/equipment-finance',
    futurePage: '/services/equipment-finance'
  },
  {
    id: 'project-loan',
    slug: 'project-loan',
    category: 'Loan Services',
    title: 'Project Loan',
    shortDescription: 'Large-scale project financing solutions for infrastructure development and commercial ventures.',
    description: 'Fund greenfield or brownfield infrastructure projects, commercial real estate, or industrial expansions.',
    iconName: 'FileCheck2',
    processingTime: '15 - 30 Business Days',
    keywords: ['project loan', 'infrastructure finance', 'commercial funding', 'project report'],
    benefits: [
      'Structured term loans with moratorium periods',
      'Consolidated funding for construction & setup',
      'Customized interest structures',
      'Professional project report preparation support'
    ],
    requiredDocuments: [
      'Detailed Project Report (DPR) & TEV study',
      'Statutory permissions & environmental clearances',
      'Promoters profile and equity contribution proof',
      'Land records and layout maps'
    ],
    faqReference: [
      { q: 'What is a TEV study?', a: 'Techno-Economic Viability (TEV) study validates the technical feasibility and financial success of the project.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/project-loan',
    futurePage: '/services/project-loan'
  },
  {
    id: 'cash-credit',
    slug: 'cash-credit',
    category: 'Loan Services',
    title: 'Cash Credit',
    shortDescription: 'Flexible cash credit limits against stocks and receivables to manage business capital cycles.',
    description: 'Secure a revolving cash credit line based on inventory stocks and book debt receivables.',
    iconName: 'DollarSign',
    processingTime: '7 - 14 Business Days',
    keywords: ['cash credit', 'cc limit', 'stock funding', 'working capital line'],
    benefits: [
      'Pay interest only on the utilized amount',
      'Revolving credit line that updates with sales',
      'Supports bulk stock purchases',
      'Maintains daily corporate liquidity'
    ],
    requiredDocuments: [
      'Monthly stock and debtors statements',
      'Audited balance sheets & projections',
      'GST returns & tax filings',
      'Bank statement for the last 12 months'
    ],
    faqReference: [
      { q: 'How is the draw-down limit calculated?', a: 'It is based on the value of paid stock plus debtors, minus a specified margin.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/cash-credit',
    futurePage: '/services/cash-credit'
  },
  {
    id: 'overdraft-facility',
    slug: 'overdraft-facility',
    category: 'Loan Services',
    title: 'Overdraft Facility',
    shortDescription: 'Temporary overdraft credit linked to corporate current accounts for short-term payment support.',
    description: 'Set up an overdraft limit against bank fixed deposits, mutual funds, or business credit history.',
    iconName: 'FileSpreadsheet',
    processingTime: '2 - 5 Business Days',
    keywords: ['overdraft', 'od limit', 'od against fd', 'current account credit'],
    benefits: [
      'Instant access to funds beyond account balance',
      'No prepayment charges or commitments',
      'High limit options against financial securities',
      'Perfect for meeting temporary payroll gaps'
    ],
    requiredDocuments: [
      'Current account statements',
      'Pledge documentation for security (FD, MF, etc.)',
      'KYC documents of the account holders'
    ],
    faqReference: [
      { q: 'Can I get an OD without security?', a: 'Yes, clean overdraft limits are offered based on current account transaction volume.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/overdraft-facility',
    futurePage: '/services/overdraft-facility'
  },
  {
    id: 'professional-loan',
    slug: 'professional-loan',
    category: 'Loan Services',
    title: 'Professional Loan',
    shortDescription: 'Specialized credit offerings tailored for self-employed professionals including doctors, CAs, and architects.',
    description: 'Customized credit lines designed for doctors, chartered accountants, company secretaries, architects, and consulting professionals.',
    iconName: 'UserCheck',
    processingTime: '3 - 5 Business Days',
    keywords: ['professional loan', 'doctor loan', 'ca financing', 'consultant credit'],
    benefits: [
      'No security or collateral needed',
      'Preferential interest rates for qualified professionals',
      'Funding for office setup or clinic expansion',
      'Flexible repayment schemes'
    ],
    requiredDocuments: [
      'Professional qualification certificate & registration',
      'Last 2 years ITR and bank statements',
      'KYC and clinic/office address proof'
    ],
    faqReference: [
      { q: 'Who is eligible for a Professional Loan?', a: 'Practicing doctors, CAs, CSs, and architects with valid license to practice are eligible.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/professional-loan',
    futurePage: '/services/professional-loan'
  },
  {
    id: 'commercial-vehicle-loan',
    slug: 'commercial-vehicle-loan',
    category: 'Loan Services',
    title: 'Commercial Vehicle Loan',
    shortDescription: 'Tailored financing solutions for purchasing commercial trucks, buses, and heavy logistics fleets.',
    description: 'Finance commercial transit fleets. Tailored credit for logistics companies, operators, and fleet managers.',
    iconName: 'Award',
    processingTime: '3 - 7 Business Days',
    keywords: ['commercial vehicle', 'truck loan', 'fleet finance', 'transit loan'],
    benefits: [
      'Customized funding for single vehicles or large fleets',
      'Flexible structuring based on freight contracts',
      'Quick approvals with specialized asset valuations',
      'Long tenure limits'
    ],
    requiredDocuments: [
      'Transport permit documents',
      'KYC and income proofs',
      'Vehicle proforma invoice and dealer details',
      'Existing fleet ownership details (if any)'
    ],
    faqReference: [
      { q: 'Are pre-owned commercial vehicles financed?', a: 'Yes, pre-owned trucks and buses can be financed based on their age and condition.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/commercial-vehicle-loan',
    futurePage: '/services/commercial-vehicle-loan'
  },
  {
    id: 'construction-loan',
    slug: 'construction-loan',
    category: 'Loan Services',
    title: 'Construction Loan',
    shortDescription: 'Project-based credit facilities to finance real estate development and building construction.',
    description: 'Project-based credit facilities to finance real estate developers, contractors, and building construction costs.',
    iconName: 'Building2',
    processingTime: '10 - 20 Business Days',
    keywords: ['construction loan', 'developer finance', 'building credit', 'contractor funding'],
    benefits: [
      'Tranche-wise disbursal based on stage of construction',
      'Customized repayment maps matching unit sales',
      'Competitive commercial building interest rates',
      'Support for both residential and commercial builders'
    ],
    requiredDocuments: [
      'Approved building plans and local authority clearances',
      'Architect cost estimate and construction schedule',
      'Project report and feasibility studies',
      'Developer track record & company financials'
    ],
    faqReference: [
      { q: 'How are disbursements handled?', a: 'Funds are disbursed in phases, corresponding directly with progress verified by bank engineers.' }
    ],
    canonicalSlug: 'https://clearfiling.in/services/construction-loan',
    futurePage: '/services/construction-loan'
  }
];

export const CONSULTANTS = [
  {
    id: 'ca',
    role: 'Chartered Accountant (CA)',
    description: 'Specialists in statutory audits, corporate taxation, ITR filings, GST audits, and strategic financial planning for enterprises.',
    iconName: 'BookOpen',
    whatsappText: "Hi ClearFiling, I would like to consult with a Chartered Accountant (CA) for tax/audit services."
  },
  {
    id: 'cs',
    role: 'Company Secretary (CS)',
    description: 'Experts in MCA filings, corporate governance, Board Meetings secretarial logs, corporate restructuring, and ROC compliance.',
    iconName: 'FileSpreadsheet',
    whatsappText: "Hi ClearFiling, I would like to consult with a Company Secretary (CS) for corporate ROC/secretarial compliance."
  },
  {
    id: 'legal-advisor',
    role: 'Legal Advisor',
    description: 'Attorneys drafting business deeds, contracts, terms policies, trademark opposition defenses, and intellectual property registrations.',
    iconName: 'Scale',
    whatsappText: "Hi ClearFiling, I would like to consult with a Legal Advisor regarding brand trademark / drafting contracts."
  },
  {
    id: 'merchant-banker',
    role: 'Merchant Banker',
    description: 'Advisors handling corporate equity valuations, venture funding structures, share allocations, and FDI transaction compliance.',
    iconName: 'TrendingUp',
    whatsappText: "Hi ClearFiling, I would like to consult with a Merchant Banker regarding company valuation and equity structuring."
  },
  {
    id: 'cost-accountant',
    role: 'Cost Accountant',
    description: 'Professionals managing inventory cost audit ledgers, supply chain cost-optimization, and corporate cost-records compliance.',
    iconName: 'Briefcase',
    whatsappText: "Hi ClearFiling, I would like to consult with a Cost Accountant regarding cost records and inventory control audits."
  }
];

export const CATEGORY_SERVICES_MAP = SERVICES.reduce((acc, service) => {
  const cat = service.category;
  if (!acc[cat]) {
    acc[cat] = [];
  }
  acc[cat].push({
    id: service.id,
    title: service.title,
    desc: service.shortDescription
  });
  return acc;
}, {});

export const ICON_MAP = {
  Building2,
  Briefcase,
  FileCheck2,
  ShieldAlert,
  DollarSign,
  FileSpreadsheet,
  Scale,
  HelpCircle,
  Stamp,
  BookOpen,
  TrendingUp,
  UserCheck,
  Globe,
  Award,
  Lock,
  Landmark,
  Zap,
  CheckCircle2,
  Laptop,
  ShoppingCart,
  Code
};

export default { SERVICES, CATEGORIES, CONSULTANTS, ICON_MAP, CATEGORY_SERVICES_MAP };

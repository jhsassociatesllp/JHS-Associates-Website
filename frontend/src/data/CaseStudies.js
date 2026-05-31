// ─── CaseStudies Data ────────────────────────────────────────────────────────
// Each case study matches the shape expected by CaseStudies.jsx:
//   id, title, sector, category, scope, image, approach[], delivery[], valueAdded[]

import { imageUrl } from '../utils/imageUrl';

// Case study images - using local assets from public/Uploads folder
const IMAGES = {
  compliance: imageUrl('Risk.png'),
  audit: imageUrl('Auditposter.jpg'),
  risk: imageUrl('Risk.png'),
  finance: imageUrl('MutualFund.avif'),
  operations: imageUrl('outsourcing.png'),
  banking: imageUrl('Banking.avif'),
  insurance: imageUrl('Insurance.avif'),
  realestate: imageUrl('Real-State.avif'),
  manufacturing: imageUrl('manufacturing.png'),
  it: imageUrl('IT-Technology.avif'),
  NBFC: imageUrl('NBFC.avif'),
  Logistics: imageUrl('Logistics1.png'),
  fainance_report: imageUrl('Fainance-report.png'),
  payment: imageUrl('Payment.jpeg'),
  media: imageUrl('Media.png')
};

export const CASE_STUDIES = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'casp',
    title: 'Compliance Assurance & Self Certification Programme (CASP)',
    sector: 'Payment System',
    category: 'Compliance',
    scope:
      'Implementation assistance on Compliance Assurance & Self Certification Programme (CASP) for a Payment System Service Provider — developing master checklists, self-assessment formats, and CEO/CFO compliance dashboards.',
    image: IMAGES.payment,
    approach: [
      'Preparation of Master Checklist for various laws applicable to the company',
      'Development of Self-Assessment Certification Formats and checklists and obtaining self-certificates from process owners',
      'Assess the extent of compliance and thereby identifying gaps (if any)',
      'Development of CEO / CFO Compliance Effectiveness Dashboard',
    ],
    delivery: [
      'Master Checklists across various laws',
      'Self Certification formats and checklists',
      'Assessment of compliance status based on self assessment by process owners',
      'Compliance Dashboards for CEO / CFO',
    ],
    valueAdded: [
      'Developed a comprehensive Compliance framework',
      'Compliance Dashboards for CEO / CFO',
      'Proactive approach towards compliance',
      'Incorporated a culture of self accountability amongst employees',
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'vendor-monitoring-audit',
    title: 'Vendor Monitoring Audit',
    sector: 'Payment System',
    category: 'Audit',
    scope:
      'Undertaking comprehensive vendor audit for a payment bank — covering vendor master creation controls, voucher duplication controls, and detection of unauthorised payments using data analytics (CAAT).',
    image: IMAGES.audit,
    approach: [  
      'Developing checklist of data analytics to be executed',
      'Preparing data for analysis (format, size, masters, etc.)',
      'Review of RCMs and Process Maps — mapping with walkthrough',
      'Developing queries for data analytics within CAAT tool',
      'Checking for deviations identified within analytics and walkthrough executed',
      'Drawing logical samples for data verification out of deviations identified',
      'Reporting deviations to management',
    ],
    delivery: [
      'Assurance on vendor master creation / modification controls, vendor voucher duplication controls, and unauthorised payment',
      'Identifying deviations in vendor master, vouchers and payment data',
      'Adequacy of controls to comply with statutory requirements',
    ],
    valueAdded: [
      'Control gaps identification and remediation — QC Gaps, Master Validation Gaps, Duplicate Voucher Validation Gaps',
      '100% data population considered for analysis',
      'Drawing logical samples for auditing purpose',
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: 'fixed-asset-management-healthcare',
    title: 'Fixed Asset Management — Hospital & Healthcare',
    sector: 'Healthcare',
    category: 'Audit',
    scope:
      'Providing absolute control to management over Fixed Assets through physical verification & tagging of assets and building a Fixed Assets Register that tallies with books for Hospital & Healthcare Institutions.',
    image: IMAGES.operations,
    approach: [
      'Study of existing SOP & Fixed Assets Register (FAR)',
      'Design & facilitation of Entity Level Controls',
      'Design & Operating Effectiveness — Mega Processes',
      'Suggesting remediation action for deficient controls',
      'Process Owner and Board & Audit Committee sign off',
    ],
    delivery: [
      'Physical verification sheets',
      'Updated Fixed Assets Register tallying with books',
      'Bar coded / Tagged assets',
      'Location mapping in System',
    ],
    valueAdded: [
      'Identified assets not recorded in the FAR worth lakhs',
      'Tagging of 26,000+ assets',
      'Reconciled with books ensuring company does not attract Audit qualification',
      'One time System entry',
      'Knowledge transfer through SOP',
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: 'ssae16-review',
    title: 'SSAE 16 Review',
    sector: 'Information Technology',
    category: 'Audit',
    scope:
      'Facilitating execution of an SSAE 16 review for an IT company. Type 1 review covers overall design effectiveness of process and system controls; Type 2 covers review of operating effectiveness of controls.',
    image: IMAGES.it,
    approach: [
      'Understanding the Organization & Control Environment',
      'Review Plan & Checklists update',
      'Walkthrough and Review',
      'Reporting of gaps',
      'Testing of operating and the remediated controls',
      'Reporting',
    ],
    delivery: [
      'Report on description of payroll processing system and on suitability of design and operating effectiveness of its controls — Type 2 Report',
      'Independent Service Auditor\'s Report signed by Certified Public Accountant (CPA)',
      'Management Assertions',
      'Description of Processing System',
      'Independent Service Auditor\'s Description of Tests of controls and results',
    ],
    valueAdded: [
      'Enhancement of Control and Processes',
      'Identified opportunities for improvement in key areas',
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: 'governance-of-risk-media',
    title: 'Governance of Risk — Local Search Engine & Media',
    sector: 'Media & Technology',
    category: 'Risk & Governance',
    scope:
      'Implementing Governance Policies & Enterprise Risk Management for a Local Search Engine and Media company, covering ethical conduct policies, board charters, insider trading policy, and a top-10 risk framework.',
    image: IMAGES.media,
    approach: [
      'Research on global best practices & regulatory requirements',
      'Extensive discussions with the client on needs and existing governance practices',
    ],
    delivery: [
      'Developed ethical business conduct policy, board charters, insider trading policy and risk management policy',
      'Risk management structure & risk registers',
      'Focus on top 10 risks and treatment plans',
    ],
    valueAdded: [
      'Lean governance & risk management framework',
      'Key control deficiency mitigation plans',
      'Risk Dashboard',
      'Compliance with Listing requirements',
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    id: 'revenue-assurance-program',
    title: 'Revenue Assurance Program',
    sector: 'Logistics',
    category: 'Audit',
    scope:
      'Review of client invoicing process, identification of invoicing errors, and recommendation of process improvements for a logistics sector client through a rigorous monthly revenue assurance SOP.',
    image: IMAGES.Logistics,
    approach: [
      'Designed a monthly revenue assurance SOP',
      'Rigorous review of each client invoice against route masters, diesel consumption norms, etc.',
    ],
    delivery: [
      'Monthly audit report of invoices and site visits',
      'Root cause analysis',
    ],
    valueAdded: [
      'Revenue leakage score card',
      'Pre-identification of client rejections and corrective actions',
      'Reduction in revenue recognition errors',
    ],
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    id: 'governance-review-pricing',
    title: 'Governance Review — Pricing & Cost Review',
    sector: 'IT & Regulatory',
    category: 'Risk & Governance',
    scope:
      'Conducting a strategic Pricing & Cost Review for an IT & Quasi Regulatory Agency, analysing existing products, pricing policies, and competition to deliver a comprehensive strategic report.',
    image: IMAGES.finance,
    approach: [
      'Understanding existing products, pricing policies and competition',
      'Historical & Projected Financial Data Analysis',
      'Detailed primary & secondary research',
    ],
    delivery: [
      'Strategic Pricing & Cost Review Report',
      'Revenue & Budgeting Parameters',
      'Payback period and other analytics',
    ],
    valueAdded: [
      'Pricing Steering Committee',
      'Recommendation for Activity Based Management Systems',
      'Setting up of Project, Cost & Capex principles',
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    id: 'increasing-per-person-productivity',
    title: 'Increasing Per Person Productivity',
    sector: 'Textile',
    category: 'Business Excellence',
    scope:
      'Increasing per person productivity by identifying and reducing Non-Value Added Activities (NVA) in the process for a Textile Industry client through time & motion analysis and SOP documentation.',
    image: IMAGES.manufacturing,
    approach: [
      'Process walkthrough of the activity lifecycle for major labour categories/components',
      'Time and motion analysis for each activity/sub-activity within various processes',
      'Identifying and allocating labour and time cost of each activity',
      'Evaluating alternative productive solutions for NVA identified',
    ],
    delivery: [
      'Documented Standard Operating Procedures with Flowcharts, Control Parameters, System Checks and templates',
      'Implementation support advisory',
    ],
    valueAdded: [
      'Improved per person productivity',
      'Reduced process cycle time',
      'Increased cost efficiency for the process',
    ],
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    id: 'payroll-audit-caat',
    title: 'Payroll Audit Through CAAT',
    sector: 'NBFC',
    category: 'Audit',
    scope:
      'Undertaking a comprehensive Payroll Review using Computer Assisted Audit Techniques (CAAT) for an NBFC — assuring payroll accuracy, identifying deviations, and verifying correctness of statutory deductions.',
    image: IMAGES.NBFC,
    approach: [
      'Developing checklist of data analytics to be executed for payroll data',
      'Preparing data for analysis (format, size, etc.)',
      'Developing queries for data analytics within CAAT tool',
      'Checking for deviations identified within analytics executed',
      'Drawing logical samples for data verification out of deviations identified',
      'Reporting deviations to management',
    ],
    delivery: [
      'Assurance on accuracy of payroll system',
      'Identifying deviations in payroll data generated by payroll system',
      'Correctness of statutory deduction in payroll',
    ],
    valueAdded: [
      'Control gaps identification and remediation',
      '100% data population considered for analysis',
      'Drawing logical samples for auditing purpose',
    ],
  },

  // ── 10 ─────────────────────────────────────────────────────────────────────
  {
    id: 'financial-stability-review',
    title: 'Financial Stability Review',
    sector: 'Real Estate',
    category: 'Financial Advisory',
    scope:
      'Diagnosing the current financial stability position of a Real Estate company and suggesting a policy framework to strengthen it, including stress scenario simulation and a performance scorecard for the Chairman\'s office.',
    image: IMAGES.realestate,
    approach: [
      'Detailed review of company\'s profitability and financial position — current & history',
      'Evaluated company\'s ability to complete its projects and service its on-boarded debt',
      'Studied various ratios to identify company\'s financial strengths & weaknesses',
      'Developed and simulated stress scenarios on financial position and recommended action plans',
      'Suggested Financial Stability Policy framework for the entity',
    ],
    delivery: [
      'Diagnosis on current Financial Stability',
      'Draft Financial Stability Policy framework',
      'Proposed dashboard for Top Management to assess Financial Stability going forward',
      'Guidance to implement both',
    ],
    valueAdded: [
      'Diagnosis of company\'s financial health',
      'Devised action plans for improving the entity\'s health',
      'Developed a performance measuring scorecard for Chairman\'s office',
    ],
  },

  // ── 11 ─────────────────────────────────────────────────────────────────────
  {
    id: 'centralised-concurrent-review',
    title: 'Centralised Concurrent Review',
    sector: 'Banking',
    category: 'Audit',
    scope:
      'Pan India centralised concurrent reviews covering all key banking functions and processes, managed by a 70-member team with automated workflow, regulatory compliance assurance, and fraud detection.',
    image: IMAGES.banking,
    approach: [
      'Set up Project Management & Organisation for a 70 member team',
      'Set up detailed audit and regulatory checklists',
      'Comprehensive roll out and implementation',
      'On-site robust project management',
    ],
    delivery: [
      'Flash reports',
      'Monthly reports',
      'Quarterly Audit Committee summaries',
      'Data dump analytics',
      'Root cause summaries',
    ],
    valueAdded: [
      'Assisted in automating the concurrent audit workflow',
      'Ensured regulatory compliance',
      'Identification of revenue leakages and regulatory non-compliances',
      'Identification of suspect cases of Frauds',
    ],
  },

  // ── 12 ─────────────────────────────────────────────────────────────────────
  {
    id: 'regulatory-compliance-insurance',
    title: 'Regulatory Compliance & Self Assessment Model Implementation',
    sector: 'Life Insurance',
    category: 'Compliance',
    scope:
      'Mock regulatory inspection and implementation of a compliance self-assessment framework for a Life Insurance company — customised testing of 500+ regulatory controls and delivery of CEO/CFO dashboards.',
    image: IMAGES.insurance,
    approach: [
      'Research, design & development of Insurance Regulation checklists',
      'Mapping of penalties, warning orders, etc.',
      'Business process understanding & flow charting',
      'Data analysis & customized testing of 500+ regulatory controls',
    ],
    delivery: [
      'Process flow charts & narratives',
      'Major & minor compliance violations report',
      'Self-assessment checklists',
    ],
    valueAdded: [
      'CEO/CFO dashboard',
      'Early warning report to prevent penalties',
      'Implemented self assessment system',
      'Pre-identification of client rejections and corrective actions',
    ],
  },

  // ── 13 ─────────────────────────────────────────────────────────────────────
  {
    id: 'financial-modelling',
    title: 'Financial Modelling',
    sector: 'Housing Finance',
    category: 'Financial Advisory',
    scope:
      'Validating an existing business plan and developing a fully linked, Excel-based 10-year Financial Model for a Housing Finance company, covering financial projections, cashflow templates, and risk scenario planning.',
    image: IMAGES.finance,
    approach: [
      'Research & study of business model and review of business plans',
      'Development of assumptions & key business drivers',
      'Preparation of financial model',
    ],
    delivery: [
      'Business assumptions review',
      'Financial projections',
      'Cashflow & liquidity templates',
    ],
    valueAdded: [
      'Risk & scenario planning',
      'Completely linked Excel-based 10-year financial model',
      'Independent validation',
    ],
  },

  // ── 14 ─────────────────────────────────────────────────────────────────────
  {
    id: 'internal-audit-infra',
    title: 'Internal Audit — Infrastructure & Real Estate',
    sector: 'Infrastructure',
    category: 'Audit',
    scope:
      'Fully outsourced internal audit and project/site audits for an Infrastructure & Real Estate client, focusing on sectorial risks, contractor performance, inventory, revenue recognition, and system controls improvement.',
    image: IMAGES.realestate,
    approach: [
      'Focus on key sectorial risks',
      'Project & contractor performance review',
      'Site audits to cover inventory, monthly progress & revenue recognition',
    ],
    delivery: [
      'Flash reports',
      'Monthly reports',
      'Quarterly Audit Committee presentations',
    ],
    valueAdded: [
      'Savings in procurement',
      'Timely flagging of non-compliances',
      'Revenue assurance',
      'Systems & controls improvements',
    ],
  },

  // ── 15 ─────────────────────────────────────────────────────────────────────
  {
    id: 'business-excellence-esop',
    title: 'Business Excellence — E-SOPs',
    sector: 'ITES',
    category: 'Business Excellence',
    scope:
      'Developing comprehensive E-SOPs for an accounting firm in the ITES sector — covering end-to-end process narratives, flowcharts, embedded risk & controls, and disclosure best practices, creating a web-enabled drill-down reference.',
    image: IMAGES.it,
    approach: [
      'Study of accounting structure, chart of accounts, SOD, and transaction recording practices',
    ],
    delivery: [
      'Developed end-to-end process narratives',
      'Flow charting, embedded risk & controls and performance indicators',
      'Accounting entries & narrations',
      'Mapped disclosure best practices',
    ],
    valueAdded: [
      'Web enabled, drill down & linked e-SOP',
      'Ease of use & one-stop reference source',
      'Process simplification & standardization',
    ],
  },

  // ── 16 ─────────────────────────────────────────────────────────────────────
  {
    id: 'sop-outsourcing-support',
    title: 'SOP & Outsourcing Support',
    sector: 'Private Equity',
    category: 'Business Excellence',
    scope:
      'Setting up of Investment & conflict resolution SOPs and providing outsourced accounting & compliance support for a Private Equity / Venture Fund client with timely reporting and full compliance delivery.',
    image: IMAGES.finance,
    approach: [
      'Identification of relationship value drivers',
      'Set up an engagement relationship model',
    ],
    delivery: [
      'Designed SOP model and commenced implementation',
      'Timely reporting and ensuring compliances',
    ],
    valueAdded: [
      'Delivery beyond defined scope of work',
      'Enthusiastic and engaged team which delighted the client',
    ],
  },

  // ── 17 ─────────────────────────────────────────────────────────────────────
  {
    id: 'governance-of-risk-broking',
    title: 'Governance of Risk — Broking Company',
    sector: 'Broking',
    category: 'Risk & Governance',
    scope:
      'Risk review of Cash, Commodity and Currency segments and review of Risk Management Systems (RMS) as per management-laid processes and exchange requirements for a Broking Company.',
    image: IMAGES.risk,
    approach: [
      'Study of Risk Management Systems (RMS), manuals and processes with live trading sessions',
    ],
    delivery: [
      'Comments on robustness of risk management processes',
      'Handling of unauthorized trading review',
      'Flagging of deviations from management approved RMS',
      'Benchmarking of industry-wide good practices',
    ],
    valueAdded: [
      'Identified RMS SOP requirement',
      'Automation requirement was emphasized',
      'Business Intelligence & Stress testing was recommended',
      'Disaster Recovery site was proposed',
    ],
  },

  // ── 18 ─────────────────────────────────────────────────────────────────────
  {
    id: 'ifc-framework-implementation',
    title: 'IFC Framework Implementation',
    sector: 'Manufacturing',
    category: 'Compliance',
    scope:
      'Review of existing internal controls and documentation of the IFC Framework in compliance with Companies Act, 2013 requirements for a Manufacturing company — aligned with COSO 2013 and with full Board certification.',
    image: IMAGES.manufacturing,
    approach: [
      'Scenario-based Materiality Assessment with sign off & Board reporting',
      'Design & facilitation of Entity Level Controls',
      'Design & Operating Effectiveness — Mega Processes',
      'Suggesting remediation action for deficient controls',
      'Process Owner and Board & Audit Committee sign off',
    ],
    delivery: [
      'Reporting on Materiality Assessment, ELC, process & control effectiveness',
      'Control Documentation — Flow Chart, Risk Control Matrix, Control Deficiencies Report, Remediation Testing',
      'Conceptual Framework Alignment with COSO 2013',
    ],
    valueAdded: [
      'Developed a framework of Internal Financial Control Assessment',
      'Developed the process flow, risk and controls for material processes',
      'Identified Material Weakness',
      'Facilitated Board certification and ensured full compliance with Companies Act, 2013',
    ],
  },

  // ── 19 ─────────────────────────────────────────────────────────────────────
  {
    id: 'process-efficiency-sop',
    title: 'Process Efficiency Enhancement Through SOP',
    sector: 'Financial Services',
    category: 'Business Excellence',
    scope:
      'Review of procurement processes across group companies and documentation of Standard Operating Procedures for the Procurement function of a Financial Services group, enabling automation and control standardization.',
    image: IMAGES.fainance_report,
    approach: [
      'Process walkthrough covering multiple lines of service and variety of procurement requirements',
      'Data analytics on procurement transactions, identification of process gaps and IT functional bottlenecks',
      'Benchmarking existing process vis-à-vis best practices',
      'Defining and documenting SOP',
    ],
    delivery: [
      'Documented Standard Operating Procedures with Flowcharts, Control Parameters, System Checks and templates',
      'Implementation support advisory',
    ],
    valueAdded: [
      'Control gaps identification and remediation',
      'Automation of many manual controls',
      'Standardization of process and enhancement of control environment across group',
    ],
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const CASE_STUDY_CATEGORIES = [
  'All',
  'Compliance',
  'Audit',
  'Risk & Governance',
  'Financial Advisory',
  'Business Excellence',
];

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getCaseStudiesByCategory(category) {
  if (!category || category === 'All') return CASE_STUDIES;
  return CASE_STUDIES.filter((cs) => cs.category === category);
}

export const getCaseStudyById = (id) => {
  return CASE_STUDIES.find(
    (study) => study.id.toString() === id.toString()
  );
};
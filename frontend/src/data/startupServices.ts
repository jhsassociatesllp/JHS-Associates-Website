// Source: "Services Listing for Start Ups & MSMEs" (PDF supplied by the firm). Wording follows the PDF.

export interface StartupItem {
  no: string
  title: string
  /** Sub-points exactly as listed (labels such as "a)" or bullets are kept in `mark`). */
  points?: { mark: string; text: string }[]
  /** Several services listed together under one number (rows 7 of the second table). */
  also?: string[]
  /** "Timelines" column; empty when the PDF gives none. */
  timeline?: string
}

export interface StartupSection {
  id: string
  title: string
  columns: string
  items: StartupItem[]
}

const L = (mark: string, text: string) => ({ mark, text })
const B = (text: string) => ({ mark: '•', text })

export const STARTUP_SECTIONS: StartupSection[] = [
  {
    id: 'compliance',
    title: 'Compliance Requirements for Start-Ups',
    columns: 'Requirements',
    items: [
      { no: '1', title: 'Shop & Establishment Certificate', timeline: '10 or more employees in case deployed (Maharashtra)' },
      {
        no: '2',
        title: 'Company Act',
        points: [
          L('a)', 'Digital Signature of 02 Directors/Shareholders'),
          L('b)', 'Company Registration Forms- Name reservation and Spice +'),
          L('b)', 'First Board Meeting and Appointment of Auditors (ADT-1 form)'),
          L('c)', 'Intimation of Commencement of Business date'),
          L('d)', 'DIR-8 and MBP-1 form to be submitted by directors in first Board meeting'),
          L('e)', 'Display of CIN number and Name on Premises'),
          L('f)', 'Preparation of minutes book and statutory registers like shareholders register/director register under Company Act'),
          L('g)', 'Share certificate issuance'),
        ],
        timeline: 'Within 30 days of Incorporation',
      },
      {
        no: '3',
        title: 'Intellectual Property Rights Based Compliances:',
        points: [
          L('a)', 'Scheme for Start-ups Intellectual Property Protection’ (SIPP) under the Start-up India initiative'),
          L('b)', 'Tarde Marks and Patents Registration'),
        ],
        timeline: 'Immediately or on need basis',
      },
      {
        no: '4',
        title: 'Labor Law Related Compliances',
        points: [
          L('a)', 'The Contract Labor (Regulation and Abolition) Act, 1970'),
          L('b)', 'The Employees’ Provident Funds and Miscellaneous Provisions Act, 1952'),
          L('c)', 'The Employees’ State Insurance Act, 1948.'),
        ],
        timeline: 'In case there are 10 or more employees or anticipated to deploy 10 or more employee or contract staff during the year.',
      },
      {
        no: '5',
        title: 'Professional Tax Registration:',
        points: [L('a)', 'PT Registration for Entity'), L('b)', 'PT registration for Employees/Directors')],
        timeline: 'Immediately within 30 days',
      },
      {
        no: '6',
        title: 'GST Return Filing periodicity selection',
        points: [{ mark: '', text: 'Display of GSTN registration certificate in premises' }],
        timeline: 'Opting for Quarterly filing on portal',
      },
      {
        no: '7',
        title: 'Income tax Act',
        points: [
          L('a)', 'Three years tax holiday in seven years u/s 80IAC to avail 100% tax rebate on its profits for 3 years within a block of 7 years'),
          L('b)', 'Login Id for Traces (TAN based) and PAN based to be created'),
          L('c)', 'New employees 80 JJA deductions'),
          L('d)', 'Lower TDS application'),
          L('e)', 'Structuring employee and Directors CTC/ Payout'),
          L('f)', 'Quarterly TDS & Annual Return filing'),
        ],
        timeline: 'During the financial year',
      },
      {
        no: '8',
        title: 'Start-up India Registration required to avail Tax Exemption under Section 56 of the Income Tax Act (Angel Tax)',
        timeline: 'During the financial year or on need basis or within 10 years from date of incorporation',
      },
      { no: '9', title: 'MSME/Udyam Registration', timeline: 'Immediately to avail MSME Benefits of Better Payment terms and Credit period and Loan facilities from Bank' },
      {
        no: '10',
        title: 'Non-Disclosure agreements, Code of Conducts and other Legal formats Drafting such as Shareholders Agreement/ Conflict resolution',
        timeline: 'Event basis',
      },
      { no: '11', title: 'Business Licenses as per applicable laws through associated firms' },
      { no: '12', title: 'IPR Registrations through associated firms' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance, Accounting & Secretarial Requirements for Start-Ups',
    columns: 'Requirements',
    items: [
      { no: '1', title: 'Legal Advisory on agreements including JV, Mergers, acquisitions and structuring of holding/ subsidiary', timeline: 'Event based' },
      {
        no: '2',
        title: 'Yearly Compliance',
        points: [
          B('Assistance in holding & conducting Board Meeting, Annual General Meeting, and Extra-Ordinary General Meeting'),
          B('Maintenance of Minutes Book, Statutory Registers, and all other prescribed secretarial records under the Companies Act, 2013'),
          B('Annual Return & Financial Statements with Registrar of Companies (ROC)'),
          B('Complete support and advisory services for implementation of Corporate Social Responsibility in compliance with the provisions of the Companies Act 2013'),
          B('Consolidation/sub-division of shares, share transfer and transmission, issue of shares certificates, dematerialization of shares, forfeiture of shares'),
          B('Ensuring board of director’s compliance as per Companies Act, 2013- ensuring minimum number of board meetings, confirmation of requisite quorum of board meeting, preparation and sending notice and agenda of board meeting, preparation of board resolutions as per Secretarial Standard'),
          B('Procedures and compliances related to making inter-company loans, investments, guarantees, and providing of securities.'),
          B('Payment of Dividend I.e. Interim and Final'),
        ],
      },
      {
        no: '3',
        title: 'Certification and Form Filing Fees',
        points: [
          B('Obtaining Director Identification Number (DIN) and Digital Signature Certificate (DSC)'),
          B('Company KYC, Director’s KYC, DPT-3, MSME'),
          B('Any other forms required to be filed with the Authority'),
        ],
      },
      {
        no: '4',
        title: 'Event Based Compliance',
        points: [
          B('Increase and re-classification of Authorised Share Capital and restructure of share capital of the Company like issue of Bonus Shares, Right Issue, Private Placement, Employees Stock Option Plan (ESOP), Buy back of the Shares.'),
          B('Compliances relating to Change of Name, Change of Objects, change of status from Public Ltd to Private Ltd and vice a versa'),
          B('Change of Registered office within the Local Limits of the State or outside the state.'),
          B('Secretarial Compliance certificate from practicing Company Secretary.'),
          B('Liaising with the office of Registrar of Companies, Regional Director and Company Law Board for obtaining various regulatory approvals.'),
        ],
      },
      {
        no: '5',
        title: 'Services relating to the FEMA and RBI, if required.',
        points: [
          B('Single Master Form'),
          B('Advance Remittance Form'),
          B('Form FC- GPR'),
          B('Annual Return on Foreign Liabilities and Assets'),
          B('Annual Performance Report'),
        ],
      },
      { no: '6', title: 'Any other assignment like corporate due diligence, etc.', timeline: 'Event based' },
      {
        no: '7',
        title: 'Cloud Accounting Software Tally or ZOHO implementation',
        also: ['Outsourced accounting, MIS & compliance support services'],
        timeline: 'Need basis',
      },
      { no: '8', title: 'HR & Accounting Policies & Formats', timeline: 'Need basis' },
      { no: '9', title: 'Employee claims and payroll processing/ outsourcing', timeline: 'Need basis' },
      { no: '10', title: 'Fixed Asset Register and FAMS implementation including tagging and bar-coding solutions', timeline: 'Need basis' },
      { no: '11', title: 'Statutory Audit (where conflicted through independent associates)', timeline: 'Need basis' },
      { no: '12', title: 'Internal Audit (where conflicted through independent associates)', timeline: 'Need basis' },
      { no: '13', title: 'Virtual CFO services', timeline: 'Need basis' },
      { no: '14', title: 'Expert tax retainership services', timeline: 'Need basis' },
      { no: '15', title: 'Board advisory services including Board formations, Board charter and appraisal formats', timeline: 'Need basis' },
      { no: '16', title: 'Business Valuation certificates (where conflicted through independent associates)', timeline: 'Need basis' },
      { no: '17', title: 'Comprehensive Business Rules/ e-SOPs', timeline: 'Need basis' },
      { no: '18', title: 'Loan staff arrangements/ employee secondments', timeline: 'Need basis' },
      { no: '19', title: 'IT systems one-time review for cyber security and back resilience testing', timeline: 'Need basis' },
      { no: '20', title: 'Record digitization services through associates', timeline: 'Need basis' },
    ],
  },
]

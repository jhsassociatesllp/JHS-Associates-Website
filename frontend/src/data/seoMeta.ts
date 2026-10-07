export const SITE_NAME = 'JHS'
export const SITE_URL = 'https://www.jhsassociates.in'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Uploads/logo.webp`

export interface RouteMeta {
  title: string
  description: string
}

const suffix = ` | ${SITE_NAME}`

export const DEFAULT_META: RouteMeta = {
  title: `${SITE_NAME} | Chartered Accountants`,
  description:
    'JHS is a premier Chartered Accountancy firm offering assurance, taxation, consulting, corporate finance and outsourcing services across India.',
}

export const SEO_META: Record<string, RouteMeta> = {
  '/': {
    title: `${SITE_NAME} | Chartered Accountants`,
    description:
      'JHS is a premier Chartered Accountancy firm delivering assurance, taxation, consulting, corporate finance and outsourcing services to clients across India and globally.',
  },

  // Spotlight
  '/ai-automation': {
    title: `AI & Automation${suffix}`,
    description: 'Explore how JHS uses AI-enabled tools and automation to deliver smarter assurance, tax and advisory outcomes.',
  },
  '/alumni': {
    title: `Alumni Network${suffix}`,
    description: 'Connect with the JHS alumni network of former team members across the globe.',
  },
  '/solutions': {
    title: `Solutions${suffix}`,
    description: 'Integrated professional service solutions from JHS spanning assurance, tax, advisory and technology.',
  },

  // Cities
  '/city/mumbai': { title: `Mumbai Office${suffix}`, description: 'JHS Mumbai office — chartered accountancy, tax and advisory services in Mumbai.' },
  '/city/delhi': { title: `Delhi Office${suffix}`, description: 'JHS Delhi office — chartered accountancy, tax and advisory services in Delhi NCR.' },
  '/city/bengaluru': { title: `Bengaluru Office${suffix}`, description: 'JHS Bengaluru office — chartered accountancy, tax and advisory services in Bengaluru.' },
  '/city/global': { title: `Global Presence${suffix}`, description: 'JHS global presence and international advisory network.' },
  '/city/gujarat': { title: `Gujarat Office${suffix}`, description: 'JHS Gujarat office — chartered accountancy, tax and advisory services in Gujarat.' },
  '/city/hyderabad': { title: `Hyderabad Office${suffix}`, description: 'JHS Hyderabad office — chartered accountancy, tax and advisory services in Hyderabad.' },
  '/city/kolkata': { title: `Kolkata Office${suffix}`, description: 'JHS Kolkata office — chartered accountancy, tax and advisory services in Kolkata.' },
  '/city/chennai': { title: `Chennai Office${suffix}`, description: 'JHS Chennai office — chartered accountancy, tax and advisory services in Chennai.' },

  // Services
  '/services/outsourcing': { title: `Outsourcing Solutions${suffix}`, description: 'Finance, accounting and process outsourcing solutions from JHS.' },
  '/services/consulting': { title: `Consulting Services${suffix}`, description: 'Strategic business and management consulting services from JHS.' },
  '/services/taxation': { title: `Taxation Solutions${suffix}`, description: 'Direct and indirect tax advisory, compliance and litigation support from JHS.' },
  '/services/assurance': { title: `Assurance Services${suffix}`, description: 'Statutory audit, assurance and risk advisory services from JHS.' },
  '/services/it-assurance': { title: `IT Assurance${suffix}`, description: 'IT audit, cyber security and technology assurance services from JHS.' },
  '/services/single-window-assistance': { title: `Single Window Assistance${suffix}`, description: 'End-to-end regulatory and compliance assistance through a single point of contact.' },
  '/services/soc-attestation': { title: `SOC Attestation${suffix}`, description: 'SOC 1 / SOC 2 attestation and reporting services from JHS.' },
  '/services/corporate-finance': { title: `Corporate Finance Solutions${suffix}`, description: 'Capital raising, M&A and corporate finance advisory services from JHS.' },
  '/services/compliance-learning': { title: `Compliance, Learning & Innovation${suffix}`, description: 'Compliance training, learning and innovation programs from JHS.' },
  '/services/learning-development': { title: `Learning & Development${suffix}`, description: 'Learning and development programs to build professional capability, from JHS.' },

  // Financial Services sectors
  '/sectors/financial-services/banking': { title: `Banking Sector Services${suffix}`, description: 'Assurance, risk and advisory services for banking sector clients from JHS.' },
  '/sectors/financial-services/mutual-funds': { title: `Mutual Funds Sector Services${suffix}`, description: 'Assurance and advisory services for mutual funds and asset management companies.' },
  '/sectors/financial-services/broking': { title: `Broking Sector Services${suffix}`, description: 'Assurance and advisory services for broking and capital markets intermediaries.' },
  '/sectors/financial-services/family-oriented-businesses': { title: `Family Oriented Businesses${suffix}`, description: 'Advisory services tailored for family-owned and family-oriented businesses.' },
  '/sectors/financial-services/insurance': { title: `Insurance Sector Services${suffix}`, description: 'Assurance and advisory services for insurance sector clients from JHS.' },
  '/sectors/financial-services/digital-currency': { title: `Digital Currency Advisory${suffix}`, description: 'Advisory services for digital currency and virtual digital asset businesses.' },
  '/sectors/financial-services/nbfc': { title: `NBFC Sector Services${suffix}`, description: 'Assurance and advisory services for Non-Banking Financial Companies (NBFCs).' },
  '/sectors/financial-services/portfolio-management': { title: `Portfolio Management Services${suffix}`, description: 'Advisory services for portfolio management service (PMS) providers.' },
  '/sectors/financial-services/venture-capital': { title: `Venture Capital Advisory${suffix}`, description: 'Advisory services for venture capital funds and their portfolio companies.' },

  // Consumer sectors
  '/sectors/consumer/housing': { title: `Housing Sector Services${suffix}`, description: 'Assurance and advisory services for the housing and construction finance sector.' },
  '/sectors/consumer/gems-jewellery': { title: `Gems & Jewellery Sector Services${suffix}`, description: 'Assurance and advisory services for the gems and jewellery industry.' },
  '/sectors/consumer/real-estate': { title: `Real Estate Sector Services${suffix}`, description: 'Assurance, RERA compliance and advisory services for real estate developers.' },
  '/sectors/consumer/retail': { title: `Retail Sector Services${suffix}`, description: 'Assurance and advisory services for retail and consumer businesses.' },
  '/sectors/consumer/oil-gas-industry': { title: `Oil & Gas Industry Services${suffix}`, description: 'Assurance and advisory services for the oil and gas industry.' },
  '/sectors/consumer/fmcg': { title: `FMCG Sector Services${suffix}`, description: 'Assurance and advisory services for FMCG (fast-moving consumer goods) companies.' },
  '/sectors/consumer/commodity': { title: `Commodity Sector Services${suffix}`, description: 'Assurance and advisory services for commodity trading and processing businesses.' },

  // Media & Technology sectors
  '/sectors/media-technology/media': { title: `Media Sector Services${suffix}`, description: 'Assurance and advisory services for media and entertainment companies.' },
  '/sectors/media-technology/it-system-audit': { title: `IT System Audit${suffix}`, description: 'IT systems audit services for technology-driven businesses.' },
  '/sectors/media-technology/it-tes': { title: `IT / ITeS Sector Services${suffix}`, description: 'Assurance and advisory services for IT and IT-enabled services (ITeS) companies.' },

  // Other sectors
  '/sectors/other/healthcare': { title: `Healthcare Sector Services${suffix}`, description: 'Assurance and advisory services for hospitals and healthcare businesses.' },
  '/sectors/other/construction': { title: `Construction Sector Services${suffix}`, description: 'Assurance and advisory services for construction and infrastructure companies.' },
  '/sectors/other/ngo': { title: `NGO Sector Services${suffix}`, description: 'Assurance, compliance and advisory services for NGOs and non-profit organizations.' },
  '/sectors/other/manufacturing': { title: `Manufacturing Sector Services${suffix}`, description: 'Assurance and advisory services for manufacturing businesses.' },
  '/sectors/other/logistics': { title: `Logistics Sector Services${suffix}`, description: 'Assurance and advisory services for logistics and supply chain companies.' },

  // Insights
  '/resources': { title: `Knowledge Resources${suffix}`, description: 'Guides, whitepapers and knowledge resources from JHS.' },
  '/white-papers': { title: `White Papers${suffix}`, description: 'In-depth white papers on tax, regulatory and business topics from JHS.' },
  '/regulatory': { title: `Regulatory Updates${suffix}`, description: 'The latest regulatory and compliance updates curated by JHS.' },
  '/articles': { title: `Articles${suffix}`, description: 'Articles and insights on taxation, audit and business advisory from JHS.' },
  '/case-studies': { title: `Case Studies${suffix}`, description: 'Client case studies showcasing the impact of JHS advisory work.' },
  '/thought-leadership': { title: `Thought Leadership${suffix}`, description: 'Thought leadership perspectives from the partners and experts at JHS.' },
  '/newsletters': { title: `Newsletters${suffix}`, description: 'Periodic newsletters covering tax, regulatory and business updates from JHS.' },
  '/blog': { title: `Blog${suffix}`, description: 'The JHS blog — perspectives on tax, audit, and business advisory.' },
  '/podcasts': { title: `Podcasts${suffix}`, description: 'Podcasts from JHS on business, tax and advisory topics.' },
  '/excellencia': { title: `Excellencia${suffix}`, description: 'Excellencia — JHS initiative celebrating excellence and innovation.' },

  // Know Us / About Us
  '/know-us/our-story': { title: `Our Story${suffix}`, description: 'The story of JHS — over four decades of building trust and delivering excellence.' },
  '/know-us/mission-vision': { title: `Mission & Vision${suffix}`, description: 'The mission and vision that guide JHS.' },
  '/know-us/culture': { title: `Our Culture${suffix}`, description: 'The values and culture that define life at JHS.' },
  '/know-us/partnerships': { title: `Partnerships${suffix}`, description: 'Strategic partnerships and network affiliations of JHS.' },
  '/know-us/awards': { title: `Awards & Recognition${suffix}`, description: 'Awards and recognitions received by JHS.' },
  '/about/leadership': { title: `Leadership${suffix}`, description: 'Meet the partners and leadership team at JHS.' },
  '/about/csr': { title: `Corporate Social Responsibility${suffix}`, description: 'Corporate social responsibility initiatives undertaken by JHS.' },
  '/about/careers': { title: `Careers${suffix}`, description: 'Explore career opportunities and open positions at JHS.' },
  '/about/our-offices': { title: `Our Offices${suffix}`, description: 'Locations and contact details for all JHS offices across India.' },
  '/about/company-overview': { title: `Company Overview${suffix}`, description: 'An overview of JHS — our history, scale and service offerings.' },
  '/about/global-presence': { title: `Global Presence${suffix}`, description: 'The international reach and global network of JHS.' },

  // Contact / Feedback / Legal
  '/contact': { title: `Contact Us${suffix}`, description: 'Get in touch with JHS for assurance, tax, consulting and advisory services.' },
  '/feedback': { title: `Client Feedback${suffix}`, description: 'Share your feedback about working with JHS.' },
  '/privacy-policy': { title: `Privacy Policy${suffix}`, description: 'The privacy policy governing use of the JHS website.' },
  '/terms-and-conditions': { title: `Terms & Conditions${suffix}`, description: 'Terms and conditions for use of the JHS website.' },
  '/terms-of-business': { title: `Terms of Business${suffix}`, description: 'Terms of business governing engagements with JHS.' },
  '/approval-for-proposal': { title: `Request for Proposal${suffix}`, description: 'Submit a request for proposal to engage JHS for your business needs.' },

  // Hero card detail / standalone article pages
  '/articles/boardrooms-in-transition': { title: `Boardrooms in Transition${suffix}`, description: 'How Indian boardrooms are evolving amid changing governance and regulatory expectations.' },
  '/resources/data-governance-rule-6': { title: `The Rule 6 Maze${suffix}`, description: 'Understanding Rule 6 of the data governance regulations and its compliance implications.' },
  '/technology/investment-opportunities-india': { title: `Investment Opportunities in India${suffix}`, description: 'Emerging investment opportunities across sectors in India.' },
  '/sustainability/green-transition': { title: `The Green Transition${suffix}`, description: 'How businesses are navigating the transition to sustainable, green operations.' },
  '/digital/digital-twins': { title: `Digital Twins${suffix}`, description: 'How digital twin technology is transforming business operations and decision-making.' },
  '/regulatory/sebi-draft-circular': { title: `SEBI Draft Proposal${suffix}`, description: 'Analysis of the latest SEBI draft circular and its implications for market participants.' },
  '/regulatory/rbi-cooling-off-period': { title: `RBI Cooling-Off Period${suffix}`, description: "Understanding RBI's mandatory cooling-off period requirement and its impact." },
}

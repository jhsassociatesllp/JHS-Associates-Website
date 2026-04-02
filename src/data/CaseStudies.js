const CASE_STUDIES = [
  {
    id: 1,
    title: "Tax Optimization for Tech Startup",
    tag: "Tax Planning",
    description: "How we helped a Bangalore-based SaaS startup save ₹45 lakhs through strategic tax planning and GST optimization.",
    image: "src/image/case1.jpg",
    pdf: "/src/pdfs/tech-startup-tax-optimization.pdf",
    author: "CA Rajesh Kumar",
    client: "TechSolutions Pvt Ltd",
    industry: "Technology",
    savings: "₹45 Lakhs"
  },
  {
    id: 2,
    title: "Audit Compliance for Manufacturing",
    tag: "Audit",
    description: "Complete audit compliance and process restructuring for a mid-sized manufacturing company in Pune.",
    image: "src/image/case2.jpg",
    pdf: "/src/pdfs/manufacturing-audit-compliance.pdf",
    author: "CA Priya Sharma",
    client: "Precision Industries",
    industry: "Manufacturing",
    savings: "₹32 Lakhs"
  },
  {
    id: 3,
    title: "International Tax Strategy",
    tag: "International Tax",
    description: "Cross-border tax planning for an Indian IT company expanding operations in the US and Europe.",
    image: "src/image/case3.jpg",
    pdf: "/src/pdfs/international-tax-strategy.pdf",
    author: "CA Amit Joshi",
    client: "GlobalTech Solutions",
    industry: "IT Services",
    savings: "₹78 Lakhs"
  },
  {
    id: 4,
    title: "GST Implementation for Retail Chain",
    tag: "GST",
    description: "End-to-end GST implementation and compliance for a retail chain with 50+ stores across India.",
    image: "src/image/case4.jpg",
    pdf: "/src/pdfs/retail-gst-implementation.pdf",
    author: "CA Nisha Patel",
    client: "Fashion Retail India",
    industry: "Retail",
    savings: "₹28 Lakhs"
  },
  {
    id: 5,
    title: "Due Diligence for M&A",
    tag: "M&A Advisory",
    description: "Comprehensive due diligence and tax structuring for a successful merger in the pharmaceutical sector.",
    image: "src/image/case5.jpg",
    pdf: "/src/pdfs/ma-due-diligence.pdf",
    author: "CA Sanjay Verma",
    client: "MediCorp Pharma",
    industry: "Pharmaceutical",
    savings: "₹1.2 Crore"
  },
  {
    id: 6,
    title: "Transfer Pricing Optimization",
    tag: "Transfer Pricing",
    description: "Transfer pricing documentation and optimization for a multinational company's Indian operations.",
    image: "src/image/case6.jpg",
    pdf: "/src/pdfs/transfer-pricing-optimization.pdf",
    author: "CA Anjali Gupta",
    client: "Global Manufacturing Co",
    industry: "Manufacturing",
    savings: "₹56 Lakhs"
  }
]

const CASE_STUDY_CATEGORIES = ['All', 'Tax Planning', 'Audit', 'International Tax', 'GST', 'M&A Advisory', 'Transfer Pricing']

const getCaseStudiesByCategory = (category) => {
  if (category === 'All') return CASE_STUDIES
  return CASE_STUDIES.filter(caseStudy => caseStudy.tag === category)
}

const getCaseStudyById = (id) => {
  return CASE_STUDIES.find(caseStudy => caseStudy.id === parseInt(id))
}

const getIndustries = () => {
  return [...new Set(CASE_STUDIES.map(caseStudy => caseStudy.industry))]
}

export {
  CASE_STUDIES,
  CASE_STUDY_CATEGORIES,
  getCaseStudiesByCategory,
  getCaseStudyById,
  getIndustries
}

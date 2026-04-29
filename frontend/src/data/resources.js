// Resources data for JHS & Associates LLP
// Each resource includes id, title, tag, description, image, pdf, and author

export const RESOURCES = [
  {
    id: 1,
    title: "Tax Planning Guide for FY 2024-25",
    tag: "Guide",
    description: "A comprehensive guide on tax planning strategies for individuals and businesses in the current financial year.",
    image: "src/image/Taxposter.jpg",
    pdf: "/src/pdfs/tax-planning-guide-2024.pdf",
    author: "CA Huzeifa Unwala"
  },
  {
    id: 2,
    title: "GST Compliance Checklist",
    tag: "Checklist", 
    description: "Essential checklist for businesses to ensure complete GST compliance and avoid penalties.",
    image: "src/image/Fainance1poster.jpg",
    pdf: "/src/pdfs/gst-compliance-checklist.pdf",
    author: "CA Huzeifa Unwala"
  },
  {
    id: 3,
    title: "Startup Audit Requirements",
    tag: "Guide",
    description: "Understanding audit requirements and best practices for startup companies in India.",
    image: "src/image/fainance2poster.jpg",
    pdf: "/src/pdfs/startup-audit-requirements.pdf",
    author: "CA Amit Joshi"
  },
  {
    id: 4,
    title: "International Taxation Basics",
    tag: "Guide",
    description: "Fundamental concepts of international taxation for Indian businesses with global operations.",
    image: "src/image/webPoster2.jpeg",
    pdf: "/src/pdfs/international-taxation-basics.pdf",
    author: "CA Nisha Patel"
  },
  {
    id: 5,
    title: "Digital Currency Taxation",
    tag: "Article",
    description: "Tax implications and compliance requirements for cryptocurrency and digital assets in India.",
    image: "src/image/webPoster3.jpeg",
    pdf: "/src/pdfs/digital-currency-taxation.pdf",
    author: "CA Vikram Singh"
  },
  {
    id: 6,
    title: "Transfer Pricing Documentation",
    tag: "Guide",
    description: "Complete guide to transfer pricing documentation requirements for multinational companies.",
    image: "src/image/Fainance4.jpg",
    pdf: "/src/pdfs/transfer-pricing-documentation.pdf",
    author: "CA Huzeifa Unwala"
  },
  {
    id: 7,
    title: "RERA Compliance Guide",
    tag: "Guide",
    description: "Understanding RERA compliance requirements for real estate developers and promoters.",
    image: "src/image/Auditposter.jpg",
    pdf: "/src/pdfs/rera-compliance-guide.pdf",
    author: "CA HUzeifa Unwala"
  },
  {
    id: 8,
    title: "ESG Reporting Standards",
    tag: "Report",
    description: "Overview of Environmental, Social, and Governance reporting standards for Indian companies.",
    image: "src/image/fainance2poster.jpg",
    pdf: "/src/pdfs/esg-reporting-standards.pdf",
    author: "CA Huzeifa Unwala"
  },
  {
    id: 9,
    title: "FEMA Compliance Manual",
    tag: "Manual",
    description: "Comprehensive manual for Foreign Exchange Management Act compliance for businesses.",
    image: "src/image/articles/fema-compliance.jpg",
    pdf: "/src/pdfs/fema-compliance-manual.pdf",
    author: "CA Rohit Verma"
  },
  {
    id: 10,
    title: "Income Tax Appeals Process",
    tag: "Guide",
    description: "Step-by-step guide to handling income tax appeals and litigation procedures.",
    image: "src/image/articles/tax-appeals.jpg",
    pdf: "/src/pdfs/income-tax-appeals-process.pdf",
    author: "CA Pooja Shah"
  },
  {
    id: 11,
    title: "Startup Valuation Methods",
    tag: "Article",
    description: "Different valuation methods used for startups and their tax implications.",
    image: "src/image/articles/startup-valuation.jpg",
    pdf: "/src/pdfs/startup-valuation-methods.pdf",
    author: "CA Karan Malhotra"
  },
  {
    id: 12,
    title: "NBFC Regulatory Framework",
    tag: "Framework",
    description: "Understanding the regulatory framework for Non-Banking Financial Companies in India.",
    image: "src/image/articles/nbfc-regulation.jpg",
    pdf: "/src/pdfs/nbfc-regulatory-framework.pdf",
    author: "CA Sneha Reddy"
  },
  {
    id: 13,
    title: "ESG Reporting Standards",
    tag: "Report",
    description: "Overview of Environmental, Social, and Governance reporting standards for Indian companies.",
    image: "src/image/articles/esg-reporting.jpg",
    pdf: "/src/pdfs/esg-reporting-standards.pdf",
    author: "CA Huzeifa Unwala"
  },
  {
    id: 14,
    title: "Corporate Tax Planning",
    tag: "Guide",
    description: "Strategic tax planning approaches for corporate entities to optimize tax liabilities.",
    image: "src/image/webPoster4.jpeg",
    pdf: "/src/pdfs/corporate-tax-planning.pdf",
    author: "CA Maaz Quraishi"
  }
];

// Categories for filtering
export const RESOURCE_CATEGORIES = [
  "All",
  "Guide", 
  "Checklist",
  "Article",
  "Report",
  "Manual",
  "Framework"
];

// Helper function to get resources by category
export const getResourcesByCategory = (category) => {
  if (category === "All") return RESOURCES;
  return RESOURCES.filter(resource => 
    resource.tag.toLowerCase().includes(category.toLowerCase()) ||
    resource.title.toLowerCase().includes(category.toLowerCase()) ||
    resource.description.toLowerCase().includes(category.toLowerCase())
  );
};

// Helper function to get resource by ID
export const getResourceById = (id) => {
  return RESOURCES.find(resource => resource.id === parseInt(id));
};

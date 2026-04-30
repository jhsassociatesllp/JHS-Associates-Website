const CASE_STUDIES = [
  {
    // id: 1,
    title: "Independent Risk Management Review for a Broking Company",
    sector: "Brokerage",
    solution: "Risk Management Review",
    scope: "Risk review of Cash, commodity and currency segments. Risk management systems review as per management laid processes and exchange requirements.",
    approach: "Study of Risk Management Systems (RMS), manuals and processes with live trading sessions.",
    delivery: [
      "Comments on robustness of risk management processes",
      "Handling of unauthorized trading",
      "Flagging of deviations from management approved RMS",
      "Bench marking of industry wide good practices"
    ],
    valueAdded: [
      "Identified RMS SOP requirement",
      "Automation requirement was emphasized",
      "Business Intelligence & Stress testing was recommended",
      "Disaster Recovery site was proposed"
    ]
  },
  {
    // id: 2,
    title: "Developed Risk Management Systems & Processes for a Payment Bank",
    sector: "Payment Bank",
    solution: "ERM Manuals",
    scope: "Develop Risk Management Manuals.",
    approach: "Research & study of business model, review of existing processes. Development of key risk scenarios and risk indicators. Preparation of manuals and procedures.",
    delivery: [
      "Risk procedures, reporting framework, templates & risk indicators"
    ],
    valueAdded: [
      "Risk & scenarios",
      "Independent validation",
      "Regulatory application"
    ]
  },
  {
    // id: 3,
    title: "Developed Train the Trainer training module on Risk Management for leading Financial Service Group",
    sector: "Financial Services",
    solution: "Develop Train the Trainer training content and training delivery",
    scope: "Develop Risk Management Manuals.",
    approach: "Research & study of business challenges and pain areas. Identification of key Risks and developing training material.",
    delivery: [
      "'Train the trainer' training material",
      "Training deliver to key stakeholders"
    ],
    valueAdded: [
      "Identification of key pain areas / Risks in Services domain and ensuring training material address those concerns"
    ]
  },
  {
    // id: 4,
    title: "Developed Risk Management Policy and Manual for Leading Bank",
    sector: "Banking",
    solution: "ERM Manuals",
    scope: "Developed Consolidated Risk Management Policy and Manuals.",
    approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
    delivery: [
      "Consolidated Risk procedures, Framework and reporting framework"
    ],
    valueAdded: [
      "Ensuring regulatory compliance with RBI requirements"
    ]
  }
];

const CASE_STUDY_CATEGORIES = ['All', 'Brokerage', 'Payment Bank', 'Financial Services', 'Banking'];

const getCaseStudiesByCategory = (category) => {
  if (category === 'All') return CASE_STUDIES;
  return CASE_STUDIES.filter(caseStudy => caseStudy.sector === category);
};

const getCaseStudyById = (id) => {
  return CASE_STUDIES.find(caseStudy => caseStudy.id === parseInt(id));
};

const getIndustries = () => {
  return [...new Set(CASE_STUDIES.map(caseStudy => caseStudy.sector))];
};

export {
  CASE_STUDIES,
  CASE_STUDY_CATEGORIES,
  getCaseStudiesByCategory,
  getCaseStudyById,
  getIndustries
};

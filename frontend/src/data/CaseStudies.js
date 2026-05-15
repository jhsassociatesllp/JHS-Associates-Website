import { imageUrl } from '../utils/imageUrl';

const CASE_STUDIES = [
  {
    id: 1,
    image: imageUrl('Fainance3.jpg'),
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
    id: 2,
    image: imageUrl('WebPoster2.jpeg'),
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
    id: 3,
    image: imageUrl('StatsImage.png'),
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
    id: 4,
    image: imageUrl('Fainance4.jpg'),
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
  },
  // {
  //   id: 5,
  //   image: img5,
  //   title: "COMPLIANCE ASSURANCE & SELF CERTIFICATION PROGRAMME (CASP)",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 6,
  //   image: img6,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 7,
  //   image: img7,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 8,
  //   image: img8,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 9,
  //   image: img9,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 10,
  //   image: img10,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 11,
  //   image: img11,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 12,
  //   image: img12,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // },
  // {
  //   id: 13,
  //   image: img13,
  //   title: "Developed Risk Management Policy and Manual for Leading Bank",
  //   sector: "Banking",
  //   solution: "ERM Manuals",
  //   scope: "Developed Consolidated Risk Management Policy and Manuals.",
  //   approach: "Study of business model, review of existing processes and scattered manuals. Preparation of Consolidated Enterprise Risk Management Policy and manuals for 4 key areas as the RBI requirements.",
  //   delivery: [
  //     "Consolidated Risk procedures, Framework and reporting framework"
  //   ],
  //   valueAdded: [
  //     "Ensuring regulatory compliance with RBI requirements"
  //   ]
  // }
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

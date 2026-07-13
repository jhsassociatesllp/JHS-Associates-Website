import { useState } from "react";
import "./FAQ.css";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  label: string;
  items: FAQItem[];
}

const faqs: FAQCategory[] = [
  {
    label: "About JHS",
    items: [
      {
        q: "What is JHS & Associates LLP?",
        a: "JHS & Associates LLP is a multi-disciplinary professional services firm of Chartered Accountants headquartered in India. We provide a comprehensive suite of services including Assurance, Taxation, Consulting, Corporate Finance, Outsourcing, and Regulatory Advisory to clients across industries ranging from financial services and manufacturing to healthcare and NGOs.",
      },
      {
        q: "How long has JHS & Associates LLP been in practice?",
        a: "JHS & Associates LLP has built a strong legacy of trust and professional excellence over decades of practice. Our firm combines deep domain expertise with a forward-looking approach, enabling us to serve diverse clients across India's evolving regulatory and business landscape.",
      },
      {
        q: "How many offices does JHS have across India?",
        a: "JHS & Associates LLP has a pan-India presence with offices in major cities including Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Ahmedabad, and Kolkata. This network enables us to serve clients locally while leveraging our collective national and international expertise.",
      },
      {
        q: "What industries does JHS serve?",
        a: "We serve a broad spectrum of industries including Banking & Financial Services, Manufacturing, Real Estate, Healthcare, Retail, Construction, Media & Technology, NGOs, Logistics, Oil & Gas, and more. Our sector-specific knowledge ensures tailored, context-aware advice for every client.",
      },
    ],
  },
  {
    label: "Our Services",
    items: [
      {
        q: "What core services does JHS & Associates LLP offer?",
        a: "Our core service lines include IT Assurance, Tax & GST Advisory, Financial Reporting, Risk & Governance, Outsourcing (Accounting, Payroll & Compliance), Single Window Assistance, SOC Attestation, Corporate Finance, and Compliance Learning. Each practice is led by experienced professionals with deep subject-matter expertise.",
      },
      {
        q: "Do you provide services to international clients or businesses with cross-border operations?",
        a: "Yes. JHS & Associates LLP assists multinational corporations and businesses with cross-border operations through international tax structuring, transfer pricing advisory, foreign exchange compliance (FEMA), and assistance with setting up business entities in India. We also collaborate with international networks to deliver seamless service.",
      },
      {
        q: "What is Single Window Assistance?",
        a: "Single Window Assistance is a unified, end-to-end service designed to help businesses — particularly those entering or expanding within India — manage all regulatory, compliance, and operational setup requirements through one dedicated point of contact. It covers entity formation, registrations, licences, tax enrolments, and ongoing compliance management.",
      },
      {
        q: "Does JHS offer Risk & Governance advisory?",
        a: "Yes. Our Risk & Governance practice helps organisations identify, assess, and mitigate enterprise risks while establishing robust internal controls and corporate governance frameworks. We conduct internal audits, risk assessments, board-level governance reviews, and compliance audits tailored to regulatory requirements.",
      },
    ],
  },
  {
    label: "Working with JHS",
    items: [
      {
        q: "How can I engage JHS & Associates LLP for professional services?",
        a: "You can reach out to us through the Contact page on our website, or submit a formal Request for Proposal (RFP) using the dedicated RFP form. Our team will review your requirements and connect you with the right practice lead to discuss scope, timelines, and fee arrangements.",
      },
      {
        q: "How do I submit a Request for Proposal (RFP)?",
        a: "Click the 'Request for Proposal' button on the website header or navigate to the RFP page. Complete the form with details about your organisation, the services required, and any relevant deadlines. Our team typically acknowledges receipt within one business day and follows up to discuss your requirements in detail.",
      },
      {
        q: "Does JHS offer internship or career opportunities?",
        a: "Yes. JHS & Associates LLP actively recruits Chartered Accountants, CA Articleship trainees, and professionals across finance, tax, audit, and consulting. Visit the Careers page to explore current openings and submit your application, or click the 'Apply Now' button on the homepage.",
      },
      {
        q: "Will my information remain confidential?",
        a: "Absolutely. Confidentiality is a cornerstone of professional practice. All information shared with JHS & Associates LLP — whether during engagement discussions or in the course of delivering services — is treated with the highest level of discretion and in accordance with the professional standards of the Institute of Chartered Accountants of India (ICAI).",
      },
    ],
  },
  {
    label: "Compliance & Regulatory",
    items: [
      {
        q: "How does JHS stay updated with regulatory and legislative changes?",
        a: "Our dedicated knowledge management team continuously monitors changes across SEBI, RBI, MCA, ICAI, Income Tax, GST, and other regulatory bodies. We publish timely alerts, in-depth articles, white papers, and regulatory briefings through our Insights platform to keep clients informed and prepared.",
      },
      {
        q: "What is the DPDP Act and how can JHS help?",
        a: "The Digital Personal Data Protection (DPDP) Act, 2023, along with the DPDP Rules, 2025, introduces mandatory obligations for Data Fiduciaries around consent management, data security, and breach notification. JHS can assist with DPDP gap assessments, privacy framework implementation, third-party processor due diligence, and board-level reporting under Rule 6.",
      },
      {
        q: "Can JHS assist with SEBI and RBI regulatory compliance?",
        a: "Yes. We provide regulatory compliance support for entities regulated by SEBI (such as mutual funds, portfolio managers, brokers, and investment advisers) and RBI (such as banks, NBFCs, and co-operative banks). Our services include compliance audits, regulatory filings, FEMA advisory, and assistance in responding to regulatory queries.",
      },
      {
        q: "Does JHS assist with GST compliance and disputes?",
        a: "Yes. Our Tax & GST Advisory team offers end-to-end GST compliance services including registration, return filing, input tax credit reconciliation, GST audits, and representation before tax authorities in case of disputes, assessments, or appeals. We also advise on GST structuring for complex business transactions.",
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleCategoryChange = (idx: number) => {
    setActiveCategory(idx);
    setOpenIndex(0);
  };

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const currentItems = faqs[activeCategory].items;

  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        {/* Header */}
        <div className="faq__header">
          <span className="faq__eyebrow">GOT QUESTIONS?</span>
          <h2 className="faq__heading">Frequently Asked Questions</h2>
          <p className="faq__sub">
            Everything you need to know about JHS &amp; Associates LLP — our
            services, how we work, and how we can help your business.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="faq__tabs" role="tablist" aria-label="FAQ Categories">
          {faqs.map((cat, idx) => (
            <button
              key={cat.label}
              role="tab"
              aria-selected={activeCategory === idx}
              className={`faq__tab ${activeCategory === idx ? "faq__tab--active" : ""}`}
              onClick={() => handleCategoryChange(idx)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="faq__accordion" role="tabpanel">
          {currentItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq__item ${isOpen ? "faq__item--open" : ""}`}
              >
                <button
                  className="faq__question"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq__question-text">{item.q}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {isOpen ? (
                        <line x1="5" y1="12" x2="19" y2="12" />
                      ) : (
                        <>
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </>
                      )}
                    </svg>
                  </span>
                </button>
                <div className="faq__answer-wrapper" style={{ maxHeight: isOpen ? "600px" : "0px" }}>
                  <p className="faq__answer">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {/* <div className="faq__cta">
          <p className="faq__cta-text">Still have questions? We're happy to help.</p>
          <a href="/contact" className="faq__cta-btn">Contact Us</a>
        </div> */}
      </div>
    </section>
  );
}

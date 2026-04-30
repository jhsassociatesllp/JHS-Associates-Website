import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FileCheck, Shield, Search, Activity, Calculator,
  Truck, Leaf, Database, CheckCircle2, Target, TrendingUp, BarChart3
} from 'lucide-react'
import './Assurance.css'
import heroImg from '../../image/Assurance.png'

gsap.registerPlugin(ScrollTrigger)

const continuousCoverage = [
  { id: "01", title: "Statutory Audit", desc: "Annual statutory financial review", icon: <FileCheck size={28} strokeWidth={1.5} /> },
  { id: "02", title: "Internal Audit", desc: "Process, risk & control assurance", icon: <Search size={28} strokeWidth={1.5} /> },
  { id: "03", title: "IT / Cyber Security", desc: "CERT-In empanelled assessment", icon: <Shield size={28} strokeWidth={1.5} /> },
  { id: "04", title: "Forensic Investigation", desc: "Fraud detection & digital forensics", icon: <Activity size={28} strokeWidth={1.5} /> },
  { id: "05", title: "Concurrent Audit", desc: "Real-time transaction monitoring", icon: <BarChart3 size={28} strokeWidth={1.5} /> },
  { id: "06", title: "SOC 1 & SOC 2", desc: "Service organisation controls", icon: <Calculator size={28} strokeWidth={1.5} /> },
  { id: "07", title: "Channel / Dealer Audit", desc: "Supply chain & distributor review", icon: <Truck size={28} strokeWidth={1.5} /> },
  { id: "08", title: "ESG & Ethics Audit", desc: "Sustainability & governance review", icon: <Leaf size={28} strokeWidth={1.5} /> },
  { id: "09", title: "DPDP Act Compliance", desc: "Data protection impact assessment", icon: <Database size={28} strokeWidth={1.5} /> },
]

const programsData = [
  {
    id: "casp",
    title: "Compliance Assurance & Self Certification Programme (CASP)",
    scope: "Implementation Assistance on Compliance Assurance & Self Certification Programme",
    sector: "Payment System",
    methodology: [
      "Continuous Improvement & Reporting",
      "Identification of Compliance Requirements",
      "Development of Self-Certification Framework",
      "Implementation & Self-Certification Process",
      "Compliance Monitoring & Gap Assessment",
      "Development of Compliance Effectiveness Dashboard"
    ],
    deliverables: [
      "Master Compliance Checklist",
      "Self-Assessment Certification Formats & Checklists",
      "Self-Certification Reports",
      "Compliance Gap Analysis Report",
      "Corrective Action Plan",
      "CEO/ CFO Compliance Dashboard",
      "Compliance Monitoring & Audit Reports",
      "Training & Awareness Materials",
      "Final Compliance Assurance Report"
    ],
    valueAdded: [
      "Enhanced Regulatory Compliance",
      "Improved Accountability & Ownership",
      "Proactive Risk Mitigation",
      "Operational Efficiency",
      "Real-Time Compliance Insights",
      "Regulatory Confidence & Reputation",
      "Continuous Improvement & Adaptability"
    ]
  },
  {
    id: "rap",
    title: "Revenue Assurance Program",
    scope: "Review of client invoicing process, Identify invoicing errors, Recommend process improvements",
    sector: "Logistics Sector",
    methodology: [
      "Risk Identification - Detect revenue leakage points",
      "Data Collection & Validation - Gather and verify financial data",
      "Gap Analysis - Compare actual vs. expected revenue",
      "Control Implementation - Enforce corrective measures",
      "Monitoring & Reporting - Continuously track metrics",
      "Process Optimization - Improve systems and controls",
      "Developed monthly revenue assurance SOP",
      "Conducted rigorous invoice reviews"
    ],
    deliverables: [
      "Monthly Revenue Assurance SOP",
      "Invoice Review Reports",
      "Discrepancy Reports",
      "Correction & Mitigation Plan",
      "Performance Dashboard",
      "Monthly audit report on invoices",
      "Root cause analysis for identified issues"
    ],
    valueAdded: [
      "Revenue Protection - Identifies and prevents leakages",
      "Enhanced Accuracy - Ensures correct billing and invoicing",
      "Operational Efficiency - Streamlines financial processes",
      "Risk Mitigation - Reduces financial risks and issues",
      "Data-Driven Decision Making - Strategic improvements",
      "Revenue Leakage Scorecard - Tracks potential losses",
      "Pre-identification of Client Rejections",
      "Reduction in Revenue Recognition Errors"
    ]
  }
]

const featuredEngagements = [
  { title: "Forensic Investigation", client: "Logistics Co., 8 offices", impact: "Rs. 17 Crore fraud quantified", icon: <Activity size={24} strokeWidth={1.5} /> },
  { title: "ECL Model Validation", client: "NBFC", impact: "Rs. 30 Crore provision corrected under IndAS 109", icon: <Calculator size={24} strokeWidth={1.5} /> },
  { title: "Retail Revenue Leakage", client: "Fashion Retailer", impact: "Rs. 5,425 Lakh operational impact", icon: <TrendingUp size={24} strokeWidth={1.5} /> }
]

const caseStudies = [
  {
    title: "Video KYC Concurrent Audit",
    sector: "Banking",
    label: "CASE STUDY",
    problem: "Per RBI's Master Direction on KYC, all accounts opened via Video Customer Identification Process (V-CIP) must undergo concurrent audit clearance before activation. A large private sector bank engaged JHS to provide real-time daily KYC validation — detecting fake documents, duplicates, and ensuring database alignment with KRA, NSDL, and Aadhaar at scale.",
    response: [
      "Validated 500+ V-CIP account openings daily against full regulatory checklist",
      "Cross-verified all customer documents against KRA, NSDL, and Aadhaar databases",
      "Executed systematic de-duplication checks to prevent account fraud",
      "Identified and flagged fake identity documents in real time",
      "Maintained 98%+ daily compliance rate — accounts activated only post-clearance",
      "Delivered daily management reports enabling immediate corrective action"
    ],
    metrics: [
      { value: "500+", label: "Daily Validations" },
      { value: "KRA/NSDL/Aadhaar", label: "DB Cross-Check" },
      { value: "98%+", label: "Compliance Rate" },
      { value: "Full Compliance", label: "RBI Directive" }
    ]
  },
  {
    title: "ECL Model Validation — IndAS 109",
    sector: "NBFC",
    label: "CASE STUDY",
    problem: "An NBFC required independent validation of its Expected Credit Loss (ECL) computation model as mandated under IndAS 109. The model processed 10 years of historical data with over 1 crore line items. The NBFC needed assurance that PD and LGD calculations were accurate and that provisioning outcomes were reliable for financial reporting.",
    response: [
      "Analysed 10 years of historical loan data across all product segments",
      "Re-performed calculations across 1 crore+ data line items using MS Access and IDEA",
      "Validated PD formula logic and LGD computation methodology in full",
      "Analysed DPD patterns and validated staging criteria vs. RBI norms and IndAS",
      "Identified formula errors causing material overstatement of ECL provisions",
      "Correction reduced ECL provisions by ₹30 Crores — improving the NBFC's capital position"
    ],
    metrics: [
      { value: "1 Crore+", label: "Data Lines Analysed" },
      { value: "10 Years", label: "Historical Period" },
      { value: "₹30 Crore", label: "ECL Provision Corrected" },
      { value: "Validated", label: "IndAS 109" }
    ]
  }
]

export default function Assurance() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.a-hero__content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )

      gsap.utils.toArray('.a-section-header').forEach((header: any) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.utils.toArray('.a-service-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, delay: i * 0.05, scrollTrigger: { trigger: '.a-services-grid', start: 'top 80%' } }
        )
      })

      gsap.utils.toArray('.a-program-card, .a-featured-item, .a-case-study').forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 85%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="a-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="a-hero">
        <div className="a-hero__bg" style={{ backgroundImage: `url('${heroImg}')` }} />
        <div className="a-hero__overlay" />
        <div className="a-container">
          <div className="a-hero__content">
            <span className="a-eyebrow">Trust & Integrity</span>
            <h1 className="a-title">Assurance Solutions</h1>
            <p className="a-subtitle">
              Independent, rigorous, and technologically advanced audit services designed to build stakeholder confidence and bulletproof your compliance.
            </p>
          </div>
        </div>
      </section>

      {/* ════ CONTINUOUS COVERAGE (ALWAYS ON) ════ */}
      <section className="a-coverage">
        <div className="a-container">
          <div className="a-section-header">
            <h2>Continuous Assurance Coverage</h2>
            <div className="a-divider" />
            <p>JHS's assurance practice runs continuously — providing an independent expert lens across every stage of your journey, every year, without interruption.</p>
          </div>

          <div className="a-services-grid">
            {continuousCoverage.map((item) => (
              <div key={item.id} className="a-service-card">
                <div className="a-service-card__icon">{item.icon}</div>
                <h3 className="a-service-card__title">{item.title}</h3>
                <p className="a-service-card__description">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="a-certification">
             <Shield className="a-certification__icon" size={28} />
             <p className="a-certification__text">CERT-In Empanelled Information Security Auditing Organisation · Valid until September 2028</p>
          </div>
        </div>
      </section>

      {/* ════ FLAGSHIP PROGRAMS ════ */}
      <section className="a-programs">
        <div className="a-container">
          <div className="a-section-header">
            <h2>Flagship Assurance Programs</h2>
            <div className="a-divider" />
            <p>Comprehensive frameworks designed to systematically address complex compliance and revenue protection challenges.</p>
          </div>

          <div className="a-programs-wrap">
            {programsData.map(program => (
              <div key={program.id} className="a-program-card">
                <div className="a-program-header">
                  <h3>{program.title}</h3>
                  <p><strong>Scope:</strong> {program.scope}</p>
                  <p><strong>Sector:</strong> {program.sector}</p>
                </div>
                <div className="a-program-body">
                  <div className="a-program-col">
                    <div className="a-program-col-title">
                      <Target size={24} /> Methodology
                    </div>
                    <ul className="a-program-list">
                      {program.methodology.map((item, i) => (
                        <li key={i}><CheckCircle2 size={16} /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="a-program-col">
                    <div className="a-program-col-title">
                      <FileCheck size={24} /> Deliverables
                    </div>
                    <ul className="a-program-list">
                      {program.deliverables.map((item, i) => (
                        <li key={i}><CheckCircle2 size={16} /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="a-program-col">
                    <div className="a-program-col-title">
                      <TrendingUp size={24} /> Value Added
                    </div>
                    <ul className="a-program-list">
                      {program.valueAdded.map((item, i) => (
                        <li key={i}><CheckCircle2 size={16} /> {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ IN-DEPTH CASE STUDIES ════ */}
      <section className="a-case-studies">
        <div className="a-container">
          <div className="a-section-header">
            <h2>Featured Case Studies</h2>
            <div className="a-divider" />
            <p>Exploring complex assurance challenges and our rigorous methodologies deployed to solve them.</p>
          </div>
          
          <div className="a-case-studies-grid">
            {caseStudies.map((cs, i) => (
              <div key={i} className="a-case-study">
                <div className="a-case-study__header">
                  <span className="a-case-study__sector">{cs.sector}</span>
                  <span className="a-case-study__label">{cs.label}</span>
                </div>
                <h3 className="a-case-study__title">{cs.title}</h3>
                
                <div className="a-case-study__content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                  <div>
                    <h4 className="a-case-study__section-title">Problem Statement</h4>
                    <p className="a-case-study__text">{cs.problem}</p>
                  </div>
                  <div>
                    <h4 className="a-case-study__section-title">JHS Response</h4>
                    <ul className="a-case-study__list">
                      {cs.response.map((res, j) => (
                         <li key={j} className="a-case-study__list-item">
                           <CheckCircle2 size={18} className="a-case-study__check" />
                           {res}
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="a-case-study__metrics">
                  {cs.metrics.map((metric, k) => (
                    <div key={k} className="a-metric">
                      <div className="a-metric__value">{metric.value}</div>
                      <div className="a-metric__label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FEATURED ENGAGEMENTS ════ */}
      <section className="a-featured">
        <div className="a-container">
          <div className="a-section-header">
            <h2>Real Client Work, Real Numbers</h2>
            <div className="a-divider" />
            <p>Snapshot of our high-impact assurance engagements.</p>
          </div>
          
          <div className="a-featured-grid">
            {featuredEngagements.map((item, i) => (
              <div key={i} className="a-featured-item">
                <div className="a-featured-item__header">
                  <div className="a-featured-item__icon">{item.icon}</div>
                  <h3 className="a-featured-item__title">{item.title}</h3>
                </div>
                <p className="a-featured-item__client">{item.client}</p>
                <p className="a-featured-item__impact">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      <section className="a-cta">
        <div className="a-container">
          <div className="a-cta__box">
            <h2>Need absolute clarity?</h2>
            <p>Speak to our senior Assurance partners to design the right audit framework for your organization.</p>
            <button className="a-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section>

    </div>
  )
}

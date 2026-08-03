import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './Consulting.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–06)
const leftItems = [
  { id: "01", title: "Company Incorporation and regulatory setup services", desc: "Entity formation & compliance setup" },
  { id: "02", title: "Internal Financial Controls, SOP design & automation", desc: "Process design & control frameworks" },
  { id: "03", title: "Risk Management Frameworks and fraud investigations", desc: "Risk assessment & fraud detection" },
  { id: "04", title: "Business Advisory, Valuation, and field verification studies", desc: "Strategic advisory & business valuation" },
  { id: "05", title: "Efficiency Improvement and process optimization consulting", desc: "Operational excellence & cost optimisation" },
  { id: "06", title: "Family Arbitration, Private Trust & Succession Planning", desc: "Wealth continuity & family governance" },
]

// Right column items (07–12)
const rightItems = [
  { id: "07", title: "Secretarial Practice, Company Law Compliance & Due Diligence", desc: "Corporate governance & statutory filings" },
  { id: "08", title: "Internal Control Evaluation, Business Impact & Continuity Planning", desc: "BCP design & control effectiveness" },
  { id: "09", title: "Annual Return Filing, and statutory compliance management", desc: "Regulatory reporting & filing support" },
  { id: "10", title: "Merger, Acquisition, Demerger & Reorganisation Planning", desc: "M&A structuring & transaction support" },
  { id: "11", title: "Financial Forecasting, Working Capital & Business Valuation Support", desc: "Financial modelling & capital planning" },
  { id: "12", title: "FEMA Advisory, Project Feasibility Reports & Liquidation Assistance", desc: "Cross-border compliance & exit support" },
]

export default function Consulting() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.c-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray<Element>('.c-section-header').forEach((header) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.c-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.c-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray<Element>('.c-spoke-row--left').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.c-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray<Element>('.c-spoke-row--right').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.c-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="c-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="c-hero">
        <div className="c-hero__bg" style={{ backgroundImage: `url('${imageUrl('Consulting.png')}')` }} />
        <div className="c-hero__overlay" />
        <div className="c-container">
          <div className="c-hero__content">
            {/* <span className="c-eyebrow">Expert Advisory</span> */}
            <h1 className="c-title">Consulting Services</h1>
            <p className="c-subtitle">
              Strategic guidance to drive growth, efficiency, and transformation.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="c-coverage">
        <div className="c-container">
          <div className="c-section-header">
            <h2>Our Consulting Capabilities</h2>
            <div className="c-divider" />
            <p>We deliver actionable insights and execution support across 12 core consulting verticals, ensuring end-to-end organisational excellence.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="c-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="c-spoke-col c-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="c-spoke-row c-spoke-row--left">
                  <div className="c-spoke-text c-spoke-text--left">
                    <h3 className="c-spoke-title">{item.title}</h3>
                    <p className="c-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="c-spoke-connector c-spoke-connector--left">
                    <div className="c-spoke-line" />
                    <div className="c-spoke-badge c-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="c-spoke-center">
              <div className="c-spoke-hub">
                <div className="c-spoke-hub__ring" />
                <div className="c-spoke-hub__inner">
                  <span className="c-spoke-hub__label">Consulting</span>
                  <span className="c-spoke-hub__label">Services</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="c-spoke-col c-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="c-spoke-row c-spoke-row--right">
                  <div className="c-spoke-connector c-spoke-connector--right">
                    <div className="c-spoke-badge c-spoke-badge--red">{item.id}</div>
                    <div className="c-spoke-line" />
                  </div>
                  <div className="c-spoke-text c-spoke-text--right">
                    <h3 className="c-spoke-title">{item.title}</h3>
                    <p className="c-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end c-spoke-diagram */}

          {/* Mobile fallback grid */}
          <div className="c-spoke-mobile-grid">
            {[...leftItems, ...rightItems]
              .sort((a, b) => parseInt(a.id) - parseInt(b.id))
              .map((item) => (
                <div key={item.id} className="c-spoke-mobile-card">
                  <div className={`c-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'c-spoke-badge--navy' : 'c-spoke-badge--red'}`}>
                    {item.id}
                  </div>
                  <div>
                    <h3 className="c-spoke-title">{item.title}</h3>
                    <p className="c-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="c-certification">
            <Shield className="c-certification__icon" size={28} />
            <p className="c-certification__text">JHS & Associates LLP · Trusted Advisory Partner across 7+ Cities in India</p>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      {/* <section className="c-cta">
        <div className="c-container">
          <div className="c-cta__box">
            <h2>Looking for tailored solutions?</h2>
            <p>Our consulting partners are ready to discuss your unique business challenges.</p>
            <button className="c-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section> */}

    </div>
  )
}
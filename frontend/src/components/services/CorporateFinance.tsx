import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './CorporateFinance.css'
import heroImg from '../../image/corporate-advisory.avif'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–04)
const leftItems = [
  { id: "01", title: "Project Finance, ECB, Debt", desc: "Structured finance & debt advisory" },
  { id: "02", title: "Capital Markets, IPO & PE Advisory", desc: "Equity capital & private equity support" },
  { id: "03", title: "Business Plans & Projections", desc: "Financial modelling & forecasting" },
  { id: "04", title: "Mergers & Acquisition", desc: "M&A structuring & transaction support" },
]

// Right column items (05–07, 11)
const rightItems = [
  { id: "05", title: "Valuation, Due Diligence", desc: "Business valuation & risk assessment" },
  { id: "06", title: "Treasury, Controls", desc: "Cash management & treasury oversight" },
  { id: "07", title: "CFO Services", desc: "Virtual CFO & financial leadership" },
  { id: "11", title: "Govt. & Infra. Advisory", desc: "Public sector & infrastructure consulting" },
]

export default function CorporateFinance() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cf-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray('.cf-section-header').forEach((header: any) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.cf-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.cf-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray('.cf-spoke-row--left').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.cf-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray('.cf-spoke-row--right').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.cf-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="cf-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="cf-hero">
        <div className="cf-hero__bg" style={{ backgroundImage: `url('${heroImg}')` }} />
        <div className="cf-hero__overlay" />
        <div className="cf-container">
          <div className="cf-hero__content">
            <span className="cf-eyebrow">Strategic Finance</span>
            <h1 className="cf-title">Corporate Finance Solutions</h1>
            <p className="cf-subtitle">
              Smart capital strategies for growth and risk management.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="cf-coverage">
        <div className="cf-container">
          <div className="cf-section-header">
            <h2>Corporate Finance Capabilities</h2>
            <div className="cf-divider" />
            <p>Strategic financial advisory and execution support across capital markets, transactions, and corporate treasury.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="cf-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="cf-spoke-col cf-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="cf-spoke-row cf-spoke-row--left">
                  <div className="cf-spoke-text cf-spoke-text--left">
                    <h3 className="cf-spoke-title">{item.title}</h3>
                    <p className="cf-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="cf-spoke-connector cf-spoke-connector--left">
                    <div className="cf-spoke-line" />
                    <div className="cf-spoke-badge cf-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="cf-spoke-center">
              <div className="cf-spoke-hub">
                <div className="cf-spoke-hub__ring" />
                <div className="cf-spoke-hub__inner">
                  <span className="cf-spoke-hub__label">Corporate</span>
                  <span className="cf-spoke-hub__label">Finance</span>
                  <span className="cf-spoke-hub__label cf-spoke-hub__label--accent">Solutions</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="cf-spoke-col cf-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="cf-spoke-row cf-spoke-row--right">
                  <div className="cf-spoke-connector cf-spoke-connector--right">
                    <div className="cf-spoke-badge cf-spoke-badge--red">{item.id}</div>
                    <div className="cf-spoke-line" />
                  </div>
                  <div className="cf-spoke-text cf-spoke-text--right">
                    <h3 className="cf-spoke-title">{item.title}</h3>
                    <p className="cf-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Mobile fallback grid */}
          <div className="cf-spoke-mobile-grid">
            {[...leftItems, ...rightItems].map((item) => (
              <div key={item.id} className="cf-spoke-mobile-card">
                <div className={`cf-spoke-mobile-badge ${parseInt(item.id) <= 4 ? 'cf-spoke-badge--navy' : 'cf-spoke-badge--red'}`}>
                  {item.id}
                </div>
                <div>
                  <h3 className="cf-spoke-title">{item.title}</h3>
                  <p className="cf-spoke-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cf-certification">
            <Shield className="cf-certification__icon" size={28} />
            <p className="cf-certification__text">JHS & Associates LLP · Trusted Corporate Finance Partner for M&A, Valuations & Capital Advisory</p>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      <section className="cf-cta">
        <div className="cf-container">
          <div className="cf-cta__box">
            <h2>Need strategic financial advisory?</h2>
            <p>Speak with our corporate finance specialists for M&A, valuation, and capital market support.</p>
            <button className="cf-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section>

    </div>
  )
}

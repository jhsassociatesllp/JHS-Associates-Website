import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './Outsourcing.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–06)
const leftItems = [
  { id: "01", title: "Accounting system selection, design & implementation", desc: "ERP setup & accounting infrastructure" },
  { id: "02", title: "Budgeting & Monitoring Financial Reporting", desc: "Financial planning & MIS reporting" },
  { id: "03", title: "MIS, global & domestic bookkeeping, and full compliance management", desc: "End-to-end bookkeeping & compliance" },
  { id: "04", title: "Corporate Training", desc: "Upskilling & capability development" },
  { id: "05", title: "Tax Return Preparation (Federal, State, GST/VAT, Payroll, FBAR)", desc: "Multi-jurisdiction tax return filing" },
  { id: "06", title: "Fixed Asset Management (Verification to Reconciliation)", desc: "Asset lifecycle tracking & audit" },
]

// Right column items (07–12)
const rightItems = [
  { id: "07", title: "Inventory Verification & Payroll Processing", desc: "Stock audit & salary management" },
  { id: "08", title: "Virtual CXO Services (CEO, CFO, CTO, CPO)", desc: "On-demand executive leadership" },
  { id: "09", title: "Accounting, Reporting & AP/AR Reconciliation", desc: "Receivables & payables management" },
  { id: "10", title: "Cloud Office Setup, Automation & Support", desc: "Digital workspace & process automation" },
  { id: "11", title: "Remote Secretarial Services", desc: "Virtual company secretary support" },
  { id: "12", title: "Risk Assessment & Register Maintenance", desc: "Risk mapping & control registers" },
]

export default function Outsourcing() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.o-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray('.o-section-header').forEach((header: any) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.o-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.o-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray('.o-spoke-row--left').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.o-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray('.o-spoke-row--right').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.o-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="o-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="o-hero">
        <div className="o-hero__bg" style={{ backgroundImage: `url('${imageUrl('images/Outsourcing.png')}')` }} />
        <div className="o-hero__overlay" />
        <div className="o-container">
          <div className="o-hero__content">
            <span className="o-eyebrow">Operational Excellence</span>
            <h1 className="o-title">Outsourcing Solutions</h1>
            <p className="o-subtitle">
              Reliable back-office support
              So you can focus on
              core growth.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="o-coverage">
        <div className="o-container">
          <div className="o-section-header">
            <h2>Our Outsourcing Capabilities</h2>
            <div className="o-divider" />
            <p>End to end outsourcing solutions across 12 core verticals that reduce costs improve efficiency and drive growth.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="o-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="o-spoke-col o-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="o-spoke-row o-spoke-row--left">
                  <div className="o-spoke-text o-spoke-text--left">
                    <h3 className="o-spoke-title">{item.title}</h3>
                    <p className="o-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="o-spoke-connector o-spoke-connector--left">
                    <div className="o-spoke-line" />
                    <div className="o-spoke-badge o-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="o-spoke-center">
              <div className="o-spoke-hub">
                <div className="o-spoke-hub__ring" />
                <div className="o-spoke-hub__inner">
                  <span className="o-spoke-hub__label">Outsourcing</span>
                  <span className="o-spoke-hub__label">Solutions</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="o-spoke-col o-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="o-spoke-row o-spoke-row--right">
                  <div className="o-spoke-connector o-spoke-connector--right">
                    <div className="o-spoke-badge o-spoke-badge--red">{item.id}</div>
                    <div className="o-spoke-line" />
                  </div>
                  <div className="o-spoke-text o-spoke-text--right">
                    <h3 className="o-spoke-title">{item.title}</h3>
                    <p className="o-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end o-spoke-diagram */}

          {/* Mobile fallback grid */}
          <div className="o-spoke-mobile-grid">
            {[...leftItems, ...rightItems]
              .sort((a, b) => parseInt(a.id) - parseInt(b.id))
              .map((item) => (
                <div key={item.id} className="o-spoke-mobile-card">
                  <div className={`o-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'o-spoke-badge--navy' : 'o-spoke-badge--red'}`}>
                    {item.id}
                  </div>
                  <div>
                    <h3 className="o-spoke-title">{item.title}</h3>
                    <p className="o-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="o-certification">
            <Shield className="o-certification__icon" size={28} />
            <p className="o-certification__text">JHS & Associates LLP · Scalable Outsourcing Partner across Finance, Tax, Compliance & Operations</p>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      <section className="o-cta">
        <div className="o-container">
          <div className="o-cta__box">
            <h2>Ready to outsource with confidence?</h2>
            <p>Let us discuss how JHS Outsourcing can help you reduce costs and improve efficiency.</p>
            <button className="o-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section>

    </div>
  )
}
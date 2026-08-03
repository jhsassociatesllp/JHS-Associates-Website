import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './Assurance.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–06)
const leftItems = [
  { id: "01", title: "Statutory Audit under the Companies Act, LLP Act & other applicable statutes", desc: "Independent financial statement audits" },
  { id: "02", title: "Tax Audit under Section 44AB of the Income Tax Act", desc: "Compliance-driven tax audit reporting" },
  { id: "03", title: "Internal Audit & Internal Financial Controls (IFC) Reviews", desc: "Process assurance & control effectiveness" },
  { id: "04", title: "Concurrent Audit for Banks & NBFCs", desc: "Real-time transaction monitoring & compliance" },
  { id: "05", title: "Stock & Inventory Audit", desc: "Physical verification & valuation checks" },
  { id: "06", title: "Limited Review of Quarterly Financial Results for Listed Entities", desc: "SEBI-mandated quarterly reviews" },
]

// Right column items (07–12)
const rightItems = [
  { id: "07", title: "Bank Audit — Statutory, Concurrent & Revenue Audit", desc: "RBI-aligned banking sector assurance" },
  { id: "08", title: "Special Purpose Audits, Due Diligence & Forensic Reviews", desc: "Transaction & investigative assurance" },
  { id: "09", title: "Ind AS / IFRS Implementation & Financial Statement Assurance", desc: "Accounting standards advisory & assurance" },
  { id: "10", title: "Certification Services — Net Worth, Turnover, FDI/FEMA & ROC", desc: "Statutory & regulatory certifications" },
  { id: "11", title: "Trust, Society & NGO Audits (12A / 80G Compliance)", desc: "Not-for-profit compliance & reporting" },
  { id: "12", title: "Group Reporting, Consolidation & Multi-location Audit Coordination", desc: "Pan-India audit coordination for large groups" },
]

export default function Assurance() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.aa-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray('.aa-section-header').forEach((header: any) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.aa-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.aa-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray('.aa-spoke-row--left').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.aa-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray('.aa-spoke-row--right').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.aa-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="aa-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="aa-hero">
        <div className="aa-hero__bg" style={{ backgroundImage: `url('${imageUrl('Auditposter.jpg')}')` }} />
        <div className="aa-hero__overlay" />
        <div className="aa-container">
          <div className="aa-hero__content">
            {/* <span className="aa-eyebrow">Audit &amp; Assurance</span> */}
            <h1 className="aa-title">Assurance Services</h1>
            <p className="aa-subtitle">
              Independent, rigorous audit and assurance services that strengthen financial credibility and stakeholder confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="aa-coverage">
        <div className="aa-container">
          <div className="aa-section-header">
            <h2>Our Assurance Capabilities</h2>
            <div className="aa-divider" />
            <p>Comprehensive audit and assurance services covering statutory, internal, regulatory and special purpose engagements across corporates, banks, NBFCs and trusts.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="aa-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="aa-spoke-col aa-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="aa-spoke-row aa-spoke-row--left">
                  <div className="aa-spoke-text aa-spoke-text--left">
                    <h3 className="aa-spoke-title">{item.title}</h3>
                    <p className="aa-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="aa-spoke-connector aa-spoke-connector--left">
                    <div className="aa-spoke-line" />
                    <div className="aa-spoke-badge aa-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="aa-spoke-center">
              <div className="aa-spoke-hub">
                <div className="aa-spoke-hub__ring" />
                <div className="aa-spoke-hub__inner">
                  <span className="aa-spoke-hub__label">Assurance</span>
                  <span className="aa-spoke-hub__label">Services</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="aa-spoke-col aa-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="aa-spoke-row aa-spoke-row--right">
                  <div className="aa-spoke-connector aa-spoke-connector--right">
                    <div className="aa-spoke-badge aa-spoke-badge--red">{item.id}</div>
                    <div className="aa-spoke-line" />
                  </div>
                  <div className="aa-spoke-text aa-spoke-text--right">
                    <h3 className="aa-spoke-title">{item.title}</h3>
                    <p className="aa-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end aa-spoke-diagram */}

          {/* Mobile fallback grid */}
          <div className="aa-spoke-mobile-grid">
            {[...leftItems, ...rightItems]
              .sort((a, b) => parseInt(a.id) - parseInt(b.id))
              .map((item) => (
                <div key={item.id} className="aa-spoke-mobile-card">
                  <div className={`aa-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'aa-spoke-badge--navy' : 'aa-spoke-badge--red'}`}>
                    {item.id}
                  </div>
                  <div>
                    <h3 className="aa-spoke-title">{item.title}</h3>
                    <p className="aa-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="aa-certification">
            <Shield className="aa-certification__icon" size={28} />
            <p className="aa-certification__text">JHS &amp; Associates LLP · Statutory Auditor for 1,000+ Clients across Corporates, Banks, NBFCs &amp; Trusts</p>
          </div>
        </div>
      </section>

    </div>
  )
}

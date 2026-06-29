import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './Taxation.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–06)
const leftItems = [
  { id: "01", title: "Representation before tax authorities for assessments, refunds & rectifications", desc: "Direct representation & dispute resolution" },
  { id: "02", title: "Tax structuring, budgeting, forecasting & M&A advisory", desc: "Strategic tax planning & deal structuring" },
  { id: "03", title: "Corporate & Non-Corporate Return Filing (Direct Tax)", desc: "Income tax return preparation & filing" },
  { id: "04", title: "Tax Planning, TDS & Advance Tax Compliance", desc: "Withholding tax & advance tax management" },
  { id: "05", title: "GST Return Filing, Retainership & Indirect Tax Advisory", desc: "End-to-end GST compliance & advisory" },
  { id: "06", title: "Tax Advisory, GST Health Check & Dispute Resolution", desc: "Tax review & litigation support" },
]

// Right column items (07–12)
const rightItems = [
  { id: "07", title: "Survey, Search & Seizure Support", desc: "Emergency response & regulatory support" },
  { id: "08", title: "Scrutiny & Faceless Representation", desc: "Assessment proceedings & e-proceedings" },
  { id: "09", title: "Assessments, Appeals & Litigation", desc: "CIT(A), ITAT & High Court representation" },
  { id: "10", title: "Transfer Pricing (Domestic & International), Reviews & Certifications", desc: "TP documentation & OECD BEPS advisory" },
  { id: "11", title: "International Tax & Inbound/Outbound Structuring", desc: "DTAA, FEMA & cross-border compliance" },
  { id: "12", title: "Tax Audits, Digitalization, Registration (PAN, GSTIN, TAN, Charitable Trusts)", desc: "Tax audit & registration services" },
]

export default function Taxation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tx-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray('.tx-section-header').forEach((header: any) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.tx-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.tx-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray('.tx-spoke-row--left').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.tx-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray('.tx-spoke-row--right').forEach((row: any, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.tx-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="tx-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="tx-hero">
        <div className="tx-hero__bg" style={{ backgroundImage: `url('${imageUrl('Taxation2.png')}')` }} />
        <div className="tx-hero__overlay" />
        <div className="tx-container">
          <div className="tx-hero__content">
            <span className="tx-eyebrow">Tax & Compliance</span>
            <h1 className="tx-title">Taxation Solutions</h1>
            <p className="tx-subtitle">
              Expert tax planning and compliance for smarter financial outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="tx-coverage">
        <div className="tx-container">
          <div className="tx-section-header">
            <h2>Our Taxation Capabilities</h2>
            <div className="tx-divider" />
            <p>Comprehensive tax services covering every obligation and opportunity from compliance and return filing to strategic structuring and litigation support.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="tx-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="tx-spoke-col tx-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="tx-spoke-row tx-spoke-row--left">
                  <div className="tx-spoke-text tx-spoke-text--left">
                    <h3 className="tx-spoke-title">{item.title}</h3>
                    <p className="tx-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="tx-spoke-connector tx-spoke-connector--left">
                    <div className="tx-spoke-line" />
                    <div className="tx-spoke-badge tx-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="tx-spoke-center">
              <div className="tx-spoke-hub">
                <div className="tx-spoke-hub__ring" />
                <div className="tx-spoke-hub__inner">
                  <span className="tx-spoke-hub__label">Taxation</span>
                  <span className="tx-spoke-hub__label">Solutions</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="tx-spoke-col tx-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="tx-spoke-row tx-spoke-row--right">
                  <div className="tx-spoke-connector tx-spoke-connector--right">
                    <div className="tx-spoke-badge tx-spoke-badge--red">{item.id}</div>
                    <div className="tx-spoke-line" />
                  </div>
                  <div className="tx-spoke-text tx-spoke-text--right">
                    <h3 className="tx-spoke-title">{item.title}</h3>
                    <p className="tx-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end tx-spoke-diagram */}

          {/* Mobile fallback grid */}
          <div className="tx-spoke-mobile-grid">
            {[...leftItems, ...rightItems]
              .sort((a, b) => parseInt(a.id) - parseInt(b.id))
              .map((item) => (
                <div key={item.id} className="tx-spoke-mobile-card">
                  <div className={`tx-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'tx-spoke-badge--navy' : 'tx-spoke-badge--red'}`}>
                    {item.id}
                  </div>
                  <div>
                    <h3 className="tx-spoke-title">{item.title}</h3>
                    <p className="tx-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="tx-certification">
            <Shield className="tx-certification__icon" size={28} />
            <p className="tx-certification__text">JHS & Associates LLP · Full-Spectrum Tax Advisory — Direct, Indirect & International under One Team</p>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      {/* <section className="tx-cta">
        <div className="tx-container">
          <div className="tx-cta__box">
            <h2>Ready to optimise your tax position?</h2>
            <p>Speak with a JHS tax specialist and get a tailored advisory proposal for your organisation.</p>
            <button className="tx-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section> */}

    </div>
  )
}
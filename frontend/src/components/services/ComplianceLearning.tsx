import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield } from 'lucide-react'
import './ComplianceLearning.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

const leftItems = [
  { id: "01", title: "Compliance & Governance Solutions", desc: "Regulatory framework design & oversight" },
  { id: "02", title: "Compliance Awareness Sessions & Corporate Learning Programs", desc: "Training & capability development" },
  { id: "03", title: "Enterprise Risk Identification & Assessment Across Business Functions", desc: "Organisation-wide risk mapping" },
  { id: "04", title: "Risk Mitigation Strategy Development, Implementation & Continuous Monitoring", desc: "Proactive risk management" },
  { id: "05", title: "Internal Reviews to Ensure Compliance & Evaluate Internal Controls", desc: "Control effectiveness reviews" },
  { id: "06", title: "Company Incorporation & Drafting of Memorandum and Articles of Association", desc: "Entity formation & constitutional docs" },
]

const rightItems = [
  { id: "07", title: "Board Meeting & AGM Compliance", desc: "Corporate meeting governance" },
  { id: "08", title: "Filing Annual Returns & Statutory Documents with Regulatory Authorities", desc: "Statutory filing & submissions" },
  { id: "09", title: "Maintenance of Statutory Registers, Board Resolutions, Shareholding Patterns & KMP Records", desc: "Corporate record management" },
  { id: "10", title: "Regulatory Liaison & Representation Support", desc: "Authority engagement & advocacy" },
  { id: "11", title: "Governance Framework Development & Control Environment Assessment", desc: "Governance architecture design" },
  { id: "12", title: "External Audit Support, Review Assistance & Control", desc: "Audit facilitation & coordination" },
]

export default function ComplianceLearning() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo('.cl-hero__content > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
      gsap.utils.toArray<Element>('.cl-section-header').forEach((h) => {
        gsap.fromTo(h, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: h, start: 'top 85%' } })
      })
      gsap.fromTo('.cl-spoke-hub', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.cl-spoke-diagram', start: 'top 75%' } })
      gsap.utils.toArray<Element>('.cl-spoke-row--left').forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.cl-spoke-diagram', start: 'top 75%' } })
      })
      gsap.utils.toArray<Element>('.cl-spoke-row--right').forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.cl-spoke-diagram', start: 'top 75%' } })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="cl-page" ref={containerRef}>
      <section className="cl-hero">
        <div className="cl-hero__bg" style={{ backgroundImage: `url('${imageUrl('Risk.webp')}')` }} />
        <div className="cl-hero__overlay" />
        <div className="cl-container">
          <div className="cl-hero__content">
            {/* <span className="cl-eyebrow">Risk & Governance</span> */}
            <h1 className="cl-title">Compliance, Learning & Innovation</h1>
            <p className="cl-subtitle">
              Strengthening governance and managing risk for sustainable growth.
            </p>
          </div>
        </div>
      </section>

      <section className="cl-coverage">
        <div className="cl-container">
          <div className="cl-section-header">
            <h2>Compliance & Governance Capabilities</h2>
            <div className="cl-divider" />
            <p>Comprehensive compliance, learning, and governance services across 12 verticals covering risk, regulation, and corporate administration.</p>
          </div>

          <div className="cl-spoke-diagram">
            <div className="cl-spoke-col cl-spoke-col--left">
              {leftItems.map((item) => (
                <div key={item.id} className="cl-spoke-row cl-spoke-row--left">
                  <div className="cl-spoke-text cl-spoke-text--left">
                    <h3 className="cl-spoke-title">{item.title}</h3>
                    <p className="cl-spoke-desc">{item.desc}</p>
                  </div>
                  <div className="cl-spoke-connector cl-spoke-connector--left">
                    <div className="cl-spoke-line" />
                    <div className="cl-spoke-badge cl-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cl-spoke-center">
              <div className="cl-spoke-hub">
                <div className="cl-spoke-hub__ring" />
                <div className="cl-spoke-hub__inner">
                  <span className="cl-spoke-hub__label">Compliance,</span>
                  <span className="cl-spoke-hub__label">Learning &</span>
                  <span className="cl-spoke-hub__label cl-spoke-hub__label--accent">Innovation</span>
                </div>
              </div>
            </div>

            <div className="cl-spoke-col cl-spoke-col--right">
              {rightItems.map((item) => (
                <div key={item.id} className="cl-spoke-row cl-spoke-row--right">
                  <div className="cl-spoke-connector cl-spoke-connector--right">
                    <div className="cl-spoke-badge cl-spoke-badge--red">{item.id}</div>
                    <div className="cl-spoke-line" />
                  </div>
                  <div className="cl-spoke-text cl-spoke-text--right">
                    <h3 className="cl-spoke-title">{item.title}</h3>
                    <p className="cl-spoke-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cl-spoke-mobile-grid">
            {[...leftItems, ...rightItems].sort((a, b) => parseInt(a.id) - parseInt(b.id)).map((item) => (
              <div key={item.id} className="cl-spoke-mobile-card">
                <div className={`cl-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'cl-spoke-badge--navy' : 'cl-spoke-badge--red'}`}>{item.id}</div>
                <div>
                  <h3 className="cl-spoke-title">{item.title}</h3>
                  <p className="cl-spoke-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cl-certification">
            <Shield className="cl-certification__icon" size={28} />
            <p className="cl-certification__text">JHS & Associates LLP · Compliance, Governance & Corporate Learning across all Regulatory Frameworks</p>
          </div>
        </div>
      </section>

      <section className="cl-cta">
        <div className="cl-container">
          <div className="cl-cta__box">
            <h2>Need compliance and governance support?</h2>
            <p>Speak with our compliance specialists to design the right governance framework for your organisation.</p>
            {/* <button className="cl-btn">Schedule a Consultation</button> */}
          </div>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield, Users } from 'lucide-react'
import './LearningDevelopment.css'
import ServicePartnersModal from './ServicePartnersModal'
import { getPartnersForSubPoint } from './servicePartnersData'
import { imageUrl } from '../../utils/imageUrl'
import { useServicePoints } from '../../data/leadership'

gsap.registerPlugin(ScrollTrigger)

// Left column items (01–06)
const FALLBACK_LEFT_ITEMS = [
  { id: "01", title: "GST Law, Compliance & Return Filing Workshops", desc: "Practical GST training for finance teams" },
  { id: "02", title: "Income Tax Provisions, TDS & Advance Tax Training", desc: "Direct tax fundamentals & compliance" },
  { id: "03", title: "Accounting Standards (Ind AS) & Financial Reporting Workshops", desc: "Standards-based reporting capability" },
  { id: "04", title: "Corporate Compliance & Companies Act Training Programs", desc: "Statutory & secretarial compliance training" },
  { id: "05", title: "Internal Audit & Internal Financial Controls Certification Programs", desc: "IFC design & testing capability building" },
  { id: "06", title: "Risk Management & Governance Awareness Sessions", desc: "Enterprise risk & governance literacy" },
]

// Right column items (07–12)
const FALLBACK_RIGHT_ITEMS = [
  { id: "07", title: "Statutory Audit Methodology & Documentation Training", desc: "Audit quality & documentation standards" },
  { id: "08", title: "Soft Skills, Communication & Client Handling Workshops", desc: "Professional & client-facing capability" },
  { id: "09", title: "ERP & Digital Tools Training (Tally, SAP, NetSuite)", desc: "Hands-on systems & automation training" },
  { id: "10", title: "Leadership Development & Team Management Programs", desc: "Building future-ready managers" },
  { id: "11", title: "Sector-Specific Regulatory Training (BFSI, NBFC, Insurance)", desc: "Industry-focused regulatory deep-dives" },
  { id: "12", title: "Customized In-House Training Programs for Corporate Teams", desc: "Tailored curriculum for client teams" },
]


export default function LearningDevelopment() {
  // Sub-services come from the admin panel (Services & Sectors); the lists above are the fallback.
  const { leftItems, rightItems } = useServicePoints('learning-development', FALLBACK_LEFT_ITEMS, FALLBACK_RIGHT_ITEMS)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePoint, setActivePoint] = useState<{ id: string; title: string; desc: string } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ld-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray<Element>('.ld-section-header').forEach((header) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.fromTo('.ld-spoke-hub',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.ld-spoke-diagram', start: 'top 75%' } }
      )

      gsap.utils.toArray<Element>('.ld-spoke-row--left').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.ld-spoke-diagram', start: 'top 75%' } }
        )
      })

      gsap.utils.toArray<Element>('.ld-spoke-row--right').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, scrollTrigger: { trigger: '.ld-spoke-diagram', start: 'top 75%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="ld-page" ref={containerRef}>

      {/* ════ HERO SECTION ════ */}
      <section className="ld-hero">
        <div className="ld-hero__bg" style={{ backgroundImage: `url('${imageUrl('Learning-Development.webp')}')` }} />
        <div className="ld-hero__overlay" />
        <div className="ld-container">
          <div className="ld-hero__content">
            {/* <span className="ld-eyebrow">Training &amp; Capability Building</span> */}
            <h1 className="ld-title">Learning &amp; Development</h1>
            <p className="ld-subtitle">
              Training programs on GST, Income Tax, Accounting Standards, and Corporate Compliance to equip your teams with essential knowledge and skills.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SPOKE DIAGRAM SECTION ════ */}
      <section className="ld-coverage">
        <div className="ld-container">
          <div className="ld-section-header">
            <h2>Our Training Capabilities</h2>
            <div className="ld-divider" />
            <p>Structured, practitioner-led training programs covering tax, accounting, compliance, audit and leadership development for corporate teams.</p>
          </div>

          {/* ── SPOKE DIAGRAM ── */}
          <div className="ld-spoke-diagram">

            {/* LEFT COLUMN */}
            <div className="ld-spoke-col ld-spoke-col--left">
              {leftItems.map((item) => (
                <div
                    key={item.id}
                    className="ld-spoke-row ld-spoke-row--left"
                    onClick={() => setActivePoint(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActivePoint(item)}
                  >
                  <div className="ld-spoke-text ld-spoke-text--left">
                    <h3 className="ld-spoke-title">{item.title}</h3>
                    <p className="ld-spoke-desc">{item.desc}</p>
                  <span className="ld-spoke-cta"><Users size={12} /> View Experts</span>
                  </div>
                  <div className="ld-spoke-connector ld-spoke-connector--left">
                    <div className="ld-spoke-line" />
                    <div className="ld-spoke-badge ld-spoke-badge--navy">{item.id}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER HUB */}
            <div className="ld-spoke-center">
              <div className="ld-spoke-hub">
                <div className="ld-spoke-hub__ring" />
                <div className="ld-spoke-hub__inner">
                  <span className="ld-spoke-hub__label">Learning &amp;</span>
                  <span className="ld-spoke-hub__label">Development</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="ld-spoke-col ld-spoke-col--right">
              {rightItems.map((item) => (
                <div
                  key={item.id}
                  className="ld-spoke-row ld-spoke-row--right"
                  onClick={() => setActivePoint(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePoint(item)}
                >
                  <div className="ld-spoke-connector ld-spoke-connector--right">
                    <div className="ld-spoke-badge ld-spoke-badge--red">{item.id}</div>
                    <div className="ld-spoke-line" />
                  </div>
                  <div className="ld-spoke-text ld-spoke-text--right">
                    <h3 className="ld-spoke-title">{item.title}</h3>
                    <p className="ld-spoke-desc">{item.desc}</p>
                  <span className="ld-spoke-cta"><Users size={12} /> View Experts</span>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end ld-spoke-diagram */}

          {/* Mobile fallback grid */}
          <div className="ld-spoke-mobile-grid">
            {[...leftItems, ...rightItems]
              .sort((a, b) => parseInt(a.id) - parseInt(b.id))
              .map((item) => (
                <div
                  key={item.id}
                  className="ld-spoke-mobile-card"
                  onClick={() => setActivePoint(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePoint(item)}
                >
                  <div className={`ld-spoke-mobile-badge ${parseInt(item.id) <= 6 ? 'ld-spoke-badge--navy' : 'ld-spoke-badge--red'}`}>
                    {item.id}
                  </div>
                  <div>
                    <h3 className="ld-spoke-title">{item.title}</h3>
                    <p className="ld-spoke-desc">{item.desc}</p>
                  <span className="ld-spoke-cta"><Users size={12} /> View Experts</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="ld-certification">
            <Shield className="ld-certification__icon" size={28} />
            <p className="ld-certification__text">JHS · Structured Training Programs Delivered Across GST, Income Tax, Accounting Standards &amp; Corporate Compliance</p>
          </div>
        </div>
      </section>


    <ServicePartnersModal
      isOpen={Boolean(activePoint)}
      onClose={() => setActivePoint(null)}
      serviceKey="learning-development"
      serviceTitle="Learning & Development"
      point={activePoint}
      partners={activePoint ? getPartnersForSubPoint('learningDevelopment', activePoint.id) : []}
    />


    </div>
  )
}

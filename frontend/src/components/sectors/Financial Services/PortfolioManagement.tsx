import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, TrendingUp, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './PortfolioManagement.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'SEBI PMS Compliance',
    desc: 'End-to-end compliance for SEBI-registered Portfolio Managers — SEBI (Portfolio Managers) Regulations 2020, disclosure norms, minimum investment requirements, and periodic reporting.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Audit & Assurance',
    desc: 'Statutory audit, internal audit, and SEBI-mandated annual audit for PMS entities — fund-level reconciliation, client account verification, and compliance certification.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Pass-through Advisory',
    desc: 'Tax advisory on discretionary and non-discretionary PMS structures, capital gains pass-through, TDS obligations, and tax reporting for clients and portfolio managers.',
  },
  {
    icon: <TrendingUp size={20} strokeWidth={1.5} />,
    title: 'Performance Reporting',
    desc: 'XIRR-based performance calculation advisory, benchmark comparison frameworks, and SEBI-compliant performance disclosure standards for PMS entities.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Offshore & Cross-border PMS',
    desc: 'FEMA advisory for NRI portfolios, overseas investment compliance, and cross-border PMS structuring for foreign investors accessing Indian markets.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Registration & Licensing',
    desc: 'SEBI PMS registration support, net worth compliance, principal officer qualification advisory, and ongoing regulatory change management.',
  },
]

const STATS = [
  { num: '20+', label: 'PMS Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'SEBI', label: 'Regulatory Expertise' },
]

const WHY = [
  'Specialist knowledge of SEBI Portfolio Managers Regulations 2020',
  'Deep expertise in PMS tax structures, pass-through taxation, and XIRR reporting',
  'Trusted by discretionary and non-discretionary portfolio managers across India',
  'NRI and cross-border portfolio compliance capability under FEMA',
  'Integrated audit, tax, and regulatory compliance under one engagement team',
]

export default function PortfolioManagement() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.pm-hero__eyebrow', '.pm-hero__title', '.pm-hero__sub', '.pm-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.pm-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.pm-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="pm-page">

      {/* ── HERO ── */}
      <section className="pm-hero" ref={heroRef}>
        <div className="pm-hero__inner">
          {/* <p className="pm-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="pm-hero__title">Portfolio<br /><em>Management</em></h1>
          <p className="pm-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for
            SEBI-registered Portfolio Managers — built on deep expertise in
            PMS regulations, performance reporting, and pass-through taxation.
          </p>
          {/* <div className="pm-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="pm-hero__stat">
                <span className="pm-hero__stat-num">{s.num}</span>
                <span className="pm-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="pm-overview container">
        <div className="pm-overview__inner">
          <div className="pm-overview__text">
            <span className="pm-tag">Our Approach</span>
            <h2 className="pm-overview__title">Precision Advisory for Portfolio Managers</h2>
            <p className="pm-overview__body">
              SEBI's Portfolio Managers Regulations 2020 significantly elevated the
              compliance bar for PMS entities — minimum corpus requirements, enhanced
              disclosure norms, and stringent audit obligations demand specialist
              advisory. Combined with complex pass-through tax structures and NRI
              portfolio compliance, JHS brings the depth of expertise that PMS entities
              need to operate with confidence and precision.
            </p>
            <a href="/contact" className="pm-btn pm-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="pm-overview__visual">
            <div className="pm-overview__badge">
              <span className="pm-overview__badge-icon">📉</span>
              <span className="pm-overview__badge-label">Full-spectrum PMS advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="pm-highlights container" ref={hlRef}>
        <div className="pm-section-hd">
          <h2 className="pm-section-hd__title">What We Offer</h2>
          <p className="pm-section-hd__sub">
            Comprehensive services covering every compliance, audit, and tax need of PMS entities.
          </p>
        </div>
        <div className="pm-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="pm-card">
              <div className="pm-card__accent" />
              <div className="pm-card__icon">{h.icon}</div>
              <h3 className="pm-card__title">{h.title}</h3>
              <p className="pm-card__desc">{h.desc}</p>
              <button className="pm-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="pm-why container" ref={whyRef}>
        <div className="pm-why__inner">
          <div className="pm-why__left">
            <span className="pm-tag">Why JHS</span>
            <h2 className="pm-why__title">The JHS Advantage in Portfolio Management</h2>
            <p className="pm-why__sub">
              We combine SEBI regulatory expertise with practical PMS audit
              and tax experience to deliver advisory that meets the highest standards.
            </p>
            <a href="/contact" className="pm-btn pm-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="pm-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="pm-why__item">
                <span className="pm-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pm-cta container">
        <div className="pm-cta__inner">
          <div className="pm-cta__content">
            <p className="pm-cta__eyebrow">Get Started</p>
            <h2 className="pm-cta__title">Ready to elevate your PMS compliance?</h2>
            <p className="pm-cta__sub">
              Speak with a JHS portfolio management specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="pm-btn pm-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
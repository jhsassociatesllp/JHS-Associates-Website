import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ShieldCheck, FileText, BarChart2, Scale, Globe2, Umbrella } from 'lucide-react'
import './Insurance.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'IRDAI Regulatory Compliance',
    desc: 'End-to-end compliance support for insurance companies — IRDAI circulars, solvency margin requirements, investment norms, and periodic regulatory filings.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Statutory & Concurrent Audit',
    desc: 'Statutory audit, concurrent audit, and revenue audit for life insurers, general insurers, and health insurance companies under IRDAI guidelines.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Ind AS & Financial Reporting',
    desc: 'Financial statement preparation, IFRS 17 readiness, Ind AS 104 advisory, and financial reporting for insurance entities and holding companies.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Tax & GST Advisory',
    desc: 'Income tax planning, GST on insurance premiums and commissions, reinsurance tax structures, and deferred tax advisory for insurance businesses.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Reinsurance & Cross-border',
    desc: 'Transfer pricing for reinsurance arrangements, FEMA compliance for foreign reinsurers, and cross-border reinsurance treaty advisory.',
  },
  {
    icon: <Umbrella size={20} strokeWidth={1.5} />,
    title: 'Risk & Internal Audit',
    desc: 'Risk-based internal audit, claims fraud risk reviews, underwriting controls assessment, and internal financial controls for insurers.',
  },
]

const STATS = [
  { num: '20+', label: 'Insurance Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'IRDAI', label: 'Regulatory Expertise' },
]

const WHY = [
  'Specialist knowledge of IRDAI regulations for life, general, and health insurers',
  'Deep expertise in insurance-specific accounting under Ind AS 104 and IFRS 17',
  'Experienced across public sector, private, and foreign insurance companies',
  'Concurrent audit capability across large branch and distribution networks',
  'Trusted advisor for IRDAI inspection preparedness and regulatory advisory',
]

export default function Insurance() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.ins-hero__eyebrow', '.ins-hero__title', '.ins-hero__sub', '.ins-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.ins-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.ins-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="ins-page">

      {/* ── HERO ── */}
      <section className="ins-hero" ref={heroRef}>
        <div className="ins-hero__inner">
          {/* <p className="ins-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="ins-hero__title">Insurance<br /><em>Services</em></h1>
          <p className="ins-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for
            insurance companies, reinsurers, and intermediaries — built on
            deep knowledge of IRDAI regulations and insurance-specific accounting.
          </p>
          {/* <div className="ins-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="ins-hero__stat">
                <span className="ins-hero__stat-num">{s.num}</span>
                <span className="ins-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="ins-overview container">
        <div className="ins-overview__inner">
          <div className="ins-overview__text">
            <span className="ins-tag">Our Approach</span>
            <h2 className="ins-overview__title">Trusted Advisory for India's Insurance Sector</h2>
            <p className="ins-overview__body">
              Insurance companies operate under IRDAI's demanding regulatory framework —
              solvency margins, investment norms, claims reserving, and evolving
              accounting standards like IFRS 17 create a compliance landscape that
              demands specialist expertise. JHS brings two decades of insurance sector
              experience, delivering audit, tax, and regulatory advisory that helps
              insurers operate with confidence and precision.
            </p>
            <a href="/contact" className="ins-btn ins-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="ins-overview__visual">
            <div className="ins-overview__badge">
              <span className="ins-overview__badge-icon">🛡️</span>
              <span className="ins-overview__badge-label">End-to-end insurance advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="ins-highlights container" ref={hlRef}>
        <div className="ins-section-hd">
          <h2 className="ins-section-hd__title">What We Offer</h2>
          <p className="ins-section-hd__sub">
            Comprehensive services covering every audit, tax, and compliance need of insurance businesses.
          </p>
        </div>
        <div className="ins-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="ins-card">
              <div className="ins-card__accent" />
              <div className="ins-card__icon">{h.icon}</div>
              <h3 className="ins-card__title">{h.title}</h3>
              <p className="ins-card__desc">{h.desc}</p>
              <button className="ins-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="ins-why container" ref={whyRef}>
        <div className="ins-why__inner">
          <div className="ins-why__left">
            <span className="ins-tag">Why JHS</span>
            <h2 className="ins-why__title">The JHS Advantage in Insurance</h2>
            <p className="ins-why__sub">
              We combine deep regulatory knowledge with hands-on insurance
              audit experience to deliver advisory that meets IRDAI's
              exacting standards.
            </p>
            <a href="/contact" className="ins-btn ins-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="ins-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="ins-why__item">
                <span className="ins-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ins-cta container">
        <div className="ins-cta__inner">
          <div className="ins-cta__content">
            <p className="ins-cta__eyebrow">Get Started</p>
            <h2 className="ins-cta__title">Ready to strengthen your insurance compliance?</h2>
            <p className="ins-cta__sub">
              Speak with a JHS insurance specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="ins-btn ins-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
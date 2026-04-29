import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Code2, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './ITTeS.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Code2 size={20} strokeWidth={1.5} />,
    title: 'Transfer Pricing & BEPS',
    desc: 'Transfer pricing documentation, benchmarking studies, and OECD BEPS compliance for IT/ITeS companies with cross-border intercompany transactions and captive service centres.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'SEZ & Export Incentives',
    desc: 'SEZ compliance, STPI advisory, export-oriented unit structuring, and Section 10AA deduction planning for IT exporters and software development companies.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST advisory on software services, SaaS subscriptions, cloud services, and export of services — including place of supply rules and LUT/RFD-11 compliance.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Statutory & Internal Audit',
    desc: 'Statutory audit, internal audit, and revenue assurance for IT services companies, BPO/KPO entities, and technology-enabled service providers.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'ESOP & Equity Structuring',
    desc: 'ESOP plan design, taxation advisory for employees and the company, cross-border ESOP compliance, and equity structuring for PE/VC-backed IT companies.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'M&A & Due Diligence',
    desc: 'Tax and financial due diligence, deal structuring, and post-acquisition integration advisory for IT/ITeS mergers, acquisitions, and PE investments.',
  },
]

const STATS = [
  { num: '40+', label: 'IT/ITeS Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'SEZ & STPI', label: 'Export Experts' },
]

const WHY = [
  'Deep transfer pricing expertise for IT captives and cross-border service companies',
  'Specialist SEZ, STPI, and Section 10AA export incentive advisory',
  'GST advisory for complex SaaS, cloud, and software service transactions',
  'ESOP taxation and cross-border equity structuring for funded IT companies',
  'Trusted by listed IT companies, MNC subsidiaries, and high-growth startups',
]

export default function ITTeS() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.ites-hero__eyebrow', '.ites-hero__title', '.ites-hero__sub', '.ites-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.ites-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.ites-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="ites-page">

      {/* ── HERO ── */}
      <section className="ites-hero" ref={heroRef}>
        <div className="ites-hero__inner">
          {/* <p className="ites-hero__eyebrow">Sectors &nbsp;·&nbsp; Media &amp; Technology</p> */}
          <h1 className="ites-hero__title">IT / ITeS<br /><em>Services</em></h1>
          <p className="ites-hero__sub">
            Specialised tax, audit, and compliance advisory for IT services,
            software companies, BPO/KPO entities, and technology-enabled
            service providers — built on deep expertise in transfer pricing,
            SEZ incentives, and IT sector regulations.
          </p>
          {/* <div className="ites-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="ites-hero__stat">
                <span className="ites-hero__stat-num">{s.num}</span>
                <span className="ites-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="ites-overview container">
        <div className="ites-overview__inner">
          <div className="ites-overview__text">
            <span className="ites-tag">Our Approach</span>
            <h2 className="ites-overview__title">Advisory Built for India's Technology Sector</h2>
            <p className="ites-overview__body">
              India's IT and ITeS sector drives significant export revenues — but
              navigating transfer pricing scrutiny, SEZ compliance, GST on software
              exports, and cross-border ESOP structures demands specialist expertise.
              JHS brings two decades of IT sector advisory experience, helping
              companies ranging from large listed IT firms to high-growth SaaS
              startups manage tax, audit, and compliance with confidence.
            </p>
            <a href="/contact" className="ites-btn ites-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="ites-overview__visual">
            <div className="ites-overview__badge">
              <span className="ites-overview__badge-icon">💻</span>
              <span className="ites-overview__badge-label">Full-spectrum IT/ITeS advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="ites-highlights container" ref={hlRef}>
        <div className="ites-section-hd">
          <h2 className="ites-section-hd__title">What We Offer</h2>
          <p className="ites-section-hd__sub">
            Comprehensive services covering every tax, audit, and compliance need of IT/ITeS businesses.
          </p>
        </div>
        <div className="ites-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="ites-card">
              <div className="ites-card__accent" />
              <div className="ites-card__icon">{h.icon}</div>
              <h3 className="ites-card__title">{h.title}</h3>
              <p className="ites-card__desc">{h.desc}</p>
              <button className="ites-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="ites-why container" ref={whyRef}>
        <div className="ites-why__inner">
          <div className="ites-why__left">
            <span className="ites-tag">Why JHS</span>
            <h2 className="ites-why__title">The JHS Advantage in IT / ITeS</h2>
            <p className="ites-why__sub">
              We understand the commercial realities of India's IT sector —
              export pressures, transfer pricing risk, and the need for
              tax-efficient growth structures.
            </p>
            <a href="/contact" className="ites-btn ites-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="ites-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="ites-why__item">
                <span className="ites-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ites-cta container">
        <div className="ites-cta__inner">
          <div className="ites-cta__content">
            <p className="ites-cta__eyebrow">Get Started</p>
            <h2 className="ites-cta__title">Ready to optimise your IT business compliance?</h2>
            <p className="ites-cta__sub">
              Speak with a JHS IT/ITeS specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="ites-btn ites-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, TrendingUp, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Broking.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <TrendingUp size={20} strokeWidth={1.5} />,
    title: 'SEBI Regulatory Compliance',
    desc: 'End-to-end compliance support for stock brokers, sub-brokers, and depository participants — SEBI circulars, net worth requirements, and KYC/AML obligations.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Internal & Concurrent Audit',
    desc: 'SEBI-mandated internal audits, concurrent audits, and system audit support for broking entities registered with NSE, BSE, and MCX.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Financial Reporting & Ind AS',
    desc: 'Statutory audit, financial statement preparation, and Ind AS advisory for listed and unlisted broking companies and holding structures.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & GST Advisory',
    desc: 'Income tax planning, GST on brokerage and financial services, STT accounting, and deferred tax advisory for broking businesses.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Client Fund & Margin Compliance',
    desc: 'Advisory on SEBI client fund segregation rules, peak margin reporting, and compliance with SEBI circular on use of client securities.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Risk & Compliance Framework',
    desc: 'Risk-based compliance framework design, PMLA/AML program advisory, and regulatory inspection support for broking entities.',
  },
]

const STATS = [
  { num: '25+', label: 'Broking Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'SEBI', label: 'Regulatory Expertise' },
]

const WHY = [
  'Deep expertise in SEBI regulations for stock brokers and depository participants',
  'Specialist team for SEBI-mandated concurrent and internal audit assignments',
  'Experience across equity, commodity, currency, and derivative broking segments',
  'Proven track record with large broking houses and boutique investment firms',
  'Integrated tax, audit, and compliance delivery under one engagement team',
]

export default function Broking() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.br-hero__eyebrow', '.br-hero__title', '.br-hero__sub', '.br-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.br-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.br-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="br-page">

      {/* ── HERO ── */}
      <section className="br-hero" ref={heroRef}>
        <div className="br-hero__inner">
          {/* <p className="br-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="br-hero__title">Broking<br /><em>Services</em></h1>
          <p className="br-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for stock
            brokers, sub-brokers, and depository participants — built on deep
            knowledge of SEBI regulations and capital market frameworks.
          </p>
          {/* <div className="br-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="br-hero__stat">
                <span className="br-hero__stat-num">{s.num}</span>
                <span className="br-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="br-overview container">
        <div className="br-overview__inner">
          <div className="br-overview__text">
            <span className="br-tag">Our Approach</span>
            <h2 className="br-overview__title">Precision Compliance for Capital Market Intermediaries</h2>
            <p className="br-overview__body">
              Broking entities operate under one of India's most closely scrutinised
              regulatory environments — SEBI's evolving circular framework, peak margin
              requirements, client fund segregation rules, and KYC/AML obligations
              demand constant vigilance. JHS provides specialist advisory that keeps
              broking businesses compliant, audit-ready, and operationally efficient.
            </p>
            <a href="/contact" className="br-btn br-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="br-overview__visual">
            <div className="br-overview__badge">
              <span className="br-overview__badge-icon">📈</span>
              <span className="br-overview__badge-label">Full-spectrum broking advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="br-highlights container" ref={hlRef}>
        <div className="br-section-hd">
          <h2 className="br-section-hd__title">What We Offer</h2>
          <p className="br-section-hd__sub">
            Comprehensive services covering every compliance and financial need of broking entities.
          </p>
        </div>
        <div className="br-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="br-card">
              <div className="br-card__accent" />
              <div className="br-card__icon">{h.icon}</div>
              <h3 className="br-card__title">{h.title}</h3>
              <p className="br-card__desc">{h.desc}</p>
              <button className="br-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="br-why container" ref={whyRef}>
        <div className="br-why__inner">
          <div className="br-why__left">
            <span className="br-tag">Why JHS</span>
            <h2 className="br-why__title">The JHS Advantage in Broking</h2>
            <p className="br-why__sub">
              We understand the speed and complexity of capital markets — and deliver
              compliance advisory that keeps pace with SEBI's evolving framework.
            </p>
            <a href="/contact" className="br-btn br-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="br-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="br-why__item">
                <span className="br-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="br-cta container">
        <div className="br-cta__inner">
          <div className="br-cta__content">
            <p className="br-cta__eyebrow">Get Started</p>
            <h2 className="br-cta__title">Ready to stay ahead of SEBI compliance?</h2>
            <p className="br-cta__sub">
              Speak with a JHS broking specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="br-btn br-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
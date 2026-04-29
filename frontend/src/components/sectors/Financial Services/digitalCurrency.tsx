import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Cpu, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './DigitalCurrency.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Crypto Tax & Compliance',
    desc: 'Income tax advisory on VDA (Virtual Digital Assets) — Section 115BBH computation, TDS under Section 194S, and filing obligations for crypto traders and investors.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST on Digital Assets',
    desc: 'GST advisory for crypto exchanges, NFT platforms, and Web3 businesses — transaction classification, liability structuring, and compliance management.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'FEMA & Cross-border Advisory',
    desc: 'FEMA compliance for overseas crypto holdings, foreign exchange implications of digital asset transactions, and RBI regulatory guidance for VDA businesses.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Exchange & Platform Audit',
    desc: 'Statutory audit, internal audit, and financial reporting for crypto exchanges, DeFi platforms, and digital asset custodians operating in India.',
  },
  {
    icon: <Cpu size={20} strokeWidth={1.5} />,
    title: 'Web3 Business Structuring',
    desc: 'Entity structuring, jurisdictional advisory, and tax-efficient setup for Web3 startups, NFT platforms, and blockchain businesses entering India.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'PMLA & AML Compliance',
    desc: 'PMLA compliance framework for VDA service providers as per FIU-IND guidelines — KYC/AML program design, reporting obligations, and risk assessment.',
  },
]

const STATS = [
  { num: '30+', label: 'Crypto Clients' },
  { num: 'VDA', label: 'Tax Specialists' },
  { num: 'Web3', label: 'Ready Advisory' },
]

const WHY = [
  'First-mover expertise in India\'s evolving VDA tax and regulatory framework',
  'Deep knowledge of Section 115BBH, 194S, and PMLA obligations for VDA businesses',
  'Trusted by crypto exchanges, DeFi protocols, and institutional crypto investors',
  'Cross-border advisory spanning FEMA, foreign jurisdiction structuring, and treaties',
  'Proactive updates as India\'s digital asset regulatory landscape evolves',
]

export default function DigitalCurrency() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.dc-hero__eyebrow', '.dc-hero__title', '.dc-hero__sub', '.dc-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.dc-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.dc-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="dc-page">

      {/* ── HERO ── */}
      <section className="dc-hero" ref={heroRef}>
        <div className="dc-hero__inner">
          {/* <p className="dc-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="dc-hero__title">Digital<br /><em>Currency</em></h1>
          <p className="dc-hero__sub">
            Specialist tax, compliance, and regulatory advisory for cryptocurrency
            businesses, VDA service providers, and Web3 platforms — built on deep
            expertise in India's evolving digital asset framework.
          </p>
          {/* <div className="dc-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="dc-hero__stat">
                <span className="dc-hero__stat-num">{s.num}</span>
                <span className="dc-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="dc-overview container">
        <div className="dc-overview__inner">
          <div className="dc-overview__text">
            <span className="dc-tag">Our Approach</span>
            <h2 className="dc-overview__title">Navigating India's Digital Asset Regulatory Frontier</h2>
            <p className="dc-overview__body">
              India's VDA tax framework — introduced in Budget 2022 — created sweeping
              obligations for crypto traders, exchanges, and investors. Section 115BBH
              flat tax, TDS under 194S, PMLA obligations for VDA service providers, and
              an evolving FEMA landscape demand advisors who stay ahead of the curve.
              JHS provides specialist advisory that keeps digital asset businesses
              compliant as India's regulatory framework continues to mature.
            </p>
            <a href="/contact" className="dc-btn dc-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="dc-overview__visual">
            <div className="dc-overview__badge">
              <span className="dc-overview__badge-icon">₿</span>
              <span className="dc-overview__badge-label">VDA &amp; Web3 advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="dc-highlights container" ref={hlRef}>
        <div className="dc-section-hd">
          <h2 className="dc-section-hd__title">What We Offer</h2>
          <p className="dc-section-hd__sub">
            Comprehensive services for crypto traders, exchanges, and Web3 businesses navigating India's VDA framework.
          </p>
        </div>
        <div className="dc-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="dc-card">
              <div className="dc-card__accent" />
              <div className="dc-card__icon">{h.icon}</div>
              <h3 className="dc-card__title">{h.title}</h3>
              <p className="dc-card__desc">{h.desc}</p>
              <button className="dc-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="dc-why container" ref={whyRef}>
        <div className="dc-why__inner">
          <div className="dc-why__left">
            <span className="dc-tag">Why JHS</span>
            <h2 className="dc-why__title">The JHS Advantage in Digital Currency</h2>
            <p className="dc-why__sub">
              We were among India's first CAs to build specialist VDA tax
              expertise — and we stay ahead as the framework evolves.
            </p>
            <a href="/contact" className="dc-btn dc-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="dc-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="dc-why__item">
                <span className="dc-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="dc-cta container">
        <div className="dc-cta__inner">
          <div className="dc-cta__content">
            <p className="dc-cta__eyebrow">Get Started</p>
            <h2 className="dc-cta__title">Ready to navigate the VDA tax landscape?</h2>
            <p className="dc-cta__sub">
              Speak with a JHS digital currency specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="dc-btn dc-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
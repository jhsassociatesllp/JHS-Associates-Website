import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, TrendingUp, ShieldCheck, BarChart2, Globe2, Layers, FileText } from 'lucide-react'
import './Commodity.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <TrendingUp size={20} strokeWidth={1.5} />,
    title: 'Price Risk Management',
    desc: 'Structured hedging strategies to protect your business from commodity price volatility across metals, energy, and agri markets.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'Full compliance support for SEBI, FMC, and international commodity exchange regulations — from registration to reporting.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Market Analysis & Research',
    desc: 'In-depth commodity market intelligence, price forecasting, and sector research to support informed decision-making.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Cross-border Trading',
    desc: 'Advisory on international commodity trading structures, transfer pricing, and customs duty optimisation.',
  },
  {
    icon: <Layers size={20} strokeWidth={1.5} />,
    title: 'Inventory & Valuation',
    desc: 'Accurate commodity inventory valuation, impairment testing, and stock audit services aligned with Ind AS and IFRS.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Structuring',
    desc: 'End-to-end tax planning for commodity traders — GST, customs, income tax, and FEMA compliance under one roof.',
  },
]

const STATS = [
  { num: '20+', label: 'Years of Experience' },
  { num: '200+', label: 'Commodity Clients' },
  { num: '100%', label: 'Compliance Record' },
]

const WHY = [
  'Deep domain expertise in metals, agri, and energy sectors',
  'Dedicated commodity desk with real-time regulatory updates',
  'Seamless coordination between tax, audit, and advisory teams',
  'Proven track record with large commodity trading houses',
  'International advisory capability across key trading hubs',
]

export default function Commodity() {
  const heroRef     = useRef<HTMLDivElement>(null)
  const hlRef       = useRef<HTMLDivElement>(null)
  const whyRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* Hero */
      gsap.fromTo(
        ['.com-hero__eyebrow', '.com-hero__title', '.com-hero__sub', '.com-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )

      /* Highlights cards */
      gsap.fromTo(
        '.com-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' },
        }
      )

      /* Why list items */
      gsap.fromTo(
        '.com-why__item',
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="com-page">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="com-hero" ref={heroRef}>
        <div className="com-hero__inner">

          <h1 className="com-hero__title">
            Commodity<br /><em>Services</em>
          </h1>

          <p className="com-hero__sub">
            Expert financial, tax, and compliance advisory for commodity traders,
            exchanges, and market participants — built on deep sectoral knowledge
            and regulatory expertise.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════
          OVERVIEW STRIP
      ══════════════════════════════════════ */}
      <section className="com-overview container">
        <div className="com-overview__inner">
          <div className="com-overview__text">
            <span className="com-overview__tag">Our Approach</span>
            <h2 className="com-overview__title">
              Navigating Complexity in Commodity Markets
            </h2>
            <p className="com-overview__body">
              India's commodity sector operates at the intersection of volatile global
              markets, complex domestic regulations, and evolving tax frameworks. JHS
              provides integrated advisory — combining financial structuring, tax
              optimisation, and compliance management — to help commodity businesses
              operate with confidence and efficiency.
            </p>
            <a href="/contact" className="com-btn com-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="com-overview__visual">
            <div className="com-overview__badge">
              <span className="com-overview__badge-num">₹</span>
              <span className="com-overview__badge-label">End-to-end commodity advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICE HIGHLIGHTS
      ══════════════════════════════════════ */}
      <section className="com-highlights container" ref={hlRef}>
        <div className="com-section-hd">
          <h2 className="com-section-hd__title">What We Offer</h2>
          <p className="com-section-hd__sub">
            Comprehensive services tailored to the unique demands of commodity markets.
          </p>
        </div>

        <div className="com-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="com-card">
              <div className="com-card__accent" />
              <div className="com-card__icon">{h.icon}</div>
              <h3 className="com-card__title">{h.title}</h3>
              <p className="com-card__desc">{h.desc}</p>
              <button className="com-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY JHS
      ══════════════════════════════════════ */}
      <section className="com-why container" ref={whyRef}>
        <div className="com-why__inner">
          <div className="com-why__left">
            <span className="com-overview__tag">Why JHS</span>
            <h2 className="com-why__title">
              The JHS Advantage in Commodity
            </h2>
            <p className="com-why__sub">
              We don't just advise — we embed ourselves in your operations
              to deliver measurable outcomes.
            </p>
            <a href="/contact" className="com-btn com-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>

          <ul className="com-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="com-why__item">
                <span className="com-why__item-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="com-cta container">
        <div className="com-cta__inner">
          <div className="com-cta__content">
            <p className="com-cta__eyebrow">Get Started</p>
            <h2 className="com-cta__title">Ready to strengthen your commodity operations?</h2>
            <p className="com-cta__sub">
              Speak with a JHS commodity specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="com-btn com-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}
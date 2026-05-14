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
  { num: '200+', label: 'Commodity Clients' },
  { num: '20+', label: 'Years Experience' },
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
  const heroRef = useRef<HTMLDivElement>(null)
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.com-eyebrow, .com-title, .com-subtitle, .com-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.com-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.com-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="com-page">

      {/* ── HERO ── */}
      <section className="com-hero" ref={heroRef}>
        <div className="com-hero__inner com-container">
          <span className="com-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="com-title">Commodity<br />Services</h1>
          <p className="com-subtitle">
            Expert financial, tax, and compliance advisory for commodity traders, exchanges,
            and market participants — built on deep sectoral knowledge and regulatory expertise.
          </p>
          <div className="com-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="com-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="com-main">

        {/* ── OVERVIEW ── */}
        <section className="com-overview com-container">
          <div className="com-overview__inner">
            <div>
              <span className="com-section-kicker">Our Approach</span>
              <h2 className="com-overview__title">Navigating Complexity in Commodity Markets</h2>
            </div>
            <div>
              <p className="com-overview__body">
                India's commodity sector operates at the intersection of volatile global markets,
                complex domestic regulations, and evolving tax frameworks. JHS provides integrated
                advisory — combining financial structuring, tax optimisation, and compliance management
                — to help commodity businesses operate with confidence and efficiency.
              </p>
              <a href="/contact" className="com-btn com-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="com-services com-container" ref={servRef}>
          <div className="com-services__header">
            <div>
              <span className="com-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Comprehensive services tailored to the unique demands of commodity markets.</p>
          </div>
          <div className="com-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="com-card">
                <div className="com-card__aside">
                  <span className="com-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="com-card__icon">{h.icon}</div>
                </div>
                <div className="com-card__body">
                  <h3 className="com-card__title">{h.title}</h3>
                  <p className="com-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="com-why com-container" ref={whyRef}>
          <div className="com-why__header">
            <span className="com-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in Commodity</h2>
            <p>We don't just advise — we embed ourselves in your operations to deliver measurable outcomes.</p>
            <a href="/contact" className="com-btn com-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="com-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="com-why__item">
                <div className="com-why__item-header">
                  <span className="com-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="com-cta com-container">
          <div className="com-cta__inner">
            <div className="com-cta__content">
              <p className="com-cta__eyebrow">Get Started</p>
              <h2 className="com-cta__title">Ready to strengthen your commodity operations?</h2>
              <p className="com-cta__sub">Speak with a JHS commodity specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="com-btn com-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

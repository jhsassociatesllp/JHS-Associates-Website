import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ShoppingCart, BarChart2, ShieldCheck, Truck, FileText, Globe2 } from 'lucide-react'
import './FMCG.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShoppingCart size={20} strokeWidth={1.5} />,
    title: 'Trade & Distribution Compliance',
    desc: 'GST structuring, trade discount optimisation, and distribution chain compliance for multi-tier FMCG networks.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Revenue & Margin Analytics',
    desc: 'SKU-level profitability analysis, trade spend audits, and margin improvement advisory for growing FMCG brands.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory & Licensing',
    desc: 'End-to-end support for FSSAI, BIS, and other statutory registrations, renewals, and compliance management.',
  },
  {
    icon: <Truck size={20} strokeWidth={1.5} />,
    title: 'Supply Chain Advisory',
    desc: 'Transfer pricing, customs duty optimisation, and tax-efficient supply chain structuring for domestic and import-heavy FMCG businesses.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Indirect Tax',
    desc: 'GST return filing, reconciliations, ITC management, and litigation support — tailored for high-volume FMCG operations.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Market Entry & Expansion',
    desc: 'Financial structuring, entity setup, and regulatory guidance for FMCG brands entering or expanding within India.',
  },
]

const STATS = [
  { num: '50+', label: 'FMCG Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: '360°', label: 'Advisory Coverage' },
]

const WHY = [
  'Deep understanding of FMCG distribution, trade terms, and margin structures',
  'Specialist GST and indirect tax team for high-volume transaction environments',
  'Dedicated support for both listed FMCG corporates and emerging D2C brands',
  'Integrated tax, audit, and compliance delivery under one engagement',
  'Proven track record with consumer goods companies across categories',
]

export default function FMCG() {
  const heroRef = useRef<HTMLDivElement>(null)
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fmcg-eyebrow, .fmcg-title, .fmcg-subtitle, .fmcg-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.fmcg-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.fmcg-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="fmcg-page">

      {/* ── HERO ── */}
      <section className="fmcg-hero" ref={heroRef}>
        <div className="fmcg-hero__inner fmcg-container">
          <span className="fmcg-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="fmcg-title">FMCG<br />Services</h1>
          <p className="fmcg-subtitle">
            Integrated financial, tax, and compliance advisory for Fast Moving Consumer Goods
            companies — from emerging D2C brands to large distribution-led businesses.
          </p>
          <div className="fmcg-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="fmcg-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="fmcg-main">

        {/* ── OVERVIEW ── */}
        <section className="fmcg-overview fmcg-container">
          <div className="fmcg-overview__inner">
            <div>
              <span className="fmcg-section-kicker">Our Approach</span>
              <h2 className="fmcg-overview__title">Built for the Speed of FMCG</h2>
            </div>
            <div>
              <p className="fmcg-overview__body">
                FMCG businesses operate at high velocity — large transaction volumes, complex distribution
                chains, and constant regulatory scrutiny. JHS delivers advisory that keeps pace: proactive
                GST management, trade compliance, and financial structuring designed for businesses where
                margins and timing matter.
              </p>
              <a href="/contact" className="fmcg-btn fmcg-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="fmcg-services fmcg-container" ref={servRef}>
          <div className="fmcg-services__header">
            <div>
              <span className="fmcg-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Comprehensive services tailored to the pace and complexity of FMCG operations.</p>
          </div>
          <div className="fmcg-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="fmcg-card">
                <div className="fmcg-card__aside">
                  <span className="fmcg-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="fmcg-card__icon">{h.icon}</div>
                </div>
                <div className="fmcg-card__body">
                  <h3 className="fmcg-card__title">{h.title}</h3>
                  <p className="fmcg-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="fmcg-why fmcg-container" ref={whyRef}>
          <div className="fmcg-why__header">
            <span className="fmcg-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in FMCG</h2>
            <p>We understand the commercial realities of FMCG — fast cycles, thin margins, and relentless compliance demands.</p>
            <a href="/contact" className="fmcg-btn fmcg-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="fmcg-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="fmcg-why__item">
                <div className="fmcg-why__item-header">
                  <span className="fmcg-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="fmcg-cta fmcg-container">
          <div className="fmcg-cta__inner">
            <div className="fmcg-cta__content">
              <p className="fmcg-cta__eyebrow">Get Started</p>
              <h2 className="fmcg-cta__title">Ready to accelerate your FMCG business?</h2>
              <p className="fmcg-cta__sub">Speak with a JHS FMCG specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="fmcg-btn fmcg-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

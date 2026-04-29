import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ShoppingBag, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Retail.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShoppingBag size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST compliance, ITC reconciliation, e-invoicing, and indirect tax advisory tailored to high-volume multi-location retail operations.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Revenue & Margin Analytics',
    desc: 'Category-level profitability analysis, shrinkage audits, markdown optimisation, and financial KPI dashboards for retail management.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Franchise & License Compliance',
    desc: 'Compliance support for franchise agreements, royalty accounting, licence fee structuring, and multi-party retail arrangements.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Audit & Internal Controls',
    desc: 'Store-level internal audits, inventory controls, shrinkage reviews, and fraud risk assessment across retail networks.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Omnichannel & E-commerce Tax',
    desc: 'Tax and compliance advisory for omnichannel retailers — managing GST, TDS on marketplace commissions, and digital transaction reporting.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Business Structuring',
    desc: 'Entity structuring, PE risk mitigation for foreign retailers, FDI advisory, and tax-efficient retail expansion strategies.',
  },
]

const STATS = [
  { num: '50+', label: 'Retail Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'Omni', label: 'Channel Coverage' },
]

const WHY = [
  'Deep experience with large-format retail, specialty stores, and D2C brands',
  'Specialist GST team for high-volume, multi-location retail environments',
  'Proven track record with listed retailers and fast-growing omnichannel brands',
  'Store-level internal audit capability across pan-India retail networks',
  'FDI and foreign retailer compliance expertise under DIPP guidelines',
]

export default function Retail() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.rt-hero__eyebrow', '.rt-hero__title', '.rt-hero__sub', '.rt-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.rt-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.rt-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="rt-page">

      {/* ── HERO ── */}
      <section className="rt-hero" ref={heroRef}>
        <div className="rt-hero__inner">
          {/* <p className="rt-hero__eyebrow">Sectors &nbsp;·&nbsp; Consumer</p> */}
          <h1 className="rt-hero__title">Retail<br /><em>Services</em></h1>
          <p className="rt-hero__sub">
            Integrated financial, tax, and compliance advisory for retail businesses —
            from single-store independents to large omnichannel chains operating
            across India and internationally.
          </p>
          {/* <div className="rt-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="rt-hero__stat">
                <span className="rt-hero__stat-num">{s.num}</span>
                <span className="rt-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="rt-overview container">
        <div className="rt-overview__inner">
          <div className="rt-overview__text">
            <span className="rt-tag">Our Approach</span>
            <h2 className="rt-overview__title">Built for the Pace and Scale of Modern Retail</h2>
            <p className="rt-overview__body">
              Retail businesses operate at extraordinary velocity — high transaction
              volumes, complex multi-state GST obligations, omnichannel complexity,
              and constant margin pressure. JHS delivers advisory that keeps pace,
              combining deep GST expertise, store-level audit capability, and
              strategic tax structuring for retail businesses at every stage of growth.
            </p>
            <a href="/contact" className="rt-btn rt-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="rt-overview__visual">
            <div className="rt-overview__badge">
              <span className="rt-overview__badge-icon">🛍️</span>
              <span className="rt-overview__badge-label">End-to-end retail advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="rt-highlights container" ref={hlRef}>
        <div className="rt-section-hd">
          <h2 className="rt-section-hd__title">What We Offer</h2>
          <p className="rt-section-hd__sub">
            Comprehensive services tailored to the pace and complexity of retail operations.
          </p>
        </div>
        <div className="rt-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="rt-card">
              <div className="rt-card__accent" />
              <div className="rt-card__icon">{h.icon}</div>
              <h3 className="rt-card__title">{h.title}</h3>
              <p className="rt-card__desc">{h.desc}</p>
              <button className="rt-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="rt-why container" ref={whyRef}>
        <div className="rt-why__inner">
          <div className="rt-why__left">
            <span className="rt-tag">Why JHS</span>
            <h2 className="rt-why__title">The JHS Advantage in Retail</h2>
            <p className="rt-why__sub">
              We understand the commercial realities of retail —
              thin margins, high volumes, and the need for real-time compliance clarity.
            </p>
            <a href="/contact" className="rt-btn rt-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="rt-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="rt-why__item">
                <span className="rt-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rt-cta container">
        <div className="rt-cta__inner">
          <div className="rt-cta__content">
            <p className="rt-cta__eyebrow">Get Started</p>
            <h2 className="rt-cta__title">Ready to strengthen your retail operations?</h2>
            <p className="rt-cta__sub">
              Speak with a JHS retail specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="rt-btn rt-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
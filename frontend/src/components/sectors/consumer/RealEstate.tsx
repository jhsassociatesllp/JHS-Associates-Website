import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Building2, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './RealEstate.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Building2 size={20} strokeWidth={1.5} />,
    title: 'Transaction Advisory',
    desc: 'Due diligence, valuation, and structuring advisory for commercial and residential real estate acquisitions, disposals, and mergers.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'Complex GST structuring for commercial leasing, co-working spaces, RERA-governed projects, and sale of developed properties.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'REITs & Fund Structuring',
    desc: 'Advisory on REIT establishment, InvIT structuring, fund formation, and investor reporting for real estate asset managers.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'End-to-end support for RERA, FEMA, FDI compliance, and municipal approvals for real estate developers and investors.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Project Finance & Valuation',
    desc: 'Financial modelling, DCF valuations, project feasibility studies, and lender due diligence for real estate projects.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Audit & Assurance',
    desc: 'Statutory audit, internal audit, and Ind AS 115 revenue recognition reviews for real estate developers and listed entities.',
  },
]

const STATS = [
  { num: '35+', label: 'RE Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'Full Cycle', label: 'Advisory' },
]

const WHY = [
  'Deep expertise across commercial, residential, and mixed-use real estate sectors',
  'Specialist knowledge of REIT regulations and real estate fund structures',
  'Experienced with Ind AS 115 revenue recognition for complex project structures',
  'Integrated tax, audit, and transaction advisory under one engagement',
  'Trusted by leading developers, PE funds, and institutional investors',
]

export default function RealEstate() {
  const heroRef = useRef<HTMLDivElement>(null)
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.re-eyebrow, .re-title, .re-subtitle, .re-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.re-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.re-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="re-page">

      {/* ── HERO ── */}
      <section className="re-hero" ref={heroRef}>
        <div className="re-hero__inner re-container">
          <span className="re-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="re-title">Real Estate<br />Services</h1>
          <p className="re-subtitle">
            Strategic financial, tax, and compliance advisory for real estate developers,
            investors, and fund managers — from asset acquisition to portfolio management.
          </p>
          <div className="re-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="re-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="re-main">

        {/* ── OVERVIEW ── */}
        <section className="re-overview re-container">
          <div className="re-overview__inner">
            <div>
              <span className="re-section-kicker">Our Approach</span>
              <h2 className="re-overview__title">Advisory Built for the Complexity of Real Estate</h2>
            </div>
            <div>
              <p className="re-overview__body">
                Real estate operates at the intersection of finance, law, and regulation — with RERA,
                GST, Ind AS, FEMA, and sector-specific tax rules all adding layers of complexity. JHS
                provides comprehensive advisory spanning the full real estate lifecycle, from initial
                land acquisition and project structuring through to asset exit, fund reporting, and
                regulatory compliance.
              </p>
              <a href="/contact" className="re-btn re-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="re-services re-container" ref={servRef}>
          <div className="re-services__header">
            <div>
              <span className="re-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Comprehensive services covering every financial and compliance dimension of real estate.</p>
          </div>
          <div className="re-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="re-card">
                <div className="re-card__aside">
                  <span className="re-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="re-card__icon">{h.icon}</div>
                </div>
                <div className="re-card__body">
                  <h3 className="re-card__title">{h.title}</h3>
                  <p className="re-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="re-why re-container" ref={whyRef}>
          <div className="re-why__header">
            <span className="re-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in Real Estate</h2>
            <p>We combine sector-specific expertise with commercial acumen to help real estate businesses navigate complexity and create value.</p>
            <a href="/contact" className="re-btn re-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="re-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="re-why__item">
                <div className="re-why__item-header">
                  <span className="re-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="re-cta re-container">
          <div className="re-cta__inner">
            <div className="re-cta__content">
              <p className="re-cta__eyebrow">Get Started</p>
              <h2 className="re-cta__title">Ready to unlock value in your real estate portfolio?</h2>
              <p className="re-cta__sub">Speak with a JHS real estate specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="re-btn re-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

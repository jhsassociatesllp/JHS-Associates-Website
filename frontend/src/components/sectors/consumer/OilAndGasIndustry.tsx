import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Flame, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './OilAndGasIndustry.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Flame size={20} strokeWidth={1.5} />,
    title: 'Project Finance & Structuring',
    desc: 'Advisory on funding structures, project SPVs, debt covenants, and financial modelling for upstream, midstream, and downstream projects.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'Support for DGH, PNGRB, MoPNG, and environmental compliance — from licensing to periodic filings and statutory reporting.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Royalty Advisory',
    desc: 'Profit petroleum calculations, royalty structuring, depletion allowances, and income tax planning for PSC and HELP contracts.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Cross-border Operations',
    desc: 'Transfer pricing, FEMA advisory, and international tax structuring for oil & gas businesses with cross-border operations and JV partners.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Audit & Assurance',
    desc: 'Statutory audit, internal audit, and joint venture audit for oil & gas entities — aligned with Ind AS and IFRS 6 exploration accounting.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Cost Audit & Pricing',
    desc: 'Cost audit, product costing, and cost recovery reviews for entities operating under production sharing or government nominated pricing.',
  },
]

const STATS = [
  { num: '25+', label: 'O&G Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'PSC & HELP', label: 'Contract Expertise' },
]

const WHY = [
  'Deep understanding of PSC, NELP, HELP, and DSF contract structures',
  'Specialist knowledge of DGH reporting, cost recovery, and profit petroleum',
  'Experienced across upstream exploration, refining, and distribution segments',
  'Integrated tax, audit, and regulatory compliance delivery',
  'Trusted by both Indian public sector undertakings and private operators',
]

export default function OilAndGasIndustry() {
  const heroRef = useRef<HTMLDivElement>(null)
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.og-eyebrow, .og-title, .og-subtitle, .og-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.og-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.og-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="og-page">

      {/* ── HERO ── */}
      <section className="og-hero" ref={heroRef}>
        <div className="og-hero__inner og-container">
          <span className="og-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="og-title">Oil &amp; Gas<br />Industry</h1>
          <p className="og-subtitle">
            Specialised financial, tax, and compliance advisory for oil &amp; gas operators,
            refiners, and distribution companies — built on deep knowledge of PSC contracts,
            DGH regulations, and sector-specific accounting.
          </p>
          <div className="og-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="og-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="og-main">

        {/* ── OVERVIEW ── */}
        <section className="og-overview og-container">
          <div className="og-overview__inner">
            <div>
              <span className="og-section-kicker">Our Approach</span>
              <h2 className="og-overview__title">Navigating the Complexity of India's Energy Sector</h2>
            </div>
            <div>
              <p className="og-overview__body">
                India's oil &amp; gas sector operates under a uniquely complex framework — PSC cost
                recovery rules, profit petroleum calculations, royalty regimes, and evolving HELP
                and DSF contract structures demand advisors who understand both the commercial and
                regulatory landscape. JHS brings specialist expertise across the full value chain,
                from exploration accounting to downstream distribution.
              </p>
              <a href="/contact" className="og-btn og-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="og-services og-container" ref={servRef}>
          <div className="og-services__header">
            <div>
              <span className="og-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Comprehensive services covering every financial and compliance need of oil &amp; gas businesses.</p>
          </div>
          <div className="og-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="og-card">
                <div className="og-card__aside">
                  <span className="og-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="og-card__icon">{h.icon}</div>
                </div>
                <div className="og-card__body">
                  <h3 className="og-card__title">{h.title}</h3>
                  <p className="og-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="og-why og-container" ref={whyRef}>
          <div className="og-why__header">
            <span className="og-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in Oil &amp; Gas</h2>
            <p>We understand the commercial, contractual, and regulatory complexity of India's energy sector — and deliver advisory that keeps pace with it.</p>
            <a href="/contact" className="og-btn og-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="og-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="og-why__item">
                <div className="og-why__item-header">
                  <span className="og-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="og-cta og-container">
          <div className="og-cta__inner">
            <div className="og-cta__content">
              <p className="og-cta__eyebrow">Get Started</p>
              <h2 className="og-cta__title">Ready to power your compliance forward?</h2>
              <p className="og-cta__sub">Speak with a JHS oil &amp; gas specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="og-btn og-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

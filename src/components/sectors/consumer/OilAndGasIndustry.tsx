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
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.og-hero__eyebrow', '.og-hero__title', '.og-hero__sub', '.og-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.og-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.og-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="og-page">

      {/* ── HERO ── */}
      <section className="og-hero" ref={heroRef}>
        <div className="og-hero__inner">
          <p className="og-hero__eyebrow">Sectors &nbsp;·&nbsp; Consumer</p>
          <h1 className="og-hero__title">Oil &amp; Gas<br /><em>Industry</em></h1>
          <p className="og-hero__sub">
            Specialised financial, tax, and compliance advisory for oil &amp; gas
            operators, refiners, and distribution companies — built on deep knowledge
            of PSC contracts, DGH regulations, and sector-specific accounting.
          </p>
          <div className="og-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="og-hero__stat">
                <span className="og-hero__stat-num">{s.num}</span>
                <span className="og-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="og-overview container">
        <div className="og-overview__inner">
          <div className="og-overview__text">
            <span className="og-tag">Our Approach</span>
            <h2 className="og-overview__title">Navigating the Complexity of India's Energy Sector</h2>
            <p className="og-overview__body">
              India's oil &amp; gas sector operates under a uniquely complex framework —
              PSC cost recovery rules, profit petroleum calculations, royalty regimes, and
              evolving HELP and DSF contract structures demand advisors who understand
              both the commercial and regulatory landscape. JHS brings specialist expertise
              across the full value chain, from exploration accounting to downstream distribution.
            </p>
            <a href="/contact" className="og-btn og-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="og-overview__visual">
            <div className="og-overview__badge">
              <span className="og-overview__badge-icon">⛽</span>
              <span className="og-overview__badge-label">Full value chain O&amp;G advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="og-highlights container" ref={hlRef}>
        <div className="og-section-hd">
          <h2 className="og-section-hd__title">What We Offer</h2>
          <p className="og-section-hd__sub">
            Comprehensive services covering every financial and compliance need of oil &amp; gas businesses.
          </p>
        </div>
        <div className="og-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="og-card">
              <div className="og-card__accent" />
              <div className="og-card__icon">{h.icon}</div>
              <h3 className="og-card__title">{h.title}</h3>
              <p className="og-card__desc">{h.desc}</p>
              <button className="og-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="og-why container" ref={whyRef}>
        <div className="og-why__inner">
          <div className="og-why__left">
            <span className="og-tag">Why JHS</span>
            <h2 className="og-why__title">The JHS Advantage in Oil &amp; Gas</h2>
            <p className="og-why__sub">
              We understand the commercial, contractual, and regulatory complexity
              of India's energy sector — and deliver advisory that keeps pace with it.
            </p>
            <a href="/contact" className="og-btn og-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="og-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="og-why__item">
                <span className="og-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="og-cta container">
        <div className="og-cta__inner">
          <div className="og-cta__content">
            <p className="og-cta__eyebrow">Get Started</p>
            <h2 className="og-cta__title">Ready to power your compliance forward?</h2>
            <p className="og-cta__sub">
              Speak with a JHS oil &amp; gas specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="og-btn og-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
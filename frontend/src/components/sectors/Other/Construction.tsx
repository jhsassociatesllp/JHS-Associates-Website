import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, HardHat, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Construction.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <HardHat size={20} strokeWidth={1.5} />,
    title: 'Project Finance & Structuring',
    desc: 'Advisory on debt-equity structuring, SPV setup, project cost accounting, and financial modelling for infrastructure, residential, and commercial construction projects.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST advisory on works contracts, sub-contracting arrangements, reverse charge mechanisms, and input tax credit optimisation for construction businesses.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Statutory & Internal Audit',
    desc: 'Statutory audit, internal audit, and project cost audit for construction companies — covering revenue recognition under Ind AS 115 and percentage of completion method.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Contract & WIP Accounting',
    desc: 'Work-in-progress accounting, contract revenue recognition, mobilisation advance treatment, and retention money accounting for long-duration construction projects.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Tax & Transfer Pricing',
    desc: 'Income tax planning, MAT advisory, transfer pricing for cross-border construction contracts, and tax structuring for joint ventures and consortium arrangements.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Labour & Compliance',
    desc: 'Labour law compliance, contractor payment compliance, ESI/PF advisory, and regulatory compliance for construction site operations across multiple states.',
  },
]

const STATS = [
  { num: '30+', label: 'Construction Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'Ind AS 115', label: 'Contract Experts' },
]

const WHY = [
  'Deep expertise in Ind AS 115 revenue recognition for long-duration contracts',
  'Specialist GST team handling works contracts and sub-contracting complexities',
  'Project cost audit and WIP accounting capability for large construction groups',
  'Transfer pricing advisory for cross-border EPC and infrastructure contracts',
  'Trusted by leading infrastructure developers and construction companies across India',
]

export default function Construction() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.cn-hero__eyebrow', '.cn-hero__title', '.cn-hero__sub', '.cn-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.cn-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.cn-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="cn-page">

      {/* ── HERO ── */}
      <section className="cn-hero" ref={heroRef}>
        <div className="cn-hero__inner">
          {/* <p className="cn-hero__eyebrow">Sectors &nbsp;·&nbsp; Other</p> */}
          <h1 className="cn-hero__title">Construction<br /><em>Services</em></h1>
          <p className="cn-hero__sub">
            Specialised financial, tax, and compliance advisory for construction
            companies, infrastructure developers, and EPC contractors — built on
            deep expertise in project accounting and works contract GST.
          </p>
          {/* <div className="cn-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="cn-hero__stat">
                <span className="cn-hero__stat-num">{s.num}</span>
                <span className="cn-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="cn-overview container">
        <div className="cn-overview__inner">
          <div className="cn-overview__text">
            <span className="cn-tag">Our Approach</span>
            <h2 className="cn-overview__title">Building Financial Clarity for Construction Businesses</h2>
            <p className="cn-overview__body">
              Construction companies face some of the most complex accounting
              and tax challenges in Indian business — Ind AS 115 revenue
              recognition on long-duration contracts, works contract GST
              complexity, multi-state labour compliance, and project cost
              audits all demand specialist expertise. JHS brings deep
              construction sector knowledge to deliver advisory that gives
              developers and contractors financial clarity at every stage.
            </p>
            <a href="/contact" className="cn-btn cn-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="cn-overview__visual">
            <div className="cn-overview__badge">
              <span className="cn-overview__badge-icon">🏗️</span>
              <span className="cn-overview__badge-label">Full lifecycle construction advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="cn-highlights container" ref={hlRef}>
        <div className="cn-section-hd">
          <h2 className="cn-section-hd__title">What We Offer</h2>
          <p className="cn-section-hd__sub">
            Comprehensive services covering every financial and compliance need of construction businesses.
          </p>
        </div>
        <div className="cn-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="cn-card">
              <div className="cn-card__accent" />
              <div className="cn-card__icon">{h.icon}</div>
              <h3 className="cn-card__title">{h.title}</h3>
              <p className="cn-card__desc">{h.desc}</p>
              <button className="cn-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="cn-why container" ref={whyRef}>
        <div className="cn-why__inner">
          <div className="cn-why__left">
            <span className="cn-tag">Why JHS</span>
            <h2 className="cn-why__title">The JHS Advantage in Construction</h2>
            <p className="cn-why__sub">
              We understand the financial complexity of construction — long project
              cycles, multi-party contracts, and evolving tax obligations — and
              deliver advisory that keeps pace.
            </p>
            <a href="/contact" className="cn-btn cn-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="cn-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="cn-why__item">
                <span className="cn-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cn-cta container">
        <div className="cn-cta__inner">
          <div className="cn-cta__content">
            <p className="cn-cta__eyebrow">Get Started</p>
            <h2 className="cn-cta__title">Ready to build on solid financial ground?</h2>
            <p className="cn-cta__sub">
              Speak with a JHS construction specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="cn-btn cn-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
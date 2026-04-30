import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Receipt, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Taxation.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Receipt size={20} strokeWidth={1.5} />,
    title: 'Direct Tax Advisory',
    desc: 'Comprehensive income tax planning, return filing, and advisory for corporates, LLPs, HUFs, and individuals — structured to minimise tax liability within the law.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'International Tax',
    desc: 'Transfer pricing documentation, DTAA advisory, FEMA compliance, and cross-border structuring for multinationals and businesses with overseas operations.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST registration, return filing, ITC reconciliation, e-invoicing compliance, and advisory on complex GST transactions across industries.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Tax Litigation & Representation',
    desc: 'Representation before Income Tax Authorities, CIT(A), ITAT, GST appellate bodies, and High Courts — from drafting to oral hearings.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Tax Due Diligence',
    desc: 'Pre-acquisition and pre-investment tax due diligence, identifying contingent liabilities, treaty risks, and structuring recommendations for M&A transactions.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Corporate Tax Structuring',
    desc: 'Business restructuring, demergers, amalgamations, and holding company structures designed for tax efficiency across corporate groups.',
  },
]

const STATS = [
  { num: '500+', label: 'Tax Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'Pan India', label: 'Coverage' },
]

const WHY = [
  'Full-spectrum tax advisory — direct, indirect, and international under one team',
  'Senior partner-led representation before tax authorities and appellate tribunals',
  'Specialist GST team handling complex sectoral transactions across industries',
  'Transfer pricing documentation and OECD BEPS advisory for multinationals',
  'Proactive tax planning aligned with regulatory changes and budget updates',
]

export default function Taxation() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.tx-hero__eyebrow', '.tx-hero__title', '.tx-hero__sub', '.tx-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.tx-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.tx-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="tx-page">

      {/* ── HERO ── */}
      <section className="tx-hero" ref={heroRef}>
        <div className="tx-hero__inner">
          {/* <p className="tx-hero__eyebrow">Services &nbsp;·&nbsp; JHS & Associates</p> */}
          <h1 className="tx-hero__title">Taxation<br /><em>Services</em></h1>
          <p className="tx-hero__sub">
            Full-spectrum direct tax, indirect tax, and international tax advisory
            for corporates, businesses, and individuals — backed by two decades
            of expertise and senior partner-led delivery.
          </p>
          {/* <div className="tx-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="tx-hero__stat">
                <span className="tx-hero__stat-num">{s.num}</span>
                <span className="tx-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="tx-overview container">
        <div className="tx-overview__inner">
          <div className="tx-overview__text">
            <span className="tx-tag">Our Approach</span>
            <h2 className="tx-overview__title">Tax Advisory That Goes Beyond Compliance</h2>
            <p className="tx-overview__body">
              Tax is not just a compliance obligation — it is a strategic lever.
              JHS delivers tax advisory that looks beyond the return filing cycle,
              helping businesses structure transactions, plan for the future, and
              manage disputes proactively. From direct tax to GST, from transfer
              pricing to M&amp;A structuring, our integrated tax practice covers
              every dimension of a business's tax exposure.
            </p>
            <a href="/contact" className="tx-btn tx-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="tx-overview__visual">
            <div className="tx-overview__badge">
              <span className="tx-overview__badge-icon">📋</span>
              <span className="tx-overview__badge-label">Full-spectrum tax advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="tx-highlights container" ref={hlRef}>
        <div className="tx-section-hd">
          <h2 className="tx-section-hd__title">What We Offer</h2>
          <p className="tx-section-hd__sub">
            Comprehensive tax services covering every obligation and opportunity for businesses and individuals.
          </p>
        </div>
        <div className="tx-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="tx-card">
              <div className="tx-card__accent" />
              <div className="tx-card__icon">{h.icon}</div>
              <h3 className="tx-card__title">{h.title}</h3>
              <p className="tx-card__desc">{h.desc}</p>
              <button className="tx-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="tx-why container" ref={whyRef}>
        <div className="tx-why__inner">
          <div className="tx-why__left">
            <span className="tx-tag">Why JHS</span>
            <h2 className="tx-why__title">The JHS Advantage in Taxation</h2>
            <p className="tx-why__sub">
              We combine technical tax depth with practical business understanding
              to deliver advisory that creates real value — not just compliance.
            </p>
            <a href="/contact" className="tx-btn tx-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="tx-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="tx-why__item">
                <span className="tx-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tx-cta container">
        <div className="tx-cta__inner">
          <div className="tx-cta__content">
            <p className="tx-cta__eyebrow">Get Started</p>
            <h2 className="tx-cta__title">Ready to optimise your tax position?</h2>
            <p className="tx-cta__sub">
              Speak with a JHS tax specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="tx-btn tx-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
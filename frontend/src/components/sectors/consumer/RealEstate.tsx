import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Building, FileText, ShieldCheck, BarChart2, Scale, TrendingUp } from 'lucide-react'
import './RealEstate.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Building size={20} strokeWidth={1.5} />,
    title: 'Transaction Advisory',
    desc: 'Due diligence, valuation and structuring for commercial real estate acquisitions, disposals and joint ventures.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Regulatory Compliance',
    desc: 'GST advisory on commercial leasing, capital gains planning, RERA compliance and indirect tax structuring for developers.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Audit & Assurance',
    desc: 'Statutory audit, internal audit and Ind AS compliance for real estate developers, REITs and property management firms.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Financial Modelling',
    desc: 'Project feasibility studies, cash flow modelling and investment appraisal for commercial and mixed-use developments.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'REIT & InvIT Advisory',
    desc: 'Structuring, compliance and ongoing advisory for Real Estate Investment Trusts and Infrastructure Investment Trusts.',
  },
  {
    icon: <TrendingUp size={20} strokeWidth={1.5} />,
    title: 'Asset Management Support',
    desc: 'Portfolio performance tracking, lease management advisory and financial reporting for institutional real estate investors.',
  },
]

const STATS = [
  { num: '50+', label: 'Real Estate Clients' },
  { num: '₹5000Cr+', label: 'Assets Under Advisory' },
  { num: 'Pan India', label: 'Coverage' },
]

const WHY = [
  'Deep expertise in commercial real estate transactions and structuring',
  'Specialist REIT and InvIT advisory team with regulatory experience',
  'Comprehensive GST and capital gains tax planning for developers and investors',
  'Trusted by leading developers, REITs and institutional investors',
  'End-to-end support from acquisition to exit and portfolio management',
]

export default function RealEstate() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef = useRef<HTMLDivElement>(null)
  const whyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.re-hero__eyebrow', '.re-hero__title', '.re-hero__sub', '.re-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.re-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' }
        }
      )
      gsap.fromTo('.re-why__item',
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="re-page">

      {/* ── HERO ── */}
      <section className="re-hero" ref={heroRef}>
        <div className="re-hero__inner">
          {/* <p className="re-hero__eyebrow">Sectors &nbsp;·&nbsp; Consumer</p> */}
          <h1 className="re-hero__title">Real Estate<br /><span>Services</span></h1>
          <p className="re-hero__sub">
            Strategic financial, tax and compliance advisory for commercial real estate
            developers, REITs, institutional investors and property management firms
            across India.
          </p>
          {/* <div className="re-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="re-hero__stat">
                <span className="re-hero__stat-num">{s.num}</span>
                <span className="re-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="re-overview container">
        <div className="re-overview__inner">
          <div className="re-overview__text">
            <span className="re-tag">Our Approach</span>
            <h2 className="re-overview__title">Building Value Through Expert Advisory</h2>
            <p className="re-overview__body">
              India's real estate sector is undergoing rapid transformation with the rise
              of REITs, institutional capital and regulatory reforms. JHS provides
              integrated advisory that spans transaction structuring, tax optimisation,
              regulatory compliance and ongoing asset management support helping clients
              navigate complexity and unlock value at every stage of the real estate lifecycle.
            </p>
            <a href="/contact" className="re-btn re-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="re-overview__visual">
            <div className="re-overview__badge">
              {/* <span className="re-overview__badge-icon">🏢</span> */}
              <span className="re-overview__badge-label">Full lifecycle real estate advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="re-highlights container" ref={hlRef}>
        <div className="re-section-hd">
          <h2 className="re-section-hd__title">What We Offer</h2>
          <p className="re-section-hd__sub">
            Comprehensive services covering every financial and compliance need of real estate businesses.
          </p>
        </div>
        <div className="re-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="re-card">
              <div className="re-card__accent" />
              <div className="re-card__icon">{h.icon}</div>
              <h3 className="re-card__title">{h.title}</h3>
              <p className="re-card__desc">{h.desc}</p>
              {/* <button className="re-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button> */}
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="re-why container" ref={whyRef}>
        <div className="re-why__inner">
          <div className="re-why__left">
            <span className="re-tag">Why JHS</span>
            <h2 className="re-why__title">The JHS Advantage in Real Estate</h2>
            <p className="re-why__sub">
              We combine sector-specific regulatory knowledge with transaction
              experience to deliver outcomes that matter.
            </p>
            {/* <a href="/contact" className="re-btn re-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a> */}
          </div>
          <ul className="re-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="re-why__item">
                <span className="re-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="re-cta container">
        <div className="re-cta__inner">
          <div className="re-cta__content">
            <p className="re-cta__eyebrow">Get Started</p>
            <h2 className="re-cta__title">Ready to unlock value in your real estate portfolio?</h2>
            <p className="re-cta__sub">
              Speak with a JHS real estate specialist and get a tailored advisory proposal.
            </p>
          </div>
          {/* <a href="/contact" className="re-btn re-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a> */}
        </div>
      </section>

    </div>
  )
}

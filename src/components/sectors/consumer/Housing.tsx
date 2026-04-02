import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Building2, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Housing.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Building2 size={20} strokeWidth={1.5} />,
    title: 'Project Finance & Structuring',
    desc: 'Advisory on funding structures, debt-equity mix, and financial modelling for residential and affordable housing projects.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'RERA Compliance',
    desc: 'End-to-end support for RERA registration, project accounting, quarterly filings, and audit requirements across states.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST advisory on under-construction properties, affordable housing schemes, JDA transactions, and input tax credit optimisation.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Audit & Assurance',
    desc: 'Statutory audit, internal audit, and revenue recognition reviews for housing developers under Ind AS 115.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Land & JDA Advisory',
    desc: 'Tax and legal structuring for joint development agreements, land acquisition, slum rehabilitation, and redevelopment projects.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Affordable Housing Schemes',
    desc: 'Advisory on PMAY, CLSS, and government housing schemes — compliance, subsidy claims, and financial reporting.',
  },
]

const STATS = [
  { num: '40+', label: 'Housing Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'Pan India', label: 'RERA Coverage' },
]

const WHY = [
  'Deep expertise in RERA accounting, reporting, and audit obligations',
  'Specialist GST team handling JDA, under-construction, and redevelopment transactions',
  'Experience across affordable, mid-segment, and luxury housing developers',
  'Ind AS 115 revenue recognition advisory for complex project structures',
  'Trusted by leading Mumbai and pan-India housing developers',
]

export default function Housing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.hs-hero__eyebrow', '.hs-hero__title', '.hs-hero__sub', '.hs-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.hs-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.hs-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="hs-page">

      {/* ── HERO ── */}
      <section className="hs-hero" ref={heroRef}>
        <div className="hs-hero__inner">
          {/* <p className="hs-hero__eyebrow">Sectors &nbsp;·&nbsp; Consumer</p> */}
          <h1 className="hs-hero__title">Housing<br /><em>Services</em></h1>
          <p className="hs-hero__sub">
            Comprehensive financial, tax, and compliance advisory for housing
            developers, affordable housing projects, and real estate businesses
            — from RERA registration to project completion.
          </p>
          {/* <div className="hs-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="hs-hero__stat">
                <span className="hs-hero__stat-num">{s.num}</span>
                <span className="hs-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="hs-overview container">
        <div className="hs-overview__inner">
          <div className="hs-overview__text">
            <span className="hs-tag">Our Approach</span>
            <h2 className="hs-overview__title">Building Financial Foundations for Housing Businesses</h2>
            <p className="hs-overview__body">
              India's housing sector operates under one of the most complex regulatory
              environments — RERA, GST, income tax, and Ind AS all intersect in ways
              that demand specialist expertise. JHS provides integrated advisory that
              covers the full lifecycle of a housing project, from land acquisition
              structuring to final handover and project close-out.
            </p>
            <a href="/contact" className="hs-btn hs-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hs-overview__visual">
            <div className="hs-overview__badge">
              <span className="hs-overview__badge-icon">🏗️</span>
              <span className="hs-overview__badge-label">Full lifecycle housing advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="hs-highlights container" ref={hlRef}>
        <div className="hs-section-hd">
          <h2 className="hs-section-hd__title">What We Offer</h2>
          <p className="hs-section-hd__sub">
            Specialised services covering every financial and compliance need of a housing developer.
          </p>
        </div>
        <div className="hs-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="hs-card">
              <div className="hs-card__accent" />
              <div className="hs-card__icon">{h.icon}</div>
              <h3 className="hs-card__title">{h.title}</h3>
              <p className="hs-card__desc">{h.desc}</p>
              <button className="hs-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="hs-why container" ref={whyRef}>
        <div className="hs-why__inner">
          <div className="hs-why__left">
            <span className="hs-tag">Why JHS</span>
            <h2 className="hs-why__title">The JHS Advantage in Housing</h2>
            <p className="hs-why__sub">
              We combine sector-specific regulatory knowledge with hands-on
              project experience to deliver outcomes that matter.
            </p>
            <a href="/contact" className="hs-btn hs-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="hs-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="hs-why__item">
                <span className="hs-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hs-cta container">
        <div className="hs-cta__inner">
          <div className="hs-cta__content">
            <p className="hs-cta__eyebrow">Get Started</p>
            <h2 className="hs-cta__title">Ready to build on solid financial ground?</h2>
            <p className="hs-cta__sub">
              Speak with a JHS housing specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="hs-btn hs-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
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
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hs-eyebrow, .hs-title, .hs-subtitle, .hs-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.hs-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.hs-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="hs-page">

      {/* ── HERO ── */}
      <section className="hs-hero" ref={heroRef}>
        <div className="hs-hero__inner hs-container">
          <span className="hs-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="hs-title">Housing<br />Services</h1>
          <p className="hs-subtitle">
            Comprehensive financial, tax, and compliance advisory for housing developers,
            affordable housing projects, and real estate businesses — from RERA registration
            to project completion.
          </p>
          <div className="hs-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="hs-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="hs-main">

        {/* ── OVERVIEW ── */}
        <section className="hs-overview hs-container">
          <div className="hs-overview__inner">
            <div>
              <span className="hs-section-kicker">Our Approach</span>
              <h2 className="hs-overview__title">Building Financial Foundations for Housing Businesses</h2>
            </div>
            <div>
              <p className="hs-overview__body">
                India's housing sector operates under one of the most complex regulatory environments
                — RERA, GST, income tax, and Ind AS all intersect in ways that demand specialist expertise.
                JHS provides integrated advisory that covers the full lifecycle of a housing project,
                from land acquisition structuring to final handover and project close-out.
              </p>
              <a href="/contact" className="hs-btn hs-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="hs-services hs-container" ref={servRef}>
          <div className="hs-services__header">
            <div>
              <span className="hs-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Specialised services covering every financial and compliance need of a housing developer.</p>
          </div>
          <div className="hs-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="hs-card">
                <div className="hs-card__aside">
                  <span className="hs-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="hs-card__icon">{h.icon}</div>
                </div>
                <div className="hs-card__body">
                  <h3 className="hs-card__title">{h.title}</h3>
                  <p className="hs-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="hs-why hs-container" ref={whyRef}>
          <div className="hs-why__header">
            <span className="hs-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in Housing</h2>
            <p>We combine sector-specific regulatory knowledge with hands-on project experience to deliver outcomes that matter.</p>
            <a href="/contact" className="hs-btn hs-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="hs-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="hs-why__item">
                <div className="hs-why__item-header">
                  <span className="hs-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hs-cta hs-container">
          <div className="hs-cta__inner">
            <div className="hs-cta__content">
              <p className="hs-cta__eyebrow">Get Started</p>
              <h2 className="hs-cta__title">Ready to build on solid financial ground?</h2>
              <p className="hs-cta__sub">Speak with a JHS housing specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="hs-btn hs-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

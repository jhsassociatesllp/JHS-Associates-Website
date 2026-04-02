import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Landmark, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Banking.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Landmark size={20} strokeWidth={1.5} />,
    title: 'RBI Regulatory Compliance',
    desc: 'End-to-end support for RBI master circulars, FEMA compliance, CRR/SLR reporting, and prudential norms for banks and NBFCs.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Statutory & Concurrent Audit',
    desc: 'Statutory audit, concurrent audit, and revenue audit for scheduled commercial banks, cooperative banks, and RRBs under RBI guidelines.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Ind AS & Financial Reporting',
    desc: 'Transition support, ECL provisioning under Ind AS 109, IFRS 9 alignment, and financial statement preparation for banking entities.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax Advisory',
    desc: 'Income tax planning, TDS compliance, GST on financial services, and deferred tax accounting for banks and financial institutions.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Cross-border & FEMA',
    desc: 'FEMA advisory, external commercial borrowings, NRI banking compliance, and cross-border transaction structuring.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Risk & Internal Audit',
    desc: 'Risk-based internal audit, credit risk reviews, NPA management advisory, and internal financial controls assessment.',
  },
]

const STATS = [
  { num: '30+', label: 'Banking Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'RBI', label: 'Regulatory Expertise' },
]

const WHY = [
  'Deep knowledge of RBI master directions, circulars, and prudential frameworks',
  'Specialist Ind AS 109 and ECL provisioning expertise for banking entities',
  'Experienced across scheduled commercial banks, cooperative banks, and NBFCs',
  'Concurrent audit capability across large branch networks',
  'Trusted by public sector banks, private banks, and foreign bank branches',
]

export default function Banking() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.bk-hero__eyebrow', '.bk-hero__title', '.bk-hero__sub', '.bk-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.bk-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.bk-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="bk-page">

      {/* ── HERO ── */}
      <section className="bk-hero" ref={heroRef}>
        <div className="bk-hero__inner">
          {/* <p className="bk-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="bk-hero__title">Banking<br /><em>Services</em></h1>
          <p className="bk-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for banks,
            NBFCs, and financial institutions — built on deep knowledge of RBI
            frameworks, Ind AS, and banking sector regulations.
          </p>
          {/* <div className="bk-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="bk-hero__stat">
                <span className="bk-hero__stat-num">{s.num}</span>
                <span className="bk-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="bk-overview container">
        <div className="bk-overview__inner">
          <div className="bk-overview__text">
            <span className="bk-tag">Our Approach</span>
            <h2 className="bk-overview__title">Trusted Advisory for India's Banking Sector</h2>
            <p className="bk-overview__body">
              Banking institutions operate under India's most demanding regulatory
              environment — RBI prudential norms, Ind AS 109 provisioning, FEMA
              compliance, and concurrent audit obligations demand advisors with
              genuine sector depth. JHS brings two decades of banking sector
              experience, delivering audit, tax, and regulatory advisory that
              helps banks operate with confidence and precision.
            </p>
            <a href="/contact" className="bk-btn bk-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="bk-overview__visual">
            <div className="bk-overview__badge">
              <span className="bk-overview__badge-icon">🏦</span>
              <span className="bk-overview__badge-label">End-to-end banking advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="bk-highlights container" ref={hlRef}>
        <div className="bk-section-hd">
          <h2 className="bk-section-hd__title">What We Offer</h2>
          <p className="bk-section-hd__sub">
            Comprehensive services covering every audit, tax, and compliance need of banking institutions.
          </p>
        </div>
        <div className="bk-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="bk-card">
              <div className="bk-card__accent" />
              <div className="bk-card__icon">{h.icon}</div>
              <h3 className="bk-card__title">{h.title}</h3>
              <p className="bk-card__desc">{h.desc}</p>
              <button className="bk-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="bk-why container" ref={whyRef}>
        <div className="bk-why__inner">
          <div className="bk-why__left">
            <span className="bk-tag">Why JHS</span>
            <h2 className="bk-why__title">The JHS Advantage in Banking</h2>
            <p className="bk-why__sub">
              We combine regulatory depth with practical experience to deliver
              advisory that meets the exacting standards of India's banking sector.
            </p>
            <a href="/contact" className="bk-btn bk-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="bk-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="bk-why__item">
                <span className="bk-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bk-cta container">
        <div className="bk-cta__inner">
          <div className="bk-cta__content">
            <p className="bk-cta__eyebrow">Get Started</p>
            <h2 className="bk-cta__title">Ready to elevate your banking compliance?</h2>
            <p className="bk-cta__sub">
              Speak with a JHS banking specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="bk-btn bk-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
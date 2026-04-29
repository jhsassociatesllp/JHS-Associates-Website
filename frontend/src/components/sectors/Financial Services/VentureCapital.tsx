import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Rocket, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './VentureCapital.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Rocket size={20} strokeWidth={1.5} />,
    title: 'Fund Structuring & Setup',
    desc: 'Advisory on AIF Category I & II fund structuring, SEBI registration, trust deed drafting, and placement memorandum support for VC and growth-stage funds.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'SEBI AIF Compliance',
    desc: 'End-to-end compliance for SEBI-registered AIFs — Category I, II, and III — periodic filings, disclosure obligations, and SEBI inspection preparedness.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Fund Audit & Reporting',
    desc: 'Statutory audit of AIF schemes, NAV certification, investor reporting support, and Ind AS-compliant financial statement preparation for fund entities.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Pass-through Advisory',
    desc: 'Pass-through taxation structuring for AIF Category I & II, capital gains advisory for exits, carried interest taxation, and investor-level tax planning.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Cross-border & FEMA',
    desc: 'FEMA advisory for foreign LP investments, overseas investment by Indian funds, and cross-border structuring for funds with global limited partners.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Portfolio Company Advisory',
    desc: 'Tax and compliance advisory for VC-backed portfolio companies — ESOP structuring, fundraising due diligence support, and pre-IPO tax planning.',
  },
]

const STATS = [
  { num: '15+', label: 'VC/AIF Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'SEBI AIF', label: 'Registered Experts' },
]

const WHY = [
  'Specialist SEBI AIF compliance expertise across Category I, II, and III structures',
  'Pass-through tax advisory for fund managers and limited partners',
  'ESOP and equity structuring for VC-backed portfolio companies',
  'Cross-border fund structuring with FEMA and tax treaty advisory',
  'Trusted by marquee VC funds and emerging managers across India',
]

export default function VentureCapital() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.vc-hero__eyebrow', '.vc-hero__title', '.vc-hero__sub', '.vc-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.vc-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.vc-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="vc-page">

      {/* ── HERO ── */}
      <section className="vc-hero" ref={heroRef}>
        <div className="vc-hero__inner">
          {/* <p className="vc-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="vc-hero__title">Venture<br /><em>Capital</em></h1>
          <p className="vc-hero__sub">
            Specialist audit, tax, and regulatory compliance advisory for
            SEBI-registered AIFs, venture capital funds, and their portfolio
            companies — built on deep expertise in AIF regulations and fund taxation.
          </p>
          {/* <div className="vc-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="vc-hero__stat">
                <span className="vc-hero__stat-num">{s.num}</span>
                <span className="vc-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="vc-overview container">
        <div className="vc-overview__inner">
          <div className="vc-overview__text">
            <span className="vc-tag">Our Approach</span>
            <h2 className="vc-overview__title">Advisory Built for India's Venture Ecosystem</h2>
            <p className="vc-overview__body">
              India's venture capital ecosystem has grown rapidly — but regulatory
              complexity has grown with it. SEBI AIF regulations, pass-through
              taxation structures, FEMA compliance for foreign LPs, and portfolio
              company advisory all demand specialist expertise. JHS provides
              integrated advisory across the fund lifecycle — from structuring
              and registration through to exit and wind-down.
            </p>
            <a href="/contact" className="vc-btn vc-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="vc-overview__visual">
            <div className="vc-overview__badge">
              <span className="vc-overview__badge-icon">🚀</span>
              <span className="vc-overview__badge-label">Full lifecycle fund advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="vc-highlights container" ref={hlRef}>
        <div className="vc-section-hd">
          <h2 className="vc-section-hd__title">What We Offer</h2>
          <p className="vc-section-hd__sub">
            Comprehensive services for VC funds, AIF managers, and their portfolio companies.
          </p>
        </div>
        <div className="vc-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="vc-card">
              <div className="vc-card__accent" />
              <div className="vc-card__icon">{h.icon}</div>
              <h3 className="vc-card__title">{h.title}</h3>
              <p className="vc-card__desc">{h.desc}</p>
              <button className="vc-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="vc-why container" ref={whyRef}>
        <div className="vc-why__inner">
          <div className="vc-why__left">
            <span className="vc-tag">Why JHS</span>
            <h2 className="vc-why__title">The JHS Advantage in Venture Capital</h2>
            <p className="vc-why__sub">
              We understand the speed and ambition of the venture ecosystem —
              and deliver advisory that keeps fund managers focused on returns,
              not compliance.
            </p>
            <a href="/contact" className="vc-btn vc-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="vc-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="vc-why__item">
                <span className="vc-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="vc-cta container">
        <div className="vc-cta__inner">
          <div className="vc-cta__content">
            <p className="vc-cta__eyebrow">Get Started</p>
            <h2 className="vc-cta__title">Ready to build your fund on solid foundations?</h2>
            <p className="vc-cta__sub">
              Speak with a JHS venture capital specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="vc-btn vc-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
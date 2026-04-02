import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Heart, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './NGO.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Heart size={20} strokeWidth={1.5} />,
    title: 'FCRA Compliance',
    desc: 'End-to-end Foreign Contribution Regulation Act compliance — FCRA registration, renewal, annual returns, designated account management, and MHA reporting obligations.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Statutory & Trust Audit',
    desc: 'Statutory audit of NGOs, charitable trusts, and Section 8 companies — aligned with Income Tax Act requirements and donor reporting standards.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax Exemption Advisory',
    desc: 'Section 12A/12AB registration, 80G approval, 80GGA and DPIIT advisory, and ongoing compliance to maintain tax-exempt status for charitable entities.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'CSR Fund Utilisation',
    desc: 'Advisory on CSR fund receipt, utilisation reporting, Form CSR-2 compliance, and impact reporting frameworks for NGOs receiving corporate CSR contributions.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Grant Management & Reporting',
    desc: 'Grant accounting, utilisation certificates, fund accountability frameworks, and donor reporting support for international and bilateral grant recipients.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Registration & Structuring',
    desc: 'Advisory on optimal legal structure — Section 8 company, public charitable trust, or society — and end-to-end registration support with relevant authorities.',
  },
]

const STATS = [
  { num: '50+', label: 'NGO Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'FCRA', label: 'Compliance Experts' },
]

const WHY = [
  'Deep expertise in FCRA compliance, MHA reporting, and foreign fund management',
  'Specialist knowledge of Section 12AB, 80G, and CSR regulatory frameworks',
  'Trusted by international NGOs, bilateral aid recipients, and Indian foundations',
  'Grant accounting and utilisation certificate capability for diverse donor types',
  'Sensitive and confidential advisory aligned with the mission of each organisation',
]

export default function NGO() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.ngo-hero__eyebrow', '.ngo-hero__title', '.ngo-hero__sub', '.ngo-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.ngo-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.ngo-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="ngo-page">

      {/* ── HERO ── */}
      <section className="ngo-hero" ref={heroRef}>
        <div className="ngo-hero__inner">
          {/* <p className="ngo-hero__eyebrow">Sectors &nbsp;·&nbsp; Other</p> */}
          <h1 className="ngo-hero__title">NGO<br /><em>Services</em></h1>
          <p className="ngo-hero__sub">
            Specialist audit, tax, and regulatory compliance advisory for
            non-governmental organisations, charitable trusts, and Section 8
            companies — built on deep expertise in FCRA, 12AB, and CSR frameworks.
          </p>
          {/* <div className="ngo-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="ngo-hero__stat">
                <span className="ngo-hero__stat-num">{s.num}</span>
                <span className="ngo-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="ngo-overview container">
        <div className="ngo-overview__inner">
          <div className="ngo-overview__text">
            <span className="ngo-tag">Our Approach</span>
            <h2 className="ngo-overview__title">Advisory That Serves the Mission</h2>
            <p className="ngo-overview__body">
              NGOs and charitable organisations operate under unique regulatory
              obligations — FCRA compliance, 12AB/80G registration, CSR fund
              management, and grant accountability frameworks all demand specialist
              expertise. JHS provides advisory that understands the purpose-driven
              nature of the sector, helping organisations focus on their mission
              while we manage the compliance complexity behind the scenes.
            </p>
            <a href="/contact" className="ngo-btn ngo-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="ngo-overview__visual">
            <div className="ngo-overview__badge">
              <span className="ngo-overview__badge-icon">🤝</span>
              <span className="ngo-overview__badge-label">Purpose-driven advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="ngo-highlights container" ref={hlRef}>
        <div className="ngo-section-hd">
          <h2 className="ngo-section-hd__title">What We Offer</h2>
          <p className="ngo-section-hd__sub">
            Comprehensive services covering every compliance, audit, and tax need of NGOs and charitable entities.
          </p>
        </div>
        <div className="ngo-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="ngo-card">
              <div className="ngo-card__accent" />
              <div className="ngo-card__icon">{h.icon}</div>
              <h3 className="ngo-card__title">{h.title}</h3>
              <p className="ngo-card__desc">{h.desc}</p>
              <button className="ngo-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="ngo-why container" ref={whyRef}>
        <div className="ngo-why__inner">
          <div className="ngo-why__left">
            <span className="ngo-tag">Why JHS</span>
            <h2 className="ngo-why__title">The JHS Advantage for NGOs</h2>
            <p className="ngo-why__sub">
              We understand that compliance is in service of the mission —
              and we deliver advisory that protects organisations so they
              can focus on the work that matters.
            </p>
            <a href="/contact" className="ngo-btn ngo-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="ngo-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="ngo-why__item">
                <span className="ngo-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ngo-cta container">
        <div className="ngo-cta__inner">
          <div className="ngo-cta__content">
            <p className="ngo-cta__eyebrow">Get Started</p>
            <h2 className="ngo-cta__title">Ready to protect your organisation's compliance?</h2>
            <p className="ngo-cta__sub">
              Speak with a JHS NGO specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="ngo-btn ngo-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
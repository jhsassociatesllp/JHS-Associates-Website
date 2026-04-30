import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, PieChart, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './MutualFunds.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <PieChart size={20} strokeWidth={1.5} />,
    title: 'SEBI & AMFI Compliance',
    desc: 'End-to-end compliance support for AMCs and fund houses — SEBI (Mutual Funds) Regulations, AMFI guidelines, and NAV reporting obligations.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Fund Audit & Assurance',
    desc: 'Statutory audit of mutual fund schemes, trustee audit support, and half-yearly portfolio review as mandated by SEBI regulations.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Financial Reporting & Ind AS',
    desc: 'Scheme financial statements, AMC consolidated reporting, and Ind AS advisory for asset management companies and their holding structures.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax Advisory for AMCs',
    desc: 'Income tax planning, GST on fund management fees, pass-through taxation structures, and deferred tax advisory for AMC entities.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'FoF & Offshore Fund Structuring',
    desc: 'Advisory on Fund of Funds structures, overseas investment compliance, FEMA regulations, and cross-border distribution arrangements.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Risk & Internal Controls',
    desc: 'Internal audit, risk-based compliance reviews, and internal financial controls assessment for AMC operations and scheme management.',
  },
]

const STATS = [
  { num: '20+', label: 'AMC Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'SEBI', label: 'Regulatory Expertise' },
]

const WHY = [
  'Specialist knowledge of SEBI Mutual Funds Regulations and AMFI guidelines',
  'Deep experience in scheme audits across equity, debt, hybrid, and ETF categories',
  'Trusted by AMCs for SEBI inspection preparedness and regulatory advisory',
  'Integrated tax, audit, and compliance delivery under one engagement team',
  'FoF and offshore fund structuring expertise for international AMC operations',
]

export default function MutualFunds() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.mf-hero__eyebrow', '.mf-hero__title', '.mf-hero__sub', '.mf-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.mf-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.mf-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="mf-page">

      {/* ── HERO ── */}
      <section className="mf-hero" ref={heroRef}>
        <div className="mf-hero__inner">
          {/* <p className="mf-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="mf-hero__title">Mutual Funds<br /><em>Services</em></h1>
          <p className="mf-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for asset
            management companies, fund trustees, and mutual fund distributors —
            built on deep expertise in SEBI regulations and fund accounting.
          </p>
          {/* <div className="mf-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="mf-hero__stat">
                <span className="mf-hero__stat-num">{s.num}</span>
                <span className="mf-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="mf-overview container">
        <div className="mf-overview__inner">
          <div className="mf-overview__text">
            <span className="mf-tag">Our Approach</span>
            <h2 className="mf-overview__title">Trusted Advisory for India's Asset Management Industry</h2>
            <p className="mf-overview__body">
              India's mutual fund industry manages over ₹50 lakh crore in assets and
              operates under SEBI's rigorous regulatory framework. AMCs face complex
              scheme audit requirements, NAV computation obligations, tax pass-through
              structures, and evolving AMFI guidelines. JHS brings specialist expertise
              to help AMCs and fund houses remain compliant, audit-ready, and
              operationally sound.
            </p>
            <a href="/contact" className="mf-btn mf-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="mf-overview__visual">
            <div className="mf-overview__badge">
              <span className="mf-overview__badge-icon">📊</span>
              <span className="mf-overview__badge-label">End-to-end AMC advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="mf-highlights container" ref={hlRef}>
        <div className="mf-section-hd">
          <h2 className="mf-section-hd__title">What We Offer</h2>
          <p className="mf-section-hd__sub">
            Comprehensive services covering every audit, tax, and compliance need of AMCs and fund houses.
          </p>
        </div>
        <div className="mf-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="mf-card">
              <div className="mf-card__accent" />
              <div className="mf-card__icon">{h.icon}</div>
              <h3 className="mf-card__title">{h.title}</h3>
              <p className="mf-card__desc">{h.desc}</p>
              <button className="mf-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="mf-why container" ref={whyRef}>
        <div className="mf-why__inner">
          <div className="mf-why__left">
            <span className="mf-tag">Why JHS</span>
            <h2 className="mf-why__title">The JHS Advantage in Mutual Funds</h2>
            <p className="mf-why__sub">
              We combine deep regulatory knowledge with practical fund audit
              experience to deliver advisory that meets the exacting standards
              of India's mutual fund industry.
            </p>
            <a href="/contact" className="mf-btn mf-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="mf-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="mf-why__item">
                <span className="mf-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mf-cta container">
        <div className="mf-cta__inner">
          <div className="mf-cta__content">
            <p className="mf-cta__eyebrow">Get Started</p>
            <h2 className="mf-cta__title">Ready to strengthen your fund compliance?</h2>
            <p className="mf-cta__sub">
              Speak with a JHS mutual funds specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="mf-btn mf-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
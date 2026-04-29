import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Users, FileText, ShieldCheck, BarChart2, Scale, Heart } from 'lucide-react'
import './FamilyOrientedBusinesses.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: 'Succession Planning',
    desc: 'Structured succession advisory to ensure smooth generational transitions — legal structuring, family constitutions, and governance frameworks.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Family Settlement & Partition',
    desc: 'Expert advisory on family business partitions, settlement deeds, asset distribution, and tax-efficient restructuring of family-held entities.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Wealth & Estate Planning',
    desc: 'Holistic wealth structuring, trust formation, will drafting advisory, and estate planning to protect and preserve family wealth across generations.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Business Restructuring',
    desc: 'Tax-efficient demergers, holding company structures, group reorganisations, and consolidation advisory for complex family business groups.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & Compliance',
    desc: 'HUF taxation, trust taxation, income tax planning for promoter families, and compliance management across multiple family-held entities.',
  },
  {
    icon: <Heart size={20} strokeWidth={1.5} />,
    title: 'Governance & Family Office',
    desc: 'Family council advisory, governance charter design, and family office setup support for multi-generational business families.',
  },
]

const STATS = [
  { num: '60+', label: 'Family Business Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: '3rd Gen', label: 'Clients Served' },
]

const WHY = [
  'Deep expertise in HUF structures, family trusts, and succession frameworks',
  'Sensitive and confidential advisory for complex family dynamics',
  'Proven track record in multi-generational business family engagements',
  'Integrated tax, legal structuring, and governance advisory under one team',
  'Trusted across prominent Mumbai and pan-India business families',
]

export default function FamilyOrientedBusinesses() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.fb-hero__eyebrow', '.fb-hero__title', '.fb-hero__sub', '.fb-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.fb-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.fb-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="fb-page">

      {/* ── HERO ── */}
      <section className="fb-hero" ref={heroRef}>
        <div className="fb-hero__inner">
          {/* <p className="fb-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="fb-hero__title">Family Oriented<br /><em>Businesses</em></h1>
          <p className="fb-hero__sub">
            Trusted advisory for family-owned businesses and promoter families —
            succession planning, wealth structuring, and governance frameworks
            built on discretion, expertise, and long-term relationships.
          </p>
          {/* <div className="fb-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="fb-hero__stat">
                <span className="fb-hero__stat-num">{s.num}</span>
                <span className="fb-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="fb-overview container">
        <div className="fb-overview__inner">
          <div className="fb-overview__text">
            <span className="fb-tag">Our Approach</span>
            <h2 className="fb-overview__title">Advisory Built on Trust, Not Just Expertise</h2>
            <p className="fb-overview__body">
              Family businesses are India's economic backbone — but they face unique
              challenges that go beyond compliance. Succession disputes, wealth
              preservation across generations, governance gaps, and complex holding
              structures all require advisors who understand both the commercial and
              personal dimensions of family enterprise. JHS brings two decades of
              trusted, confidential advisory to India's leading business families.
            </p>
            <a href="/contact" className="fb-btn fb-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="fb-overview__visual">
            <div className="fb-overview__badge">
              <span className="fb-overview__badge-icon">🏛️</span>
              <span className="fb-overview__badge-label">Trusted family business advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="fb-highlights container" ref={hlRef}>
        <div className="fb-section-hd">
          <h2 className="fb-section-hd__title">What We Offer</h2>
          <p className="fb-section-hd__sub">
            Comprehensive services covering every financial, governance, and succession need of family businesses.
          </p>
        </div>
        <div className="fb-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="fb-card">
              <div className="fb-card__accent" />
              <div className="fb-card__icon">{h.icon}</div>
              <h3 className="fb-card__title">{h.title}</h3>
              <p className="fb-card__desc">{h.desc}</p>
              <button className="fb-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="fb-why container" ref={whyRef}>
        <div className="fb-why__inner">
          <div className="fb-why__left">
            <span className="fb-tag">Why JHS</span>
            <h2 className="fb-why__title">The JHS Advantage for Family Businesses</h2>
            <p className="fb-why__sub">
              We have been trusted by India's business families for two decades —
              because we treat every engagement with the discretion and care it deserves.
            </p>
            <a href="/contact" className="fb-btn fb-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="fb-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="fb-why__item">
                <span className="fb-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="fb-cta container">
        <div className="fb-cta__inner">
          <div className="fb-cta__content">
            <p className="fb-cta__eyebrow">Get Started</p>
            <h2 className="fb-cta__title">Ready to secure your family's financial future?</h2>
            <p className="fb-cta__sub">
              Speak with a JHS family business specialist — in complete confidence.
            </p>
          </div>
          <a href="/contact" className="fb-btn fb-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
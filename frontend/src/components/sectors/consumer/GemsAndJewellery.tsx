import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ShieldCheck, FileText, Globe2, BarChart2, Scale, Gem } from 'lucide-react'
import './GemsAndJewellery.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Gem size={20} strokeWidth={1.5} />,
    title: 'Valuation & Certification',
    desc: 'Independent valuation of gems, diamonds, and jewellery for insurance, estate planning, business reporting, and dispute resolution.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'End-to-end support for BIS hallmarking, SEBI regulations for listed jewellers, KYC/AML compliance, and PMLA obligations.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Import & Export Advisory',
    desc: 'Customs duty optimisation, SEZ and EOU structuring, foreign trade policy advisory, and FEMA compliance for gem & jewellery exporters.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Inventory & Stock Audit',
    desc: 'Specialised stock verification, consignment stock audits, and inventory reconciliation for retail jewellers and wholesale traders.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Tax Advisory',
    desc: 'GST structuring for making charges, job work, and bullion transactions. Income tax planning for family-owned jewellery businesses.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'Business Structuring',
    desc: 'Succession planning, family settlement, and restructuring advisory for multi-generational jewellery businesses across India.',
  },
]

const STATS = [
  { num: '30+', label: 'Jewellery Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'End-to-End', label: 'Advisory Coverage' },
]

const WHY = [
  'Sector-specific knowledge of hallmarking, SEBI, and BIS regulations',
  'Deep expertise in GST complexities unique to bullion and making charges',
  'Trusted by family jewellery businesses for succession and restructuring',
  'Specialised stock audit and inventory reconciliation capabilities',
  'Cross-border trade and export advisory for SEEPZ and SEZ operators',
]

export default function GemsAndJewellery() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.gj-hero__eyebrow', '.gj-hero__title', '.gj-hero__sub', '.gj-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.gj-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.gj-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="gj-page">

      {/* ── HERO ── */}
      <section className="gj-hero" ref={heroRef}>
        <div className="gj-hero__inner">
          {/* <p className="gj-hero__eyebrow">Sectors &nbsp;·&nbsp; Consumer</p> */}
          <h1 className="gj-hero__title">Gems &amp; Jewellery<br /><em>Services</em></h1>
          <p className="gj-hero__sub">
            Specialised financial, tax, and compliance advisory for gems traders,
            jewellery manufacturers, and retail chains — trusted by India's leading
            jewellery businesses.
          </p>
          {/* <div className="gj-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="gj-hero__stat">
                <span className="gj-hero__stat-num">{s.num}</span>
                <span className="gj-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="gj-overview container">
        <div className="gj-overview__inner">
          <div className="gj-overview__text">
            <span className="gj-tag">Our Approach</span>
            <h2 className="gj-overview__title">Precision Advisory for a Precision Industry</h2>
            <p className="gj-overview__body">
              The gems and jewellery sector operates under intense regulatory scrutiny —
              PMLA, BIS hallmarking, customs duties, and complex GST rules create a
              compliance landscape that demands specialist knowledge. JHS brings
              decades of sector-specific experience to help jewellery businesses
              stay compliant, optimise tax, and plan for long-term growth.
            </p>
            <a href="/contact" className="gj-btn gj-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="gj-overview__visual">
            <div className="gj-overview__badge">
              <span className="gj-overview__badge-icon">💎</span>
              <span className="gj-overview__badge-label">Specialist gems &amp; jewellery advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="gj-highlights container" ref={hlRef}>
        <div className="gj-section-hd">
          <h2 className="gj-section-hd__title">What We Offer</h2>
          <p className="gj-section-hd__sub">
            Comprehensive services built for the unique regulatory and commercial demands of gems &amp; jewellery.
          </p>
        </div>
        <div className="gj-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="gj-card">
              <div className="gj-card__accent" />
              <div className="gj-card__icon">{h.icon}</div>
              <h3 className="gj-card__title">{h.title}</h3>
              <p className="gj-card__desc">{h.desc}</p>
              <button className="gj-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="gj-why container" ref={whyRef}>
        <div className="gj-why__inner">
          <div className="gj-why__left">
            <span className="gj-tag">Why JHS</span>
            <h2 className="gj-why__title">The JHS Advantage in Gems &amp; Jewellery</h2>
            <p className="gj-why__sub">
              We understand the heritage, complexity, and commercial sensitivity of
              India's jewellery sector like few others.
            </p>
            <a href="/contact" className="gj-btn gj-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="gj-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="gj-why__item">
                <span className="gj-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="gj-cta container">
        <div className="gj-cta__inner">
          <div className="gj-cta__content">
            <p className="gj-cta__eyebrow">Get Started</p>
            <h2 className="gj-cta__title">Ready to bring precision to your compliance?</h2>
            <p className="gj-cta__sub">
              Speak with a JHS gems &amp; jewellery specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="gj-btn gj-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
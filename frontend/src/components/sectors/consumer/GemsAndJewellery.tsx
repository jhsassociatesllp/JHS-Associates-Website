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
  const servRef = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gj-eyebrow, .gj-title, .gj-subtitle, .gj-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )
      gsap.fromTo('.gj-card',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: servRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.gj-why__item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="gj-page">

      {/* ── HERO ── */}
      <section className="gj-hero" ref={heroRef}>
        <div className="gj-hero__inner gj-container">
          <span className="gj-eyebrow">Sectors &nbsp;·&nbsp; Consumer</span>
          <h1 className="gj-title">Gems &amp; Jewellery<br />Services</h1>
          <p className="gj-subtitle">
            Specialised financial, tax, and compliance advisory for gems traders,
            jewellery manufacturers, and retail chains — trusted by India's leading
            jewellery businesses.
          </p>
          <div className="gj-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="gj-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="gj-main">

        {/* ── OVERVIEW ── */}
        <section className="gj-overview gj-container">
          <div className="gj-overview__inner">
            <div>
              <span className="gj-section-kicker">Our Approach</span>
              <h2 className="gj-overview__title">Precision Advisory for a Precision Industry</h2>
            </div>
            <div>
              <p className="gj-overview__body">
                The gems and jewellery sector operates under intense regulatory scrutiny — PMLA,
                BIS hallmarking, customs duties, and complex GST rules create a compliance landscape
                that demands specialist knowledge. JHS brings decades of sector-specific experience
                to help jewellery businesses stay compliant, optimise tax, and plan for long-term growth.
              </p>
              <a href="/contact" className="gj-btn gj-btn--solid">
                Talk to Our Experts <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="gj-services gj-container" ref={servRef}>
          <div className="gj-services__header">
            <div>
              <span className="gj-section-kicker">What We Offer</span>
              <h2>Our Services</h2>
            </div>
            <p>Comprehensive services built for the unique regulatory and commercial demands of gems &amp; jewellery.</p>
          </div>
          <div className="gj-grid">
            {HIGHLIGHTS.map((h, i) => (
              <article key={i} className="gj-card">
                <div className="gj-card__aside">
                  <span className="gj-card__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="gj-card__icon">{h.icon}</div>
                </div>
                <div className="gj-card__body">
                  <h3 className="gj-card__title">{h.title}</h3>
                  <p className="gj-card__desc">{h.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY JHS ── */}
        <section className="gj-why gj-container" ref={whyRef}>
          <div className="gj-why__header">
            <span className="gj-section-kicker">Why JHS</span>
            <h2>The JHS Advantage in Gems &amp; Jewellery</h2>
            <p>We understand the heritage, complexity, and commercial sensitivity of India's jewellery sector like few others.</p>
            <a href="/contact" className="gj-btn gj-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="gj-why__grid">
            {WHY.map((item, i) => (
              <div key={i} className="gj-why__item">
                <div className="gj-why__item-header">
                  <span className="gj-why__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="gj-cta gj-container">
          <div className="gj-cta__inner">
            <div className="gj-cta__content">
              <p className="gj-cta__eyebrow">Get Started</p>
              <h2 className="gj-cta__title">Ready to bring precision to your compliance?</h2>
              <p className="gj-cta__sub">Speak with a JHS gems &amp; jewellery specialist and get a tailored advisory proposal.</p>
            </div>
            <a href="/contact" className="gj-btn gj-btn--cta">
              Contact Us <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

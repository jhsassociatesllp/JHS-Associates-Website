import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, HeartPulse, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './HealthCare.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <HeartPulse size={20} strokeWidth={1.5} />,
    title: 'Statutory & Internal Audit',
    desc: 'Statutory audit, internal audit, and revenue assurance for hospitals, nursing homes, diagnostic centres, and pharmaceutical companies — aligned with sector-specific accounting norms.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'GST & Indirect Tax',
    desc: 'GST advisory for healthcare entities — exemptions on medical services, ITC on capital equipment, pharmacy GST compliance, and health insurance transaction structuring.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'NABH, NABL, and clinical establishment compliance advisory — statutory registrations, licensing, and compliance management for healthcare facilities across India.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Tax & Structuring',
    desc: 'Income tax planning for hospitals, medical trusts, and pharma companies — including Section 80IC and 80IB deductions, MAT advisory, and transfer pricing for healthcare groups.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Medical Tourism & Cross-border',
    desc: 'Advisory on medical tourism structuring, FEMA compliance for foreign patient revenue, and cross-border healthcare service arrangements for hospital groups.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'M&A & Due Diligence',
    desc: 'Tax and financial due diligence, valuation advisory, and deal structuring for healthcare M&A — hospital acquisitions, pharma deals, and PE investment into healthcare.',
  },
]

const WHY = [
  'Deep sectoral knowledge across hospitals, diagnostics, pharma, and medical devices',
  'Specialist GST team for healthcare service exemptions and ITC optimisation',
  'Transfer pricing expertise for large hospital groups and pharma multinationals',
  'NABH/NABL compliance and clinical establishment advisory across all states',
  'Trusted by leading hospital chains, diagnostic labs, and pharmaceutical companies',
]

export default function HealthCare() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.hc-hero__eyebrow', '.hc-hero__title', '.hc-hero__sub', '.hc-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.hc-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.hc-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="hc-page">

      {/* ── HERO ── */}
      <section className="hc-hero" ref={heroRef}>
        <div className="hc-hero__inner">
          {/* <p className="hc-hero__eyebrow">Sectors &nbsp;·&nbsp; Other</p> */}
          <h1 className="hc-hero__title">Healthcare<br /><em>Services</em></h1>
          <p className="hc-hero__sub">
            Specialised audit, tax, and compliance advisory for hospitals,
            diagnostic centres, pharmaceutical companies, and healthcare
            groups — built on deep expertise in healthcare sector regulations
            and GST exemption frameworks.
          </p>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="hc-overview container">
        <div className="hc-overview__inner">
          <div className="hc-overview__text">
            <span className="hc-tag">Our Approach</span>
            <h2 className="hc-overview__title">Advisory That Supports Better Healthcare</h2>
            <p className="hc-overview__body">
              India's healthcare sector operates under a unique blend of social
              purpose and commercial reality — complex GST exemption frameworks,
              NABH regulatory requirements, transfer pricing for hospital groups,
              and evolving pharma tax structures demand specialist advisors.
              JHS brings deep healthcare sector expertise, helping hospitals,
              diagnostics, and pharma companies manage their compliance burden
              so they can focus on patient outcomes.
            </p>
            <a href="/contact" className="hc-btn hc-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hc-overview__visual">
            <div className="hc-overview__badge">
              <span className="hc-overview__badge-icon">🏥</span>
              <span className="hc-overview__badge-label">Full-spectrum healthcare advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="hc-highlights container" ref={hlRef}>
        <div className="hc-section-hd">
          <h2 className="hc-section-hd__title">What We Offer</h2>
          <p className="hc-section-hd__sub">
            Comprehensive services covering every financial, tax, and compliance need of healthcare businesses.
          </p>
        </div>
        <div className="hc-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="hc-card">
              <div className="hc-card__accent" />
              <div className="hc-card__icon">{h.icon}</div>
              <h3 className="hc-card__title">{h.title}</h3>
              <p className="hc-card__desc">{h.desc}</p>
              <button className="hc-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="hc-why container" ref={whyRef}>
        <div className="hc-why__inner">
          <div className="hc-why__left">
            <span className="hc-tag">Why JHS</span>
            <h2 className="hc-why__title">The JHS Advantage in Healthcare</h2>
            <p className="hc-why__sub">
              We understand the dual mandate of healthcare — commercial
              sustainability and social purpose — and deliver advisory
              that serves both.
            </p>
            <a href="/contact" className="hc-btn hc-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="hc-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="hc-why__item">
                <span className="hc-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hc-cta container">
        <div className="hc-cta__inner">
          <div className="hc-cta__content">
            <p className="hc-cta__eyebrow">Get Started</p>
            <h2 className="hc-cta__title">Ready to strengthen your healthcare compliance?</h2>
            <p className="hc-cta__sub">
              Speak with a JHS healthcare specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="hc-btn hc-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
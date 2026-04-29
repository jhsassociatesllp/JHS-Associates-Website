import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Monitor, FileText, ShieldCheck, BarChart2, Scale, Cpu } from 'lucide-react'
import './ITSystemAudit.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Monitor size={20} strokeWidth={1.5} />,
    title: 'IT General Controls Audit',
    desc: 'Comprehensive review of IT general controls — access management, change management, IT operations, and business continuity aligned with COBIT and ISO 27001 frameworks.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Cybersecurity Assessment',
    desc: 'Vulnerability assessments, penetration testing advisory, and cybersecurity framework reviews to identify and remediate risks across enterprise IT environments.',
  },
  {
    icon: <Cpu size={20} strokeWidth={1.5} />,
    title: 'ERP & Application Controls',
    desc: 'Application controls review for SAP, Oracle, Tally, and custom ERP systems — covering input, processing, and output controls for financial reporting integrity.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Data Analytics & CAAT',
    desc: 'Computer-Assisted Audit Techniques (CAAT) using ACL, IDEA, and Python-based tools for large-dataset analysis, exception reporting, and fraud detection.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Regulatory IT Compliance',
    desc: 'IT compliance reviews for RBI, SEBI, IRDAI, and DPDPA — mapping technology controls to regulatory requirements and identifying compliance gaps.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'IS Audit & SOX IT Controls',
    desc: 'Information Systems audit, SOX IT general controls testing, and internal audit of IT infrastructure for listed companies and MNC subsidiaries.',
  },
]

const STATS = [
  { num: '100+', label: 'IT Audits Completed' },
  { num: '20+', label: 'Years Experience' },
  { num: 'CISA', label: 'Certified Team' },
]

const WHY = [
  'CISA-certified professionals with deep ERP and enterprise IT audit experience',
  'Specialist CAAT capability for large-volume data analysis and fraud detection',
  'Regulatory IT compliance expertise across RBI, SEBI, IRDAI, and DPDPA',
  'SOX IT controls testing experience for listed companies and MNC subsidiaries',
  'Integrated IT audit delivery alongside financial audit and internal audit teams',
]

export default function ITSystemAudit() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.it-hero__eyebrow', '.it-hero__title', '.it-hero__sub', '.it-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.it-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.it-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="it-page">

      {/* ── HERO ── */}
      <section className="it-hero" ref={heroRef}>
        <div className="it-hero__inner">
          {/* <p className="it-hero__eyebrow">Sectors &nbsp;·&nbsp; Media &amp; Technology</p> */}
          <h1 className="it-hero__title">IT System<br /><em>Audit</em></h1>
          <p className="it-hero__sub">
            Specialist IT audit, cybersecurity assessment, and technology controls
            advisory for enterprises — built on CISA-certified expertise and
            deep knowledge of Indian regulatory IT compliance frameworks.
          </p>
          {/* <div className="it-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="it-hero__stat">
                <span className="it-hero__stat-num">{s.num}</span>
                <span className="it-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="it-overview container">
        <div className="it-overview__inner">
          <div className="it-overview__text">
            <span className="it-tag">Our Approach</span>
            <h2 className="it-overview__title">Technology Controls That Give You Confidence</h2>
            <p className="it-overview__body">
              As businesses become increasingly technology-dependent, IT audit has
              moved from a nice-to-have to a board-level priority. Regulatory
              mandates from RBI, SEBI, and IRDAI, combined with India's Digital
              Personal Data Protection Act, have made robust IT controls essential.
              JHS brings CISA-certified specialists who understand both the
              technology and the business — delivering IT audit that creates
              genuine assurance, not just a checklist.
            </p>
            <a href="/contact" className="it-btn it-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="it-overview__visual">
            <div className="it-overview__badge">
              <span className="it-overview__badge-icon">🖥️</span>
              <span className="it-overview__badge-label">Enterprise IT audit advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="it-highlights container" ref={hlRef}>
        <div className="it-section-hd">
          <h2 className="it-section-hd__title">What We Offer</h2>
          <p className="it-section-hd__sub">
            Comprehensive IT audit and technology controls services for enterprises and regulated entities.
          </p>
        </div>
        <div className="it-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="it-card">
              <div className="it-card__accent" />
              <div className="it-card__icon">{h.icon}</div>
              <h3 className="it-card__title">{h.title}</h3>
              <p className="it-card__desc">{h.desc}</p>
              <button className="it-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="it-why container" ref={whyRef}>
        <div className="it-why__inner">
          <div className="it-why__left">
            <span className="it-tag">Why JHS</span>
            <h2 className="it-why__title">The JHS Advantage in IT System Audit</h2>
            <p className="it-why__sub">
              We bridge the gap between technology and assurance — combining
              CISA-certified expertise with deep regulatory knowledge to deliver
              IT audit that boards and regulators trust.
            </p>
            <a href="/contact" className="it-btn it-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="it-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="it-why__item">
                <span className="it-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="it-cta container">
        <div className="it-cta__inner">
          <div className="it-cta__content">
            <p className="it-cta__eyebrow">Get Started</p>
            <h2 className="it-cta__title">Ready to strengthen your IT controls?</h2>
            <p className="it-cta__sub">
              Speak with a JHS IT audit specialist and get a tailored assessment proposal.
            </p>
          </div>
          <a href="/contact" className="it-btn it-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
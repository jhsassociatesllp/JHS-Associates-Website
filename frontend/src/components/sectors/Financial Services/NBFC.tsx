import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Building2, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './NBFC.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'RBI Regulatory Compliance',
    desc: 'End-to-end compliance support for NBFC-Base, Middle, and Upper Layer entities — RBI master directions, CRAR requirements, FLD reporting, and scale-based regulations.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Statutory & Internal Audit',
    desc: 'Statutory audit, internal audit, and concurrent audit for NBFCs — including asset quality reviews, NPA classification, and ECL provisioning under Ind AS 109.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Ind AS & Financial Reporting',
    desc: 'Ind AS transition support, IFRS 9 / Ind AS 109 expected credit loss modelling, and financial statement preparation for NBFC-ICC, NBFC-MFI, and HFC entities.',
  },
  {
    icon: <Building2 size={20} strokeWidth={1.5} />,
    title: 'Registration & Licensing',
    desc: 'Advisory and support for new NBFC registration with RBI, category upgrades, change-of-control approvals, and principal business criteria compliance.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Tax & GST Advisory',
    desc: 'Income tax planning, GST on financial services, interest income taxation, and TDS compliance for NBFCs across lending, leasing, and investment categories.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'PMLA & Risk Compliance',
    desc: 'PMLA compliance framework design, KYC/AML program advisory, FIU-IND reporting, and fair practices code implementation for NBFC entities.',
  },
]

const STATS = [
  { num: '35+', label: 'NBFC Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'RBI SBR', label: 'Framework Experts' },
]

const WHY = [
  'Deep expertise in RBI\'s Scale-Based Regulation framework for NBFCs',
  'Specialist Ind AS 109 ECL modelling and provisioning advisory',
  'Experience across NBFC-ICC, NBFC-MFI, HFC, and NBFC-Factor categories',
  'NBFC registration and RBI liaison support with proven success track record',
  'Integrated tax, audit, and regulatory compliance under one engagement',
]

export default function NBFC() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.nb-hero__eyebrow', '.nb-hero__title', '.nb-hero__sub', '.nb-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.nb-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.nb-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="nb-page">

      {/* ── HERO ── */}
      <section className="nb-hero" ref={heroRef}>
        <div className="nb-hero__inner">
          {/* <p className="nb-hero__eyebrow">Sectors &nbsp;·&nbsp; Financial Services</p> */}
          <h1 className="nb-hero__title">NBFC<br /><em>Services</em></h1>
          <p className="nb-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for
            Non-Banking Financial Companies — built on deep expertise in RBI's
            Scale-Based Regulation framework and Ind AS 109 provisioning.
          </p>
          {/* <div className="nb-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="nb-hero__stat">
                <span className="nb-hero__stat-num">{s.num}</span>
                <span className="nb-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="nb-overview container">
        <div className="nb-overview__inner">
          <div className="nb-overview__text">
            <span className="nb-tag">Our Approach</span>
            <h2 className="nb-overview__title">Expert Advisory for India's NBFC Sector</h2>
            <p className="nb-overview__body">
              RBI's Scale-Based Regulation framework has transformed NBFC compliance —
              creating layered obligations across Base, Middle, and Upper Layer entities.
              Combined with Ind AS 109 ECL requirements, PMLA obligations, and evolving
              fair practices guidelines, NBFCs face one of the most complex regulatory
              environments in Indian finance. JHS brings specialist expertise to help
              NBFCs navigate this landscape with confidence.
            </p>
            <a href="/contact" className="nb-btn nb-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="nb-overview__visual">
            <div className="nb-overview__badge">
              <span className="nb-overview__badge-icon">🏢</span>
              <span className="nb-overview__badge-label">End-to-end NBFC advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="nb-highlights container" ref={hlRef}>
        <div className="nb-section-hd">
          <h2 className="nb-section-hd__title">What We Offer</h2>
          <p className="nb-section-hd__sub">
            Comprehensive services covering every regulatory, audit, and tax need of NBFC entities.
          </p>
        </div>
        <div className="nb-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="nb-card">
              <div className="nb-card__accent" />
              <div className="nb-card__icon">{h.icon}</div>
              <h3 className="nb-card__title">{h.title}</h3>
              <p className="nb-card__desc">{h.desc}</p>
              <button className="nb-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="nb-why container" ref={whyRef}>
        <div className="nb-why__inner">
          <div className="nb-why__left">
            <span className="nb-tag">Why JHS</span>
            <h2 className="nb-why__title">The JHS Advantage in NBFCs</h2>
            <p className="nb-why__sub">
              We combine RBI regulatory depth with practical NBFC audit experience
              to deliver advisory that keeps pace with India's evolving NBFC framework.
            </p>
            <a href="/contact" className="nb-btn nb-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="nb-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="nb-why__item">
                <span className="nb-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="nb-cta container">
        <div className="nb-cta__inner">
          <div className="nb-cta__content">
            <p className="nb-cta__eyebrow">Get Started</p>
            <h2 className="nb-cta__title">Ready to strengthen your NBFC compliance?</h2>
            <p className="nb-cta__sub">
              Speak with a JHS NBFC specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="nb-btn nb-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
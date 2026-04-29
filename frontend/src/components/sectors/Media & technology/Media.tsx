import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Radio, FileText, ShieldCheck, BarChart2, Scale, Globe2 } from 'lucide-react'
import './Media.css'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <Radio size={20} strokeWidth={1.5} />,
    title: 'Statutory & Internal Audit',
    desc: 'Statutory audit, internal audit, and revenue assurance for broadcast media, OTT platforms, digital publishers, and entertainment companies.',
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    title: 'Tax & GST Advisory',
    desc: 'GST advisory on subscription revenues, advertising income, content licensing, and co-production arrangements — plus income tax planning for media entities.',
  },
  {
    icon: <Globe2 size={20} strokeWidth={1.5} />,
    title: 'Content Licensing & Royalties',
    desc: 'Tax structuring for content licensing, royalty income, IP transfers, and co-production agreements across domestic and international media transactions.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Regulatory Compliance',
    desc: 'MIB, TRAI, and ASCI compliance advisory for broadcasters, advertisers, and digital media companies operating under India\'s evolving media regulations.',
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    title: 'Revenue Recognition',
    desc: 'Ind AS 115 revenue recognition advisory for multi-element media arrangements — subscription bundles, advertising contracts, and content licensing deals.',
  },
  {
    icon: <Scale size={20} strokeWidth={1.5} />,
    title: 'M&A & Structuring',
    desc: 'Tax and financial structuring advisory for media M&A, platform acquisitions, and investment by PE/VC funds into media and entertainment businesses.',
  },
]

const STATS = [
  { num: '25+', label: 'Media Clients' },
  { num: '20+', label: 'Years Experience' },
  { num: 'OTT', label: 'Platform Expertise' },
]

const WHY = [
  'Deep sectoral knowledge across broadcast, OTT, print, and digital media',
  'Specialist GST and revenue recognition advisory for complex media arrangements',
  'Content licensing and royalty structuring expertise for cross-border media deals',
  'TRAI and MIB regulatory compliance advisory for broadcasters and publishers',
  'PE/VC and M&A advisory experience in India\'s fast-evolving media landscape',
]

export default function Media() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hlRef   = useRef<HTMLDivElement>(null)
  const whyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.md-hero__eyebrow', '.md-hero__title', '.md-hero__sub', '.md-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo('.md-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.md-why__item',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="md-page">

      {/* ── HERO ── */}
      <section className="md-hero" ref={heroRef}>
        <div className="md-hero__inner">
          {/* <p className="md-hero__eyebrow">Sectors &nbsp;·&nbsp; Media &amp; Technology</p> */}
          <h1 className="md-hero__title">Media<br /><em>Services</em></h1>
          <p className="md-hero__sub">
            Specialised audit, tax, and regulatory compliance advisory for
            broadcast media, OTT platforms, digital publishers, and entertainment
            companies — built on deep knowledge of India's media sector.
          </p>
          {/* <div className="md-hero__stats">
            {STATS.map((s) => (
              <div key={s.label} className="md-hero__stat">
                <span className="md-hero__stat-num">{s.num}</span>
                <span className="md-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="md-overview container">
        <div className="md-overview__inner">
          <div className="md-overview__text">
            <span className="md-tag">Our Approach</span>
            <h2 className="md-overview__title">Advisory for India's Fast-Moving Media Landscape</h2>
            <p className="md-overview__body">
              India's media and entertainment sector is undergoing rapid transformation —
              OTT disruption, evolving TRAI regulations, complex content licensing
              structures, and Ind AS 115 revenue recognition challenges demand
              advisors who truly understand the industry. JHS brings specialist
              expertise across broadcast, digital, and entertainment media,
              delivering audit, tax, and regulatory advisory that keeps media
              businesses compliant and competitive.
            </p>
            <a href="/contact" className="md-btn md-btn--solid">
              Talk to Our Experts <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="md-overview__visual">
            <div className="md-overview__badge">
              <span className="md-overview__badge-icon">🎬</span>
              <span className="md-overview__badge-label">Full-spectrum media advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE HIGHLIGHTS ── */}
      <section className="md-highlights container" ref={hlRef}>
        <div className="md-section-hd">
          <h2 className="md-section-hd__title">What We Offer</h2>
          <p className="md-section-hd__sub">
            Comprehensive services covering every financial, tax, and compliance need of media businesses.
          </p>
        </div>
        <div className="md-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="md-card">
              <div className="md-card__accent" />
              <div className="md-card__icon">{h.icon}</div>
              <h3 className="md-card__title">{h.title}</h3>
              <p className="md-card__desc">{h.desc}</p>
              <button className="md-card__cta" type="button">
                Learn More <ArrowUpRight size={13} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── WHY JHS ── */}
      <section className="md-why container" ref={whyRef}>
        <div className="md-why__inner">
          <div className="md-why__left">
            <span className="md-tag">Why JHS</span>
            <h2 className="md-why__title">The JHS Advantage in Media</h2>
            <p className="md-why__sub">
              We understand the commercial complexity of media — multi-platform
              revenues, content deals, and regulatory pressures — and deliver
              advisory that keeps pace with the industry.
            </p>
            <a href="/contact" className="md-btn md-btn--ghost">
              Start a Conversation <ArrowUpRight size={14} />
            </a>
          </div>
          <ul className="md-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="md-why__item">
                <span className="md-why__dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="md-cta container">
        <div className="md-cta__inner">
          <div className="md-cta__content">
            <p className="md-cta__eyebrow">Get Started</p>
            <h2 className="md-cta__title">Ready to strengthen your media business advisory?</h2>
            <p className="md-cta__sub">
              Speak with a JHS media specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="md-btn md-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}
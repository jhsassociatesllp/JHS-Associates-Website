import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLazyBackground } from '../../../hooks/useLazyBackground'
import { imageUrl } from '../../../utils/imageUrl'
import SimpleIcon from '../../common/SimpleIcon'
import './Logistics.css'
import SectorEngagement from '../shared/SectorEngagement'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  {
    icon: <SimpleIcon type="logistics" size={40} />,
    title: 'Supply Chain Excellence',
    desc: 'We help you streamline operations, cut costs and boost efficiency across your entire logistics network. Our team knows what works in real-world supply chains.',
  },
  {
    icon: <SimpleIcon type="compliance" size={40} />,
    title: 'Stay Compliant, Stay Ahead',
    desc: 'Navigate transportation rules, GST requirements and customs procedures with confidence. We keep you updated on every regulation that matters to your business.',
  },
  {
    icon: <SimpleIcon type="analysis" size={40} />,
    title: 'Smart Financial Decisions',
    desc: 'Make data-driven choices with our financial modeling and route analysis. Know which routes are profitable and where to invest next.',
  },
  {
    icon: <SimpleIcon type="globe" size={40} />,
    title: 'Global Logistics Made Simple',
    desc: 'Expand internationally without the headaches. We guide you through cross-border logistics, customs optimization and multi-modal strategies.',
  },
  {
    icon: <SimpleIcon type="tech" size={40} />,
    title: 'Digital Transformation',
    desc: 'Embrace technology that actually improves your operations. From automation to analytics, we help you choose and implement the right tools.',
  },
  {
    icon: <SimpleIcon type="document" size={40} />,
    title: 'Tax Optimization',
    desc: 'Keep more of what you earn with smart tax planning. We specialize in GST optimization and transfer pricing for logistics companies.',
  },
]

const WHY = [
  'We understand logistics inside and out from warehouse operations to last-mile delivery',
  'Our team stays current with transportation laws and GST changes that affect your business',
  'We have helped logistics companies save millions through smart GST planning and compliance',
  'Strong relationships with regulatory bodies mean faster approvals and smoother operations',
  'From startup to IPO, we have guided logistics companies through every growth stage',
]

export default function Logistics() {
  const hlRef = useRef<HTMLDivElement>(null)
  const whyRef = useRef<HTMLDivElement>(null)

  // Lazy load hero background image - using the Logistics1 image from uploads
  const { ref: heroBgRef, style: heroBgStyle, loaded: heroBgLoaded, className: heroBgClassName } = useLazyBackground(imageUrl('Logistics1.png'))

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* Hero */
      gsap.fromTo(
        ['.log-hero__eyebrow', '.log-hero__title', '.log-hero__sub', '.log-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )

      /* Highlights cards */
      gsap.fromTo(
        '.log-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: hlRef.current, start: 'top 82%' },
        }
      )

      /* Why list items */
      gsap.fromTo(
        '.log-why__item',
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 84%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="log-page">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className={`log-hero ${heroBgClassName}`}
        ref={heroBgRef}
        style={{
          ...heroBgStyle,
          backgroundImage: heroBgLoaded
            ? `linear-gradient(135deg, rgba(22, 41, 70, 0.75) 0%, rgba(34, 53, 82, 0.75) 100%), ${heroBgStyle.backgroundImage}`
            : 'linear-gradient(135deg, rgba(22, 41, 70, 0.75) 0%, rgba(34, 53, 82, 0.75) 100%), linear-gradient(45deg, #1e3a5f 0%, #2c5282 100%)',
          backgroundColor: '#1e3a5f' // Enhanced fallback
        }}
      >
        <div className="log-hero__inner">

          <h1 className="log-hero__title">
            Logistics &<br /><span>Supply Chain</span>
          </h1>

          <p className="log-hero__sub">
            Comprehensive financial, tax and strategic advisory for logistics companies,
            freight forwarders and supply chain operators  driving efficiency and
            compliance in India's rapidly evolving logistics landscape.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════
          OVERVIEW STRIP
      ══════════════════════════════════════ */}
      <section className="log-overview container">
        <div className="log-overview__inner">
          <div className="log-overview__text">
            <span className="log-overview__tag">Our Approach</span>
            <h2 className="log-overview__title">
              Powering India's Logistics Revolution
            </h2>
            <p className="log-overview__body">
              India's logistics sector is transforming rapidly with digitalization,
              infrastructure development and regulatory reforms. JHS provides integrated
              advisory services combining financial expertise, tax optimization and
              operational insights to help logistics companies navigate growth,
              compliance and market opportunities with confidence.
            </p>
            <a href="/contact" className="log-btn log-btn--solid">
              Talk to Our Experts <SimpleIcon type="arrow-right" size={15} />
            </a>
          </div>
          <div className="log-overview__visual">
            <div className="log-overview__badge">
              <SimpleIcon type="logistics" size={48} className="simple-icon--primary" />
              <span className="log-overview__badge-label">End-to-end logistics advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICE HIGHLIGHTS
      ══════════════════════════════════════ */}
      <section className="log-highlights container" ref={hlRef}>
        <div className="log-section-hd">
          <h2 className="log-section-hd__title">What We Offer</h2>
          <p className="log-section-hd__sub">
            Specialized services designed for the unique challenges of logistics and supply chain operations.
          </p>
        </div>

        <div className="log-grid">
          {HIGHLIGHTS.map((h, i) => (
            <article key={i} className="log-card">
              <div className="log-card__accent" />
              <div className="log-card__icon">{h.icon}</div>
              <h3 className="log-card__title">{h.title}</h3>
              {/* <p className="log-card__desc">{h.desc}</p>
              <button className="log-card__cta" type="button">
                Learn More <SimpleIcon type="arrow-right" size={13} />
              </button> */}
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY JHS
      ══════════════════════════════════════ */}
      <section className="log-why container" ref={whyRef}>
        <div className="log-why__inner">
          <div className="log-why__left">
            <span className="log-overview__tag">Why JHS</span>
            <h2 className="log-why__title">
              The JHS Advantage in Logistics
            </h2>
            <p className="log-why__sub">
              We understand the complexities of logistics operations and provide
              tailored solutions that drive real business outcomes.
            </p>
            <a href="/contact" className="log-btn log-btn--ghost">
              Start a Conversation <SimpleIcon type="arrow-right" size={14} />
            </a>
          </div>

          <ul className="log-why__list">
            {WHY.map((item, i) => (
              <li key={i} className="log-why__item">
                <span className="log-why__item-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>


      <SectorEngagement sectorKey="Logistics" sectorLabel="Logistics" />
      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="log-cta container">
        <div className="log-cta__inner">
          <div className="log-cta__content">
            <p className="log-cta__eyebrow">Get Started</p>
            <h2 className="log-cta__title">Ready to optimize your logistics operations?</h2>
            <p className="log-cta__sub">
              Speak with a JHS logistics specialist and get a tailored advisory proposal.
            </p>
          </div>
          <a href="/contact" className="log-btn log-btn--cta">
            Contact Us <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}
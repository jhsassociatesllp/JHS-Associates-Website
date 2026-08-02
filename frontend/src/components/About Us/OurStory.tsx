import { useEffect } from 'react'
import './SharedAbout.css'
import './OurStory.css'
import { imageUrl } from '../../utils/imageUrl'

const MILESTONES = [
  {
    year: '1981',
    title: 'The Beginning',
    desc: 'Establishment of JHS, laying the foundation for a practice built on professional integrity, client trust and technical excellence.',
  },
  {
    year: '1990s – 2000s',
    title: 'Expanding Capabilities',
    desc: 'Expansion beyond core taxation into assurance and accounting services, and corporate advisory supporting clients across growth stages.',
  },
  {
    year: '2010s',
    title: 'Pan-India Integration',
    desc: 'Progressed through a series of mergers and integration of professional practices to combine capabilities and offer a single window approach to clients. Development of a pan-India presence through multiple offices, enabling proximity-based delivery and deeper engagement with clients across sectors and geographies.',
  },
  {
    year: '2020s',
    title: 'Technology Transformation Era',
    desc: 'Adoption of data analytics, audit automation, dashboards, forensic tools, AI-enabled assurance methodologies and technology-led service delivery models to create scalable and insight-driven solutions. Launch of full-fledged Cyber Security Solutions, Data Privacy Assurance and receiving the coveted CERT-In empanelment.',
  },
  {
    year: '2020s',
    title: 'Global Connectivity',
    desc: 'Strengthening international capabilities through membership of the PrimeGlobal network, providing clients access to global perspectives and cross-border advisory support.',
  },
]

const BODY_PARAGRAPHS = [
  "JHS & Associates LLP (JHS) is a professionally managed assurance, advisory and consulting firm that has been serving clients since 28 February 1981. Over more than four decades, JHS has evolved from a traditional chartered accountancy practice into a multi-disciplinary professional services organization that combines deep technical expertise with technology-enabled delivery and strategic business insights.",
  "Today, JHS serves 1,000+ clients through a network of 13 offices across India, supported by 700+ people and 30 partners and advisory board members, providing a rare combination of local proximity and national reach. The firm's growth has been built on a simple philosophy: building trust, delivering excellence, and shaping better futures.",
  'What differentiates JHS is its ability to provide an integrated platform of services under one roof. From Assurance, Risk Advisory, Taxation and Compliance to Corporate Finance, Outsourcing, Technology Assurance, Governance, Internal Audit, Forensics, ESG and Business Transformation, clients benefit from a partner-led model focused on practical outcomes rather than theoretical advice.',
  'JHS has consistently positioned itself as a business enabler rather than a service provider. The firm partners with organizations across their growth journey, from incorporation and capital raising to expansion, governance enhancement, operational excellence and global growth. Its solutions are designed to reduce risk, improve efficiency, strengthen controls, simplify compliance and drive sustainable value creation.',
  'The firm combines the stability of a legacy institution with the agility of a modern advisory practice. Through investments in analytics, automation, dashboards, AI-enabled assurance and digital transformation capabilities, JHS helps organizations respond to rapidly changing regulatory, technological and business environments.',
  'A strong culture of integrity, objectivity, quality, mutual respect and result orientation forms the foundation of the organization. Diversity, inclusion and people development remain central to its philosophy, reflected in a workforce that actively promotes equal opportunity and professional growth. About 40% of the workforce at JHS comprises of women.',
  "As India's businesses become more ambitious and globally connected, JHS continues to expand its capabilities and network. Backed by decades of trust, a multidisciplinary talent pool, and global affiliations, JHS aspires to be a globally respected professional services firm that helps clients navigate complexity, unlock growth opportunities and build resilient enterprises for the future.",
]

export default function OurStory() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero story-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${imageUrl('Ourstory.png')})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <span className="story-eyebrow">Who We Are</span>
          <h2 className="story-title">The JHS Story</h2>
          <p className="story-lead">Building Trust. Delivering Excellence. Shaping Better Futures.</p>
        </div>

        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="story-stat">
            <span className="story-stat__num">45+</span>
            <span className="story-stat__label">Years of Trust</span>
          </div>
          <div className="story-stat">
            <span className="story-stat__num">13</span>
            <span className="story-stat__label">Offices</span>
          </div>
          <div className="story-stat">
            <span className="story-stat__num">700+</span>
            <span className="story-stat__label">People</span>
          </div>
          <div className="story-stat">
            <span className="story-stat__num">1,000+</span>
            <span className="story-stat__label">Clients</span>
          </div>
          <div className="story-stat story-stat--wide">
            <span className="story-stat__num">One</span>
            <span className="story-stat__label">Integrated Platform for Growth, Governance &amp; Transformation</span>
          </div>
        </div>

      </section>

      {/* ════ INTRO + STATS ════ */}

      <section className="ap-content story-section">
        <div className="ap-container">
          <div className="story-body">
            {BODY_PARAGRAPHS.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MILESTONES TIMELINE ════ */}
      <section className="ap-content story-milestones">
        <div className="ap-container">
          <div className="story-milestones__hdr">
            <span className="story-eyebrow">Our Journey</span>
            <h3>Key Milestones in the JHS Journey</h3>
            <p>The moments that shaped our four-decade journey.</p>
          </div>

          <div className="story-timeline">
            {MILESTONES.map((m, i) => (
              <div className="story-timeline__item" key={i}>
                <div className="story-timeline__marker">
                  <span className="story-timeline__dot" />
                </div>
                <div className="story-timeline__card">
                  <span className="story-timeline__year">{m.year}</span>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

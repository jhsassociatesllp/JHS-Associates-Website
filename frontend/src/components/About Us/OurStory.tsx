import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Fainance4.jpg'

export default function OurStory() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Heritage &amp; History</p>
          <h1 className="ap-hero__title">Our Story</h1>
          <p className="ap-hero__sub">
            From humble beginnings to becoming a leading Pan-India advisory network.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">1992</span><span className="ap-hero__stat-label">Year Founded</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">30+</span><span className="ap-hero__stat-label">Years of Trust</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">8</span><span className="ap-hero__stat-label">Cities Conquered</span></div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>A Legacy of Trust</h2>
              <p>Three decades of continuous evolution.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                The journey of JHS &amp; Associates LLP began in 1992 with a simple but profound mission: to provide unparalleled strategic and financial advice to growing businesses. What started as a modest boutique firm in Mumbai quickly gained recognition for its relentless dedication to client success and rigorous ethical standards.
              </p>
              <p>
                As the Indian economy opened up and digitized over the decades, JHS evolved alongside it. We expanded our capabilities far beyond statutory audits, rapidly scaling our consulting, risk advisory, and international taxation practices to meet complex global demands. Today, we stand as a unified network across major Indian economic hubs, trusted by start-ups and multinationals alike.
              </p>
            </div>
          </div>

          <div className="ap-card">
            <h3>Milestones</h3>
            <p style={{ marginBottom: '2rem' }}>Key moments that defined our trajectory.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>1992: The Foundation</h4>
                <p>JHS was established in Mumbai focusing initially on statutory audits and direct taxation.</p>
              </div>
              <div className="ap-feature">
                <h4>2008: Expanding Horizons</h4>
                <p>Launched dedicated consulting and technology advisory verticals to handle emerging IT demands.</p>
              </div>
              <div className="ap-feature">
                <h4>2015: Pan-India Network</h4>
                <p>Expanded physical footprint to Delhi, Bangalore, and Ahmedabad.</p>
              </div>
              <div className="ap-feature">
                <h4>Present: Global Affiliations</h4>
                <p>Transitioned to an LLP and joined leading international accounting networks.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/WebPoster2.jpeg'

export default function CompanyOverview() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">About JHS &amp; Associates</p>
          <h1 className="ap-hero__title">Company Overview</h1>
          <p className="ap-hero__sub">
            A dynamic, client-centric Chartered Accountancy firm delivering bespoke financial, tax, and advisory solutions since 1992.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">30+</span><span className="ap-hero__stat-label">Years Legacy</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">15+</span><span className="ap-hero__stat-label">Partners</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">200+</span><span className="ap-hero__stat-label">Professionals</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">1000+</span><span className="ap-hero__stat-label">Clients Served</span></div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Who We Are</h2>
              <p>Driving growth through insight, integrity, and innovation.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                JHS &amp; Associates LLP is a premier, full-service network of Chartered Accountants and advisory professionals in India. Since our inception, we have evolved from a traditional accounting firm into a holistic business advisory &amp; consulting network. 
              </p>
              <p>
                We blend deep technical expertise with a profound understanding of industry nuances to help businesses navigate complex regulatory landscapes, optimize operations, and achieve sustainable growth. 
              </p>
            </div>
          </div>

          <div className="ap-card">
            <h3>Our Core Values</h3>
            <p style={{ marginBottom: '2rem' }}>Our philosophy is built upon four fundamental pillars that guide every engagement:</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Integrity</h4>
                <p>Upholding the highest ethical standards in all our professional dealings.</p>
              </div>
              <div className="ap-feature">
                <h4>Excellence</h4>
                <p>Delivering uncompromised quality and exceeding client expectations.</p>
              </div>
              <div className="ap-feature">
                <h4>Insight</h4>
                <p>Providing strategic advice driven by deep industry knowledge.</p>
              </div>
              <div className="ap-feature">
                <h4>Collaboration</h4>
                <p>Working seamlessly as an extension of our clients' teams.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

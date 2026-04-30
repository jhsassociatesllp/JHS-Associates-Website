import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Auditposter.jpg'

export default function CSR() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Giving Back</p>
          <h1 className="ap-hero__title">Social Responsibility</h1>
          <p className="ap-hero__sub">
            Committed to driving positive, sustainable change in the communities where we live and work.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">500+</span><span className="ap-hero__stat-label">Lives Impacted</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">10+</span><span className="ap-hero__stat-label">NGO Partners</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">1000</span><span className="ap-hero__stat-label">Volunteering Hours</span></div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Our CSR Vision</h2>
              <p>Success measured by the good we do.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                At JHS &amp; Associates, we understand that true corporate success cannot be separated from societal well-being. Our Corporate Social Responsibility (CSR) initiatives are deeply ingrained in our firm’s DNA.
              </p>
              <p>
                We focus our efforts on primarily three verticals: Education, Healthcare, and Environmental Sustainability. By partnering with leading grassroots NGOs, we ensure that our philanthropic contributions translate into measurable, real-world impact.
              </p>
            </div>
          </div>

          <div className="ap-card">
            <h3>Key Initiatives</h3>
            <p style={{ marginBottom: '2rem' }}>How we turn our commitment into action.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Education &amp; Skilling</h4>
                <p>Sponsoring education for underprivileged children and providing vocational training scholarships.</p>
              </div>
              <div className="ap-feature">
                <h4>Health &amp; Wellness</h4>
                <p>Organizing annual medical camps and supporting local hospitals with critical medical infrastructure.</p>
              </div>
              <div className="ap-feature">
                <h4>Pro-Bono Advisory</h4>
                <p>Providing free financial and compliance advisory to selected charitable trusts and non-profits.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

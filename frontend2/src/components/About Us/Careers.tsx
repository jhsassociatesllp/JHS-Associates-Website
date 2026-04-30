import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/WebPoster4.jpeg'
import officeCulture from '../../image/growthposter.jpg' // Using generic for culture

export default function Careers() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Join JHS</p>
          <h1 className="ap-hero__title">Careers</h1>
          <p className="ap-hero__sub">
            Build a rewarding career by helping shape the future of high-growth organizations.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">200+</span><span className="ap-hero__stat-label">Team Members</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">50+</span><span className="ap-hero__stat-label">Annual Hires</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">100%</span><span className="ap-hero__stat-label">Growth Culture</span></div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Life at JHS</h2>
              <p>More than a job, it's a launchpad for your professional journey.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                We believe that our firm is only as good as the people within it. At JHS &amp; Associates, we foster an inclusive, dynamic, and high-performance culture that rewards innovation and hard work.
              </p>
              <p>
                Whether you are an aspiring articled assistant looking for deep foundational training or an experienced professional aiming to lead specialized advisory verticals, JHS provides the platform to excel.
              </p>
              <br />
              <ul>
                <li>Continuous Learning &amp; Development Programs</li>
                <li>Direct Mentorship from Industry Veterans</li>
                <li>Exposure to Diverse Industries and Fortune 500 Clients</li>
                <li>Meritocratic Growth Opportunities</li>
              </ul>
            </div>
          </div>

          <div className="ap-map-container" style={{ height: 'auto', border: 'none', boxShadow: 'none' }}>
             <img src={officeCulture} alt="JHS Office Culture" style={{ width: '100%', borderRadius: '20px', objectFit: 'cover', height: '350px' }} />
          </div>

          <div className="ap-card">
            <h3>Current Openings</h3>
            <p style={{ marginBottom: '2rem' }}>We are constantly looking for bright minds. If you don't see a role that fits you below, feel free to drop your resume at <strong>hr@jhsassociates.in</strong>.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Articled Assistants</h4>
                <p>Comprehensive training across Audit, Direct Tax, and Indirect Tax.</p>
              </div>
              <div className="ap-feature">
                <h4>Audit Executives</h4>
                <p>2-4 years post qualification experience in statutory audits.</p>
              </div>
              <div className="ap-feature">
                <h4>Tax Consultants</h4>
                <p>Specialists in Transfer Pricing, GST, and International Taxation.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

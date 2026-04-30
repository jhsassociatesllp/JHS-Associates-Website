import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Ahmedabad.jpg'

export default function Awards() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Recognition</p>
          <h1 className="ap-hero__title">Awards &amp; Accolades</h1>
          <p className="ap-hero__sub">
            Tokens of excellence reflecting our commitment to the profession and our clients.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>A Record of Excellence</h2>
              <p>Recognized by industry leaders.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                We don't work for awards; we work for client success. However, we are profoundly humbled when industry bodies and standard-setters recognize the rigor, innovation, and integrity of our practice. 
              </p>
              <p>
                Over the past decades, JHS &amp; Associates has been consistently ranked among the emerging leaders in full-service consulting, winning commendations for our specialized work in banking audits, taxation structuring, and comprehensive assurance.
              </p>
            </div>
          </div>

          <div className="ap-card" style={{ marginTop: '3rem' }}>
            <h3>Recent Acknowledgements</h3>
            <p style={{ marginBottom: '2rem' }}>Highlighting recent milestones on our journey to excellence.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Top 50 Advisory Firms</h4>
                <p>Recognized consistently among the top tier mid-market advisory networks in India.</p>
              </div>
              <div className="ap-feature">
                <h4>Excellence in Audit Quality</h4>
                <p>Commended for incorporating advanced analytics and ensuring zero-defect reporting standards.</p>
              </div>
              <div className="ap-feature">
                <h4>Best Place to Work</h4>
                <p>Awarded for our progressive HR policies, continuous learning programs, and diverse work culture.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

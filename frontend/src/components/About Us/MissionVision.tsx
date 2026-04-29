import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Mumbai 2.jpg'

export default function MissionVision() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Guiding Principles</p>
          <h1 className="ap-hero__title">Mission &amp; Vision</h1>
          <p className="ap-hero__sub">
            The core purpose that drives our firm forward every single day.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Our Vision</h2>
              <p>Where we are headed.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                To be universally recognized as the most trusted and innovative multi-disciplinary consulting network. We aim to be the first point of contact for complex financial, strategic, and regulatory advisory, seamlessly bridging local expertise with global standards.
              </p>
            </div>
          </div>

          <div className="ap-grid" style={{ marginTop: '3rem' }}>
            <div className="ap-grid-left">
              <h2>Our Mission</h2>
              <p>What we do every day to get there.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                To empower our clients to achieve sustainable, exponential growth through:
              </p>
              <ul>
                <li>Delivering proactive, insightful, and comprehensive financial solutions.</li>
                <li>Upholding the highest standards of professional integrity and independence.</li>
                <li>Fostering an inclusive, meritocratic culture that attracts and develops the best talent in the industry.</li>
                <li>Continuously investing in modern technology and innovative practices to ensure future-ready advisory services.</li>
              </ul>
            </div>
          </div>

          <div className="ap-card" style={{ marginTop: '3rem' }}>
            <h3>Our Motivation</h3>
            <p style={{ marginBottom: '2rem' }}>We don't just solve problems. We anticipate them to safeguard your future.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>Client Centricity</h4>
                <p>Every strategy is uniquely tailored. Your success is our ultimate KPI.</p>
              </div>
              <div className="ap-feature">
                <h4>Future Proofing</h4>
                <p>We leverage advanced data analytics and forward-looking risk models.</p>
              </div>
              <div className="ap-feature">
                <h4>Ethical Backbone</h4>
                <p>Uncompromising honesty in all scenarios, ensuring robust compliance.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

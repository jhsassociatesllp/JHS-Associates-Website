import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Untitled design.png'

export default function Partnerships() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Strategic Alliances</p>
          <h1 className="ap-hero__title">Partnerships</h1>
          <p className="ap-hero__sub">
            Multiplying value through robust global and domestic networks.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>Stronger Together</h2>
              <p>Expanding our footprint and capabilities.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                In the modern, highly specialized business landscape, no single firm can operate in a silo. We actively build and nurture strategic partnerships with leading technology providers, legal experts, and international accounting networks. 
              </p>
              <p>
                These alliances allow us to provide truly comprehensive "Single Window" solutions. Whether a client needs complex cross-border transfer pricing analysis in Europe, or seamless ERP integration in India, our vetted partner network acts as a seamless extension of JHS.
              </p>
              <br/>
              <ul>
                <li>Global Accounting Networks (Top 10 International Affiliations)</li>
                <li>FinTech &amp; ERP Solutions Providers</li>
                <li>Specialized Legal &amp; Corporate Law Chambers</li>
              </ul>
            </div>
          </div>

          <div className="ap-card" style={{ marginTop: '3rem' }}>
            <h3>The JHS Alliance Advantage</h3>
            <p style={{ marginBottom: '2rem' }}>Why our curated partnerships matter to your business.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>End-to-End Delivery</h4>
                <p>We take complete accountability for complex projects requiring multi-domain expertise.</p>
              </div>
              <div className="ap-feature">
                <h4>Global Quality, Local Cost</h4>
                <p>Access tier-1 global standard advisory without the inflated cost structures.</p>
              </div>
              <div className="ap-feature">
                <h4>Rapid Deployment</h4>
                <p>Our pre-vetted partnerships allow us to assemble specialized task forces instantly.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

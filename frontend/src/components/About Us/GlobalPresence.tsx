import { useEffect } from 'react'
import './SharedAbout.css'
import heroBg from '../../image/Fainance3.jpg'

export default function GlobalPresence() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="ap-page">
      {/* ════ HERO ════ */}
      <section className="ap-hero">
        <div className="ap-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="ap-hero__overlay" />
        <div className="ap-hero__content">
          <p className="ap-hero__eyebrow">Our Reach</p>
          <h1 className="ap-hero__title">Global Presence</h1>
          <p className="ap-hero__sub">
            Serving clients across borders with a unified international network of trusted partners.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="ap-hero__stats">
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">50+</span><span className="ap-hero__stat-label">Countries Served</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">12</span><span className="ap-hero__stat-label">Global Affiliates</span></div>
          <div className="ap-hero__stat-div" />
          <div className="ap-hero__stat"><span className="ap-hero__stat-num">24/7</span><span className="ap-hero__stat-label">Advisory Support</span></div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="ap-content">
        <div className="ap-container">
          
          <div className="ap-grid">
            <div className="ap-grid-left">
              <h2>International Footprint</h2>
              <p>Bridging global insights with local expertise.</p>
            </div>
            <div className="ap-grid-right">
              <p>
                In an increasingly interconnected global economy, challenges don't stop at the border. At JHS &amp; Associates LLP, we help multi-national corporations and fast-growing domestic companies expand their horizons. 
              </p>
              <p>
                Through robust strategic alliances and network partnerships, we provide seamless, end-to-end compliance and advisory services across major international jurisdictions including the US, UK, UAE, and Singapore.
              </p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="ap-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14690326.699742662!2d71.07767351663085!3d23.080512822452243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1713437505342!5m2!1sen!2sin" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="Global Map" 
            />
          </div>

          <div className="ap-card">
            <h3>Cross-Border Expertise</h3>
            <p>Our dedicated global compliance desk supports foreign companies setting up in India and Indian companies expanding abroad.</p>
            <div className="ap-features">
              <div className="ap-feature">
                <h4>FEMA &amp; RBI Advisory</h4>
                <p>Navigating cross border transactions, FDI, and ODI compliance smoothly.</p>
              </div>
              <div className="ap-feature">
                <h4>International Taxation</h4>
                <p>Transfer pricing, DTAA benefits, and global tax structuring.</p>
              </div>
              <div className="ap-feature">
                <h4>NRI Services</h4>
                <p>Tailored financial and tax advisory for Non-Resident Indians globally.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

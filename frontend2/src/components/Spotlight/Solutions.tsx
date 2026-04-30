import { useEffect } from 'react';
import { Lightbulb, Briefcase, Rocket, Settings, CheckCircle, Search } from 'lucide-react';
import './SpotlightPages.css';
import heroImg from '../../image/WebPoster4.jpeg';

export default function Solutions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page">
      {/* Hero Section */}
      <section className="sp-hero">
        <div
          className="sp-hero__bg"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="sp-hero__overlay" />
        <div className="sp-container">
          <div className="sp-hero__content">
            <span className="sp-eyebrow">Spotlight</span>
            <h1 className="sp-title">Our Solutions</h1>
            <p className="sp-subtitle">
              Comprehensive, industry-specific solutions tailored to tackle your most complex challenges. From financial restructuring to digital transformation, we deliver measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="sp-content">
        <div className="sp-container">
          <div className="sp-content__grid">

            {/* Left Column: Text */}
            <div className="sp-content__left">
              <h2 style={{ fontSize: '2.5rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
                Tailored Strategies
              </h2>
              <p className="sp-content__text">
                Every business faces unique hurdles. Off-the-shelf strategies rarely provide the nuance needed to overcome complex industry-specific challenges. <strong>Our bespoke Solutions</strong> are crafted precisely for your operational reality.
              </p>
              <p className="sp-content__text">
                We combine deep sector knowledge with innovative methodologies to solve problems ranging from supply chain inefficiencies and regulatory hurdles, to scaling operations and managing financial risks.
              </p>
              <p className="sp-content__text">
                Partner with us to deploy strategies that are not only theoretically sound but proven in the real world, ensuring long-term sustainability and immediate impact.
              </p>

              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
                  Our Approach
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Search color="#0ea5e9" size={24} />
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1.125rem', color: '#334155' }}>Diagnostic Discovery & Analysis</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Settings color="#0ea5e9" size={24} />
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1.125rem', color: '#334155' }}>Custom Framework Development</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Briefcase color="#0ea5e9" size={24} />
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1.125rem', color: '#334155' }}>Implementation & Change Management</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle color="#0ea5e9" size={24} />
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1.125rem', color: '#334155' }}>Performance Tracking & Optimization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Features */}
            <div className="sp-content__right">
              <ul className="sp-feature-list">
                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Briefcase size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Enterprise Restructuring</h3>
                    <p>Streamline corporate structures to maximize tax efficiency, reduce operational bottlenecks, and enhance shareholder value.</p>
                  </div>
                </li>

                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Rocket size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Growth Acceleration</h3>
                    <p>Identify new market entry strategies, optimize pricing models, and secure capital for rapid, sustainable expansion.</p>
                  </div>
                </li>

                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Lightbulb size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Innovation Consulting</h3>
                    <p>Modernize legacy systems and adopt digital-first strategies to stay ahead of industry disruption.</p>
                  </div>
                </li>

                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Settings size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Risk & Resilience</h3>
                    <p>Develop robust business continuity plans and enterprise risk management frameworks to weather economic uncertainties.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

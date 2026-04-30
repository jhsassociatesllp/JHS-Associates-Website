import { useEffect } from 'react';
import { Bot, Cpu, Zap, BarChart, ShieldCheck, Cog } from 'lucide-react';
import './SpotlightPages.css';
import heroImg from '../../image/WebPoster2.jpeg';

export default function AIAutomation() {
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
            <h1 className="sp-title">AI & Automation</h1>
            <p className="sp-subtitle">
              Transform your business operations with state-of-the-art Artificial Intelligence and intelligent automation strategies designed to optimize efficiency and accelerate high-value decision making.
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
                Next-Gen Efficiency
              </h2>
              <p className="sp-content__text">
                At JHS, we recognize that <strong>Artificial Intelligence and Automation</strong> are no longer just futuristic concepts—they are essential tools for maintaining a competitive edge in today's fast-paced business landscape.
              </p>
              <p className="sp-content__text">
                Our tailored AI solutions are built to integrate seamlessly into your existing workflows, reducing manual overhead, mitigating human error, and freeing up your top talent to focus on strategic initiatives rather than repetitive tasks.
              </p>
              <p className="sp-content__text">
                Whether you need intelligent data processing, predictive analytics, or automated compliance checks, our team of experts will guide you through the digital transformation journey step by step.
              </p>
            </div>

            {/* Right Column: Features */}
            <div className="sp-content__right">
              <ul className="sp-feature-list">
                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Bot size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Intelligent Workflows</h3>
                    <p>Automate repetitive, rules-based tasks using Robotic Process Automation (RPA) to enhance speed and accuracy.</p>
                  </div>
                </li>
                
                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <BarChart size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Predictive Analytics</h3>
                    <p>Leverage machine learning algorithms to forecast trends, identify risks early, and make proactive, data-driven decisions.</p>
                  </div>
                </li>

                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>Automated Compliance</h3>
                    <p>Ensure continuous regulatory adherence by deploying smart agents that monitor transactions and flag anomalies in real time.</p>
                  </div>
                </li>
                
                <li className="sp-feature-item">
                  <div className="sp-feature-icon">
                    <Cog size={28} />
                  </div>
                  <div className="sp-feature-text">
                    <h3>System Integration</h3>
                    <p>Seamlessly connect disjointed legacy systems with modern AI layers to create a unified, intelligent data ecosystem.</p>
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

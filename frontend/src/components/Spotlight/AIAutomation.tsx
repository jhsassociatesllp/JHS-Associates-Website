import { useEffect } from 'react';
import { Clock, Sparkles, BrainCircuit, Workflow } from 'lucide-react';
import './SpotlightPages.css';
import { imageUrl } from '../../utils/imageUrl'

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
          style={{ backgroundImage: `url(${imageUrl('WebPoster2.jpeg')})` }}
        />
        <div className="sp-hero__overlay" />
        <div className="sp-container">
          <div className="sp-hero__content">
            <span className="sp-eyebrow">Spotlight</span>
            <h1 className="sp-title">AI & Automation</h1>
            <p className="sp-subtitle">
              Transform your business operations with state of the art Artificial Intelligence and intelligent automation strategies designed to optimize efficiency and accelerate high value decision making.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section style={{
        padding: '120px 0',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.05)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.03)', pointerEvents: 'none',
        }} />

        <div className="sp-container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#f0f9ff', border: '1px solid #0ea5e9',
              color: '#0ea5e9', borderRadius: '999px', padding: '8px 20px',
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <Clock size={16} />
              Coming Soon
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '3rem', fontWeight: 700,
            color: '#0f172a', textAlign: 'center', marginBottom: '20px', lineHeight: 1.2,
          }}>
            Advanced AI Solutions in Development
          </h2>
          <p style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '1.25rem', color: '#475569',
            textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px', lineHeight: 1.7,
          }}>
            Our team is actively building cutting-edge AI & Automation capabilities. Stay tuned for powerful new features launching soon.
          </p>

          {/* Upcoming Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {[
              {
                icon: <BrainCircuit size={32} />,
                title: 'Generative AI Integration',
                desc: 'Embed large language models directly into your business processes for intelligent content generation and decision support.',
              },
              {
                icon: <Workflow size={32} />,
                title: 'No-Code Automation Builder',
                desc: 'Design and deploy complex automation workflows visually — no engineering resources required.',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'AI-Powered Insights Dashboard',
                desc: 'A unified analytics hub that surfaces actionable intelligence from across your entire data landscape in real time.',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px', padding: '36px 28px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.15)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>
                <div style={{
                  display: 'inline-flex', padding: '14px', borderRadius: '12px',
                  background: '#f0f9ff', color: '#0ea5e9', marginBottom: '24px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '1.25rem',
                  fontWeight: 700, color: '#0f172a', marginBottom: '12px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '1rem',
                  color: '#475569', lineHeight: 1.7,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '1.125rem',
              color: '#334155', marginBottom: '20px',
            }}>
              Interested in early access or a custom solution?
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#ffffff', fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700, fontSize: '1.0625rem',
                padding: '16px 40px', borderRadius: '10px',
                textDecoration: 'none', letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(14, 165, 233, 0.3)';
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

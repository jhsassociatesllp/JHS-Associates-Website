import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  CheckCircle, 
  FileCheck, 
  Building2, 
  Clock, 
  Shield, 
  ArrowRight,
  Download,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react'
import './SingleWindowAssistance.css'

gsap.registerPlugin(ScrollTrigger)

const SingleWindowAssistance: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ['.swa-hero__title', '.swa-hero__sub', '.swa-hero__cta'],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        }
      )

      // Features grid
      gsap.fromTo(
        '.swa-feature-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' },
        }
      )

      // Process steps
      gsap.fromTo(
        '.swa-process-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: processRef.current, start: 'top 80%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: <FileCheck size={28} />,
      title: 'Regulatory Compliance',
      description: 'Expert guidance on all statutory and regulatory requirements for your business.',
    },
    {
      icon: <Building2 size={28} />,
      title: 'Business Registration',
      description: 'Company incorporation, GST registration, and all necessary licenses under one roof.',
    },
    {
      icon: <Clock size={28} />,
      title: 'Fast-Track Processing',
      description: 'Streamlined workflows ensuring quick turnaround times for all applications.',
    },
    {
      icon: <Shield size={28} />,
      title: 'End-to-End Support',
      description: 'From document preparation to final approval — we handle everything.',
    },
  ]

  const processSteps = [
    { step: '01', title: 'Initial Consultation', description: 'Understanding your business requirements and regulatory needs.' },
    { step: '02', title: 'Document Collection', description: 'We guide you on required documents and assist with preparation.' },
    { step: '03', title: 'Application Filing', description: 'Filing all applications across relevant departments and authorities.' },
    { step: '04', title: 'Follow-up & Coordination', description: 'Regular follow-ups and coordination with government agencies.' },
    { step: '05', title: 'Approval & Delivery', description: 'Final approvals delivered to you with post-compliance support.' },
  ]

  const servicesList = [
    'Company Incorporation (Private Limited, LLP, OPC)',
    'GST Registration & Filing',
    'Import Export Code (IEC)',
    'MSME / Udyam Registration',
    'Professional Tax Registration',
    'Shop & Establishment License',
    'FSSAI Food License',
    'Trade Mark Registration',
    'ISO Certification',
    'Labor License & Compliance',
  ]

  return (
    <div className="swa-page">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="swa-hero" ref={heroRef}>
        <div className="swa-hero__overlay" />
        <div className="swa-hero__inner container">
          <span className="swa-hero__badge">JHS & Associates</span>
          <h1 className="swa-hero__title">
            Single Window <em>Assistance</em>
          </h1>
          <p className="swa-hero__sub">
            Your one-stop solution for all business regulatory, licensing, and compliance needs. 
            We simplify government interactions so you can focus on growing your business.
          </p>
          <div className="swa-hero__cta">
            <button className="swa-btn swa-btn--primary">
              Get Started <ArrowRight size={16} />
            </button>
            <button className="swa-btn swa-btn--outline">
              <PhoneCall size={14} />
              +91 98765 43210
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════ */}
      <section className="swa-features container" ref={featuresRef}>
        <div className="swa-section-header">
          <span className="swa-section-tag">Why Choose Us</span>
          <h2 className="swa-section-title">
            Comprehensive Support, <br />
            <span className="swa-accent">Seamless Experience</span>
          </h2>
          <p className="swa-section-sub">
            We provide end-to-end assistance across all regulatory touchpoints, 
            ensuring your business stays compliant and competitive.
          </p>
        </div>

        <div className="swa-features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="swa-feature-card">
              <div className="swa-feature-card__icon">{feature.icon}</div>
              <h3 className="swa-feature-card__title">{feature.title}</h3>
              <p className="swa-feature-card__desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES LIST SECTION
      ══════════════════════════════════════ */}
      <section className="swa-services">
        <div className="container">
          <div className="swa-services__inner">
            <div className="swa-services__content">
              <span className="swa-section-tag">Our Services</span>
              <h2 className="swa-section-title">
                What We <span className="swa-accent">Cover</span>
              </h2>
              <p className="swa-section-sub">
                From incorporation to ongoing compliance — we handle it all under one roof.
              </p>
              <button className="swa-btn swa-btn--primary swa-btn--download">
                <Download size={14} />
                Download Service Brochure
              </button>
            </div>
            <div className="swa-services__list">
              {servicesList.map((service, idx) => (
                <div key={idx} className="swa-service-item">
                  <CheckCircle size={18} className="swa-service-item__check" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS SECTION
      ══════════════════════════════════════ */}
      <section className="swa-process container" ref={processRef}>
        <div className="swa-section-header">
          <span className="swa-section-tag">How It Works</span>
          <h2 className="swa-section-title">
            Simple <span className="swa-accent">5-Step</span> Process
          </h2>
          <p className="swa-section-sub">
            Our streamlined approach ensures minimal effort from your side with maximum results.
          </p>
        </div>

        <div className="swa-process-steps">
          {processSteps.map((step) => (
            <div key={step.step} className="swa-process-step">
              <div className="swa-process-step__number">{step.step}</div>
              <div className="swa-process-step__content">
                <h3 className="swa-process-step__title">{step.title}</h3>
                <p className="swa-process-step__desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="swa-cta">
        <div className="container">
          <div className="swa-cta__inner">
            <div className="swa-cta__content">
              <h2 className="swa-cta__title">Ready to Simplify Your Compliance?</h2>
              <p className="swa-cta__sub">
                Get in touch with our experts today for a free consultation.
              </p>
              <div className="swa-cta__buttons">
                <button className="swa-btn swa-btn--light">
                  <Mail size={14} />
                  info@jhsassociates.com
                </button>
                <button className="swa-btn swa-btn--light">
                  <PhoneCall size={14} />
                  +91 98765 43210
                </button>
              </div>
            </div>
            <div className="swa-cta__stats">
              <div className="swa-stat">
                <span className="swa-stat__number">500+</span>
                <span className="swa-stat__label">Businesses Served</span>
              </div>
              <div className="swa-stat">
                <span className="swa-stat__number">98%</span>
                <span className="swa-stat__label">Success Rate</span>
              </div>
              <div className="swa-stat">
                <span className="swa-stat__number">7+</span>
                <span className="swa-stat__label">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SingleWindowAssistance
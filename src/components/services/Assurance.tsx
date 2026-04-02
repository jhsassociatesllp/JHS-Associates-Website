import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Shield, 
  CheckCircle, 
  ArrowUpRight, 
  Briefcase, 
  FileCheck, 
  BarChart3, 
  Building2,
  Clock,
  Users,
  Award,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import './Assurance.css'

gsap.registerPlugin(ScrollTrigger)

interface ServiceCard {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

interface StatItem {
  value: string
  label: string
}

const Assurance: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const approachRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [activeService, setActiveService] = useState<number | null>(null)

  const services: ServiceCard[] = [
    {
      id: 1,
      title: 'Statutory Audit',
      description: 'Comprehensive audit services ensuring compliance with statutory requirements and financial reporting standards.',
      icon: <FileCheck size={28} />,
      features: ['Companies Act compliance', 'CARO reporting', 'Financial statement review', 'Internal control assessment']
    },
    {
      id: 2,
      title: 'Internal Audit',
      description: 'Risk-based internal audit solutions to strengthen governance and operational efficiency.',
      icon: <Shield size={28} />,
      features: ['Process optimization', 'Risk assessment', 'Compliance testing', 'Governance review']
    },
    {
      id: 3,
      title: 'Tax Audit',
      description: 'Expert tax audit services under Income Tax Act to ensure accurate tax compliance.',
      icon: <BarChart3 size={28} />,
      features: ['Section 44AB compliance', 'Tax liability verification', 'Documentation support', 'Assessment representation']
    },
    {
      id: 4,
      title: 'GST Audit',
      description: 'Thorough GST audit and reconciliation services for seamless indirect tax compliance.',
      icon: <Building2 size={28} />,
      features: ['GST reconciliation', 'ITC verification', 'Return scrutiny', 'Annual return filing']
    },
    {
      id: 5,
      title: 'Forensic Audit',
      description: 'Specialized forensic auditing for fraud detection and financial investigation.',
      icon: <TrendingUp size={28} />,
      features: ['Fraud investigation', 'Evidence collection', 'Legal support', 'Preventive measures']
    },
    {
      id: 6,
      title: 'Management Audit',
      description: 'Strategic audit services to evaluate management effectiveness and organizational performance.',
      icon: <Users size={28} />,
      features: ['Performance evaluation', 'Strategy alignment', 'Resource optimization', 'Best practices']
    }
  ]

  const stats: StatItem[] = [
    { value: '500+', label: 'Audits Completed' },
    { value: '98%', label: 'Client Retention' },
    { value: '50+', label: 'Expert Auditors' },
    { value: '15+', label: 'Years of Excellence' }
  ]

  const approachSteps = [
    { number: '01', title: 'Understanding', desc: 'Deep dive into your business processes and risk landscape.' },
    { number: '02', title: 'Planning', desc: 'Strategic audit planning with clear objectives and timelines.' },
    { number: '03', title: 'Execution', desc: 'Meticulous execution using modern audit methodologies.' },
    { number: '04', title: 'Reporting', desc: 'Comprehensive reports with actionable insights.' }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ['.assurance-hero__badge', '.assurance-hero__title', '.assurance-hero__sub', '.assurance-hero__stats'],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
        }
      )

      // Service cards stagger
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
        }
      )

      // Stats counter animation
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(0.4)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        }
      )

      // Approach steps
      gsap.fromTo(
        '.approach-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: approachRef.current, start: 'top 80%' },
        }
      )

      // CTA reveal
      gsap.fromTo(
        '.assurance-cta__inner',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const handleContact = () => {
    // Add your contact navigation logic
    console.log('Navigate to contact')
  }

  return (
    <div className="assurance-page">
      
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="assurance-hero" ref={heroRef}>
        <div className="assurance-hero__bg-overlay" />
        <div className="assurance-hero__inner">
          <h1 className="assurance-hero__title">
            Assurance &<br />
            <em>Audit Services</em>
          </h1>
          
          <p className="assurance-hero__sub">
            Independent, thorough, and trusted assurance solutions that build stakeholder confidence 
            and drive organizational excellence.
          </p>

          <div className="assurance-hero__stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="assurance-hero__stat">
                <span className="assurance-hero__stat-num">{stat.value}</span>
                <span className="assurance-hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="assurance-hero__actions">
            <button className="assurance-btn assurance-btn--primary" onClick={handleContact}>
              Schedule Consultation <ArrowUpRight size={16} />
            </button>
            <button className="assurance-btn assurance-btn--outline" onClick={() => {
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Explore Services <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════ */}
      <section id="services" className="assurance-services section-padding" ref={servicesRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">
              Comprehensive <em>Assurance Solutions</em>
            </h2>
            <p className="section-sub">
              Tailored audit and assurance services designed to meet regulatory requirements 
              and enhance business credibility.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <div 
                key={service.id}
                className={`service-card ${activeService === service.id ? 'service-card--active' : ''}`}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="service-card__icon">
                  {service.icon}
                </div>
                
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                
                <div className={`service-card__features ${activeService === service.id ? 'service-card__features--visible' : ''}`}>
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="service-card__feature">
                      <CheckCircle size={12} />
                      {feature}
                    </span>
                  ))}
                </div>
                
                <button className="service-card__link" onClick={() => handleContact()}>
                  Learn More <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════ */}
      <section className="assurance-stats" ref={statsRef}>
        <div className="container">
          <div className="stats-wrapper">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OUR APPROACH
      ══════════════════════════════════════ */}
      <section className="assurance-approach section-padding" ref={approachRef}>
        <div className="container">
          <div className="approach-grid">
            <div className="approach-content">
              <span className="section-tag">Our Methodology</span>
              <h2 className="section-title">
                A Systematic <em>Approach to Assurance</em>
              </h2>
              <p className="approach-desc">
                Our proven methodology ensures thorough examination, unbiased reporting, 
                and value-added insights that help you make informed decisions.
              </p>
              
              <div className="approach-features">
                <div className="approach-feature">
                  <Award size={20} />
                  <span>IBBI Registered</span>
                </div>
                <div className="approach-feature">
                  <Clock size={20} />
                  <span>Timely Delivery</span>
                </div>
                <div className="approach-feature">
                  <Users size={20} />
                  <span>Expert Team</span>
                </div>
              </div>
            </div>

            <div className="approach-steps">
              {approachSteps.map((step) => (
                <div key={step.number} className="approach-step">
                  <div className="approach-step__number">{step.number}</div>
                  <div className="approach-step__content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="assurance-why section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why JHS</span>
            <h2 className="section-title">
              Why Choose <em>JHS for Assurance</em>
            </h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-card__icon">
                <Briefcase size={24} />
              </div>
              <h3>Industry Expertise</h3>
              <p>Deep domain knowledge across manufacturing, services, financials, and technology sectors.</p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">
                <Shield size={24} />
              </div>
              <h3>Unbiased Reporting</h3>
              <p>Complete independence and objectivity in our audit opinions and recommendations.</p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">
                <TrendingUp size={24} />
              </div>
              <h3>Value-Added Insights</h3>
              <p>Beyond compliance — actionable insights for business improvement and growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      {/* <section className="assurance-cta" ref={ctaRef}>
        <div className="container">
          <div className="assurance-cta__inner">
            <div className="assurance-cta__content">
              <span className="assurance-cta__tag">Get Started</span>
              <h2 className="assurance-cta__title">Ready for a trusted audit partner?</h2>
              <p className="assurance-cta__desc">
                Let's discuss how JHS can strengthen your assurance framework and build stakeholder confidence.
              </p>
            </div>
            <button className="assurance-btn assurance-btn--cta" onClick={handleContact}>
              Schedule a Meeting <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Assurance
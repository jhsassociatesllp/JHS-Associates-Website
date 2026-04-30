import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Factory, 
  TrendingUp, 
  Package, 
  Shield, 
  ArrowRight,
  Download,
  PhoneCall,
  Mail,
  CheckCircle,
  BarChart3,
  Truck,
  Settings,
  Users,
  Award,
  Clock,
  FileCheck
} from 'lucide-react'
import './Manufacturing.css'

gsap.registerPlugin(ScrollTrigger)

const Manufacturing: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const expertiseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ['.man-hero__title', '.man-hero__sub', '.man-hero__cta'],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        }
      )

      // Services cards
      gsap.fromTo(
        '.man-service-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
        }
      )

      // Expertise cards
      gsap.fromTo(
        '.man-expertise-card',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(0.4)',
          scrollTrigger: { trigger: expertiseRef.current, start: 'top 80%' },
        }
      )

      // Approach steps
      gsap.fromTo(
        '.man-approach-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.man-approach', start: 'top 80%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const services = [
    {
      icon: <Settings size={32} />,
      title: 'Operational Excellence',
      description: 'Lean manufacturing, Six Sigma, and process optimization to maximize efficiency and reduce waste.',
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Cost Optimization',
      description: 'Strategic cost reduction initiatives without compromising quality or operational integrity.',
    },
    {
      icon: <Shield size={32} />,
      title: 'Quality Management',
      description: 'ISO certification, quality control systems, and continuous improvement frameworks.',
    },
    {
      icon: <Truck size={32} />,
      title: 'Supply Chain Optimization',
      description: 'End-to-end supply chain management, vendor development, and logistics efficiency.',
    },
    {
      icon: <Factory size={32} />,
      title: 'Plant Setup & Expansion',
      description: 'Greenfield projects, facility planning, and capacity expansion advisory.',
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Regulatory Compliance',
      description: 'Environmental, safety, and industry-specific regulatory compliance management.',
    },
  ]

  const expertiseAreas = [
    {
      icon: <TrendingUp size={24} />,
      title: 'Productivity Improvement',
      description: '20-40% productivity gains through optimized workflows',
    },
    {
      icon: <Package size={24} />,
      title: 'Inventory Management',
      description: 'Reduced carrying costs and improved working capital',
    },
    {
      icon: <Users size={24} />,
      title: 'Workforce Optimization',
      description: 'Right-sizing and skill development programs',
    },
    {
      icon: <Award size={24} />,
      title: 'Quality Certification',
      description: 'ISO 9001, ISO 14001, OHSAS 18001 expertise',
    },
    {
      icon: <Clock size={24} />,
      title: 'Lead Time Reduction',
      description: 'Faster time-to-market and improved customer satisfaction',
    },
    {
      icon: <Shield size={24} />,
      title: 'Risk Management',
      description: 'Proactive identification and mitigation of operational risks',
    },
  ]

  const approachSteps = [
    { 
      step: '01', 
      title: 'Diagnostic Assessment', 
      description: 'Comprehensive evaluation of current operations, processes, and performance metrics.' 
    },
    { 
      step: '02', 
      title: 'Strategy Development', 
      description: 'Tailored improvement roadmap aligned with business objectives and market demands.' 
    },
    { 
      step: '03', 
      title: 'Implementation Support', 
      description: 'Hands-on guidance through execution phase with minimal operational disruption.' 
    },
    { 
      step: '04', 
      title: 'Performance Monitoring', 
      description: 'Continuous tracking of KPIs and real-time adjustments for optimal results.' 
    },
    { 
      step: '05', 
      title: 'Capability Building', 
      description: 'Knowledge transfer and training to ensure sustainable improvements.' 
    },
  ]

  const keyBenefits = [
    'Reduced operational costs by 15-25%',
    'Improved overall equipment effectiveness (OEE)',
    'Enhanced product quality and consistency',
    'Optimized inventory levels and turnover',
    'Streamlined supply chain operations',
    'Better regulatory compliance and safety records',
  ]

  return (
    <div className="man-page">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="man-hero" ref={heroRef}>
        <div className="man-hero__overlay" />
        <div className="man-hero__inner container">
          {/* <span className="man-hero__badge">JHS & Associates</span> */}
          <h1 className="man-hero__title">
            Manufacturing <em>Excellence</em>
          </h1>
          <p className="man-hero__sub">
            Transform your manufacturing operations with our comprehensive consulting solutions. 
            From operational efficiency to regulatory compliance, we help you build world-class manufacturing capabilities.
          </p>
          <div className="man-hero__cta">
            <button className="man-btn man-btn--primary">
              Consult an Expert <ArrowRight size={16} />
            </button>
            <button className="man-btn man-btn--outline">
              <PhoneCall size={14} />
              +91 98765 43210
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════ */}
      <section className="man-services container" ref={servicesRef}>
        <div className="man-section-header">
          <span className="man-section-tag">What We Offer</span>
          <h2 className="man-section-title">
            Comprehensive <span className="man-accent">Manufacturing</span> Solutions
          </h2>
          <p className="man-section-sub">
            End-to-end consulting services designed to optimize your manufacturing operations
          </p>
        </div>

        <div className="man-services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="man-service-card">
              <div className="man-service-card__icon">{service.icon}</div>
              <h3 className="man-service-card__title">{service.title}</h3>
              <p className="man-service-card__desc">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          EXPERTISE SECTION
      ══════════════════════════════════════ */}
      <section className="man-expertise" ref={expertiseRef}>
        <div className="container">
          <div className="man-section-header">
            <span className="man-section-tag">Our Expertise</span>
            <h2 className="man-section-title">
              Where We <span className="man-accent">Excel</span>
            </h2>
            <p className="man-section-sub">
              Proven expertise across critical manufacturing domains
            </p>
          </div>

          <div className="man-expertise-grid">
            {expertiseAreas.map((area, idx) => (
              <div key={idx} className="man-expertise-card">
                <div className="man-expertise-card__icon">{area.icon}</div>
                <h3 className="man-expertise-card__title">{area.title}</h3>
                <p className="man-expertise-card__desc">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENEFITS + APPROACH SECTION
      ══════════════════════════════════════ */}
      <section className="man-benefits-approach">
        <div className="container">
          <div className="man-benefits-approach__grid">
            {/* Key Benefits */}
            <div className="man-benefits">
              <span className="man-section-tag">Why Choose Us</span>
              <h2 className="man-section-title">
                Tangible <span className="man-accent">Results</span>
              </h2>
              <p className="man-section-sub">
                Our clients achieve measurable improvements across their manufacturing operations
              </p>
              <div className="man-benefits-list">
                {keyBenefits.map((benefit, idx) => (
                  <div key={idx} className="man-benefit-item">
                    <CheckCircle size={18} className="man-benefit-item__check" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="man-btn man-btn--primary man-btn--download">
                <Download size={14} />
                Download Service Brochure
              </button>
            </div>

            {/* Approach Steps */}
            <div className="man-approach">
              <span className="man-section-tag">Our Methodology</span>
              <h2 className="man-section-title">
                Proven <span className="man-accent">5-Step</span> Approach
              </h2>
              <div className="man-approach-steps">
                {approachSteps.map((step) => (
                  <div key={step.step} className="man-approach-step">
                    <div className="man-approach-step__number">{step.step}</div>
                    <div className="man-approach-step__content">
                      <h3 className="man-approach-step__title">{step.title}</h3>
                      <p className="man-approach-step__desc">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INDUSTRY STATS SECTION
      ══════════════════════════════════════ */}
      <section className="man-stats">
        <div className="container">
          <div className="man-stats__inner">
            <div className="man-stat">
              <span className="man-stat__number">100+</span>
              <span className="man-stat__label">Manufacturing Clients</span>
            </div>
            <div className="man-stat">
              <span className="man-stat__number">₹500Cr+</span>
              <span className="man-stat__label">Cost Savings Delivered</span>
            </div>
            <div className="man-stat">
              <span className="man-stat__number">35%</span>
              <span className="man-stat__label">Avg. Productivity Gain</span>
            </div>
            <div className="man-stat">
              <span className="man-stat__number">20+</span>
              <span className="man-stat__label">Industry Verticals</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="man-cta">
        <div className="container">
          <div className="man-cta__inner">
            <h2 className="man-cta__title">Ready to Transform Your Manufacturing Operations?</h2>
            <p className="man-cta__sub">
              Partner with JHS & Associates for expert guidance and measurable results.
            </p>
            <div className="man-cta__buttons">
              <button className="man-btn man-btn--light">
                <Mail size={14} />
                connect@jhsassociates.com
              </button>
              <button className="man-btn man-btn--light">
                <PhoneCall size={14} />
                +91 98765 43210
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Manufacturing
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Users, 
  Clock, 
  ArrowUpRight, 
  Building2,
  FileText,
  Calculator,
  Headphones,
  TrendingUp,
  Shield,
  CheckCircle2,
  ChevronRight,
  Award,
  BarChart3,
  Globe,
  Coffee
} from 'lucide-react'
import './Outsourcing.css'

gsap.registerPlugin(ScrollTrigger)

interface OutsourcingService {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
}

interface StatItem {
  value: string
  label: string
}

const Outsourcing: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [selectedService, setSelectedService] = useState<number | null>(null)

  const outsourcingServices: OutsourcingService[] = [
    {
      id: 1,
      title: 'Finance & Accounting',
      description: 'End-to-end finance and accounting outsourcing for accurate financial management.',
      icon: <Calculator size={28} />,
      benefits: ['Bookkeeping services', 'Payroll management', 'Financial reporting', 'Accounts payable/receivable']
    },
    {
      id: 2,
      title: 'Tax Outsourcing',
      description: 'Complete tax compliance and return processing services for businesses of all sizes.',
      icon: <FileText size={28} />,
      benefits: ['Tax return preparation', 'TDS/TCS compliance', 'Tax planning', 'Assessment support']
    },
    {
      id: 3,
      title: 'Payroll Management',
      description: 'Seamless payroll processing with statutory compliance and employee self-service.',
      icon: <Users size={28} />,
      benefits: ['Salary processing', 'Statutory deductions', 'Payslip generation', 'Annual returns']
    },
    {
      id: 4,
      title: 'Compliance Outsourcing',
      description: 'Stay compliant with automated regulatory filing and monitoring services.',
      icon: <Shield size={28} />,
      benefits: ['ROC compliance', 'GST filing', 'Company secretary services', 'Regulatory updates']
    },
    {
      id: 5,
      title: 'Customer Support',
      description: 'Professional customer service outsourcing to enhance client satisfaction.',
      icon: <Headphones size={28} />,
      benefits: ['24/7 support', 'Multi-channel service', 'Ticket management', 'Customer retention']
    },
    {
      id: 6,
      title: 'Back Office Operations',
      description: 'Streamlined back-office support to reduce costs and improve efficiency.',
      icon: <Building2 size={28} />,
      benefits: ['Data entry', 'Document management', 'Process automation', 'Quality control']
    }
  ]

  const stats: StatItem[] = [
    { value: '200+', label: 'Clients Served' },
    { value: '50+', label: 'Expert Team' },
    { value: '99%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Support Available' }
  ]

  const keyBenefits = [
    { icon: <TrendingUp size={24} />, title: 'Cost Efficiency', desc: 'Save up to 40% on operational costs' },
    { icon: <Clock size={24} />, title: 'Time Savings', desc: 'Focus on core business activities' },
    { icon: <Globe size={24} />, title: 'Scalability', desc: 'Flexible resources as you grow' },
    { icon: <Award size={24} />, title: 'Expertise', desc: 'Access to specialized professionals' }
  ]

  const processSteps = [
    { number: '01', title: 'Assessment', desc: 'Understand your business needs and requirements.' },
    { number: '02', title: 'Transition', desc: 'Smooth knowledge transfer and team onboarding.' },
    { number: '03', title: 'Execution', desc: 'Dedicated team handling your operations.' },
    { number: '04', title: 'Optimization', desc: 'Continuous improvement and quality checks.' }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ['.outsourcing-hero__badge', '.outsourcing-hero__title', '.outsourcing-hero__sub', '.outsourcing-hero__stats'],
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
        '.outsource-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
        }
      )

      // Benefits cards
      gsap.fromTo(
        '.benefit-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(0.4)',
          scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' },
        }
      )

      // Process steps
      gsap.fromTo(
        '.outsource-process-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: processRef.current, start: 'top 80%' },
        }
      )

      // CTA reveal
      gsap.fromTo(
        '.outsourcing-cta__inner',
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
    console.log('Navigate to contact')
  }

  const scrollToServices = () => {
    document.getElementById('outsource-services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="outsourcing-page">
      
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="outsourcing-hero" ref={heroRef}>
        <div className="outsourcing-hero__bg-overlay" />
        <div className="outsourcing-hero__pattern" />
        <div className="outsourcing-hero__inner">
          {/* <div className="outsourcing-hero__badge">
            <Coffee size={14} />
            <span>JHS & Associates</span>
          </div> */}
          
          <h1 className="outsourcing-hero__title">
            Smart <em>Outsourcing</em><br />
            Solutions
          </h1>
          
          <p className="outsourcing-hero__sub">
            Focus on what matters most while we handle your non-core operations. 
            Cost-effective, scalable, and reliable outsourcing services tailored to your needs.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════ */}
      <section id="outsource-services" className="outsourcing-services section-padding" ref={servicesRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Outsource</span>
            <h2 className="section-title">
              Comprehensive <em>Outsourcing Services</em>
            </h2>
            <p className="section-sub">
              End-to-end outsourcing solutions that reduce costs, improve efficiency, and drive growth.
            </p>
          </div>

          <div className="outsource-grid">
            {outsourcingServices.map((service) => (
              <div 
                key={service.id}
                className={`outsource-card ${selectedService === service.id ? 'outsource-card--active' : ''}`}
                onMouseEnter={() => setSelectedService(service.id)}
                onMouseLeave={() => setSelectedService(null)}
              >
                <div className="outsource-card__icon">
                  {service.icon}
                </div>
                
                <h3 className="outsource-card__title">{service.title}</h3>
                <p className="outsource-card__desc">{service.description}</p>
                
                <div className={`outsource-card__benefits ${selectedService === service.id ? 'outsource-card__benefits--visible' : ''}`}>
                  {service.benefits.map((benefit, idx) => (
                    <span key={idx} className="outsource-card__benefit">
                      <CheckCircle2 size={12} />
                      {benefit}
                    </span>
                  ))}
                </div>
                
                <button className="outsource-card__link" onClick={handleContact}>
                  Learn More <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KEY BENEFITS SECTION
      ══════════════════════════════════════ */}
      <section className="outsourcing-benefits section-padding" ref={benefitsRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Outsource</span>
            <h2 className="section-title">
              Key <em>Benefits</em> of Outsourcing
            </h2>
            <p className="section-sub">
              Transform your business operations with strategic outsourcing partnerships.
            </p>
          </div>

          <div className="benefits-grid">
            {keyBenefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <div className="benefit-card__icon">
                  {benefit.icon}
                </div>
                <h3 className="benefit-card__title">{benefit.title}</h3>
                <p className="benefit-card__desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS SECTION (Alternate Style)
      ══════════════════════════════════════ */}
      <section className="outsourcing-stats">
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
          OUR PROCESS
      ══════════════════════════════════════ */}
      <section className="outsourcing-process section-padding" ref={processRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How We Work</span>
            <h2 className="section-title">
              Our <em>Outsourcing Process</em>
            </h2>
            <p className="section-sub">
              A seamless transition process designed for minimal disruption and maximum efficiency.
            </p>
          </div>

          <div className="outsource-process-grid">
            {processSteps.map((step, idx) => (
              <div key={step.number} className="outsource-process-step">
                <div className="outsource-process-step__connector">
                  {idx < processSteps.length - 1 && <div className="outsource-process-step__line" />}
                </div>
                <div className="outsource-process-step__number">{step.number}</div>
                <h3 className="outsource-process-step__title">{step.title}</h3>
                <p className="outsource-process-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE JHS OUTSOURCING
      ══════════════════════════════════════ */}
      <section className="outsourcing-why section-padding">
        <div className="container">
          <div className="why-outsource-grid">
            <div className="why-outsource-card">
              <div className="why-outsource-card__icon">
                <Shield size={24} />
              </div>
              <h3>Data Security</h3>
              <p>ISO-certified security protocols and confidentiality agreements.</p>
            </div>
            <div className="why-outsource-card">
              <div className="why-outsource-card__icon">
                <Clock size={24} />
              </div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock support and operations for your business.</p>
            </div>
            <div className="why-outsource-card">
              <div className="why-outsource-card__icon">
                <BarChart3 size={24} />
              </div>
              <h3>Performance Tracking</h3>
              <p>Regular reports and KPIs to measure service quality.</p>
            </div>
            <div className="why-outsource-card">
              <div className="why-outsource-card__icon">
                <Users size={24} />
              </div>
              <h3>Dedicated Team</h3>
              <p>Experienced professionals assigned to your account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      {/* <section className="outsourcing-cta" ref={ctaRef}>
        <div className="container">
          <div className="outsourcing-cta__inner">
            <div className="outsourcing-cta__content">
              <span className="outsourcing-cta__tag">Start Your Journey</span>
              <h2 className="outsourcing-cta__title">Ready to outsource with confidence?</h2>
              <p className="outsourcing-cta__desc">
                Let's discuss how JHS Outsourcing can help you reduce costs and improve efficiency.
              </p>
            </div>
            <button className="outsource-btn outsource-btn--cta" onClick={handleContact}>
              Get a Free Consultation <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Outsourcing
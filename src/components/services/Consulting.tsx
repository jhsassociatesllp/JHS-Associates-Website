import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Building2,
  LineChart,
  Briefcase,
  Target,
  Clock,
  Award,
  ChevronRight,
  CheckCircle2,
  Rocket,
  Shield,
  BarChart4
} from 'lucide-react'
import './Consulting.css'

gsap.registerPlugin(ScrollTrigger)

interface ConsultingService {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  color: string
}

interface IndustryExpertise {
  id: number
  name: string
  icon: React.ReactNode
}

const Consulting: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const expertiseRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [selectedService, setSelectedService] = useState<number | null>(null)

  const consultingServices: ConsultingService[] = [
    {
      id: 1,
      title: 'Strategy Consulting',
      description: 'Transform your business with data-driven strategies that drive sustainable growth and competitive advantage.',
      icon: <Target size={28} />,
      benefits: ['Market entry strategy', 'Growth roadmap', 'Competitive analysis', 'Strategic planning'],
      color: '#c0392b'
    },
    {
      id: 2,
      title: 'Management Consulting',
      description: 'Optimize operations, improve efficiency, and achieve operational excellence across your organization.',
      icon: <Briefcase size={28} />,
      benefits: ['Process optimization', 'Organizational restructuring', 'Performance management', 'Change management'],
      color: '#e67e22'
    },
    {
      id: 3,
      title: 'Financial Consulting',
      description: 'Expert financial guidance to maximize value, reduce costs, and improve financial performance.',
      icon: <TrendingUp size={28} />,
      benefits: ['Financial planning', 'Cost optimization', 'Investment advisory', 'Risk management'],
      color: '#27ae60'
    },
    {
      id: 4,
      title: 'Digital Transformation',
      description: 'Leverage technology to reinvent business processes and create exceptional customer experiences.',
      icon: <Rocket size={28} />,
      benefits: ['Digital strategy', 'Tech stack optimization', 'Automation solutions', 'Innovation roadmap'],
      color: '#3498db'
    },
    {
      id: 5,
      title: 'HR & Talent Consulting',
      description: 'Build high-performing teams and create a culture that attracts, retains, and develops top talent.',
      icon: <Users size={28} />,
      benefits: ['Talent acquisition strategy', 'Leadership development', 'Performance systems', 'Culture transformation'],
      color: '#9b59b6'
    },
    {
      id: 6,
      title: 'Risk & Compliance Consulting',
      description: 'Navigate complex regulatory landscapes and build resilient risk management frameworks.',
      icon: <Shield size={28} />,
      benefits: ['Risk assessment', 'Regulatory compliance', 'Internal controls', 'Governance framework'],
      color: '#e74c3c'
    }
  ]

  const industryExpertise: IndustryExpertise[] = [
    { id: 1, name: 'Financial Services', icon: <Building2 size={20} /> },
    { id: 2, name: 'Manufacturing', icon: <Briefcase size={20} /> },
    { id: 3, name: 'Technology', icon: <Rocket size={20} /> },
    { id: 4, name: 'Healthcare', icon: <Users size={20} /> },
    { id: 5, name: 'Retail & E-commerce', icon: <TrendingUp size={20} /> },
    { id: 6, name: 'Real Estate', icon: <Building2 size={20} /> }
  ]

  const processSteps = [
    { 
      number: '01', 
      title: 'Discovery', 
      desc: 'Deep-dive into your business challenges, goals, and market dynamics.',
      icon: <Lightbulb size={24} />
    },
    { 
      number: '02', 
      title: 'Analysis', 
      desc: 'Data-driven analysis to identify opportunities and develop strategic insights.',
      icon: <BarChart4 size={24} />
    },
    { 
      number: '03', 
      title: 'Strategy Development', 
      desc: 'Collaborative creation of actionable strategies tailored to your unique needs.',
      icon: <Target size={24} />
    },
    { 
      number: '04', 
      title: 'Implementation', 
      desc: 'Hands-on support to execute strategies and measure impact effectively.',
      icon: <CheckCircle2 size={24} />
    }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ['.consulting-hero__badge', '.consulting-hero__title', '.consulting-hero__sub', '.consulting-hero__stats'],
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
        '.consulting-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
        }
      )

      // Expertise pills
      gsap.fromTo(
        '.expertise-pill',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(0.4)',
          scrollTrigger: { trigger: expertiseRef.current, start: 'top 80%' },
        }
      )

      // Process steps
      gsap.fromTo(
        '.process-step',
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
        '.consulting-cta__inner',
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
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="consulting-page">
      
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="consulting-hero" ref={heroRef}>
        <div className="consulting-hero__bg-overlay" />
        <div className="consulting-hero__pattern" />
        <div className="consulting-hero__inner">
          {/* <div className="consulting-hero__badge">
            <Lightbulb size={14} />
            <span>JHS & Associates</span>
          </div> */}
          
          <h1 className="consulting-hero__title">
            Strategic <em>Consulting</em><br />
            for Growth
          </h1>
          
          <p className="consulting-hero__sub">
            Transform challenges into opportunities with expert guidance. We help businesses 
            navigate complexity, drive innovation, and achieve sustainable success.
          </p>

  
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════ */}
      <section id="services" className="consulting-services section-padding" ref={servicesRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">
              <em>Consulting Services</em> That Drive Results
            </h2>
            <p className="section-sub">
              End-to-end consulting solutions tailored to your unique business challenges and growth objectives.
            </p>
          </div>

          <div className="consulting-grid">
            {consultingServices.map((service) => (
              <div 
                key={service.id}
                className={`consulting-card ${selectedService === service.id ? 'consulting-card--active' : ''}`}
                onMouseEnter={() => setSelectedService(service.id)}
                onMouseLeave={() => setSelectedService(null)}
              >
                <div className="consulting-card__icon" style={{ '--service-color': service.color } as React.CSSProperties}>
                  {service.icon}
                </div>
                
                <h3 className="consulting-card__title">{service.title}</h3>
                <p className="consulting-card__desc">{service.description}</p>
                
                <div className={`consulting-card__benefits ${selectedService === service.id ? 'consulting-card__benefits--visible' : ''}`}>
                  {service.benefits.map((benefit, idx) => (
                    <span key={idx} className="consulting-card__benefit">
                      <CheckCircle2 size={12} />
                      {benefit}
                    </span>
                  ))}
                </div>
                
                <button className="consulting-card__link" onClick={handleContact}>
                  Learn More <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INDUSTRY EXPERTISE
      ══════════════════════════════════════ */}
      <section className="consulting-expertise section-padding" ref={expertiseRef}>
        <div className="container">
          <div className="expertise-wrapper">
            <div className="expertise-content">
              <span className="section-tag">Industry Focus</span>
              <h2 className="section-title">
                Deep <em>Industry Expertise</em>
              </h2>
              <p className="expertise-desc">
                Our consultants bring deep domain knowledge across key sectors, 
                ensuring relevant insights and practical solutions for your industry.
              </p>
              <div className="expertise-stats">
                <div className="expertise-stat">
                  <span className="expertise-stat__value">15+</span>
                  <span className="expertise-stat__label">Years Average Experience</span>
                </div>
                <div className="expertise-stat">
                  <span className="expertise-stat__value">100%</span>
                  <span className="expertise-stat__label">Client-First Approach</span>
                </div>
              </div>
            </div>
            
            <div className="expertise-pills">
              {industryExpertise.map((industry) => (
                <div key={industry.id} className="expertise-pill">
                  {industry.icon}
                  <span>{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OUR PROCESS
      ══════════════════════════════════════ */}
      <section className="consulting-process section-padding" ref={processRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How We Work</span>
            <h2 className="section-title">
              Our Proven <em>Consulting Process</em>
            </h2>
            <p className="section-sub">
              A structured, collaborative approach that ensures clarity, alignment, and measurable results.
            </p>
          </div>

          <div className="process-grid">
            {processSteps.map((step, idx) => (
              <div key={step.number} className="process-step">
                <div className="process-step__connector">
                  {idx < processSteps.length - 1 && <div className="process-step__line" />}
                </div>
                <div className="process-step__icon">
                  {step.icon}
                </div>
                <div className="process-step__number">{step.number}</div>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE JHS CONSULTING
      ══════════════════════════════════════ */}
      <section className="consulting-why section-padding">
        <div className="container">
          <div className="why-consulting-grid">
            <div className="why-consulting-card">
              <div className="why-consulting-card__icon">
                <Award size={24} />
              </div>
              <h3>Proven Track Record</h3>
              <p>200+ successful consulting engagements across industries with measurable business impact.</p>
            </div>
            <div className="why-consulting-card">
              <div className="why-consulting-card__icon">
                <Users size={24} />
              </div>
              <h3>Experienced Team</h3>
              <p>Former industry leaders and strategy experts with decades of collective experience.</p>
            </div>
            <div className="why-consulting-card">
              <div className="why-consulting-card__icon">
                <LineChart size={24} />
              </div>
              <h3>Data-Driven Approach</h3>
              <p>Analytics-backed recommendations that drive informed decision-making.</p>
            </div>
            <div className="why-consulting-card">
              <div className="why-consulting-card__icon">
                <Clock size={24} />
              </div>
              <h3>Timely Delivery</h3>
              <p>Commitment to deadlines without compromising on quality or depth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      {/* <section className="consulting-cta" ref={ctaRef}>
        <div className="container">
          <div className="consulting-cta__inner">
            <div className="consulting-cta__content">
              <span className="consulting-cta__tag">Transform Your Business</span>
              <h2 className="consulting-cta__title">Ready to unlock your business potential?</h2>
              <p className="consulting-cta__desc">
                Let's discuss how JHS Consulting can help you achieve your strategic goals and drive sustainable growth.
              </p>
            </div>
            <button className="consulting-btn consulting-btn--cta" onClick={handleContact}>
              Schedule a Consultation <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Consulting
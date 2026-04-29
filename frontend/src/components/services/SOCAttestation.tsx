import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Shield, 
  FileCheck, 
  TrendingUp, 
  Lock, 
  ArrowRight,
  Download,
  PhoneCall,
  Mail,
  CheckCircle,
  Clock,
  Users,
  Award,
  BarChart3,
  Eye
} from 'lucide-react'
import './SOCAttestation.css'

gsap.registerPlugin(ScrollTrigger)

const SOCAttestation: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const standardsRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ['.soc-hero__title', '.soc-hero__sub', '.soc-hero__cta'],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        }
      )

      // Standards cards
      gsap.fromTo(
        '.soc-standard-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: standardsRef.current, start: 'top 85%' },
        }
      )

      // Benefits grid
      gsap.fromTo(
        '.soc-benefit-card',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(0.4)',
          scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' },
        }
      )

      // Why choose us
      gsap.fromTo(
        '.soc-why-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.soc-why', start: 'top 80%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const socStandards = [
    {
      icon: <FileCheck size={32} />,
      title: 'SOC 1 (SSAE 18)',
      subtitle: 'Internal Control over Financial Reporting',
      description: 'For service organizations whose services impact clients\' financial statements. Essential for payroll processors, loan servicers, and investment advisors.',
      useCase: 'Payroll processors, Loan servicers, Investment advisors',
    },
    {
      icon: <Shield size={32} />,
      title: 'SOC 2',
      subtitle: 'Trust Service Criteria',
      description: 'Based on five trust service criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. Industry standard for SaaS and tech companies.',
      useCase: 'SaaS platforms, Cloud providers, Data centers, IT services',
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'SOC 3',
      subtitle: 'General Use Report',
      description: 'Simplified, publicly available version of SOC 2 report. Perfect for marketing and website display to build customer trust.',
      useCase: 'Public websites, Marketing materials, RFP responses',
    },
  ]

  const benefits = [
    {
      icon: <TrendingUp size={24} />,
      title: 'Build Customer Trust',
      description: 'Demonstrate your commitment to security and compliance',
    },
    {
      icon: <Lock size={24} />,
      title: 'Strengthen Security',
      description: 'Identify and address control gaps proactively',
    },
    {
      icon: <Users size={24} />,
      title: 'Win More Deals',
      description: 'Many enterprises require SOC reports from vendors',
    },
    {
      icon: <Award size={24} />,
      title: 'Competitive Edge',
      description: 'Stand out from competitors without attestation',
    },
    {
      icon: <Clock size={24} />,
      title: 'Reduce Audits',
      description: 'Replace customer audits with one SOC report',
    },
    {
      icon: <Eye size={24} />,
      title: 'Risk Management',
      description: 'Proactively manage operational and security risks',
    },
  ]

  const whyChooseUs = [
    'Licensed CPA firm with specialized SOC practice',
    'Experienced in over 100+ SOC engagements',
    'End-to-end readiness assessment and gap analysis',
    'Custom control matrices tailored to your operations',
    'Efficient project management with clear timelines',
    'Post-report support for customer inquiries',
  ]

  const processSteps = [
    { step: '01', title: 'Readiness Assessment', description: 'We evaluate your current controls against SOC requirements and identify gaps.' },
    { step: '02', title: 'Remediation Planning', description: 'Develop and implement controls to address any gaps found during assessment.' },
    { step: '03', title: 'Control Testing', description: 'Rigorous testing of control design and operating effectiveness.' },
    { step: '04', title: 'Report Preparation', description: 'Drafting the SOC report with detailed description of controls and test results.' },
    { step: '05', title: 'Issuance & Support', description: 'Final report issuance with ongoing support for customer questions.' },
  ]

  return (
    <div className="soc-page">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="soc-hero" ref={heroRef}>
        <div className="soc-hero__overlay" />
        <div className="soc-hero__inner container">
          <span className="soc-hero__badge">JHS & Associates</span>
          <h1 className="soc-hero__title">
            SOC <em>Attestation</em>
          </h1>
          <p className="soc-hero__sub">
            System and Organization Controls (SOC) attestation services that validate your 
            internal controls, build customer trust, and demonstrate your commitment to security.
          </p>
          <div className="soc-hero__cta">
            <button className="soc-btn soc-btn--primary">
              Get a Quote <ArrowRight size={16} />
            </button>
            <button className="soc-btn soc-btn--outline">
              <PhoneCall size={14} />
              +91 98765 43210
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOC STANDARDS SECTION
      ══════════════════════════════════════ */}
      <section className="soc-standards container" ref={standardsRef}>
        <div className="soc-section-header">
          <span className="soc-section-tag">Understanding SOC</span>
          <h2 className="soc-section-title">
            Choose the Right <span className="soc-accent">SOC Report</span>
          </h2>
          <p className="soc-section-sub">
            We help you determine which SOC report best aligns with your business needs and customer requirements.
          </p>
        </div>

        <div className="soc-standards-grid">
          {socStandards.map((standard, idx) => (
            <div key={idx} className="soc-standard-card">
              <div className="soc-standard-card__icon">{standard.icon}</div>
              <h3 className="soc-standard-card__title">{standard.title}</h3>
              <p className="soc-standard-card__subtitle">{standard.subtitle}</p>
              <p className="soc-standard-card__desc">{standard.description}</p>
              <div className="soc-standard-card__use-case">
                <span className="soc-use-label">Best for:</span>
                <span className="soc-use-text">{standard.useCase}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENEFITS SECTION
      ══════════════════════════════════════ */}
      <section className="soc-benefits" ref={benefitsRef}>
        <div className="container">
          <div className="soc-section-header">
            <span className="soc-section-tag">Why Get SOC Attestation</span>
            <h2 className="soc-section-title">
              Key <span className="soc-accent">Benefits</span>
            </h2>
            <p className="soc-section-sub">
              SOC attestation provides tangible value for your organization and customers
            </p>
          </div>

          <div className="soc-benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="soc-benefit-card">
                <div className="soc-benefit-card__icon">{benefit.icon}</div>
                <h3 className="soc-benefit-card__title">{benefit.title}</h3>
                <p className="soc-benefit-card__desc">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US + PROCESS
      ══════════════════════════════════════ */}
      <section className="soc-why-process">
        <div className="container">
          <div className="soc-why-process__grid">
            {/* Why Choose Us */}
            <div className="soc-why">
              <span className="soc-section-tag">Why JHS</span>
              <h2 className="soc-section-title">
                Why Choose <span className="soc-accent">Us?</span>
              </h2>
              <p className="soc-section-sub">
                Partner with experienced SOC attestation specialists
              </p>
              <div className="soc-why-list">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="soc-why-item">
                    <CheckCircle size={18} className="soc-why-item__check" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="soc-btn soc-btn--primary soc-btn--download">
                <Download size={14} />
                Download SOC Service Guide
              </button>
            </div>

            {/* Process Steps */}
            <div className="soc-process">
              <span className="soc-section-tag">Our Approach</span>
              <h2 className="soc-section-title">
                Simple <span className="soc-accent">5-Step</span> Process
              </h2>
              <div className="soc-process-steps">
                {processSteps.map((step) => (
                  <div key={step.step} className="soc-process-step">
                    <div className="soc-process-step__number">{step.step}</div>
                    <div className="soc-process-step__content">
                      <h3 className="soc-process-step__title">{step.title}</h3>
                      <p className="soc-process-step__desc">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST INDICATORS
      ══════════════════════════════════════ */}
      <section className="soc-trust">
        <div className="container">
          <div className="soc-trust__inner">
            <div className="soc-trust__stats">
              <div className="soc-stat">
                <span className="soc-stat__number">100+</span>
                <span className="soc-stat__label">SOC Engagements</span>
              </div>
              <div className="soc-stat">
                <span className="soc-stat__number">50+</span>
                <span className="soc-stat__label">Happy Clients</span>
              </div>
              <div className="soc-stat">
                <span className="soc-stat__number">99%</span>
                <span className="soc-stat__label">Success Rate</span>
              </div>
              <div className="soc-stat">
                <span className="soc-stat__number">15+</span>
                <span className="soc-stat__label">Industries Served</span>
              </div>
            </div>
            <div className="soc-trust__quote">
              <p>"JHS provided exceptional SOC 2 guidance. Their team was knowledgeable, responsive, and helped us achieve attestation within 3 months."</p>
              <span className="soc-trust__author">— CTO, Leading SaaS Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className="soc-cta">
        <div className="container">
          <div className="soc-cta__inner">
            <h2 className="soc-cta__title">Ready to Get SOC Attested?</h2>
            <p className="soc-cta__sub">
              Start your compliance journey today. Get a free consultation with our SOC specialists.
            </p>
            <div className="soc-cta__buttons">
              <button className="soc-btn soc-btn--light">
                <Mail size={14} />
                connect@jhsassociates.com
              </button>
              <button className="soc-btn soc-btn--light">
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

export default SOCAttestation
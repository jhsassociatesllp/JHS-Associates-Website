import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FileText,
  Settings,
  ShieldAlert,
  BarChart,
  Activity,
  Users,
  Briefcase,
  Layers,
  FileCheck,
  GitMerge,
  TrendingUp,
  Globe,
  ArrowRight
} from 'lucide-react'
import './Consulting.css'
import ConsultingImg from '../../image/Consulting.png' // Using an Indian image as requested

gsap.registerPlugin(ScrollTrigger)

interface ConsultingServiceItem {
  id: string
  title: string
  icon: React.ReactNode
}

const consultingData: ConsultingServiceItem[] = [
  {
    id: "01",
    title: "Company Incorporation and regulatory setup services",
    icon: <FileText size={28} strokeWidth={1.5} />
  },
  {
    id: "02",
    title: "Internal Financial Controls, SOP design & automation",
    icon: <Settings size={28} strokeWidth={1.5} />
  },
  {
    id: "03",
    title: "Risk Management Frameworks and fraud investigations",
    icon: <ShieldAlert size={28} strokeWidth={1.5} />
  },
  {
    id: "04",
    title: "Business Advisory, Valuation, and field verification studies",
    icon: <BarChart size={28} strokeWidth={1.5} />
  },
  {
    id: "05",
    title: "Efficiency Improvement and process optimization consulting",
    icon: <Activity size={28} strokeWidth={1.5} />
  },
  {
    id: "06",
    title: "Family Arbitration, Private Trust & Succession Planning",
    icon: <Users size={28} strokeWidth={1.5} />
  },
  {
    id: "07",
    title: "Secretarial Practice, Company Law Compliance & Due Diligence",
    icon: <Briefcase size={28} strokeWidth={1.5} />
  },
  {
    id: "08",
    title: "Internal Control Evaluation, Business Impact & Continuity Planning",
    icon: <Layers size={28} strokeWidth={1.5} />
  },
  {
    id: "09",
    title: "Annual Return Filing, and statutory compliance management",
    icon: <FileCheck size={28} strokeWidth={1.5} />
  },
  {
    id: "10",
    title: "Merger, Acquisition, Demerger & Reorganization Planning",
    icon: <GitMerge size={28} strokeWidth={1.5} />
  },
  {
    id: "11",
    title: "Financial Forecasting, Working Capital & Business Valuation Support",
    icon: <TrendingUp size={28} strokeWidth={1.5} />
  },
  {
    id: "12",
    title: "FEMA Advisory, Project Feasibility Reports & Liquidation Assistance",
    icon: <Globe size={28} strokeWidth={1.5} />
  }
]

export default function Consulting() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        '.c-hero__content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )

      // Service cards staggered entrance
      gsap.fromTo(
        '.c-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="c-page">

      {/* ════ HERO SECTION ════ */}
      <section className="c-hero" ref={heroRef}>
        <div className="c-hero__bg" style={{ backgroundImage: `url('${ConsultingImg}')` }} />
        <div className="c-hero__overlay" />

        <div className="c-container">
          <div className="c-hero__content">
            <span className="c-eyebrow">Expert Advisory</span>
            <h1 className="c-title">Consulting Services</h1>
            <p className="c-subtitle">
              Comprehensive strategic, financial, and operational guidance tailored to drive sustainable enterprise growth.
            </p>
          </div>
        </div>
      </section>

      {/* ════ SERVICES GRID ════ */}
      <section className="c-services">
        <div className="c-container">
          <div className="c-services__header">
            <h2>Our Capabilities</h2>
            <div className="c-divider" />
            <p>We deliver actionable insights and execution support across 12 core consulting verticals, ensuring end-to-end organizational excellence.</p>
          </div>

          <div className="c-grid" ref={gridRef}>
            {consultingData.map((item) => (
              <div key={item.id} className="c-card">
                <div className="c-card__top">
                  <span className="c-card__number">{item.id}</span>
                  <div className="c-card__icon">{item.icon}</div>
                </div>
                <h3 className="c-card__title">{item.title}</h3>
                <div className="c-card__footer">
                  <span className="c-card__explore">Explore <ArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA (CLEAN WHITE) ════ */}
      <section className="c-cta">
        <div className="c-container">
          <div className="c-cta__box">
            <h2>Looking for tailored solutions?</h2>
            <p>Our consulting partners are ready to discuss your unique business challenges.</p>
            <button className="c-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section>

    </div>
  )
}
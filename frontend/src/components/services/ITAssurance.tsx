import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Shield, Search, Activity, Database, CheckCircle2, TrendingUp,
  Server, Lock, RefreshCw, Monitor, Users, GitBranch, Settings,
  AlertTriangle, Cloud, Cpu, Eye, HardDrive, Wifi, FileText, Layers
} from 'lucide-react'
import './ITAssurance.css'
import { imageUrl } from '../../utils/imageUrl'

gsap.registerPlugin(ScrollTrigger)

/* ─── IT Assurance Services ─── */
const itServices = [
  { id: "01", title: "End-to-End Information Security Reviews", icon: <Shield size={26} strokeWidth={1.5} /> },
  { id: "02", title: "Third Party Reviews", icon: <Users size={26} strokeWidth={1.5} /> },
  { id: "03", title: "BCP / Resilience Reviews", icon: <RefreshCw size={26} strokeWidth={1.5} /> },
  { id: "04", title: "ERP / Application Reviews", icon: <Layers size={26} strokeWidth={1.5} /> },
  { id: "05", title: "Data Migration Reviews", icon: <Database size={26} strokeWidth={1.5} /> },
  { id: "06", title: "User Access Control & Role Reviews", icon: <Lock size={26} strokeWidth={1.5} /> },
  { id: "07", title: "IT Project Management Reviews", icon: <GitBranch size={26} strokeWidth={1.5} /> },
  { id: "08", title: "IT General Control Reviews", icon: <Settings size={26} strokeWidth={1.5} /> },
  { id: "09", title: "ISO 27001 Gap Assessments", icon: <Search size={26} strokeWidth={1.5} /> },
  { id: "10", title: "IT Internal Audits", icon: <FileText size={26} strokeWidth={1.5} /> },
  { id: "11", title: "Vulnerability Assessments", icon: <AlertTriangle size={26} strokeWidth={1.5} /> },
]

/* ─── End-to-End Technology Audit Domains ─── */
const technologyAuditDomains = [
  {
    category: "Policy & Architecture",
    icon: <FileText size={22} strokeWidth={1.5} />,
    items: [
      "IT Policy & Procedures Review",
      "Network Management & Architecture Review",
      "IT Strategy Review",
      "IT Security & Organisational Structure Review",
    ]
  },
  {
    category: "Access & Application Controls",
    icon: <Lock size={22} strokeWidth={1.5} />,
    items: [
      "Access Controls System & Monitoring",
      "Application Controls Review",
      "IT Operations Review",
      "IT Asset Management Review",
    ]
  },
  {
    category: "Development & Change",
    icon: <GitBranch size={22} strokeWidth={1.5} />,
    items: [
      "System Development Review",
      "Change Control",
      "IT Project Management Reviews",
      "ERP / Application Reviews",
    ]
  },
  {
    category: "Physical & Environmental Security",
    icon: <Eye size={22} strokeWidth={1.5} />,
    items: [
      "Physical & Environmental Security",
      "Building Management Systems",
      "Surveillance Systems & Camera Monitoring",
      "Backup, Fire Detection & Prevention System",
      "Temperature & Humidity, Power Supply & Backup",
      "Lightning Protection & Pest Control",
    ]
  },
  {
    category: "Compliance & Access Registers",
    icon: <Monitor size={22} strokeWidth={1.5} />,
    items: [
      "Maintenance of Visitors Register",
      "Attendance Register",
      "Material In & Out Register",
    ]
  },
  {
    category: "Resilience & Cyber Security",
    icon: <Shield size={22} strokeWidth={1.5} />,
    items: [
      "Business Continuity Management Review",
      "Disaster Recovery Drills Review",
      "Backup & Recovery Controls",
      "Anti-Virus and Malware Protection Controls",
      "Incident Management",
      "End-Point Security Controls",
      "Cyber Security Controls & Cloud Privacy / Security",
    ]
  },
]

/* ─── Benchmarks ─── */
const benchmarks = [
  { label: "COBIT / ISACA", desc: "Global framework for IT governance & management", icon: <Cpu size={22} strokeWidth={1.5} /> },
  { label: "CERT-In", desc: "Government of India's national nodal agency for cyber security", icon: <Shield size={22} strokeWidth={1.5} /> },
]

/* ─── VAPT Details ─── */
const vaptProcess = [
  { step: "01", title: "Annual VAPT Plan", desc: "Prepare a comprehensive annual plan for Vulnerability Assessment & Penetration Testing" },
  { step: "02", title: "Execution", desc: "Execute VAPT using Black Box or White Box approach as per management preference, from JHS office remotely" },
  { step: "03", title: "Vulnerability Reporting", desc: "Report identified vulnerabilities with severity ratings and recommended mitigating controls" },
  { step: "04", title: "Action Tracking", desc: "Track status of management's plan of action devised to mitigate reported risks" },
]

const threatTypes = [
  { label: "Virus & Malware", icon: <AlertTriangle size={20} strokeWidth={1.5} /> },
  { label: "Ransomware", icon: <Lock size={20} strokeWidth={1.5} /> },
  { label: "Phishing Attacks", icon: <Wifi size={20} strokeWidth={1.5} /> },
  { label: "DOS / DDOS", icon: <Server size={20} strokeWidth={1.5} /> },
  { label: "Cloud Threats", icon: <Cloud size={20} strokeWidth={1.5} /> },
  { label: "Data Breaches", icon: <HardDrive size={20} strokeWidth={1.5} /> },
]

/* ─── Approach Cards ─── */
const approaches = [
  {
    label: "Black Box",
    icon: <Eye size={28} strokeWidth={1.5} />,
    desc: "Zero prior knowledge approach — our team simulates an external attacker with no internal access, replicating real-world threat scenarios.",
    tag: "External Attacker Simulation"
  },
  {
    label: "White Box",
    icon: <Monitor size={28} strokeWidth={1.5} />,
    desc: "Full-knowledge approach — JHS is granted access to credentials and architecture details (IP whitelisted) to perform deep internal security validation.",
    tag: "Full-Knowledge Internal Review"
  },
]

export default function ITAssurance() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.a-hero__content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )

      gsap.utils.toArray<Element>('.a-section-header').forEach((header) => {
        gsap.fromTo(header,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: header, start: 'top 85%' } }
        )
      })

      gsap.utils.toArray<Element>('.a-service-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, delay: i * 0.04, scrollTrigger: { trigger: '.a-services-grid', start: 'top 80%' } }
        )
      })

      gsap.utils.toArray<Element>('.a-domain-card, .a-vapt-step, .a-approach-card, .a-benchmark-card').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 88%' } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="a-page" ref={containerRef}>

      {/* ════ HERO ════ */}
      <section className="a-hero">
        <div className="a-hero__bg" style={{ backgroundImage: `url('${imageUrl('Assurance.png')}')` }} />
        <div className="a-hero__overlay" />
        <div className="a-container">
          <div className="a-hero__content">
            {/* <span className="a-eyebrow">CERT-In Empanelled · ISO 27001 · COBIT / ISACA</span> */}
            <h1 className="a-title">IT Assurance </h1>
            <p className="a-subtitle">
              End to end information security reviews, vulnerability assessments and technology audits delivered by a CERT In empanelled organisation to protect what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* ════ IT ASSURANCE SERVICES ════ */}
      <section className="a-coverage">
        <div className="a-container">
          <div className="a-section-header">
            <h2>IT Assurance Services</h2>
            <div className="a-divider" />
            <p>A comprehensive suite of technology audit services covering every layer of your IT environment — from security reviews to compliance assessments.</p>
          </div>

          <div className="a-services-grid">
            {itServices.map((item) => (
              <div key={item.id} className="a-service-card">
                <div className="a-service-card__num">{item.id}</div>
                <div className="a-service-card__icon">{item.icon}</div>
                <h3 className="a-service-card__title">{item.title}</h3>
              </div>
            ))}
          </div>

          <div className="a-certification">
            <Shield className="a-certification__icon" size={28} />
            <p className="a-certification__text">CERT-In Empanelled Information Security Auditing Organisation · Valid until September 2028</p>
          </div>
        </div>
      </section>

      {/* ════ END-TO-END TECHNOLOGY AUDIT ════ */}
      <section className="a-programs">
        <div className="a-container">
          <div className="a-section-header">
            <h2>End-to-End Technology Audit</h2>
            <div className="a-divider" />
            <p>A structured, domain-by-domain technology audit that leaves no blind spots — from IT strategy and network architecture through to physical security and cyber resilience.</p>
          </div>

          <div className="a-domains-grid">
            {technologyAuditDomains.map((domain, i) => (
              <div key={i} className="a-domain-card">
                <div className="a-domain-card__header">
                  <div className="a-domain-card__icon">{domain.icon}</div>
                  <h3 className="a-domain-card__title">{domain.category}</h3>
                </div>
                <ul className="a-domain-list">
                  {domain.items.map((item, j) => (
                    <li key={j} className="a-domain-list__item">
                      <CheckCircle2 size={14} className="a-domain-list__check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benchmarks */}
          <div className="a-benchmarks">
            <p className="a-benchmarks__label">Benchmarked Against Best Practices</p>
            <div className="a-benchmarks__row">
              {benchmarks.map((b, i) => (
                <div key={i} className="a-benchmark-card">
                  <div className="a-benchmark-card__icon">{b.icon}</div>
                  <div>
                    <p className="a-benchmark-card__title">{b.label}</p>
                    <p className="a-benchmark-card__desc">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ VULNERABILITY ASSESSMENTS ════ */}
      <section className="a-vapt">
        <div className="a-container">
          <div className="a-section-header">
            <h2>Vulnerability Assessment &amp; Penetration Testing</h2>
            <div className="a-divider" />
            <p>Proactive, periodic security testing to detect weaknesses before attackers do protecting the confidentiality, integrity, availability and privacy of your information assets.</p>
          </div>

          {/* Threat landscape */}
          <div className="a-threats">
            <p className="a-threats__label">Threats We Test Against</p>
            <div className="a-threats__grid">
              {threatTypes.map((t, i) => (
                <div key={i} className="a-threat-chip">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VAPT Process */}
          <div className="a-vapt-process">
            <p className="a-vapt__section-label">Our VAPT Programme</p>
            <div className="a-vapt-steps">
              {vaptProcess.map((step, i) => (
                <div key={i} className="a-vapt-step">
                  <div className="a-vapt-step__num">{step.step}</div>
                  <div className="a-vapt-step__content">
                    <h4 className="a-vapt-step__title">{step.title}</h4>
                    <p className="a-vapt-step__desc">{step.desc}</p>
                  </div>
                  {i < vaptProcess.length - 1 && <div className="a-vapt-step__connector" />}
                </div>
              ))}
            </div>
          </div>

          {/* Black Box / White Box */}
          <div className="a-approaches">
            <p className="a-vapt__section-label">Approach Options</p>
            <div className="a-approaches__grid">
              {approaches.map((a, i) => (
                <div key={i} className="a-approach-card">
                  <div className="a-approach-card__icon">{a.icon}</div>
                  <span className="a-approach-card__tag">{a.tag}</span>
                  <h3 className="a-approach-card__label">{a.label} Approach</h3>
                  <p className="a-approach-card__desc">{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="a-vapt-note">
              <Activity size={16} />
              <p>All assessments are executed remotely from JHS Office. Planned activities are scheduled on weekends / holidays to avoid impact on business operations.</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="a-vapt-value">
            <div className="a-vapt-value__inner">
              <div className="a-vapt-value__left">
                <TrendingUp size={32} strokeWidth={1.5} />
                <h3>Value Proposition</h3>
                <p>Development &amp; Maintenance of a Vulnerability Assessment &amp; Penetration Testing Programme</p>
              </div>
              <div className="a-vapt-value__right">
                {[
                  "Preparation of an annual VAPT plan",
                  "Execution of assessments using industry-grade tooling",
                  "Detailed vulnerability reports with mitigating controls",
                  "Tracking management's corrective action plan",
                  "Black Box &amp; White Box methodologies as required",
                  "Scheduled to minimise operational disruption"
                ].map((pt, i) => (
                  <div key={i} className="a-vapt-value__point">
                    <CheckCircle2 size={16} />
                    <span dangerouslySetInnerHTML={{ __html: pt }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ BOTTOM CTA ════ */}
      {/* <section className="a-cta">
        <div className="a-container">
          <div className="a-cta__box">
            <Target size={36} className="a-cta__icon" />
            <h2>Strengthen Your Security Posture</h2>
            <p>Speak to our senior IT Assurance partners to design the right technology audit and VAPT framework for your organisation.</p>
            <button className="a-btn">Schedule a Consultation</button>
          </div>
        </div>
      </section> */}

    </div>
  )
}
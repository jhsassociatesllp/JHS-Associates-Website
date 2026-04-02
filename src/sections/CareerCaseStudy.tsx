import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import './CareerCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

const TABS = ['Results', 'Expertise', 'Solutions'] as const
type Tab = typeof TABS[number]

const TAB_CONTENT: Record<Tab, { text: string; points: string[] }> = {
  Results: {
    text: 'Our track record speaks for itself — delivering measurable outcomes for clients across industries.',
    points: ['₹500Cr+ in savings identified', '98% client retention rate', 'Awards in compliance excellence'],
  },
  Expertise: {
    text: 'Decades of combined expertise across audit, tax, transactions, and regulatory domains.',
    points: ['50+ domain specialists', 'Cross-industry knowledge', 'Continuous upskilling programmes'],
  },
  Solutions: {
    text: 'Tailored, practical solutions crafted to address the unique challenges of every client.',
    points: ['Custom advisory frameworks', 'Tech-enabled delivery', 'End-to-end implementation support'],
  },
}

const CAREER_PERKS = [
  'Structured learning & development',
  'Mentorship by industry veterans',
  'Diverse, inclusive culture',
  'Global exposure opportunities',
]

export default function CareerCaseStudy() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<Tab>('Results')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zoom in on scroll down, zoom out on scroll up — both boxes
      [leftRef.current, rightRef.current].forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.88, opacity: 0, y: 40 },
          {
            scale: 1, opacity: 1, y: 0,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 1,
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="careers" ref={sectionRef} className="ccs section-pad">
      <div className="container">
        <div className="ccs__grid">
          {/* ── Left: Careers ─────────────────────────── */}
          <div ref={leftRef} className="ccs__box ccs__box--career">
            {/* Background pattern */}
            <div className="ccs__career-bg" />
            <div className="ccs__career-content">
              <span className="text-overline" style={{ color: 'rgba(255,255,255,0.7)' }}>Join Our Team</span>
              <h2 className="text-h2 ccs__box-title">Build Your Career<br />With Purpose</h2>
              <p className="ccs__box-desc">
                At JHS & Associates, we invest in our people as much as our clients. 
                Join a culture of excellence where your growth drives our success.
              </p>
              <ul className="ccs__perks">
                {CAREER_PERKS.map((p) => (
                  <li key={p}><CheckCircle2 size={16} /> {p}</li>
                ))}
              </ul>
              <a href="#" className="btn btn-ghost ccs__cta">
                Join Now <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* ── Right: Case Studies ────────────────────── */}
          <div ref={rightRef} className="ccs__box ccs__box--case">
            <span className="text-overline">Our Work</span>
            <h2 className="text-h2 ccs__box-title ccs__box-title--dark">Case Studies &amp;<br />Proven Outcomes</h2>
            <p className="ccs__box-desc ccs__box-desc--dark">
              Real-world impact crafted through deep expertise and disciplined execution.
            </p>

            {/* Tabs */}
            <div className="ccs__tabs" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`ccs__tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="ccs__tab-content" key={activeTab}>
              <p className="ccs__tab-text">{TAB_CONTENT[activeTab].text}</p>
              <ul className="ccs__tab-points">
                {TAB_CONTENT[activeTab].points.map((pt) => (
                  <li key={pt}><CheckCircle2 size={14} /> {pt}</li>
                ))}
              </ul>
            </div>

            <a href="#" className="btn btn-secondary ccs__cta">
              View Our Work <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

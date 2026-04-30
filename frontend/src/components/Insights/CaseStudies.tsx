import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react'
import { CASE_STUDIES, CASE_STUDY_CATEGORIES, getCaseStudiesByCategory } from '../../data/CaseStudies'
import './CaseStudies.css'
import CaseStudiesImg from '../../image/Case Studies.png'

gsap.registerPlugin(ScrollTrigger)

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const heroRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const filteredCaseStudies = useMemo(
    () => getCaseStudiesByCategory(selectedCategory),
    [selectedCategory]
  )

  const stats = [
    { label: 'Case studies', value: filteredCaseStudies.length },
    { label: 'Sectors', value: new Set(filteredCaseStudies.map((item) => item.sector)).size },
    { label: 'Solutions', value: new Set(filteredCaseStudies.map((item) => item.solution)).size },
  ]

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cs-hero__content > *, .cs-hero__stats',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }
      )

      gsap.fromTo(
        '.cs-filter',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: { trigger: filterRef.current, start: 'top 90%' },
        }
      )

      gsap.fromTo(
        '.cs-card',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 82%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [filteredCaseStudies])

  return (
    <div className="cs-page">
      <section className="cs-hero" ref={heroRef}>
        <div className="cs-hero__bg" style={{ backgroundImage: `url('${CaseStudiesImg}')` }} />
        <div className="cs-hero__overlay" />

        <div className="cs-container cs-hero__inner">
          <div className="cs-hero__content">
            <span className="cs-eyebrow">Enterprise Solutions</span>
            <h1 className="cs-title">Enterprise Risk Management Case Studies</h1>
            <p className="cs-subtitle">
              Real challenges, measurable outcomes, and practical execution support across
              compliance, governance, internal controls, and financial transformation.
            </p>
          </div>

          {/* <div className="cs-hero__stats" aria-label="Case study summary">
            {stats.map((stat) => (
              <div className="cs-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      <main className="cs-main-content">
        {CASE_STUDY_CATEGORIES?.length > 1 && (
          <div className="cs-container">
            <div className="cs-filter" ref={filterRef}>
              <span className="cs-filter__label">
                <Filter size={16} strokeWidth={1.75} />
                Filter
              </span>

              <div className="cs-filter__pills" role="list" aria-label="Case study categories">
                {CASE_STUDY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`cs-filter__btn ${selectedCategory === cat ? 'cs-filter__btn--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    aria-pressed={selectedCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <section className="cs-services" ref={listRef}>
          <div className="cs-container">
            <div className="cs-services__header">
              <span className="cs-section-kicker">Selected work</span>
              <h2>Recent Case Studies</h2>
              <p>
                Explore {filteredCaseStudies.length} detailed accounts of JHS engagements that
                turned risk, process, and compliance challenges into measurable business outcomes.
              </p>
            </div>

            {filteredCaseStudies.length > 0 ? (
              <div className="cs-grid">
                {filteredCaseStudies.map((cs, i) => (
                  <article key={`${cs.title}-${i}`} className="cs-card">
                    <div className="cs-card__aside">
                      <span className="cs-card__number">{String(i + 1).padStart(2, '0')}</span>
                      <ArrowUpRight size={22} strokeWidth={1.8} className="cs-card__arrow" />
                    </div>

                    <div className="cs-card__body">
                      <div className="cs-card__top">
                        <div className="cs-card__badges">
                          <span className="cs-badge cs-badge--sector">{cs.sector}</span>
                          <span className="cs-badge cs-badge--solution">{cs.solution}</span>
                        </div>
                      </div>

                      <h3 className="cs-card__title">{cs.title}</h3>

                      <div className="cs-card__content-grid">
                        <InfoBox icon={<Target size={18} />} title="Scope">
                          <p>{cs.scope}</p>
                        </InfoBox>

                        <InfoBox icon={<Lightbulb size={18} />} title="Approach">
                          <p>{cs.approach}</p>
                        </InfoBox>

                        <InfoBox icon={<CheckCircle2 size={18} />} title="Delivery">
                          <ul>
                            {cs.delivery.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </InfoBox>

                        <InfoBox icon={<TrendingUp size={18} />} title="Value Added" highlight>
                          <ul>
                            {cs.valueAdded.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </InfoBox>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="cs-empty-state">
                <h3>No case studies found</h3>
                <p>Choose another category to view available client outcomes.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function InfoBox({
  children,
  highlight = false,
  icon,
  title,
}: {
  children: ReactNode
  highlight?: boolean
  icon: ReactNode
  title: string
}) {
  return (
    <div className={`cs-info-box ${highlight ? 'cs-info-box--highlight' : ''}`}>
      <div className="cs-info-box__header">
        <span className="cs-info-box__icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  )
}
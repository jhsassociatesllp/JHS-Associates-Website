import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Filter, ArrowUpRight, BarChart2 } from 'lucide-react'
import { CASE_STUDIES, CASE_STUDY_CATEGORIES, getCaseStudiesByCategory } from '../../data/CaseStudies'
import './CaseStudies.css'

gsap.registerPlugin(ScrollTrigger)

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredCaseStudies, setFilteredCaseStudies] = useState(CASE_STUDIES)
  const heroRef   = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.cs-hero__eyebrow', '.cs-hero__title', '.cs-hero__sub', '.cs-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo(
        '.cs-filter__btn',
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: 'power2.out',
          scrollTrigger: { trigger: filterRef.current, start: 'top 90%' },
        }
      )
      gsap.fromTo(
        '.cs-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    setFilteredCaseStudies(getCaseStudiesByCategory(selectedCategory))
  }, [selectedCategory])

  const featured = filteredCaseStudies[0]
  const rest      = filteredCaseStudies.slice(1)

  return (
    <div className="cs-page">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="cs-hero" ref={heroRef}>
        <div className="cs-hero__inner">
          {/* <p className="cs-hero__eyebrow">
            <BarChart2 size={12} strokeWidth={1.5} />
            Insights &nbsp;·&nbsp; Case Studies
          </p> */}
          <h1 className="cs-hero__title">
            Client&nbsp;<em>Success Stories</em>
          </h1>
          <p className="cs-hero__sub">
            Real challenges. Measurable outcomes. See how JHS has helped businesses across sectors
            achieve compliance excellence and unlock financial opportunity.
          </p>
          {/* <div className="cs-hero__stats">
            <div className="cs-hero__stat">
              <span className="cs-hero__stat-num">{CASE_STUDIES.length}+</span>
              <span className="cs-hero__stat-label">Case Studies</span>
            </div>
            <div className="cs-hero__stat">
              <span className="cs-hero__stat-num">12+</span>
              <span className="cs-hero__stat-label">Industries</span>
            </div>
            <div className="cs-hero__stat">
              <span className="cs-hero__stat-num">100%</span>
              <span className="cs-hero__stat-label">Real Results</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════ */}
      {CASE_STUDY_CATEGORIES?.length > 1 && (
        <div className="cs-filter container" ref={filterRef}>
          <span className="cs-filter__label">
            <Filter size={11} strokeWidth={1.5} />
            Filter
          </span>
          <div className="cs-filter__pills">
            {CASE_STUDY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cs-filter__btn${selectedCategory === cat ? ' cs-filter__btn--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          FEATURED CASE STUDY
      ══════════════════════════════════════ */}
      {featured && (
        <section className="cs-featured container">
          <div className="cs-featured__inner">

            {/* Left: content */}
            <div className="cs-featured__content">
              <div className="cs-featured__meta">
                <span className="cs-chip cs-chip--industry">{featured.industry}</span>
                <span className="cs-chip cs-chip--challenge">{featured.challenge}</span>
                <span className="cs-chip cs-chip--featured">Featured</span>
              </div>

              <h2 className="cs-featured__title">{featured.title}</h2>
              <p className="cs-featured__outcome">{featured.outcome}</p>

              {/* Metrics inside featured */}
              <div className="cs-featured__metrics">
                {featured.metrics?.map((m, j) => (
                  <div key={j} className="cs-featured__metric">
                    <span className="cs-featured__metric-val">{m.value}</span>
                    <span className="cs-featured__metric-label">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="cs-featured__footer">
                <button className="cs-btn cs-btn--ghost" onClick={() => {}} type="button">
                  Read Case Study <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: visual accent panel */}
            <div className="cs-featured__panel">
              <div className="cs-featured__panel-bg" />
              <span className="cs-featured__panel-num">01</span>
              <div className="cs-featured__panel-label">Featured Story</div>
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CARDS GRID
      ══════════════════════════════════════ */}
      <section className="cs-grid-section container" ref={gridRef}>
        <div className="cs-grid-header">
          <h3 className="cs-grid-header__title">All Case Studies</h3>
          <span className="cs-grid-header__count">{filteredCaseStudies.length} results</span>
        </div>

        <div className="cs-grid">
          {filteredCaseStudies.map((cs, i) => (
            <article key={i} className="cs-card">

              {/* Top accent bar (animates in on hover) */}
              <div className="cs-card__accent" />

              {/* Header chips */}
              <div className="cs-card__header">
                <span className="cs-chip cs-chip--industry">{cs.industry}</span>
                <span className="cs-chip cs-chip--challenge">{cs.challenge}</span>
                {/* Card index */}
                <span className="cs-card__idx">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Title */}
              <h3 className="cs-card__title">{cs.title}</h3>

              {/* Outcome */}
              <p className="cs-card__outcome">{cs.outcome}</p>

              {/* Metrics strip */}
              <div className="cs-card__metrics">
                {cs.metrics?.map((m, j) => (
                  <div key={j} className="cs-metric">
                    <span className="cs-metric__val">{m.value}</span>
                    <span className="cs-metric__label">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="cs-card__footer">
                <button className="cs-card__cta" onClick={() => {}} type="button">
                  Read Full Story
                  <ArrowUpRight size={14} />
                </button>
              </div>

            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="cs-cta container">
        <div className="cs-cta__inner">
          <div className="cs-cta__content">
            <p className="cs-cta__eyebrow">Work With Us</p>
            <h2 className="cs-cta__title">Want results like these?</h2>
            <p className="cs-cta__sub">
              Let us understand your business challenges and propose a tailored engagement.
            </p>
          </div>
          <a href="#contact" className="cs-btn cs-btn--cta">
            Start a Conversation <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}
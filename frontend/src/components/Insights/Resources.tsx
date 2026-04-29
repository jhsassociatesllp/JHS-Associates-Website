import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, Filter, ArrowUpRight, Library } from 'lucide-react'
import { RESOURCES, RESOURCE_CATEGORIES, getResourcesByCategory } from '../../data/resources'
import './Resources.css'

gsap.registerPlugin(ScrollTrigger)

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredResources, setFilteredResources] = useState(RESOURCES)
  const heroRef   = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* Hero stagger */
      gsap.fromTo(
        ['.res-hero__eyebrow', '.res-hero__title', '.res-hero__sub', '.res-hero__stats'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.15 }
      )

      /* Filter pills */
      gsap.fromTo(
        '.res-filter__btn',
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: 'power2.out',
          scrollTrigger: { trigger: filterRef.current, start: 'top 90%' },
        }
      )

      /* Featured card */
      gsap.fromTo(
        '.res-featured__inner',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.res-featured', start: 'top 84%' },
        }
      )

      /* Grid cards */
      gsap.fromTo(
        '.res-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    setFilteredResources(getResourcesByCategory(selectedCategory))
  }, [selectedCategory])

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const featured = filteredResources[0]

  return (
    <div className="res-page">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="res-hero" ref={heroRef}>
        <div className="res-hero__inner">
          {/* <p className="res-hero__eyebrow">
            <Library size={12} strokeWidth={1.5} />
            Insights &nbsp;·&nbsp; Resources
          </p> */}

          <h1 className="res-hero__title">
            Knowledge&nbsp;<em>Resources</em>
          </h1>

          <p className="res-hero__sub">
            Practical guides, whitepapers, and toolkits crafted by JHS experts to help you navigate
            regulatory complexity and drive informed business decisions.
          </p>

          {/* <div className="res-hero__stats">
            <div className="res-hero__stat">
              <span className="res-hero__stat-num">{RESOURCES.length}+</span>
              <span className="res-hero__stat-label">Resources</span>
            </div>
            <div className="res-hero__stat">
              <span className="res-hero__stat-num">{RESOURCE_CATEGORIES.length - 1}</span>
              <span className="res-hero__stat-label">Categories</span>
            </div>
            <div className="res-hero__stat">
              <span className="res-hero__stat-num">Free</span>
              <span className="res-hero__stat-label">PDF Downloads</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════ */}
      <div className="res-filter container" ref={filterRef}>
        <span className="res-filter__label">
          <Filter size={11} strokeWidth={1.5} />
          Filter
        </span>
        <div className="res-filter__pills">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`res-filter__btn${selectedCategory === cat ? ' res-filter__btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <>
          {/* ══════════════════════════════════════
              FEATURED RESOURCE
          ══════════════════════════════════════ */}
          {featured && (
            <section className="res-featured container">
              <div className="res-featured__inner">

                {/* Left: content */}
                <div className="res-featured__content">
                  <div className="res-featured__meta">
                    <span className="res-tag">{featured.tag}</span>
                    <span className="res-featured__badge">Featured</span>
                  </div>

                  <h2 className="res-featured__title">{featured.title}</h2>
                  <p className="res-featured__desc">{featured.description}</p>

                  <div className="res-featured__footer">
                    <div className="res-author">
                      <div className="res-author__avatar">
                        {featured.author?.charAt(0)?.toUpperCase() ?? 'J'}
                      </div>
                      <span className="res-author__name">{featured.author}</span>
                    </div>

                    <div className="res-featured__actions">
                      <button className="res-btn res-btn--ghost" onClick={() => {}} type="button">
                        Preview <ArrowUpRight size={14} />
                      </button>
                      <button
                        className="res-btn res-btn--solid"
                        onClick={() => handleDownload(featured.pdf, featured.title)}
                        type="button"
                      >
                        <Download size={13} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: image */}
                <div className="res-featured__img-wrap">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="res-featured__img"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="res-featured__img-overlay" />
                  <span className="res-featured__index">01</span>
                </div>

              </div>
            </section>
          )}

          {/* ══════════════════════════════════════
              RESOURCE GRID
          ══════════════════════════════════════ */}
          <section className="res-grid-section container" ref={gridRef}>
            <div className="res-grid-header">
              <h3 className="res-grid-header__title">All Resources</h3>
              <span className="res-grid-header__count">{filteredResources.length} results</span>
            </div>

            <div className="res-grid">
              {filteredResources.map((resource, idx) => (
                <article key={resource.id} className="res-card">

                  {/* Image */}
                  <div className="res-card__img-wrap">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="res-card__img"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <span className="res-card__num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="res-card__tag-float">{resource.tag}</span>
                  </div>

                  {/* Body */}
                  <div className="res-card__body">
                    <h3 className="res-card__title">{resource.title}</h3>
                    <p className="res-card__desc">{resource.description}</p>

                    <div className="res-card__footer">
                      <div className="res-author res-author--sm">
                        <div className="res-author__avatar res-author__avatar--sm">
                          {resource.author?.charAt(0)?.toUpperCase() ?? 'J'}
                        </div>
                        <span className="res-author__name">{resource.author}</span>
                      </div>

                      <div className="res-card__actions">
                        <button
                          className="res-card__icon-btn"
                          title="Preview"
                          onClick={() => {}}
                          type="button"
                        >
                          <ArrowUpRight size={14} />
                        </button>
                        <button
                          className="res-card__dl-btn"
                          onClick={() => handleDownload(resource.pdf, resource.title)}
                          type="button"
                        >
                          <Download size={12} />
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="container res-empty">
          <div className="res-empty__box">
            <span className="res-empty__icon">∅</span>
            <h3>No resources found</h3>
            <p>No resources match the selected category "{selectedCategory}".</p>
            <button
              className="res-btn res-btn--solid"
              onClick={() => setSelectedCategory('All')}
              type="button"
            >
              View All Resources
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="res-cta container">
        <div className="res-cta__inner">
          <div className="res-cta__content">
            <p className="res-cta__eyebrow">Custom Research</p>
            <h2 className="res-cta__title">Need a tailored resource?</h2>
            <p className="res-cta__sub">
              Our experts can create custom reports and analysis specific to your industry and needs.
            </p>
          </div>
          <a href="#contact" className="res-btn res-btn--cta">
            Talk to an Expert <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}
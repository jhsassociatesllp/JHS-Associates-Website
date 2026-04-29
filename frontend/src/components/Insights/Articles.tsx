import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, Filter, ArrowUpRight, BookOpen } from 'lucide-react'
import { ARTICLES, ARTICLE_CATEGORIES, getArticlesByCategory } from '../../data/articles'
import './Articles.css'

gsap.registerPlugin(ScrollTrigger)

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES)
  const heroRef   = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* ── Hero: staggered slide-up ── */
      gsap.fromTo(
        ['.art-hero__eyebrow', '.art-hero__title', '.art-hero__sub', '.art-hero__stats'],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.13,
          ease: 'power3.out',
          delay: 0.15,
        }
      )

      /* ── Filter pills: fade up ── */
      gsap.fromTo(
        '.art-filter__btn',
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.055,
          ease: 'power2.out',
          scrollTrigger: { trigger: filterRef.current, start: 'top 90%' },
        }
      )

      /* ── Featured card: slide in from below ── */
      gsap.fromTo(
        '.art-featured__inner',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.art-featured', start: 'top 84%' },
        }
      )

      /* ── Grid cards: cascade ── */
      gsap.fromTo(
        '.art-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    setFilteredArticles(getArticlesByCategory(selectedCategory))
  }, [selectedCategory])

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const featured = filteredArticles[0]

  return (
    <div className="art-page">

      {/* ══════════════════════════════════════
          HERO — full-width, dark bg image, centered
      ══════════════════════════════════════ */}
      <section className="art-hero" ref={heroRef}>
        <div className="art-hero__inner">
          <h1 className="art-hero__title">
            Expert&nbsp;<em>Articles</em>
          </h1>

          <p className="art-hero__sub">
            In-depth analysis and commentary from JHS partners and senior advisors on the issues
            shaping Indian and global finance, tax, and compliance.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════ */}
      <div className="art-filter container" ref={filterRef}>
        <span className="art-filter__label">
          <Filter size={11} strokeWidth={1.5} />
          Filter
        </span>
        <div className="art-filter__pills">
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`art-filter__btn${selectedCategory === cat ? ' art-filter__btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <>
          {/* ══════════════════════════════════════
              FEATURED ARTICLE — premium hero card
          ══════════════════════════════════════ */}
          {featured && (
            <section className="art-featured container">
              <div className="art-featured__inner">

                {/* Left: content */}
                <div className="art-featured__content">
                  <div className="art-featured__meta">
                    <span className="art-tag">{featured.tag}</span>
                    <span className="art-featured__badge">Featured</span>
                  </div>

                  <h2 className="art-featured__title">{featured.title}</h2>
                  <p className="art-featured__desc">{featured.description}</p>

                  <div className="art-featured__footer">
                    <div className="art-author">
                      <div className="art-author__avatar">
                        {featured.author?.charAt(0)?.toUpperCase() ?? 'J'}
                      </div>
                      <span className="art-author__name">{featured.author}</span>
                    </div>

                    <div className="art-featured__actions">
                      <button
                        className="art-btn art-btn--ghost"
                        onClick={() => {}}
                        type="button"
                      >
                        Read Article <ArrowUpRight size={14} />
                      </button>
                      <button 
                        className="art-btn art-btn--solid"
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
                <div className="art-featured__img-wrap">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="art-featured__img"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="art-featured__img-overlay" />
                  <span className="art-featured__index">01</span>
                </div>

              </div>
            </section>
          )}
 
          {/* ══════════════════════════════════════
              ARTICLE GRID — proper gaps
          ══════════════════════════════════════ */}
          <section className="art-grid-section container" ref={gridRef}>
            <div className="art-grid-header">
              <h3 className="art-grid-header__title">All Articles</h3>
              <span className="art-grid-header__count">{filteredArticles.length} results</span>
            </div>

            <div className="art-grid">
              {filteredArticles.map((article, idx) => (
                <article key={article.id} className="art-card">

                  {/* Image */}
                  <div className="art-card__img-wrap">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="art-card__img"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <span className="art-card__num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="art-card__tag-float">{article.tag}</span>
                  </div>

                  {/* Body */}
                  <div className="art-card__body">
                    <h3 className="art-card__title">{article.title}</h3>
                    <p className="art-card__desc">{article.description}</p>

                    <div className="art-card__footer">
                      <div className="art-author art-author--sm">
                        <div className="art-author__avatar art-author__avatar--sm">
                          {article.author?.charAt(0)?.toUpperCase() ?? 'J'}
                        </div>
                        <span className="art-author__name">{article.author}</span>
                      </div>

                      <div className="art-card__actions">
                        <button
                          className="art-card__icon-btn"
                          title="Read Article"
                          onClick={() => {}}
                          type="button"
                        >
                          <ArrowUpRight size={14} />
                        </button>
                        <button
                          className="art-card__dl-btn"
                          onClick={() => handleDownload(article.pdf, article.title)}
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
        <section className="container art-empty">
          <div className="art-empty__box">
            <span className="art-empty__icon">∅</span>
            <h3>No articles found</h3>
            <p>No articles match the selected category "{selectedCategory}".</p>
            <button
              className="art-btn art-btn--solid"
              onClick={() => setSelectedCategory('All')}
              type="button"
            >
              View All Articles
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {/* <section className="art-cta container">
        <div className="art-cta__inner">
          <div className="art-cta__content">
            <p className="art-cta__eyebrow">Stay Informed</p>
            <h2 className="art-cta__title">Stay ahead of regulatory changes</h2>
            <p className="art-cta__sub">
              Subscribe to receive JHS insights directly in your inbox — no noise, only what matters.
            </p>
          </div>
          <a href="#contact" className="art-btn art-btn--cta">
            Subscribe Now <ArrowUpRight size={16} />
          </a>
        </div>
      </section> */}

    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Filter } from 'lucide-react'
import { ARTICLES, ARTICLE_CATEGORIES, getArticlesByCategory } from '../../data/articles'
import './Articles.css'

gsap.registerPlugin(ScrollTrigger)

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* ── Hero: staggered slide-up ── */
      gsap.fromTo(
        ['.art-hero__eyebrow', '.art-hero__title', '.art-hero__sub'],
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

  // Generate a mock date based on ID to simulate realistic content
  const getMockDate = (id: number) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[(id * 3) % 12];
    const day = (id * 7) % 28 + 1;
    const year = 2024 + (id % 2);
    return `${month} ${day}, ${year}`;
  }

  return (
    <div className="art-page">

      {/* ══════════════════════════════════════
          HERO — background image, centered text
      ══════════════════════════════════════ */}
      <section className="art-hero" ref={heroRef}>
        <div className="art-hero__inner">
          <span className="art-hero__eyebrow">Knowledge Center</span>
          <h1 className="art-hero__title">
            Our <em>Articles</em>
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
          <Filter size={14} strokeWidth={1.5} />
          Filter By Category
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
        <section className="art-grid-section container" ref={gridRef}>
          <div className="art-grid">
            {filteredArticles.map((article) => (
              <article key={article.id} className="art-card">

                {/* Background Image */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="art-card__bg-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />

                {/* Default State: White Box at Bottom */}
                <div className="art-card__default-box">
                  <div className="art-card__meta">
                    {article.tag?.toUpperCase() || 'ARTICLE'} &bull; {article.author?.toUpperCase()} &bull; {getMockDate(article.id).toUpperCase()}
                  </div>
                  <h3 className="art-card__title">{article.title}</h3>
                </div>

                {/* Hover State: Frosted Overlay */}
                <div className="art-card__hover-overlay">
                  <div className="art-card__hover-content">
                    <div className="art-card__meta">
                      {article.tag?.toUpperCase() || 'ARTICLE'} &bull; {article.author?.toUpperCase()} &bull; {getMockDate(article.id).toUpperCase()}
                    </div>
                    <h3 className="art-card__hover-title">{article.title}</h3>
                    <p className="art-card__hover-desc">{article.description}</p>
                  </div>

                  <a
                    href="#download"
                    className="art-card__learn-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(article.pdf, article.title);
                    }}
                  >
                    Download <ArrowRight size={16} />
                  </a>
                </div>

              </article>
            ))}
          </div>
        </section>
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

    </div>
  )
}
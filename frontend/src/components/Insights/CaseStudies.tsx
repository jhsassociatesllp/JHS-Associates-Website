import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CASE_STUDIES, CASE_STUDY_CATEGORIES, getCaseStudiesByCategory } from '../../data/CaseStudies'
import './CaseStudies.css'
import { imageUrl } from '../../utils/imageUrl'
// import img1 from '../../image/Fainance3.jpg';
// import img2 from '../../image/WebPoster2.jpeg';
// import img3 from '../../image/StatsImage.png';
// import img4 from '../../image/Fainance4.jpg';

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCaseStudies = useMemo(
    () => getCaseStudiesByCategory(selectedCategory),
    [selectedCategory]
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="cs-page">
      {/* Hero Section */}
      <section className="cs-hero" style={{ backgroundImage: `url('${imageUrl('Case_studies.png')}')` }}>
        <div className="cs-hero__overlay" />
        <div className="cs-hero__content">
          <h1 className="cs-title">Our Client Stories</h1>
          <p className="cs-subtitle">
            Exploring how our strategic partnerships and technical excellence drive tangible impact and sustainable growth for global market leaders.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="cs-main">
        <div className="cs-container">

          {/* Filters */}
          {CASE_STUDY_CATEGORIES?.length > 1 && (
            <div className="cs-filters">
              {CASE_STUDY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cs-filter-btn ${selectedCategory === cat ? 'cs-filter-btn--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filteredCaseStudies.length > 0 ? (
            <div className="cs-grid">
              {filteredCaseStudies.map((cs, i) => (
                <div key={i} className="cs-card" style={{ backgroundImage: `url('${cs.image}')` }}>

                  {/* Normal State */}
                  <div className="cs-card__normal">
                    <div className="cs-card__badge-top">CASE STUDY</div>
                    <div className="cs-card__bottom-box">
                      <span className="cs-card__meta">CASE STUDY &bull; {cs.sector}</span>
                      <h3 className="cs-card__title">{cs.title}</h3>
                    </div>
                  </div>

                  {/* Hover State */}
                  <div className="cs-card__hover">
                    <div className="cs-card__hover-content">
                      <span className="cs-card__meta">CASE STUDY &bull; {cs.sector}</span>
                      <h3 className="cs-card__title">{cs.title}</h3>
                      <p className="cs-card__desc">{cs.scope}</p>
                      <Link to={`/case-studies/${cs.id}`} className="cs-card__button">
                        Read More <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="cs-empty">
              <h3>No case studies found</h3>
              <p>Choose another category to view available client outcomes.</p>
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <section className="cs-cta">
        <div className="cs-cta__content">
          <h2>Ready to create your own success story?</h2>
          <p>
            Partner with JHS to drive innovation and achieve measurable results. Our experts are ready to help you navigate your most complex challenges.
          </p>
          <a href="/contact" className="cs-cta__button">Schedule a Consultation</a>
        </div>
      </section>
    </div>
  )
}
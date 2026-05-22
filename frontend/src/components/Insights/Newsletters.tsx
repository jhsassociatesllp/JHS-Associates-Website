import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Filter } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import './Newsletters.css'

gsap.registerPlugin(ScrollTrigger)

const NEWSLETTERS = [
  {
    id: 1,
    title: "Tax & Compliance Weekly - May 2026",
    description: "Our weekly wrap-up of the latest direct and indirect tax rulings, MCA updates, and key compliance deadlines for businesses in India.",
    category: "Weekly Digest",
    date: "May 10, 2026",
    pdf: "#",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "CFO Insights Monthly - April 2026",
    description: "Strategic perspectives on corporate finance, ESG reporting, and navigating the global minimum tax framework.",
    category: "Monthly Insights",
    date: "April 30, 2026",
    pdf: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Global Transfer Pricing Digest",
    description: "Analyzing the impact of recent OECD guidelines on intercompany transactions and dispute resolution mechanisms.",
    category: "Tax Updates",
    date: "April 15, 2026",
    pdf: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop"
  }
];

const CATEGORIES = ['All', 'Weekly Digest', 'Monthly Insights', 'Tax Updates'];

export default function Newsletters() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredNewsletters, setFilteredNewsletters] = useState(NEWSLETTERS)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* ── Hero: staggered slide-up ── */
      gsap.fromTo(
        ['.nl-hero__eyebrow', '.nl-hero__title', '.nl-hero__sub'],
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
        '.nl-filter__btn',
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
        '.nl-card',
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
    if (selectedCategory === 'All') {
      setFilteredNewsletters(NEWSLETTERS);
    } else {
      setFilteredNewsletters(NEWSLETTERS.filter(nl => nl.category === selectedCategory));
    }
  }, [selectedCategory])

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="nl-page">

      {/* ══════════════════════════════════════
          HERO — background image, centered text
      ══════════════════════════════════════ */}
      <section className="nl-hero" ref={heroRef}>
        <div className="nl-hero__inner">
          <span className="nl-hero__eyebrow">Knowledge Center</span>
          <h1 className="nl-hero__title">
            Our <em>Newsletters</em>
          </h1>
          <p className="nl-hero__sub">
            Subscribe to our weekly and monthly digests for the latest updates on tax, compliance, and strategic finance.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════ */}
      <div className="nl-filter container" ref={filterRef}>
        <span className="nl-filter__label">
          <Filter size={14} strokeWidth={1.5} />
          Filter By Category
        </span>
        <div className="nl-filter__pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`nl-filter__btn${selectedCategory === cat ? ' nl-filter__btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredNewsletters.length > 0 ? (
        <section className="nl-grid-section container" ref={gridRef}>
          <div className="nl-grid">
            {filteredNewsletters.map((nl) => (
              <article key={nl.id} className="nl-card">

                {/* Background Image */}
                <LazyImage
                  src={nl.image}
                  alt={nl.title}
                  className="nl-card__bg-img"
                />

                {/* Default State: White Box at Bottom */}
                <div className="nl-card__default-box">
                  <div className="nl-card__meta">
                    {nl.category.toUpperCase()} &bull; {nl.date.toUpperCase()}
                  </div>
                  <h3 className="nl-card__title">{nl.title}</h3>
                </div>

                {/* Hover State: Frosted Overlay */}
                <div className="nl-card__hover-overlay">
                  <div className="nl-card__hover-content">
                    <div className="nl-card__meta">
                      {nl.category.toUpperCase()} &bull; {nl.date.toUpperCase()}
                    </div>
                    <h3 className="nl-card__hover-title">{nl.title}</h3>
                    <p className="nl-card__hover-desc">{nl.description}</p>
                  </div>

                  <a
                    href="#download"
                    className="nl-card__learn-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(nl.pdf, nl.title);
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
        <section className="container nl-empty">
          <div className="nl-empty__box">
            <span className="nl-empty__icon">∅</span>
            <h3>No newsletters found</h3>
            <p>No newsletters match the selected category "{selectedCategory}".</p>
            <button
              className="nl-btn nl-btn--solid"
              onClick={() => setSelectedCategory('All')}
              type="button"
            >
              View All Newsletters
            </button>
          </div>
        </section>
      )}

    </div>
  )
}

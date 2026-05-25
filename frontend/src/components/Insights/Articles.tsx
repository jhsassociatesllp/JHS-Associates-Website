import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Download, X, Calendar, User, ChevronLeft, RefreshCw, Search, Filter } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import './Articles.css'

gsap.registerPlugin(ScrollTrigger)

// Force cache refresh - v2.0

/* ── API base — reads from .env, falls back to localhost ─────── */
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? 'http://45.198.225.149:9030'

  console.log(API_BASE)
/* ── Types ───────────────────────────────────────────────────── */
interface Article {
  id: string
  title: string
  short_description: string
  content: string
  author?: string  // Optional for backward compatibility
  image_id: string
  pdf_id: string
  publish_date?: string  // Optional for backward compatibility
  created_at: string
}
console.log(API_BASE)
/* ── Helpers ─────────────────────────────────────────────────── */
const articleImageUrl = (image_id: string) =>
  `${API_BASE}/articles/image/${image_id}`

const articlePdfUrl = (pdf_id: string) =>
  `${API_BASE}/articles/pdf/${pdf_id}`

const formatDate = (iso?: string) => {
  if (!iso) return 'Date not available'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return iso
  }
}

/* ── Component ───────────────────────────────────────────────── */
export default function Articles() {
  const [articles,        setArticles]        = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [downloading,     setDownloading]     = useState(false)
  
  // Filter states
  const [searchTerm,      setSearchTerm]      = useState('')
  const [selectedAuthor,  setSelectedAuthor]  = useState('')
  const [sortBy,          setSortBy]          = useState('newest')
  const [showFilters,     setShowFilters]     = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  /* ── Fetch ─────────────────────────────────────────────────── */
  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/articles/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()
      console.log('Fetched articles:', data) // Debug log
      // data may be an array directly or wrapped
      setArticles(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('[Articles] fetch error:', err)
      setError(err?.message ?? 'Failed to load articles. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchArticles()
  }, [])

  /* ── Filter and sort articles ──────────────────────────────── */
  useEffect(() => {
    let filtered = [...articles]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Author filter
    if (selectedAuthor) {
      filtered = filtered.filter(article => article.author === selectedAuthor)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publish_date || b.created_at).getTime() - new Date(a.publish_date || a.created_at).getTime()
        case 'oldest':
          return new Date(a.publish_date || a.created_at).getTime() - new Date(b.publish_date || b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedAuthor, sortBy])

  /* ── Get unique authors for filter ─────────────────────────── */
  const uniqueAuthors = [...new Set(articles.filter(a => a.author).map(a => a.author))].sort()

  /* ── GSAP — only after data is ready ──────────────────────── */
  useEffect(() => {
    if (loading || error) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.art-hero__eyebrow', '.art-hero__title', '.art-hero__sub'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.1 }
      )
      if (filteredArticles.length > 0) {
        gsap.fromTo(
          '.art-card',
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [loading, error, filteredArticles.length])

  /* ── Lock body scroll when modal open ─────────────────────── */
  useEffect(() => {
    if (selectedArticle) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'  // Prevent layout shift from scrollbar
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [selectedArticle])

  /* ── PDF download ──────────────────────────────────────────── */
  const handleDownload = async (article: Article) => {
    setDownloading(true)
    try {
      const res = await fetch(articlePdfUrl(article.pdf_id))
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${article.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Could not download the PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }
/*  */
  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="art-page">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="art-hero" ref={heroRef}>
        <div className="art-hero__inner">
          <span className="art-hero__eyebrow">Knowledge Center</span>
          <h1 className="art-hero__title">Our <em>Articles</em></h1>
          <p className="art-hero__sub">
            In depth analysis and commentary from JHS partners and senior advisors on the
            issues shaping Indian and global finance, tax and compliance.
          </p>
        </div>
      </section>

      {/* ══ LOADING ═══════════════════════════════════════════ */}
      {loading && (
        <section className="container art-empty">
          <div className="art-empty__box">
            <span className="art-empty__icon art-spin">⟳</span>
            <h3>Loading Articles…</h3>
            <p>Fetching the latest insights from our knowledge base.</p>
          </div>
        </section>
      )}

      {/* ══ ERROR ═════════════════════════════════════════════ */}
      {!loading && error && (
        <section className="container art-empty">
          <div className="art-empty__box">
            <span className="art-empty__icon">⚠</span>
            <h3>Could not load articles</h3>
            <p style={{ marginBottom: '0.5rem' }}>{error}</p>
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '1.5rem' }}>
              Make sure the backend is running at <code>{API_BASE}</code>
            </p>
            <button className="art-btn art-btn--solid" onClick={fetchArticles}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        </section>
      )}

      {/* ══ GRID ══════════════════════════════════════════════ */}
      {!loading && !error && articles.length > 0 && (
        <section className="art-grid-section container" ref={gridRef}>
          
          {/* Filters Section */}
          <div className="art-filters">
            <div className="art-filters__header">
              <div className="art-filters__title-row">
                <span className="art-grid-header__title">All Articles</span>
                <span className="art-grid-header__count">
                  {filteredArticles.length} of {articles.length} articles
                </span>
              </div>
              <button 
                className={`art-filters__toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="art-filters__panel">
                <div className="art-filters__row">
                  <div className="art-filter-group">
                    <label className="art-filter-label">Search</label>
                    <div className="art-search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="art-search-input"
                      />
                    </div>
                  </div>

                  <div className="art-filter-group">
                    <label className="art-filter-label">Author</label>
                    <select
                      value={selectedAuthor}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                      className="art-filter-select"
                    >
                      <option value="">All Authors</option>
                      {uniqueAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>

                  <div className="art-filter-group">
                    <label className="art-filter-label">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="art-filter-select"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  {(searchTerm || selectedAuthor || sortBy !== 'newest') && (
                    <button
                      className="art-clear-filters"
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedAuthor('')
                        setSortBy('newest')
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="art-grid">
            {filteredArticles.map((article) => (
              <article key={article.id} className="art-card">

                {/* Background image from GridFS */}
                <LazyImage
                  src={articleImageUrl(article.image_id)}
                  alt={article.title}
                  className="art-card__bg-img"
                  onError={() => {
                    console.log('Image failed to load:', articleImageUrl(article.image_id))
                  }}
                />

                {/* Default state: white box at bottom */}
                <div className="art-card__default-box">
                  <div className="art-card__meta">
                    ARTICLE{article.author ? ` • ${article.author.toUpperCase()}` : ''}{article.publish_date ? ` • ${formatDate(article.publish_date).toUpperCase()}` : ''}
                  </div>
                  <h3 className="art-card__title">{article.title}</h3>
                </div>

                {/* Hover state: frosted overlay */}
                <div className="art-card__hover-overlay">
                  <div className="art-card__hover-content">
                    <div className="art-card__meta">
                      ARTICLE{article.author ? ` • ${article.author.toUpperCase()}` : ''}{article.publish_date ? ` • ${formatDate(article.publish_date).toUpperCase()}` : ''}
                    </div>
                    <h3 className="art-card__hover-title">{article.title}</h3>
                    <p className="art-card__hover-desc">{article.short_description}</p>
                  </div>

                  <div className="art-card__hover-actions">
                    <button
                      className="art-card__learn-btn"
                      onClick={() => setSelectedArticle(article)}
                    >
                      View More <ArrowRight size={16} />
                    </button>

                    <button
                      className="art-card__download-btn"
                      onClick={(e) => { e.stopPropagation(); handleDownload(article) }}
                      disabled={downloading}
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </section>
      )}

      {/* ══ EMPTY STATE ═══════════════════════════════════════ */}
      {!loading && !error && articles.length === 0 && (
        <section className="container art-empty">
          <div className="art-empty__box">
            <span className="art-empty__icon">∅</span>
            <h3>No articles yet</h3>
            <p>Check back soon — our team is preparing new insights for you.</p>
          </div>
        </section>
      )}

      {/* ══ NO FILTERED RESULTS ═══════════════════════════════ */}
      {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
        <section className="container art-empty">
          <div className="art-empty__box">
            <span className="art-empty__icon">🔍</span>
            <h3>No articles match your filters</h3>
            <p>Try adjusting your search terms or filters to find what you're looking for.</p>
            <button 
              className="art-btn art-btn--ghost"
              onClick={() => {
                setSearchTerm('')
                setSelectedAuthor('')
                setSortBy('newest')
              }}
            >
              Clear All Filters
            </button>
          </div>
        </section>
      )}

      {/* ══ DETAIL MODAL ══════════════════════════════════════ */}
      {selectedArticle && (
        <div
          className="art-modal-backdrop"
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not the modal content
            if (e.target === e.currentTarget) {
              setSelectedArticle(null)
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedArticle.title}
        >
          <div 
            className="art-modal" 
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header image */}
            <div className="art-modal__img-wrap">
              <LazyImage
                src={articleImageUrl(selectedArticle.image_id)}
                alt={selectedArticle.title}
                className="art-modal__img"
                onError={() => console.log('Modal image failed to load')}
              />
              <div className="art-modal__img-overlay" />
              <button
                className="art-modal__close"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div
  className="art-modal__body"
  ref={modalBodyRef}
  onWheel={(e) => e.stopPropagation()}
>
              {/* Meta */}
              <div className="art-modal__meta">
                <span className="art-tag">Article</span>
                {selectedArticle.author && (
                  <span className="art-modal__meta-item">
                    <User size={13} /> {selectedArticle.author}
                  </span>
                )}
                <span className="art-modal__meta-item">
                  <Calendar size={13} /> {selectedArticle.publish_date ? formatDate(selectedArticle.publish_date) : 'Date not available'}
                </span>
              </div>

              {/* Title */}
              <h2 className="art-modal__title">{selectedArticle.title}</h2>

              {/* Short description callout */}
              <p className="art-modal__short-desc">{selectedArticle.short_description}</p>

              <hr className="art-modal__divider" />

              {/* Full content */}
              <div className="art-modal__content">
                {selectedArticle.content.split('\n').map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                )}
              </div>

              {/* Footer */}
              <div className="art-modal__footer">
                <button
                  className="art-btn art-btn--ghost"
                  onClick={() => setSelectedArticle(null)}
                >
                  <ChevronLeft size={16} /> Back to Articles
                </button>

                <button
                  className="art-btn art-btn--solid"
                  onClick={() => handleDownload(selectedArticle)}
                  disabled={downloading}
                >
                  <Download size={16} />
                  {downloading ? 'Downloading…' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

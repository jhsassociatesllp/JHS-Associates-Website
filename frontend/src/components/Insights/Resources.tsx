import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, Filter, X } from 'lucide-react'
import { imageUrl } from '../../utils/imageUrl'
import LazyImage from '../common/LazyImage'
import './Resources.css'

gsap.registerPlugin(ScrollTrigger)

// Force cache refresh - v2.0

/* ── API base — reads from .env, falls back to localhost ─────── */
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? 'http://localhost:8000'

/* ── Types ───────────────────────────────────────────────────── */
interface KnowledgeResource {
  id: string
  title: string
  short_description: string
  content: string
  image_id: string
  pdf_id: string
  created_at: string  
}

/* ── Helpers ─────────────────────────────────────────────────── */
const knowledgeImageUrl = (image_id: string) =>
  `${API_BASE}/knowledge/image/${image_id}`

const knowledgePdfUrl = (pdf_id: string) =>
  `${API_BASE}/knowledge/pdf/${pdf_id}`

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
export default function Resources() {
  const [resources,        setResources]        = useState<KnowledgeResource[]>([])
  const [filteredResources, setFilteredResources] = useState<KnowledgeResource[]>([])
  const [loading,          setLoading]          = useState(true)
  const [error,            setError]            = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<KnowledgeResource | null>(null)
  const [downloading,      setDownloading]      = useState(false)
  
  // Filter states
  const [searchTerm,       setSearchTerm]       = useState('')
  const [sortBy,           setSortBy]           = useState('newest')
  const [showFilters,      setShowFilters]      = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  /* ── Fetch ─────────────────────────────────────────────────── */
  const fetchResources = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/knowledge/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()
      console.log('Fetched knowledge resources:', data) // Debug log
      // data may be an array directly or wrapped
      setResources(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('[Resources] fetch error:', err)
      setError(err?.message ?? 'Failed to load resources. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchResources()
  }, [])

  /* ── Filter and sort resources ─────────────────────────────── */
  useEffect(() => {
    let filtered = [...resources]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredResources(filtered)
  }, [resources, searchTerm, sortBy])

  /* ── GSAP — only after data is ready ──────────────────────── */
  useEffect(() => {
    if (loading || error) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.res-hero__eyebrow', '.res-hero__title', '.res-hero__sub'],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out', delay: 0.1 }
      )
      if (filteredResources.length > 0) {
        gsap.fromTo(
          '.res-card',
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [loading, error, filteredResources.length])

  /* ── Lock body scroll when modal open ─────────────────────── */
  useEffect(() => {
    if (selectedResource) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none' 
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
  }, [selectedResource])

  /* ── PDF download ──────────────────────────────────────────── */
  const handleDownload = async (resource: KnowledgeResource) => {
    setDownloading(true)
    try {
      const res = await fetch(knowledgePdfUrl(resource.pdf_id))
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${resource.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
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

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="res-page">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section 
        className="res-hero" 
        ref={heroRef}
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(22, 41, 70, 0.60) 0%, rgba(34, 53, 82, 0.60) 100%),
            url('${imageUrl('Resources.png') }')
          `,
          backgroundColor: '#1e3a5f' // Fallback color if image fails to load
        }}
      >
        <div className="res-hero__inner">
          <span className="res-hero__eyebrow">Knowledge Center</span>
          <h1 className="res-hero__title">Knowledge <em>Resources</em></h1>
          <p className="res-hero__sub">
            Practical guides, whitepapers, and toolkits crafted by JHS experts to help you navigate
            regulatory complexity and drive informed business decisions.
          </p>
        </div>
      </section>

      {/* ══ LOADING ═══════════════════════════════════════════ */}
      {loading && (
        <section className="container res-empty">
          <div className="res-empty__box">
            <span className="res-empty__icon res-spin">⟳</span>
            <h3>Loading Resources…</h3>
            <p>Fetching the latest knowledge resources from our database.</p>
          </div>
        </section>
      )}

      {/* ══ ERROR ═════════════════════════════════════════════ */}
      {!loading && error && (
        <section className="container res-empty">
          <div className="res-empty__box">
            <span className="res-empty__icon">⚠</span>
            <h3>Could not load resources</h3>
            <p style={{ marginBottom: '0.5rem' }}>{error}</p>
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '1.5rem' }}>
              Make sure the backend is running at <code>{API_BASE}</code>
            </p>
            <button className="res-btn res-btn--solid" onClick={fetchResources}>
              🔄 Retry
            </button>
          </div>
        </section>
      )}

      {/* ══ GRID ══════════════════════════════════════════════ */}
      {!loading && !error && resources.length > 0 && (
        <section className="res-grid-section container" ref={gridRef}>
          
          {/* Filters Section */}
          <div className="res-filters">
            <div className="res-filters__header">
              <div className="res-filters__title-row">
                <span className="res-grid-header__title">All Resources</span>
                <span className="res-grid-header__count">
                  {filteredResources.length} of {resources.length} resources
                </span>
              </div>
              <button 
                className={`res-filters__toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="res-filters__panel">
                <div className="res-filters__row">
                  <div className="res-filter-group">
                    <label className="res-filter-label">Search</label>
                    <div className="res-search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="res-search-input"
                      />
                    </div>
                  </div>

                  <div className="res-filter-group">
                    <label className="res-filter-label">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="res-filter-select"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  {(searchTerm || sortBy !== 'newest') && (
                    <button
                      className="res-clear-filters"
                      onClick={() => {
                        setSearchTerm('')
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

          <div className="res-grid">
            {filteredResources.map((resource) => (
              <article key={resource.id} className="res-card">

                {/* Background image from GridFS */}
                <LazyImage
                  src={knowledgeImageUrl(resource.image_id)}
                  alt={resource.title}
                  className="res-card__bg-img"
                  onError={() => {
                    console.log('Image failed to load:', knowledgeImageUrl(resource.image_id))
                  }}
                />

                {/* Default state: white box at bottom */}
                <div className="res-card__default-box">
                  <div className="res-card__meta">
                    RESOURCE • {formatDate(resource.created_at).toUpperCase()}
                  </div>
                  <h3 className="res-card__title">{resource.title}</h3>
                </div>

                {/* Hover state: frosted overlay */}
                <div className="res-card__hover-overlay">
                  <div className="res-card__hover-content">
                    <div className="res-card__meta">
                      RESOURCE • {formatDate(resource.created_at).toUpperCase()}
                    </div>
                    <h3 className="res-card__hover-title">{resource.title}</h3>
                    <p className="res-card__hover-desc">{resource.short_description}</p>
                  </div>

                  <div className="res-card__hover-actions">
                    <button
                      className="res-card__learn-btn"
                      onClick={() => setSelectedResource(resource)}
                    >
                      View More →
                    </button>

                    <button
                      className="res-card__download-btn"
                      onClick={(e) => { e.stopPropagation(); handleDownload(resource) }}
                      disabled={downloading}
                      title="Download PDF"
                    >
                      ⬇
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </section>
      )}

      {/* ══ EMPTY STATE ═══════════════════════════════════════ */}
      {!loading && !error && resources.length === 0 && (
        <section className="container res-empty">
          <div className="res-empty__box">
            <span className="res-empty__icon">∅</span>
            <h3>No resources yet</h3>
            <p>Check back soon — our team is preparing new knowledge resources for you.</p>
          </div>
        </section>
      )}

      {/* ══ NO FILTERED RESULTS ═══════════════════════════════ */}
      {!loading && !error && resources.length > 0 && filteredResources.length === 0 && (
        <section className="container res-empty">
          <div className="res-empty__box">
            <span className="res-empty__icon">🔍</span>
            <h3>No resources match your filters</h3>
            <p>Try adjusting your search terms or filters to find what you're looking for.</p>
            <button 
              className="res-btn res-btn--ghost"
              onClick={() => {
                setSearchTerm('')
                setSortBy('newest')
              }}
            >
              Clear All Filters
            </button>
          </div>
        </section>
      )}

      {/* ══ DETAIL MODAL ══════════════════════════════════════ */}
      {selectedResource && (
        <div
          className="res-modal-backdrop"
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not the modal content
            if (e.target === e.currentTarget) {
              setSelectedResource(null)
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedResource.title}
        >
          <div 
            className="res-modal" 
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header image */}
            <div className="res-modal__img-wrap">
              <LazyImage
                src={knowledgeImageUrl(selectedResource.image_id)}
                alt={selectedResource.title}
                className="res-modal__img"
                onError={() => console.log('Modal image failed to load')}
              />
              <div className="res-modal__img-overlay" />
              <button
                className="res-modal__close"
                onClick={() => setSelectedResource(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div
  className="res-modal__body"
  ref={modalBodyRef}
  onWheel={(e) => e.stopPropagation()}
>
              {/* Meta */}
              <div className="res-modal__meta">
                <span className="res-tag">Resource</span>
                <span className="res-modal__meta-item">
                  📅 {formatDate(selectedResource.created_at)}
                </span>
              </div>

              {/* Title */}
              <h2 className="res-modal__title">{selectedResource.title}</h2>

              {/* Short description callout */}
              <p className="res-modal__short-desc">{selectedResource.short_description}</p>

              <hr className="res-modal__divider" />

              {/* Full content */}
              <div className="res-modal__content">
                {selectedResource.content.split('\n').map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                )}
              </div>

              {/* Footer */}
              <div className="res-modal__footer">
                <button
                  className="res-btn res-btn--ghost"
                  onClick={() => setSelectedResource(null)}
                >
                  ← Back to Resources
                </button>

                <button
                  className="res-btn res-btn--solid"
                  onClick={() => handleDownload(selectedResource)}
                  disabled={downloading}
                >
                  ⬇ {downloading ? 'Downloading…' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
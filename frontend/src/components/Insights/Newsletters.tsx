import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Mail } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import './Newsletters.css'

gsap.registerPlugin(ScrollTrigger)

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface Newsletter {
  id: string
  heading: string
  short_description: string
  pdf_id: string
  image_id?: string
  created_at: string
}

const pdfUrl = (pdfId: string) => `${API_BASE}/newsletters/pdf/${pdfId}`
const imageUrl = (imageId: string) => `${API_BASE}/newsletters/image/${imageId}`

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
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
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/newsletters/`)
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data = await res.json()
        setNewsletters(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[Newsletters] fetch error:', err)
        setError('Could not load newsletters right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchNewsletters()
  }, [])

  useEffect(() => {
    if (loading || error || newsletters.length === 0) return
    const ctx = gsap.context(() => {
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
  }, [loading, error, newsletters])

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

      {/* Loading */}
      {loading && (
        <section className="container nl-empty">
          <div className="nl-empty__box">
            <span className="nl-empty__icon">⟳</span>
            <h3>Loading newsletters…</h3>
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="container nl-empty">
          <div className="nl-empty__box">
            <span className="nl-empty__icon">∅</span>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        </section>
      )}

      {/* Real cards */}
      {!loading && !error && newsletters.length > 0 && (
        <section className="nl-grid-section container" ref={gridRef}>
          <div className="nl-grid">
            {newsletters.map((nl) => (
              <article key={nl.id} className="nl-card">

                {/* Background image from GridFS or fallback gradient */}
                {nl.image_id ? (
                  <LazyImage
                    src={imageUrl(nl.image_id)}
                    alt={nl.heading}
                    className="nl-card__bg-img"
                  />
                ) : (
                  <div className="nl-card__bg-img" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 30%, #D62049 70%, #8a1725 100%)' }} />
                )}

                {/* Default State: White Box at Bottom */}
                <div className="nl-card__default-box">
                  <div className="nl-card__meta">
                    NEWSLETTER &bull; {formatDate(nl.created_at).toUpperCase()}
                  </div>
                  <h3 className="nl-card__title">{nl.heading}</h3>
                </div>

                {/* Hover State: Frosted Overlay */}
                <div className="nl-card__hover-overlay">
                  <div className="nl-card__hover-content">
                    <div className="nl-card__meta">
                      NEWSLETTER &bull; {formatDate(nl.created_at).toUpperCase()}
                    </div>
                    <h3 className="nl-card__hover-title">{nl.heading}</h3>
                    <p className="nl-card__hover-desc">{nl.short_description}</p>
                  </div>

                  <a
                    href={pdfUrl(nl.pdf_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nl-card__learn-btn"
                  >
                    Read Newsletter <ArrowRight size={16} />
                  </a>
                </div>

              </article>
            ))}
          </div>
        </section>
      )}

      {/* Coming soon — only when there's genuinely nothing published yet */}
      {!loading && !error && newsletters.length === 0 && (
        <section className="container nl-empty">
          <div className="nl-empty__box">
            <Mail size={44} strokeWidth={1.5} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--ink-5)' }} />
            <h3>No newsletters published yet</h3>
            <p>We're preparing our first digest. Check back soon for updates on tax, compliance, and strategic finance.</p>
          </div>
        </section>
      )}

    </div>
  )
}

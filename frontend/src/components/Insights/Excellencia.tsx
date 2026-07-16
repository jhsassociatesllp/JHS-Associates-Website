import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, ArrowUpRight, Bell, ArrowRight } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import './Excellencia.css'

const TOPICS = [
  'Premium Research',
  'Industry Benchmarks',
  'Strategic Frameworks',
  'Best Practices',
  'Thought Leadership',
]

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface ExcellenciaEntry {
  id: string
  heading: string
  short_description: string
  image_id?: string
  button_text?: string
  button_url?: string
  created_at: string
}

const imageUrl = (imageId: string) => `${API_BASE}/excellencia/image/${imageId}`

const isExternalLink = (url: string) => /^https?:\/\//i.test(url)

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function Excellencia() {
  const [entries, setEntries] = useState<ExcellenciaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/excellencia/`)
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data = await res.json()
        setEntries(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[Excellencia] fetch error:', err)
        setError('Could not load Excellencia right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  return (
    <div className="exc-page">
      {/* ════ HERO ════ */}
      <section className="exc-hero">
        <span className="exc-hero__eyebrow">Built for Excellence</span>
        <h1 className="exc-hero__title">JHS Excellencia Library</h1>
        <p className="exc-hero__sub">
          Our proprietary knowledge base of premium research, industry benchmarks, and strategic frameworks.
        </p>

        <ul className="exc-hero__topics">
          {TOPICS.map((topic) => (
            <li key={topic} className="exc-hero__topic">{topic}</li>
          ))}
        </ul>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="exc-content">

        {/* Loading */}
        {loading && (
          <div className="exc-status">
            <span className="exc-status__spin">⟳</span>
            <p>Loading Excellencia…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="exc-status">
            <p>{error}</p>
          </div>
        )}

        {/* Real cards */}
        {!loading && !error && entries.length > 0 && (
          <div className="exc-grid">
            {entries.map((entry) => (
              <article key={entry.id} className="exc-card">

                {/* Background image from GridFS or fallback gradient */}
                {entry.image_id ? (
                  <LazyImage
                    src={imageUrl(entry.image_id)}
                    alt={entry.heading}
                    className="exc-card__bg-img"
                  />
                ) : (
                  <div className="exc-card__bg-fallback" />
                )}

                {/* Default state: white box at bottom */}
                <div className="exc-card__default-box">
                  <div className="exc-card__meta">
                    EXCELLENCIA • {formatDate(entry.created_at).toUpperCase()}
                  </div>
                  <h3 className="exc-card__title">{entry.heading}</h3>
                </div>

                {/* Hover state: frosted overlay */}
                <div className="exc-card__hover-overlay">
                  <div className="exc-card__hover-content">
                    <div className="exc-card__meta">
                      EXCELLENCIA • {formatDate(entry.created_at).toUpperCase()}
                    </div>
                    <h3 className="exc-card__hover-title">{entry.heading}</h3>
                    <p className="exc-card__hover-desc">{entry.short_description}</p>
                  </div>

                  {entry.button_text && entry.button_url && (
                    <div className="exc-card__hover-actions">
                      {isExternalLink(entry.button_url) ? (
                        <a
                          href={entry.button_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="exc-card__view-btn"
                        >
                          {entry.button_text} <ArrowRight size={16} />
                        </a>
                      ) : (
                        <Link to={entry.button_url} className="exc-card__view-btn">
                          {entry.button_text} <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

              </article>
            ))}
          </div>
        )}

        {/* Coming soon — only when there's genuinely nothing published yet */}
        {!loading && !error && entries.length === 0 && (
          <div className="exc-coming-soon">
            <div className="exc-coming-soon__icon">
              <Award size={28} strokeWidth={1.5} />
            </div>
            <h2>Our Excellencia Library Is in the Works</h2>
            <p>
              We're migrating our vast collection of whitepapers, regulatory updates, and strategic guides
              to a new interactive platform. Thank you for your patience!
            </p>

            <div className="exc-coming-soon__actions">
              <Link to="/resources" className="exc-btn exc-btn--solid">
                Explore Knowledge Resources <ArrowUpRight size={15} />
              </Link>
              <Link to="/newsletters" className="exc-btn exc-btn--ghost">
                <Bell size={15} /> Get Notified When They're Live
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Bell, Download, Calendar, ArrowRight } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import './WhitePapers.css'

const TOPICS = [
  'Regulatory & Compliance',
  'Taxation & GST',
  'Financial Strategy',
  'Governance & Risk',
  'Industry Intelligence',
]

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface WhitePaper {
  id: string
  title: string
  short_description: string
  pdf_id: string
  image_id?: string
  created_at: string
}

const pdfUrl = (pdfId: string) => `${API_BASE}/whitepapers/pdf/${pdfId}`
const imageUrl = (imageId: string) => `${API_BASE}/whitepapers/image/${imageId}`

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function WhitePapers() {
  const [papers, setPapers] = useState<WhitePaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/whitepapers/`)
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data = await res.json()
        setPapers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[WhitePapers] fetch error:', err)
        setError('Could not load white papers right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchPapers()
  }, [])

  return (
    <div className="wp-page">
      {/* ════ HERO ════ */}
      <section className="wp-hero">
        <span className="wp-hero__eyebrow">Knowledge Center</span>
        <h1 className="wp-hero__title">White Papers</h1>
        <p className="wp-hero__sub">
          In-depth research on regulatory frameworks, financial strategy, taxation and
          industry intelligence — authored by JHS experts to help you navigate what's next.
        </p>

        <ul className="wp-hero__topics">
          {TOPICS.map((topic) => (
            <li key={topic} className="wp-hero__topic">{topic}</li>
          ))}
        </ul>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="wp-content">

        {/* Loading */}
        {loading && (
          <div className="wp-status">
            <span className="wp-status__spin">⟳</span>
            <p>Loading white papers…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="wp-status">
            <p>{error}</p>
          </div>
        )}

        {/* Real cards */}
        {!loading && !error && papers.length > 0 && (
          <div className="wp-grid">
            {papers.map((paper) => (
              <article key={paper.id} className="wp-card">

                {/* Background image from GridFS or fallback gradient */}
                {paper.image_id ? (
                  <LazyImage
                    src={imageUrl(paper.image_id)}
                    alt={paper.title}
                    className="wp-card__bg-img"
                  />
                ) : (
                  <div className="wp-card__bg-fallback" />
                )}

                {/* Default state: white box at bottom */}
                <div className="wp-card__default-box">
                  <div className="wp-card__meta">
                    WHITE PAPER • {formatDate(paper.created_at).toUpperCase()}
                  </div>
                  <h3 className="wp-card__title">{paper.title}</h3>
                </div>

                {/* Hover state: frosted overlay */}
                <div className="wp-card__hover-overlay">
                  <div className="wp-card__hover-content">
                    <div className="wp-card__meta">
                      WHITE PAPER • {formatDate(paper.created_at).toUpperCase()}
                    </div>
                    <h3 className="wp-card__hover-title">{paper.title}</h3>
                    <p className="wp-card__hover-desc">{paper.short_description}</p>
                  </div>

                  <div className="wp-card__hover-actions">
                    <a
                      href={pdfUrl(paper.pdf_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wp-card__view-btn"
                    >
                      View PDF <ArrowRight size={16} />
                    </a>

                    <a
                      href={pdfUrl(paper.pdf_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wp-card__download-btn"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* Coming soon — only when there's genuinely nothing published yet */}
        {!loading && !error && papers.length === 0 && (
          <div className="wp-coming-soon">
            <div className="wp-coming-soon__icon">
              <FileText size={28} strokeWidth={1.5} />
            </div>
            <h2>Our First White Papers Are in the Works</h2>
            <p>
              We're preparing an in-depth series covering regulatory updates, financial strategy,
              taxation insights and industry-specific intelligence. In the meantime, explore our
              existing knowledge resources or let us know you'd like early access.
            </p>

            <div className="wp-coming-soon__actions">
              <Link to="/resources" className="wp-btn wp-btn--solid">
                Explore Knowledge Resources <ArrowUpRight size={15} />
              </Link>
              <Link to="/newsletters" className="wp-btn wp-btn--ghost">
                <Bell size={15} /> Get Notified When They're Live
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

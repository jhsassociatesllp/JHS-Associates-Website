import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Bell, Download, ArrowRight } from 'lucide-react'
import LazyImage from '../common/LazyImage'
import { imageUrl as staticImageUrl } from '../../utils/imageUrl'
import './Regulatory.css'

const TOPICS = [
  'Regulatory & Compliance',
  'Taxation & GST',
  'Financial Strategy',
  'Governance & Risk',
  'Industry Intelligence',
]

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface Regulatory {
  id: string
  title: string
  short_description: string
  pdf_id: string
  image_id?: string
  created_at: string
}

const pdfUrl = (pdfId: string) => `${API_BASE}/regulatory/pdf/${pdfId}`
const imageUrl = (imageId: string) => `${API_BASE}/regulatory/image/${imageId}`

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function RegulatoryPage() {
  const [papers, setPapers] = useState<Regulatory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/regulatory/`)
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data = await res.json()
        setPapers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[Regulatory] fetch error:', err)
        setError('Could not load regulatory documents right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchPapers()
  }, [])

  return (
    <div className="reg-page">
      {/* ════ HERO ════ */}
      <section className="reg-hero">
        <div
          className="reg-hero__bg"
          style={{ backgroundImage: `url(${staticImageUrl('Regulatory-bg-img.webp')})` }}
        />
        <div className="reg-hero__overlay" />
        <div className="reg-hero__content">
          <span className="reg-hero__eyebrow">Knowledge Center</span>
          <h1 className="reg-hero__title">Regulatory</h1>
          <p className="reg-hero__sub">
            In-depth research on regulatory frameworks, financial strategy, taxation and
            industry intelligence — authored by JHS experts to help you navigate what's next.
          </p>

          <ul className="reg-hero__topics">
            {TOPICS.map((topic) => (
              <li key={topic} className="reg-hero__topic">{topic}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="reg-content">

        {/* Loading */}
        {loading && (
          <div className="reg-status">
            <span className="reg-status__spin">⟳</span>
            <p>Loading regulatory documents…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="reg-status">
            <p>{error}</p>
          </div>
        )}

        {/* Real cards */}
        {!loading && !error && papers.length > 0 && (
          <div className="reg-grid">
            {papers.map((paper) => (
              <article key={paper.id} className="reg-card">

                {/* Background image from GridFS or fallback gradient */}
                {paper.image_id ? (
                  <LazyImage
                    src={imageUrl(paper.image_id)}
                    alt={paper.title}
                    className="reg-card__bg-img"
                  />
                ) : (
                  <div className="reg-card__bg-fallback" />
                )}

                {/* Default state: white box at bottom */}
                <div className="reg-card__default-box">
                  <div className="reg-card__meta">
                    REGULATORY • {formatDate(paper.created_at).toUpperCase()}
                  </div>
                  <h3 className="reg-card__title">{paper.title}</h3>
                </div>

                {/* Hover state: frosted overlay */}
                <div className="reg-card__hover-overlay">
                  <div className="reg-card__hover-content">
                    <div className="reg-card__meta">
                      REGULATORY • {formatDate(paper.created_at).toUpperCase()}
                    </div>
                    <h3 className="reg-card__hover-title">{paper.title}</h3>
                    <p className="reg-card__hover-desc">{paper.short_description}</p>
                  </div>

                  <div className="reg-card__hover-actions">
                    <a
                      href={pdfUrl(paper.pdf_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reg-card__view-btn"
                    >
                      View PDF <ArrowRight size={16} />
                    </a>

                    <a
                      href={pdfUrl(paper.pdf_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reg-card__download-btn"
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
          <div className="reg-coming-soon">
            <div className="reg-coming-soon__icon">
              <FileText size={28} strokeWidth={1.5} />
            </div>
            <h2>Our First Regulatory Updates Are in the Works</h2>
            <p>
              We're preparing an in-depth series covering regulatory updates, financial strategy,
              taxation insights and industry-specific intelligence. In the meantime, explore our
              existing knowledge resources or let us know you'd like early access.
            </p>

            <div className="reg-coming-soon__actions">
              <Link to="/resources" className="reg-btn reg-btn--solid">
                Explore Knowledge Resources <ArrowUpRight size={15} />
              </Link>
              <Link to="/newsletters" className="reg-btn reg-btn--ghost">
                <Bell size={15} /> Get Notified When They're Live
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

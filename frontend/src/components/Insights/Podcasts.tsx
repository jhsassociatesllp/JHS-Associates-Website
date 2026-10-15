import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mic } from 'lucide-react'
import { formatEpisodeDate, podcastImageUrl, usePodcasts } from '../../data/podcasts'
import { imageUrl as staticImageUrl } from '../../utils/imageUrl'
import './SimpleInsight.css'
import './Podcasts.css'

/* Two layers: the Podcasts picture first; if that file is not on the server yet, the Excellencia picture shows instead. */
const HERO_BG = `url(${staticImageUrl('Podcast-bg-img.webp')}), url(${staticImageUrl('Excellencia-bg-img.webp')})`

export default function Podcasts() {
  const { episodes, loading, error } = usePodcasts()

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="pod-page">
      {/* ════ HERO ════ */}
      <section className="pod-hero">
        <div className="pod-hero__bg" style={{ backgroundImage: HERO_BG }} />
        <div className="pod-hero__overlay" />
        <div className="pod-hero__content">
          <span className="pod-hero__eyebrow">Expert Podcasts</span>
          <h1 className="pod-hero__title">How Industry Leaders are Adapting</h1>
          <p className="pod-hero__sub">
            Exclusive audio insights on the go. Hear directly from top executives and our senior partners.
          </p>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="pod-content">
        {loading && <div className="pod-status">Loading episodes…</div>}
        {!loading && error && <div className="pod-status">Could not load the podcasts right now. Please try again shortly.</div>}

        {!loading && !error && episodes && episodes.length > 0 && (
          <div className="pod-grid">
            {episodes.map((ep) => {
              const meta = `${ep.platform.toUpperCase()} • ${formatEpisodeDate(ep.published_on).toUpperCase()}`
              return (
                <article key={ep.id} className="pod-card">
                  {ep.image_id ? (
                    <div className="pod-card__bg-img" style={{ backgroundImage: `url(${podcastImageUrl(ep.image_id)})` }} />
                  ) : (
                    <div className="pod-card__bg-fallback"><Mic size={44} strokeWidth={1.4} /></div>
                  )}

                  {/* Default state: white box at the bottom */}
                  <div className="pod-card__default-box">
                    <div className="pod-card__meta">{meta}</div>
                    <h2 className="pod-card__title">{ep.title}</h2>
                  </div>

                  {/* Hover state: frosted overlay */}
                  <div className="pod-card__hover-overlay">
                    <div className="pod-card__hover-content">
                      <div className="pod-card__meta">{meta}{ep.duration ? ` • ${ep.duration.toUpperCase()}` : ''}</div>
                      <h2 className="pod-card__hover-title">{ep.title}</h2>
                      {ep.guest && <p className="pod-card__guest">With {ep.guest}</p>}
                      <p className="pod-card__hover-desc">{ep.description}</p>
                    </div>
                    <div className="pod-card__hover-actions">
                      <a className="pod-card__view-btn" href={ep.listen_url} target="_blank" rel="noopener noreferrer">
                        Listen now <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && !error && episodes && episodes.length === 0 && (
          <div className="coming-soon-box">
            <h2>Coming Soon</h2>
            <p>We are currently producing our first season of expert interviews and industry deep dives. Subscribe to our newsletter to be notified when the first episode drops!</p>
            <Link to="/" className="btn-back">
              Return to Homepage
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

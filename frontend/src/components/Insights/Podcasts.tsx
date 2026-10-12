import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mic } from 'lucide-react'
import { formatEpisodeDate, podcastImageUrl, usePodcasts } from '../../data/podcasts'
import './SimpleInsight.css'
import './Podcasts.css'

export default function Podcasts() {
  const { episodes, loading, error } = usePodcasts()

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="simple-insight-page">
      {/* ════ HERO ════ */}
      <section className="simple-insight-hero">
        <span className="simple-insight-eyebrow">Expert Podcasts</span>
        <h1 className="simple-insight-title">How Industry Leaders are Adapting</h1>
        <p className="simple-insight-sub">
          Exclusive audio insights on the go. Hear directly from top executives and our senior partners.
        </p>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="simple-insight-content">
        {loading && <div className="pod-status">Loading episodes…</div>}
        {!loading && error && <div className="pod-status">Could not load the podcasts right now. Please try again shortly.</div>}

        {!loading && !error && episodes && episodes.length > 0 && (
          <div className="pod-grid">
            {episodes.map((ep) => (
              <article key={ep.id} className="pod-card">
                {ep.image_id ? (
                  <div className="pod-card__cover" style={{ backgroundImage: `url(${podcastImageUrl(ep.image_id)})` }} />
                ) : (
                  <div className="pod-card__cover pod-card__cover--plain"><Mic size={34} strokeWidth={1.5} /></div>
                )}
                <div className="pod-card__body">
                  <div className="pod-card__tags">
                    <span className="pod-tag pod-tag--platform">{ep.platform}</span>
                    {ep.duration && <span className="pod-tag">{ep.duration}</span>}
                    <span className="pod-tag">{formatEpisodeDate(ep.published_on)}</span>
                  </div>
                  <h2 className="pod-card__title">{ep.title}</h2>
                  {ep.guest && <p className="pod-card__guest">With {ep.guest}</p>}
                  <p className="pod-card__desc">{ep.description}</p>
                  <a className="pod-btn" href={ep.listen_url} target="_blank" rel="noopener noreferrer">
                    Listen now <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
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

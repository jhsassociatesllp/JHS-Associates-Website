import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SimpleInsight.css'

export default function Podcasts() {
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
        <div className="coming-soon-box">
          <h2>Coming Soon</h2>
          <p>We are currently producing our first season of expert interviews and industry deep dives. Subscribe to our newsletter to be notified when the first episode drops!</p>
          <Link to="/" className="btn-back">
            Return to Homepage
          </Link>
        </div>
      </section>
    </div>
  )
}

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SimpleInsight.css'

export default function Excellencia() {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="simple-insight-page">
      {/* ════ HERO ════ */}
      <section className="simple-insight-hero">
        <span className="simple-insight-eyebrow">Built for Excellence</span>
        <h1 className="simple-insight-title">JHS Excellencia Library</h1>
        <p className="simple-insight-sub">
          Our proprietary knowledge base of premium research, industry benchmarks, and strategic frameworks.
        </p>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="simple-insight-content">
        <div className="coming-soon-box">
          <h2> Coming Soon</h2>
          <p>We are migrating our vast collection of whitepapers, regulatory updates, and strategic guides to a new interactive platform. Thank you for your patience!</p>
          <Link to="/" className="btn-back">
            Return to Homepage
          </Link>
        </div>
      </section>
    </div>
  )
}

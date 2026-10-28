import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, FileText, Radar } from 'lucide-react'
import { useGatedDownload } from '../hooks/useGatedDownload'
import { bundledUrl } from '../utils/imageUrl'
import {
  REGULATOR_ACCENT,
  formatRegDate,
  regWatchImageUrl,
  regWatchPdfUrl,
  useRegWatch,
  type RegWatchItem,
} from '../data/regwatch'
import './RegWatch.css'

export default function RegWatch() {
  const { items, loading, error } = useRegWatch(100)
  const { openFile } = useGatedDownload()
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const regulators = useMemo(() => {
    const present = Array.from(new Set((items ?? []).map((i) => i.regulator)))
    return ['All', ...present]
  }, [items])

  const visible = useMemo(
    () => (items ?? []).filter((i) => filter === 'All' || i.regulator === filter),
    [items, filter],
  )

  const handleOpen = async (item: RegWatchItem, mode: 'view' | 'download') => {
    setNotice(null)
    try {
      await openFile(regWatchPdfUrl(item.pdf_id), `${item.title}.pdf`, mode)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not open this document.')
    }
  }

  return (
    <div className="rw-page">
      <section className="rw-hero">
        <div className="rw-hero__bg" style={{ backgroundImage: `url(${bundledUrl('RegWatch-Hero-Bg.webp')})` }} aria-hidden="true" />
        <div className="rw-hero__shade" aria-hidden="true" />
        <div className="rw-hero__inner">
          <nav className="rw-crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/regulatory">Insights</Link><span>/</span><b>Reg-Watch</b>
          </nav>
          <span className="rw-eyebrow"><Radar size={14} /> Regulatory radar</span>
          <h1>Reg-Watch</h1>
          <p>
            Circulars, notifications and rule changes from SEBI, RBI, MCA, GST, Income Tax and more —
            tracked by JHS and explained in plain language, so you always know what changed and what to do next.
          </p>
        </div>
      </section>

      <section className="rw-content">
        {regulators.length > 2 && (
          <div className="rw-filters" role="tablist" aria-label="Filter by regulator">
            {regulators.map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={filter === r}
                className={`rw-chip ${filter === r ? 'rw-chip--active' : ''}`}
                onClick={() => setFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {notice && <div className="rw-status" role="alert">{notice}</div>}
        {loading && <div className="rw-status">Loading the latest updates…</div>}
        {error && <div className="rw-status">Could not load Reg-Watch right now. Please try again shortly.</div>}

        {!loading && !error && visible.length > 0 && (
          <div className="rw-grid">
            {visible.map((item) => {
              const accent = REGULATOR_ACCENT[item.regulator] ?? REGULATOR_ACCENT.Other
              return (
                <article key={item.id} className="rw-card" style={{ ['--accent' as string]: accent }}>
                  {/* Full-card picture (or a coloured fallback when none was uploaded) */}
                  {item.image_id ? (
                    <div className="rw-card__bg-img" style={{ backgroundImage: `url(${regWatchImageUrl(item.image_id)})` }} />
                  ) : (
                    <div className="rw-card__bg-fallback"><Radar size={44} strokeWidth={1.4} /></div>
                  )}

                  {/* Default state: white box at the bottom */}
                  <div className="rw-card__default-box">
                    <div className="rw-card__meta">{item.regulator} • {formatRegDate(item.published_on).toUpperCase()}</div>
                    <h2 className="rw-card__title">{item.title}</h2>
                  </div>

                  {/* Hover / keyboard-focus state: frosted overlay */}
                  <div className="rw-card__hover-overlay">
                    <div className="rw-card__hover-content">
                      <div className="rw-card__meta">{item.regulator} • {formatRegDate(item.published_on).toUpperCase()}</div>
                      <h2 className="rw-card__hover-title">{item.title}</h2>
                      <p className="rw-card__hover-desc">{item.summary}</p>
                      {item.reference && <p className="rw-card__ref">Ref: {item.reference}</p>}
                    </div>
                    <div className="rw-card__hover-actions">
                      <button type="button" className="rw-card__view-btn" onClick={() => handleOpen(item, 'view')}>
                        Read update <ArrowRight size={16} />
                      </button>
                      <button
                        type="button"
                        className="rw-card__download-btn"
                        title="Download PDF"
                        aria-label={`Download ${item.title}`}
                        onClick={() => handleOpen(item, 'download')}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && !error && items && items.length === 0 && (
          <div className="rw-empty">
            <span className="rw-empty__icon"><FileText size={28} strokeWidth={1.5} /></span>
            <h2>Our first Reg-Watch updates are on the way</h2>
            <p>We are preparing a regular digest of regulatory changes. Check back soon, or subscribe to our newsletter.</p>
            <Link to="/newsletters" className="rw-btn">Subscribe to newsletters <ArrowRight size={15} /></Link>
          </div>
        )}

        {!loading && !error && items && items.length > 0 && visible.length === 0 && (
          <div className="rw-status">No updates from {filter} yet.</div>
        )}
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Clock } from 'lucide-react'
import { STARTUP_SECTIONS } from '../data/startupServices'
import type { StartupItem } from '../data/startupServices'
import { bundledUrl } from '../utils/imageUrl'
import './StartupServices.css'

const haystack = (it: StartupItem) =>
  [it.title, ...(it.points ?? []).map((p) => p.text), ...(it.also ?? []), it.timeline ?? ''].join(' ').toLowerCase()

export default function StartupServices() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  const sections = STARTUP_SECTIONS.map((s) => ({ ...s, items: q.length >= 2 ? s.items.filter((it) => haystack(it).includes(q)) : s.items }))
  const shown = sections.reduce((n, s) => n + s.items.length, 0)

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="ss-page">
      {/* ════ HERO ════ */}
      <section className="ss-hero">
        <div className="ss-hero__bg" style={{ backgroundImage: `url(${bundledUrl('Startup-Hero-Bg.webp')})` }} aria-hidden="true" />
        <div className="ss-hero__inner">
          <span className="ss-hero__eyebrow">Services</span>
          <h1 className="ss-hero__title">Services Listing for Start-Ups &amp; MSMEs</h1>
          <div className="ss-hero__jump">
            {STARTUP_SECTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => jump(s.id)}>
                {s.title}<span>{s.items.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SEARCH ════ */}
      <section className="ss-bar">
        <div className="ss-container">
          <div className="ss-search">
            <Search size={17} />
            <input
              type="search" value={query} maxLength={80} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a requirement, e.g. GST, ESOP, Udyam, payroll…" aria-label="Search the services listing"
            />
            {query && <button type="button" className="ss-search__clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </div>
          {q.length >= 2 && <p className="ss-count"><strong>{shown}</strong> result{shown === 1 ? '' : 's'}</p>}
        </div>
      </section>

      {/* ════ LISTINGS ════ */}
      <section className="ss-content">
        <div className="ss-container">
          {shown === 0 && (
            <div className="ss-empty">
              <p>Nothing matches “{query.trim()}”.</p>
              <button type="button" className="ss-btn" onClick={() => setQuery('')}>Clear search</button>
            </div>
          )}

          {sections.filter((s) => s.items.length > 0).map((s) => (
            <div key={s.id} id={s.id} className="ss-section">
              <h2 className="ss-section__title">{s.title}</h2>
              <div className="ss-list">
                {s.items.map((it) => (
                  <article key={it.no} className="ss-card">
                    <div className="ss-card__no" aria-hidden="true">{it.no}</div>
                    <div className="ss-card__body">
                      <h3>{it.title}</h3>
                      {it.points && (
                        <ul className="ss-points">
                          {it.points.map((p, i) => (
                            <li key={i}>{p.mark && <b>{p.mark}</b>}<span>{p.text}</span></li>
                          ))}
                        </ul>
                      )}
                      {it.also?.map((a, i) => <p key={i} className="ss-also">{a}</p>)}
                    </div>
                    {it.timeline && (
                      <div className="ss-card__time">
                        <span><Clock size={13} /> Timelines</span>
                        <p>{it.timeline}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}

          <div className="ss-cta">
            <h3>Talk to JHS about your start-up or MSME</h3>
            <Link to="/contact" className="ss-btn">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
